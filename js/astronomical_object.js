define(['gl', 'glMatrix'], function (gl, glMatrix) {

    var AstronomicalObject = function (config) {

        this.setAttributes(config);
        this.setOriginAccordingTo(config);

        this.modelViewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.translate(this.modelViewMatrix, this.modelViewMatrix, this.origin);
        glMatrix.mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [
            0, 0, -(this.radius / 2)
        ]);

        this.createCube(this.radius);
    };

    AstronomicalObject.prototype = {

        setAttributes: function (config) {
            this.name          = config.name          || 'name not set';
            this.orbits        = config.orbits        || false;
            this.orbitDistance = config.orbitDistance || 0;
            this.radius        = config.radius        || 10;
            this.axis          = config.axis          || 0;
            this.texture       = config.texture       || false;
            this.faceColors    = config.faceColors    || [
                [1.0, 0.0, 0.0, 1.0], // Front face
                [0.0, 1.0, 0.0, 1.0], // Back face
                [0.0, 0.0, 1.0, 1.0], // Top face
                [1.0, 1.0, 0.0, 1.0], // Bottom face
                [1.0, 0.0, 1.0, 1.0], // Right face
                [0.0, 1.0, 1.0, 1.0]  // Left face
            ];
        },

        setOriginAccordingTo: function (config) {

            console.log("Setting origin for the " + this.name);

            if (this.orbits) {
                this.origin = this.orbits.origin;
                this.origin[2] -= (this.orbitDistance + this.orbits.radius + this.radius);
            }
            else {
                this.origin = config.origin || [0, 0, 0];
            }

            console.log('origin: ', this.origin);
        },

        // Create the vertex, color and index data for a multi-colored cube
        createCube: function (scaleFactor) {

            // Vertex Data
            var vertexBuffer;
            vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            
            var verts = [
               // Front face
               -1.0 * scaleFactor, -1.0 * scaleFactor,  1.0 * scaleFactor,
                1.0 * scaleFactor, -1.0 * scaleFactor,  1.0 * scaleFactor,
                1.0 * scaleFactor,  1.0 * scaleFactor,  1.0 * scaleFactor,
               -1.0 * scaleFactor,  1.0 * scaleFactor,  1.0 * scaleFactor,

               // Back face
               -1.0 * scaleFactor, -1.0 * scaleFactor, -1.0 * scaleFactor,
               -1.0 * scaleFactor,  1.0 * scaleFactor, -1.0 * scaleFactor,
                1.0 * scaleFactor,  1.0 * scaleFactor, -1.0 * scaleFactor,
                1.0 * scaleFactor, -1.0 * scaleFactor, -1.0 * scaleFactor,

               // Top face
               -1.0 * scaleFactor,  1.0 * scaleFactor, -1.0 * scaleFactor,
               -1.0 * scaleFactor,  1.0 * scaleFactor,  1.0 * scaleFactor,
                1.0 * scaleFactor,  1.0 * scaleFactor,  1.0 * scaleFactor,
                1.0 * scaleFactor,  1.0 * scaleFactor, -1.0 * scaleFactor,

               // Bottom face
               -1.0 * scaleFactor, -1.0 * scaleFactor, -1.0 * scaleFactor,
                1.0 * scaleFactor, -1.0 * scaleFactor, -1.0 * scaleFactor,
                1.0 * scaleFactor, -1.0 * scaleFactor,  1.0 * scaleFactor,
               -1.0 * scaleFactor, -1.0 * scaleFactor,  1.0 * scaleFactor,

               // Right face
                1.0 * scaleFactor, -1.0 * scaleFactor, -1.0 * scaleFactor,
                1.0 * scaleFactor,  1.0 * scaleFactor, -1.0 * scaleFactor,
                1.0 * scaleFactor,  1.0 * scaleFactor,  1.0 * scaleFactor,
                1.0 * scaleFactor, -1.0 * scaleFactor,  1.0 * scaleFactor,

               // Left face
               -1.0 * scaleFactor, -1.0 * scaleFactor, -1.0 * scaleFactor,
               -1.0 * scaleFactor, -1.0 * scaleFactor,  1.0 * scaleFactor,
               -1.0 * scaleFactor,  1.0 * scaleFactor,  1.0 * scaleFactor,
               -1.0 * scaleFactor,  1.0 * scaleFactor, -1.0 * scaleFactor
               ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

            // Color data
            var colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

            var vertexColors = [];
            for (var i in this.faceColors) {
                var color = this.faceColors[i];
                for (var j=0; j < 4; j++) {
                    vertexColors = vertexColors.concat(color);
                }
            }
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

            // Index data (defines the triangles to be drawn)
            var cubeIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
            var cubeIndices = [
                0, 1, 2,      0, 2, 3,    // Front face
                4, 5, 6,      4, 6, 7,    // Back face
                8, 9, 10,     8, 10, 11,  // Top face
                12, 13, 14,   12, 14, 15, // Bottom face
                16, 17, 18,   16, 18, 19, // Right face
                20, 21, 22,   20, 22, 23  // Left face
            ];
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

            this.buffer      = vertexBuffer;
            this.colorBuffer = colorBuffer;
            this.indices     = cubeIndexBuffer;
            this.vertSize    = 3;
            this.nVerts      = 24;
            this.colorSize   = 4;
            this.nColors     = 24;
            this.nIndices    = 36;
            this.primtype    = gl.TRIANGLES;
        },

        draw: function () {
            gl.drawElements(this.primtype, this.nIndices, gl.UNSIGNED_SHORT, 0);
        },

        getModelViewMatrix: function () {
            return this.modelViewMatrix;
        },

        spinDuration: 5000, // ms
        
        currentTime: Date.now(),

        spin: function () {
            // var now = Date.now();
            // var deltat = now - this.currentTime;
            // this.currentTime = now;
            // var fract = deltat / this.spinDuration;
            // var angle = Math.PI * 2 * fract; // @TODO use this.axis somewhere
            // glMatrix.mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, [0, 1, 1]);
        },

        orbit: function () {
            if (this.orbits) {
                // the temporary matrices we'll use to make our planet orbit
                var rotationMatrix = glMatrix.mat4.create(),
                    translationMatrix = glMatrix.mat4.create(),
                    orbitMatrix = glMatrix.mat4.create();

                // matrix of planet we're orbiting
                var parentMatrix = this.orbits.modelViewMatrix;

                // start off at parent planet's matrix
                //glMatrix.mat4.copy(rotationMatrix, parentMatrix);
                
                var orbitingOrigin = [
                    this.orbits.origin[0],
                    this.orbits.origin[1],
                    this.orbits.origin[2]
                ];
                var orbitingOriginInverse = [
                    -this.orbits.origin[0],
                    -this.orbits.origin[1],
                    -this.orbits.origin[2]
                ];

                glMatrix.mat4.translate(rotationMatrix, rotationMatrix, orbitingOriginInverse);
                glMatrix.mat4.rotate(rotationMatrix, rotationMatrix, 0.05, [0, 1, 0]);
                glMatrix.mat4.translate(rotationMatrix, rotationMatrix, orbitingOrigin);
                
                // @TODO move back out to original orbit distance
                

                // multiply translation and rotation matrices to get our orbit matrix
                glMatrix.mat4.multiply(orbitMatrix, rotationMatrix, translationMatrix);

                // move the planet according to its orbit matrix
                glMatrix.mat4.multiply(this.modelViewMatrix, this.modelViewMatrix, orbitMatrix);
            }
        }

    };

    return AstronomicalObject;
});