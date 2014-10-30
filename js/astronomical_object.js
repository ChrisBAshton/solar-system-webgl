define(['gl', 'glMatrix'], function (gl, glMatrix) {

    /**
     * [AstronomicalObject description]
     * @param {Object} config The config object.
     * @param {int} config.orbitDistance X thousand miles from whatever it is orbiting. This is then automatically reduced for presentation purposes.
     * @param {int} config.radius X thousand. This is then automatically increased for presentation purposes.
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

    AstronomicalObject.prototype = {

        degreesToRadians: function (celsius) {
            return celsius * (Math.PI / 180);
        },

        setAttributes: function (config) {
            this.name          = config.name                        || 'name not set';
            this.orbits        = config.orbits                      || false;
            this.orbitDistance = config.orbitDistance               || 0;
            this.radius        = config.radius                      || 10;
            this.axis          = this.degreesToRadians(config.axis) || 0;
            this.texture       = config.texture                     || "textures/moon.gif";

            this.orbitDistance /= 100;
            if (this.orbits) {
                this.radius *= 10;
                this.distanceFromBodyWeAreOrbiting = this.radius + this.orbitDistance + this.orbits.radius;
            }
        },

        setOriginAccordingTo: function (config) {
            if (this.orbits) {
                this.origin = [];
                this.origin[0] = this.orbits.origin[0];
                this.origin[1] = this.orbits.origin[1];
                this.origin[2] = this.orbits.origin[2] - this.distanceFromBodyWeAreOrbiting;
            }
            else {
                this.origin = config.origin || [0, 0, 0];
            }
        },

        initMatrix: function () {
            var modelViewMatrix = glMatrix.mat4.create();
            glMatrix.mat4.identity(modelViewMatrix);
            glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, this.origin); 

            matrixStack[this.name] = [];
            matrixStack[this.name].push(modelViewMatrix);
            lastSpinAngle[this.name] = 0;
            lastOrbitAngle[this.name] = 0;

            this.modelViewMatrix = modelViewMatrix;
        },

        initTexture: function() {
            var moonTexture = gl.createTexture();
            moonTexture.image = new Image();
            moonTexture.image.crossOrigin = "anonymous";

            var self = this;

            moonTexture.image.onload = function () {
                self.handleLoadedTexture(moonTexture);
            }

            moonTexture.image.src = this.texture;
        },

        handleLoadedTexture: function (texture) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);

            gl.bindTexture(gl.TEXTURE_2D, null);

            this.moonTexture = texture;
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

            this.moonVertexNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.moonVertexNormalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
            this.moonVertexNormalBuffer.itemSize = 3;
            this.moonVertexNormalBuffer.numItems = normalData.length / 3;

            this.moonVertexTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.moonVertexTextureCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
            this.moonVertexTextureCoordBuffer.itemSize = 2;
            this.moonVertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

            this.moonVertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.moonVertexPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
            this.moonVertexPositionBuffer.itemSize = 3;
            this.moonVertexPositionBuffer.numItems = vertexPositionData.length / 3;

            this.moonVertexIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.moonVertexIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
            this.moonVertexIndexBuffer.itemSize = 1;
            this.moonVertexIndexBuffer.numItems = indexData.length;
        },

        draw: function (shaderProgram, projectionMatrix) {

            var lighting = false;
            gl.uniform1i(shaderProgram.useLightingUniform, lighting);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.moonTexture);
            gl.uniform1i(shaderProgram.samplerUniform, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.moonVertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.moonVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.moonVertexTextureCoordBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.moonVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.moonVertexNormalBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.moonVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.moonVertexIndexBuffer);

            gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, projectionMatrix);
            gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, this.modelViewMatrix);
            
            var normalMatrix = glMatrix.mat3.create();
            glMatrix.mat3.normalFromMat4(normalMatrix, this.modelViewMatrix);
            gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

            gl.drawElements(gl.TRIANGLES, this.moonVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        },

        orbit: function () {
            if (this.orbits) {
                var translationMatrix = glMatrix.mat4.create();
                var orbitAmount = (90 / this.orbitDistance) / (this.millisecondsPerYear / 1000);
                var spinAmount  = this.getAngle(orbitAmount);
                var inverseParentMatrix = glMatrix.mat4.create();
                glMatrix.mat4.invert(inverseParentMatrix, this.orbits.modelViewMatrix);



                // move to origin
                glMatrix.mat4.rotate(translationMatrix, translationMatrix, -lastSpinAngle[this.name], [0, this.axis, 0]);
                glMatrix.mat4.translate(translationMatrix, translationMatrix, [0, 0, this.distanceFromBodyWeAreOrbiting]);

                // ############## multiply by the inverse of the parent matrix
                glMatrix.mat4.multiply(translationMatrix, translationMatrix, inverseParentMatrix);

                // ############## multiply by the parent matrix

                if (this.orbits.orbits) {

                    // rotate by the MOONs last orbit angle
                    glMatrix.mat4.rotate(translationMatrix, translationMatrix, -lastOrbitAngle[this.name], [0, this.axis, 0]);

                    glMatrix.mat4.translate(translationMatrix, translationMatrix, [0, 0, this.orbits.distanceFromBodyWeAreOrbiting]);
                    
                    glMatrix.mat4.rotate(translationMatrix, translationMatrix, lastOrbitAngle[this.orbits.name], [0, 1, 0]);
                    glMatrix.mat4.translate(translationMatrix, translationMatrix, [0, 0, -this.orbits.distanceFromBodyWeAreOrbiting]);

                    // then correct ourselves
                    glMatrix.mat4.rotate(translationMatrix, translationMatrix, lastOrbitAngle[this.name], [0, this.axis, 0]);
                }

               glMatrix.mat4.multiply(translationMatrix, translationMatrix, this.orbits.modelViewMatrix);
                // perform orbit
                glMatrix.mat4.rotate(translationMatrix, translationMatrix, orbitAmount, [0, 1, 0]);
                glMatrix.mat4.translate(translationMatrix, translationMatrix, [0, 0, -this.distanceFromBodyWeAreOrbiting]);


                // move the planet according to its orbit matrix
                var tmpMatrix = matrixStack[this.name].pop();
                glMatrix.mat4.multiply(tmpMatrix, tmpMatrix, translationMatrix);
                matrixStack[this.name].push(tmpMatrix);

                // perform spin
                glMatrix.mat4.rotate(tmpMatrix, tmpMatrix, lastSpinAngle[this.name] + spinAmount, [0, this.axis, 0]);

                lastOrbitAngle[this.name] = orbitAmount;
                lastSpinAngle[this.name] += spinAmount;

                this.modelViewMatrix = tmpMatrix;

            } /*else {
                lastSpinAngle[this.name] = this.getAngle();
                glMatrix.mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, lastSpinAngle[this.name], [0, this.axis, 0]);
            }*/
        },
        
        currentTime: Date.now(),

        /**
         * Gets the angle amount by which the planet should spin on its axis at the current frame.
         * @param  {Float} orbitAmount The angle amount that the planet has orbited this frame, if any. If not provided, spin amount is calculated based on framerate.
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

        animate: function (millisecondsPerYear) {
            this.millisecondsPerYear = millisecondsPerYear;
            this.orbit();
        }

    };

    return AstronomicalObject;
});