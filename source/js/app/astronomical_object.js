define(['gl', 'glMatrix', 'shaders', 'buffers'], function (gl, glMatrix, shaderProgram, buffers) {

    /**
     * [AstronomicalObject description]
     * @param {Object} config The config object.
     * @param {int} config.orbitDistance (in miles) from whatever it is orbiting. This is then automatically reduced for presentation purposes.
     * @param {float} config.orbitalPeriod Number of days to make a full orbit.
     * @param {int} config.radius (in miles). This is then automatically increased for presentation purposes.
     * @param {float} config.axis Rotational axis (in degrees).
     */
    var AstronomicalObject = function (config) {
        this.setAttributes(config);
        this.setOriginAccordingTo(config.origin);
        this.setRandomStartingOrbit();
        this.initMatrix();
        this.initTexture();
        buffers.initBuffers(this);
    };

    AstronomicalObject.prototype = {

        setAttributes: function (config) {
            this.name          = config.name                        || 'name not set';
            this.orbits        = config.orbits                      || false;
            this.orbitDistance = config.orbitDistance               || 0;
            this.orbitalPeriod = config.orbitalPeriod               || 1;
            this.spinPeriod    = config.spinPeriod                  || 1;
            this.radius        = config.radius                      || 10;
            this.textureImage  = config.texture                     || 'textures/moon.gif';
            this.spherical     = this.getBoolean(config.spherical);
            this.useLighting   = this.getBoolean(config.useLighting);
            this.spins         = this.getBoolean(config.spins);
            this.shortcutKey   = config.shortcutKey;

            this.setAxis(config.axis);

            this.orbitDistance /= 50000;
            this.radius /= 100;
            this.distanceFromBodyWeAreOrbiting = 0;

            if (this.orbits) {
                this.distanceFromBodyWeAreOrbiting = this.radius + this.orbitDistance + this.orbits.radius;
            }
            else if (this.name === 'Sun') {
                this.radius /= 10;
            }

            if (this.name === 'Saturn\'s Rings') {
                this.distanceFromBodyWeAreOrbiting = 0;
                this.orbitalPeriod = this.orbits.orbitalPeriod;
                this.spinPeriod    = this.orbits.spinPeriod;
            }
        },

        setAxis: function (axis) {
            axis = axis || 0;
            while (axis > 90) {
                axis -= 90;
            }
            this.axis = this.degreesToRadians(axis);
            this.axisArray = [
                this.axis / this.degreesToRadians(90),
                1 - (this.axis / this.degreesToRadians(90)),
                0
            ];
        },

        degreesToRadians: function (celsius) {
            return celsius * (Math.PI / 180);
        },

        getBoolean: function (attribute) {
            return attribute === undefined ? true : attribute;
        },

        setOriginAccordingTo: function (origin) {
            if (origin) {
                this.origin = origin;
            }
            else if (this.orbits) {
                this.origin = [];
                this.origin[0] = this.orbits.origin[0];
                this.origin[1] = this.orbits.origin[1];
                this.origin[2] = this.orbits.origin[2] - this.distanceFromBodyWeAreOrbiting;
            }
            else {
                this.origin = [0, 0, 0];
            }
        },

        setRandomStartingOrbit: function () {

            var randomStartingOrbit = this.orbits ? (Math.PI * 2) / Math.random() : 0;

            this.lastSpinAngle = 0;
            this.lastOrbitAngle = randomStartingOrbit;
            this.cumulativeOrbitAngle = randomStartingOrbit;
        },

        initMatrix: function () {
            this.modelViewMatrix = glMatrix.mat4.create();

            if (this.orbits.orbits) {
                glMatrix.mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, this.orbits.lastOrbitAngle, [0, 1, 0]);
                glMatrix.mat4.translate(this.modelViewMatrix, this.modelViewMatrix, this.orbits.origin);
            }

            glMatrix.mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, this.lastOrbitAngle, [0, 1, 0]);
            glMatrix.mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, 0, -this.distanceFromBodyWeAreOrbiting]);
        },

        initTexture: function () {
            var texture = gl.createTexture();
            texture.image = new Image();
            texture.image.crossOrigin = 'anonymous';

            var self = this;

            texture.image.onload = function () {
                self.handleLoadedTexture(texture);
            };

            texture.image.src = this.textureImage;
        },

        handleLoadedTexture: function (texture) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            this.texture = texture;
        },

        draw: function (projectionMatrix) {
            this.setupLighting(projectionMatrix);
            this.setupTexture();
            buffers.drawElements(this);
        },

        setupLighting: function (projectionMatrix) {
            var normalMatrix = glMatrix.mat3.create();

            gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, true);
            gl.uniform1i(shaderProgram.useLightingUniform, this.useLighting);
            gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, projectionMatrix);
            gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, this.modelViewMatrix);
            glMatrix.mat3.normalFromMat4(normalMatrix, this.modelViewMatrix);
            gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
        },

        setupTexture: function () {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(shaderProgram.useTexturesUniform, true);
            gl.uniform1i(shaderProgram.samplerUniform, 0);
        },

        orbit: function () {

            var deltaT      = this.millisecondsSinceLastFrame(),
                orbitAmount = this.calculatePortionOf(this.orbitalPeriod, deltaT),
                spinAmount  = this.calculatePortionOf(this.spinPeriod, deltaT);

            if (this.orbits) {
                var translationMatrix = glMatrix.mat4.create();

                // X. unspin
                glMatrix.mat4.rotate(translationMatrix, translationMatrix, -this.lastSpinAngle, this.axisArray);

                // NORMAL PLANETS
                if (!this.orbits.orbits) {
                    // 3. move to origin of body we're orbiting
                    glMatrix.mat4.translate(translationMatrix, translationMatrix, [0, 0, this.distanceFromBodyWeAreOrbiting]);

                    // 4. rotate by extra orbit angle
                    glMatrix.mat4.rotate(translationMatrix, translationMatrix, orbitAmount, [0, 1, 0]);

                    // 5. move back out to orbit space
                    glMatrix.mat4.translate(translationMatrix, translationMatrix, [0, 0, -this.distanceFromBodyWeAreOrbiting]);
                }
                // MOONS etc
                else {

                    // 1. move to center of earth
                    glMatrix.mat4.translate(translationMatrix, translationMatrix, [0, 0, this.distanceFromBodyWeAreOrbiting]);
                    
                    // 2. rotate by the moon's CUMULATIVE orbit amount
                    glMatrix.mat4.rotate(translationMatrix, translationMatrix, -this.cumulativeOrbitAngle, [0, 1, 0]);
                    
                    // 3. move to center of sun
                    glMatrix.mat4.translate(translationMatrix, translationMatrix, [0, 0, this.orbits.distanceFromBodyWeAreOrbiting]);

                    // 4. rotate by earth's LAST orbit angle
                    glMatrix.mat4.rotate(translationMatrix, translationMatrix, this.orbits.lastOrbitAngle, [0, 1, 0]);

                    // 5. move back out by earth's distance
                    glMatrix.mat4.translate(translationMatrix, translationMatrix, [0, 0, -this.orbits.distanceFromBodyWeAreOrbiting]);

                    // 6. rotate by the moon's cumulative orbit amount PLUS the new orbit
                    glMatrix.mat4.rotate(translationMatrix, translationMatrix, this.cumulativeOrbitAngle + orbitAmount, [0, 1, 0]);

                    // 7. move back out to orbit space (away from earth)
                    glMatrix.mat4.translate(translationMatrix, translationMatrix, [0, 0, -this.distanceFromBodyWeAreOrbiting]);
                }

                // move the planet according to its orbit matrix
                glMatrix.mat4.multiply(this.modelViewMatrix, this.modelViewMatrix, translationMatrix);

                // perform spin
                glMatrix.mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, this.lastSpinAngle + spinAmount, this.axisArray);

            } else {
                glMatrix.mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, spinAmount, [0, 0, 0]);
            }
            
            this.updateAttributes(orbitAmount, spinAmount);
        },

        millisecondsSinceLastFrame: function () {
            var timeThisFrame = Date.now(),
                millisecondsSinceLastFrame = timeThisFrame - (this.timeLastFrame || 0);
            this.timeLastFrame = timeThisFrame;
            return millisecondsSinceLastFrame;
        },

        calculatePortionOf: function (attribute, deltaT) {
            var proportion = deltaT / (this.millisecondsPerDay * attribute),
                proportionInRadians = (Math.PI * 2) * proportion;
            return proportionInRadians;
        },

        updateAttributes: function (orbitAmount, spinAmount) {
            this.lastOrbitAngle = orbitAmount;
            this.cumulativeOrbitAngle += this.lastOrbitAngle;
            this.lastSpinAngle += spinAmount;
        },

        animate: function (millisecondsPerDay) {
            this.millisecondsPerDay = millisecondsPerDay;
            this.orbit();
        }

    };

    return AstronomicalObject;
});