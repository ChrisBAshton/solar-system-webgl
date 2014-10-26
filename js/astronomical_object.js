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

    AstronomicalObject.prototype = {

        setAttributes: function (config) {
            this.name          = config.name          || 'name not set';
            this.orbits        = config.orbits        || false;
            this.orbitDistance = config.orbitDistance || 0;
            this.radius        = config.radius        || 10;
            this.axis          = config.axis          || 0;
            this.texture       = config.texture       || "textures/moon.gif";

            this.orbitDistance /= 100;
            if (this.orbits) {
                this.radius *= 10;
            }
        },

        setOriginAccordingTo: function (config) {
            if (this.orbits) {
                this.origin = [];
                this.origin[0] = this.orbits.origin[0];
                this.origin[1] = this.orbits.origin[1];
                this.origin[2] = this.orbits.origin[2] - (this.orbitDistance + this.orbits.radius + this.radius);

                console.log(this.name + " does orbit, and its origin is ", this.origin);
                console.log("Its parent (" + this.orbits.name + ") has an origin of: ", this.orbits.origin);
            }
            else {
                this.origin = config.origin || [0, 0, 0];
            }
        },

        initMatrix: function () {
            this.modelViewMatrix = glMatrix.mat4.create();
            glMatrix.mat4.identity(this.modelViewMatrix);
            glMatrix.mat4.translate(this.modelViewMatrix, this.modelViewMatrix, this.origin);     
            // glMatrix.mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [
            //     0, 0, -(this.radius / 2)
            // ]);
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

        // Create the vertex, color and index data for a multi-colored cube
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

        getModelViewMatrix: function () {
            return this.modelViewMatrix;
        },

        spinDuration: 5000, // ms
        
        currentTime: Date.now(),

        spin: function () {
            var now = Date.now();
            var deltat = now - this.currentTime;
            this.currentTime = now;
            var fract = deltat / this.spinDuration;
            var angle = Math.PI * 2 * fract; // @TODO use this.axis somewhere

            var tmpMatrix = glMatrix.mat4.create();
            glMatrix.mat4.rotate(tmpMatrix, tmpMatrix, angle, [0, 1, this.axis]);
            return tmpMatrix;
        },

        orbit: function () {
            if (this.orbits) {
                // the temporary matrices we'll use to make our planet orbit
                var rotationMatrix = glMatrix.mat4.create(),
                    translationMatrix = glMatrix.mat4.create(),
                    orbitMatrix = glMatrix.mat4.create();

                var orbitingOrigin = [
                    this.origin[0] - this.orbits.origin[0],
                    this.origin[1] - this.orbits.origin[1],
                    this.origin[2] - this.orbits.origin[2]
                ];
                var orbitingOriginInverse = [
                    -orbitingOrigin[0],
                    -orbitingOrigin[1],
                    -orbitingOrigin[2]
                ];

                // we like orbit distance of 1000 and radius of 0.05
                // distances further than 1000 should have a smaller radius rotation matrix
                
                var rotation = 50 / this.orbitDistance;

                glMatrix.mat4.translate(rotationMatrix, rotationMatrix, orbitingOriginInverse);
                glMatrix.mat4.rotate(rotationMatrix, rotationMatrix, rotation, [0, 1, 0]);
                //glMatrix.mat4.multiply(rotationMatrix, rotationMatrix, this.spin());
                glMatrix.mat4.translate(rotationMatrix, rotationMatrix, orbitingOrigin);
                

                // multiply translation and rotation matrices to get our orbit matrix
                glMatrix.mat4.multiply(orbitMatrix, rotationMatrix, translationMatrix);

                // move the planet according to its orbit matrix
                glMatrix.mat4.multiply(this.modelViewMatrix, this.modelViewMatrix, orbitMatrix);

            }/* else {
                glMatrix.mat4.multiply(this.modelViewMatrix, this.modelViewMatrix, this.spin());
            }*/
        }

    };

    return AstronomicalObject;
});