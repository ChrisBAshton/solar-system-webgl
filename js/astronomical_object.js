define(['gl', 'glMatrix'], function (gl, glMatrix) {

    var AstronomicalObject = function (config) {

        this.origin        = config.origin        || [0, 0, -4];
        this.orbits        = config.orbits        || false;
        this.orbitDistance = config.orbitDistance || 0;
        this.radius        = config.radius        || 10;
        this.axis          = config.axis          || 0;
        this.texture       = config.texture       || false;
        this.faceColors    = config.faceColors || [
            [1.0, 0.0, 0.0, 1.0], // Front face
            [0.0, 1.0, 0.0, 1.0], // Back face
            [0.0, 0.0, 1.0, 1.0], // Top face
            [1.0, 1.0, 0.0, 1.0], // Bottom face
            [1.0, 0.0, 1.0, 1.0], // Right face
            [0.0, 1.0, 1.0, 1.0]  // Left face
        ];

        this.modelViewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.translate(this.modelViewMatrix, this.modelViewMatrix, this.origin);

        this.createCube();
    };

    AstronomicalObject.prototype = {

        // Create the vertex, color and index data for a multi-colored cube
        createCube: function () {

            // Vertex Data
            var vertexBuffer;
            vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            
            var scaleFactor = this.radius / 300;

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
            var now = Date.now();
            var deltat = now - this.currentTime;
            this.currentTime = now;
            var fract = deltat / this.spinDuration;
            var angle = Math.PI * 2 * fract;
            glMatrix.mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, [0, 1, 1]);
        },

        orbit: function () {
            if (this.orbits) {
                
                var matrixOfCurrentPlanet       = this.modelViewMatrix;
                var matrixOfPlanetWeAreOrbiting = this.orbits.modelViewMatrix;

                var orbitMatrix = glMatrix.mat4.create();
                var inverseMatrixOfPlanetWeAreOrbiting = glMatrix.mat4.create();

                // start with clean identity matrix
                glMatrix.mat4.identity(orbitMatrix);
                glMatrix.mat4.identity(orbitMatrix);

                // move to matrix of planet we're orbiting
                glMatrix.mat4.multiply(orbitMatrix, orbitMatrix, matrixOfPlanetWeAreOrbiting);

                // rorate
                glMatrix.mat4.rotate(orbitMatrix, orbitMatrix, 0.1, [1, 0, 0]);

                // move back by same distance, but at different angle (hence orbiting)
                glMatrix.mat4.invert(inverseMatrixOfPlanetWeAreOrbiting, matrixOfPlanetWeAreOrbiting);
                glMatrix.mat4.multiply(orbitMatrix, orbitMatrix, inverseMatrixOfPlanetWeAreOrbiting);

                glMatrix.mat4.multiply(this.modelViewMatrix, this.modelViewMatrix, orbitMatrix);
            }
        }

    };

    return AstronomicalObject;
});