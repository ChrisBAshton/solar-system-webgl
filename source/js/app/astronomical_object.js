define(['gl', 'glMatrix', 'shaders', 'buffers'], function (gl, glMatrix, shaderProgram, buffers) {

    /**
     * AstronomicalObject is a class that represents Planets, Moons, the Sun, Galaxy, and Saturn's Rings.
     * @param {Object} config The config object.
     * @param {int} config.orbitDistance (in miles) from whatever it is orbiting. This is then automatically reduced for presentation purposes.
     * @param {float} config.orbitalPeriod Number of days to make a full orbit.
     * @param {int} config.radius (in miles). This is then automatically increased for presentation purposes.
     * @param {float} config.axis Rotational axis (in degrees).
     */
    var AstronomicalObject = function (config) {
        this.setAttributes(config);
        this.setOrigin(config.origin);
        this.setRandomStartingOrbit();
        this.initMatrix();
        this.initTexture();
        buffers.initBuffers(this);
    };

    AstronomicalObject.prototype = {

        /**
         * Sets the attributes of the object instance based on the passed config object.
         * @param {Object} config The config object.
         */
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
            
            if (this.name === 'Sun') {
                this.radius /= 10;
            }
            else if (this.name === 'Saturn\'s Rings') {
                this.distanceFromBodyWeAreOrbiting = 0;
                this.orbitalPeriod = this.orbits.orbitalPeriod;
                this.spinPeriod    = this.orbits.spinPeriod;
            }
        },

        /**
         * Sets the axis of the object.
         * @param {int} axis Axis (in degrees) that the object rotates on.
         */
        setAxis: function (axis) {
            axis = axis || 0;
            this.axis = this.degreesToRadians(axis);
            this.axisArray = [
                this.axis / this.degreesToRadians(90),
                1 - (this.axis / this.degreesToRadians(90)),
                0
            ];
        },

        /**
         * Converts degrees to radians.
         * @param  {int} celsius Value in degrees.
         * @return {float}       Converted value in radians.
         */
        degreesToRadians: function (celsius) {
            return celsius * (Math.PI / 180);
        },

        /**
         * Converts the given value into a boolean.
         * @param  {Object} attribute Value to convert (typically a boolean or null)
         * @return {boolean}          The boolean value.
         */
        getBoolean: function (attribute) {
            return attribute === undefined ? true : attribute;
        },

        /**
         * Sets the origin of the object, using the passed value if there is one, or calculating based on the orbited object if there isn't.
         * @param {Array} origin Three-value array representing the origin, or null.
         */
        setOrigin: function (origin) {
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

        /**
         * Called on initialisation - this moves the object to a position in its orbit, randomised to prevent all objects starting off in a long straight line.
         */
        setRandomStartingOrbit: function () {
            this.lastSpinAngle = 0;
            this.lastOrbitAngle = 0;
            this.cumulativeOrbitAngle = 0;

            if (this.name === 'Saturn\'s Rings') {
                // angle rings towards the Sun
                var saturnsRingsAngle = this.degreesToRadians(90);
                this.lastOrbitAngle = saturnsRingsAngle;
                this.cumulativeOrbitAngle = saturnsRingsAngle;
            }
            else if (this.orbits) {
                var randomStartingOrbit = (Math.PI * 2) / Math.random();
                this.lastOrbitAngle = randomStartingOrbit;
                this.cumulativeOrbitAngle = randomStartingOrbit;
            }
        },

        /**
         * Initialises the model view matrix.
         */
        initMatrix: function () {
            this.modelViewMatrix = glMatrix.mat4.create();

            if (this.orbits.orbits) {
                glMatrix.mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, this.orbits.lastOrbitAngle, [0, 1, 0]);
                glMatrix.mat4.translate(this.modelViewMatrix, this.modelViewMatrix, this.orbits.origin);
            }

            glMatrix.mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, this.lastOrbitAngle, [0, 1, 0]);
            glMatrix.mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, 0, -this.distanceFromBodyWeAreOrbiting]);
        },

        /**
         * Initialises the texture for the object.
         */
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

        /**
         * Handle the image texture once it has downloaded.
         * @param  {Object} texture A WebGL TEXTURE_2D object.
         */
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

        /**
         * Draws the object, relative to a projection matrix handles by the Camera object.
         * @param  {array} projectionMatrix glMatrix object (mat4) representing projection of the camera.
         */
        draw: function (projectionMatrix) {
            this.setupLighting(projectionMatrix);
            this.setupTexture();
            buffers.drawElements(this);
        },

        /**
         * Initialises the shader variables for lighting.
         * @param  {array} projectionMatrix glMatrix object (mat4) representing projection of the camera.
         */
        setupLighting: function (projectionMatrix) {
            var normalMatrix = glMatrix.mat3.create();
            gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, true);
            gl.uniform1i(shaderProgram.useLightingUniform, this.useLighting);
            gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, projectionMatrix);
            gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, this.modelViewMatrix);
            glMatrix.mat3.normalFromMat4(normalMatrix, this.modelViewMatrix);
            gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
        },

        /**
         * Sets up the texture.
         */
        setupTexture: function () {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(shaderProgram.useTexturesUniform, true);
            gl.uniform1i(shaderProgram.samplerUniform, 0);
        },

        /**
         * Performs the calculations necessary for the object to orbit (and spin on its axis), if applicable.
         */
        orbit: function () {

            var deltaT      = this.millisecondsSinceLastFrame(),
                orbitAmount = this.calculatePortionOf(this.orbitalPeriod, deltaT),
                spinAmount  = this.calculatePortionOf(this.spinPeriod, deltaT);

            if (this.orbits) {
                var translationMatrix = glMatrix.mat4.create();

                this.beforeOrbit(translationMatrix);

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

                this.afterOrbit(spinAmount);
            }
            else if (this.spins) {
                glMatrix.mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, spinAmount, [0, 1, 0]);
            }
            
            this.updateAttributes(orbitAmount, spinAmount);
        },

        /**
         * Translation to perform before orbit.
         * @param  {Object} translationMatrix glMatrix to multiply by modelViewMatrix
         */
        beforeOrbit: function (translationMatrix) {
            // unspin
            if (this.isNotFirstAnimationFrame) {
                glMatrix.mat4.rotate(translationMatrix, translationMatrix, -this.lastSpinAngle, [0, 1, 0]);
                glMatrix.mat4.rotate(translationMatrix, translationMatrix, -1, this.axisArray);
            }
        },

        /**
         * Translation to perform after orbit.
         * @param  {float} spinAmount Spin amount to take into account.
         */
        afterOrbit: function (spinAmount) {
            // perform spin
            glMatrix.mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, 1, this.axisArray);
            glMatrix.mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, this.lastSpinAngle + spinAmount, [0, 1, 0]);
            this.isNotFirstAnimationFrame = true;
        },

        /**
         * Returns the number of milliseconds since the last frame.
         * @return {int} Number of milliseconds since the last frame.
         */
        millisecondsSinceLastFrame: function () {
            var timeThisFrame = Date.now(),
                millisecondsSinceLastFrame = timeThisFrame - (this.timeLastFrame || 0);
            this.timeLastFrame = timeThisFrame;
            return millisecondsSinceLastFrame;
        },

        /**
         * Calculates the portion of a given attribute, based on the number of milliseconds since the last frame and the number of milliseconds which represents a day.
         * @param  {int} attribute A property of the current object, e.g. orbitalPeriod
         * @param  {float} deltaT    Number of milliseconds since last frame.
         * @return {float}           Angle (in radians) that should be moved by.
         */
        calculatePortionOf: function (attribute, deltaT) {
            var proportion = deltaT / (this.millisecondsPerDay * attribute),
                proportionInRadians = (Math.PI * 2) * proportion;
            return proportionInRadians;
        },

        /**
         * Updates the object's attributes concerning angles.
         * @param  {float} orbitAmount Last orbit amount travelled
         * @param  {float} spinAmount  Last spin amount spun
         */
        updateAttributes: function (orbitAmount, spinAmount) {
            this.lastOrbitAngle = orbitAmount;
            this.cumulativeOrbitAngle += this.lastOrbitAngle;
            this.lastSpinAngle += spinAmount;
        },

        /**
         * Called on every animation frame, this handles the animation of the object.
         * @param  {float} millisecondsPerDay The number of milliseconds that represent a day - this is integral in some of the calculations of the animation.
         */
        animate: function (millisecondsPerDay) {
            this.millisecondsPerDay = millisecondsPerDay;
            this.orbit();
        }

    };

    return AstronomicalObject;
});