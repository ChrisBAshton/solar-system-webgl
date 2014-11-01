define(['gl', 'glMatrix', 'shaders'], function (gl, glMatrix, shaderProgram) {

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
        this.setOriginAccordingTo(config);

        this.initMatrix();
        this.initBuffers(this.radius);
        this.initTexture();
    };

    var matrixStack = {};
    var lastSpinAngle = {};
    var lastOrbitAngle = {};
    var cumulativeOrbitAngle = {};

    AstronomicalObject.prototype = {

        degreesToRadians: function (celsius) {
            return celsius * (Math.PI / 180);
        },

        setAttributes: function (config) {
            this.name          = config.name                        || 'name not set';
            this.orbits        = config.orbits                      || false;
            this.orbitDistance = config.orbitDistance               || 0;
            this.orbitalPeriod = config.orbitalPeriod               || 1;
            this.spinPeriod    = config.spinPeriod                  || 1;
            this.radius        = config.radius                      || 10;
            this.axis          = this.degreesToRadians(config.axis) || 0;
            this.textureImage  = config.texture                     || "textures/moon.gif";

            this.orbitDistance /= 50000;
            this.radius /= 100;
            
            if (this.orbits) {
                this.distanceFromBodyWeAreOrbiting = this.radius + this.orbitDistance + this.orbits.radius;
            }
            else if (this.name === 'Sun') {
                this.radius /= 10;
            }
        },

        setOriginAccordingTo: function (config) {

            var randomStartingOrbit;

            if (this.orbits) {
                randomStartingOrbit = (Math.PI * 2) / Math.random();
                this.origin = [];
                this.origin[0] = this.orbits.origin[0];
                this.origin[1] = this.orbits.origin[1];
                this.origin[2] = this.orbits.origin[2] - this.distanceFromBodyWeAreOrbiting;
            }
            else {
                randomStartingOrbit = 0;
                this.origin = config.origin || [0, 0, 0];
            }

            lastSpinAngle[this.name] = 0;
            lastOrbitAngle[this.name] = randomStartingOrbit;
            cumulativeOrbitAngle[this.name] = randomStartingOrbit;
        },

        initMatrix: function () {
            var modelViewMatrix = glMatrix.mat4.create();

            if (this.orbits.orbits) {
                glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, lastOrbitAngle[this.orbits.name], [0, 1, 0]);
                glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, this.orbits.origin);
            }

            glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, lastOrbitAngle[this.name], [0, 1, 0]);
            
            if (this.orbits.orbits) {
                glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -this.distanceFromBodyWeAreOrbiting]);
            } else {
                glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, this.origin);
            }

            matrixStack[this.name] = [];
            matrixStack[this.name].push(modelViewMatrix);
            this.modelViewMatrix = modelViewMatrix;
        },

        initTexture: function() {
            var texture = gl.createTexture();
            texture.image = new Image();
            texture.image.crossOrigin = "anonymous";

            var self = this;

            texture.image.onload = function () {
                self.handleLoadedTexture(texture);
            }

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

        initBuffers: function (radius) {

            var latitudeBands = 30;
            var longitudeBands = 30;

            var vertexPositionData = [];
            var normalData = [];
            var textureCoordData = [];
            for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
                var theta = latNumber * Math.PI / latitudeBands;
                var sinTheta = Math.sin(theta);
                var cosTheta = Math.cos(theta);

                for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                    var phi = longNumber * 2 * Math.PI / longitudeBands;
                    var sinPhi = Math.sin(phi);
                    var cosPhi = Math.cos(phi);

                    var x = cosPhi * sinTheta;
                    var y = cosTheta;
                    var z = sinPhi * sinTheta;
                    var u = 1 - (longNumber / longitudeBands);
                    var v = 1 - (latNumber / latitudeBands);

                    normalData.push(x);
                    normalData.push(y);
                    normalData.push(z);
                    textureCoordData.push(u);
                    textureCoordData.push(v);
                    vertexPositionData.push(radius * x);
                    vertexPositionData.push(radius * y);
                    vertexPositionData.push(radius * z);
                }
            }

            var indexData = [];
            for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
                for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
                    var first = (latNumber * (longitudeBands + 1)) + longNumber;
                    var second = first + longitudeBands + 1;
                    indexData.push(first);
                    indexData.push(second);
                    indexData.push(first + 1);

                    indexData.push(second);
                    indexData.push(second + 1);
                    indexData.push(first + 1);
                }
            }

            this.vertexNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
            this.vertexNormalBuffer.itemSize = 3;
            this.vertexNormalBuffer.numItems = normalData.length / 3;

            this.vertexTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
            this.vertexTextureCoordBuffer.itemSize = 2;
            this.vertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

            this.vertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
            this.vertexPositionBuffer.itemSize = 3;
            this.vertexPositionBuffer.numItems = vertexPositionData.length / 3;

            this.vertexIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
            this.vertexIndexBuffer.itemSize = 1;
            this.vertexIndexBuffer.numItems = indexData.length;
        },

        draw: function (projectionMatrix) {
            this.setupLighting(projectionMatrix);
            this.setupTexture();
            this.drawElements();
        },

        setupLighting: function (projectionMatrix) {
            var useLighting = true,
                normalMatrix = glMatrix.mat3.create();
            
            if (this.name === 'Sun') {
                useLighting = false;
            }
            gl.uniform1i(shaderProgram.useLightingUniform, useLighting);
            
            gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, projectionMatrix);
            gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, this.modelViewMatrix);
            glMatrix.mat3.normalFromMat4(normalMatrix, this.modelViewMatrix);
            gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
        },

        setupTexture: function () {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(shaderProgram.samplerUniform, 0);
        },

        drawElements: function () {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);

            gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        },

        orbit: function () {

            var timeThisFrame = Date.now(),
                deltat = timeThisFrame - (this.timeLastFrame || 0),
                proportionOfOrbit = deltat / (this.millisecondsPerDay * this.orbitalPeriod),
                orbitAmount = (Math.PI * 2) * proportionOfOrbit,
                proportionOfSpin = deltat / (this.millisecondsPerDay * this.spinPeriod),
                spinAmount = (Math.PI * 2) * proportionOfSpin;
            this.timeLastFrame = timeThisFrame;

            if (this.orbits) {
                var translationMatrix = glMatrix.mat4.create();

                // X. unspin
                glMatrix.mat4.rotate(translationMatrix, translationMatrix, -lastSpinAngle[this.name], [0, this.axis, 0]);

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
                    glMatrix.mat4.rotate(translationMatrix, translationMatrix, -cumulativeOrbitAngle[this.name], [0, 1, 0]);
                    
                    // 3. move to center of sun
                    glMatrix.mat4.translate(translationMatrix, translationMatrix, [0, 0, this.orbits.distanceFromBodyWeAreOrbiting]);

                    // 4. rotate by earth's LAST orbit angle
                    glMatrix.mat4.rotate(translationMatrix, translationMatrix, lastOrbitAngle[this.orbits.name], [0, 1, 0]);

                    // 5. move back out by earth's distance
                    glMatrix.mat4.translate(translationMatrix, translationMatrix, [0, 0, -this.orbits.distanceFromBodyWeAreOrbiting]);

                    // 6. rotate by the moon's cumulative orbit amount PLUS the new orbit
                    glMatrix.mat4.rotate(translationMatrix, translationMatrix, cumulativeOrbitAngle[this.name] + orbitAmount, [0, 1, 0]);

                    // 7. move back out to orbit space (away from earth)
                    glMatrix.mat4.translate(translationMatrix, translationMatrix, [0, 0, -this.distanceFromBodyWeAreOrbiting]);
                }

                // move the planet according to its orbit matrix
                var tmpMatrix = matrixStack[this.name].pop();
                glMatrix.mat4.multiply(tmpMatrix, tmpMatrix, translationMatrix);
                matrixStack[this.name].push(tmpMatrix);

                // perform spin
                glMatrix.mat4.rotate(tmpMatrix, tmpMatrix, lastSpinAngle[this.name] + spinAmount, [0, this.axis, 0]);

                this.modelViewMatrix = tmpMatrix;

            } else {
                glMatrix.mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, spinAmount, [0, this.axis, 0]);
            }
            
            lastOrbitAngle[this.name] = orbitAmount;
            cumulativeOrbitAngle[this.name] += lastOrbitAngle[this.name];
            lastSpinAngle[this.name] += spinAmount;
        },
        
        currentTime: Date.now(),

        /**
         * Gets the angle amount by which the planet should spin on its axis at the current frame.
         * @param  {Float} orbitAmount The angle amount (in degrees) that the planet has orbited this frame, if any. If not provided, spin amount is calculated based on framerate.
         * @return {[Float]} The angle amount to spin by.
         */
        getAngle: function (orbitAmount) {
            var now = Date.now();
            var deltat = now - this.currentTime;
            this.currentTime = now;
            var fract = orbitAmount || deltat / 5000;
            var angle = Math.PI * 2 * fract;
            return angle;
        },

        animate: function (millisecondsPerDay) {
            this.millisecondsPerDay = millisecondsPerDay;
            this.orbit();
        }

    };

    return AstronomicalObject;
});