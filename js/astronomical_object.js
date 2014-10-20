define(['gl', 'glMatrix'], function (gl, glMatrix) {

    var AstronomicalObject = function (originalPosition) {

        this.modelViewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.translate(this.modelViewMatrix, this.modelViewMatrix, originalPosition);

        this.createCube();
    };

    AstronomicalObject.prototype = {

        // Create the vertex, color and index data for a multi-colored cube
        createCube: function () {

            // Vertex Data
            var vertexBuffer;
            vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            var verts = [
               // Front face
               -1.0, -1.0,  1.0,
                1.0, -1.0,  1.0,
                1.0,  1.0,  1.0,
               -1.0,  1.0,  1.0,

               // Back face
               -1.0, -1.0, -1.0,
               -1.0,  1.0, -1.0,
                1.0,  1.0, -1.0,
                1.0, -1.0, -1.0,

               // Top face
               -1.0,  1.0, -1.0,
               -1.0,  1.0,  1.0,
                1.0,  1.0,  1.0,
                1.0,  1.0, -1.0,

               // Bottom face
               -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, -1.0,  1.0,
               -1.0, -1.0,  1.0,

               // Right face
                1.0, -1.0, -1.0,
                1.0,  1.0, -1.0,
                1.0,  1.0,  1.0,
                1.0, -1.0,  1.0,

               // Left face
               -1.0, -1.0, -1.0,
               -1.0, -1.0,  1.0,
               -1.0,  1.0,  1.0,
               -1.0,  1.0, -1.0
               ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

            // Color data
            var colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            var faceColors = [
                [1.0, 0.0, 0.0, 1.0], // Front face
                [0.0, 1.0, 0.0, 1.0], // Back face
                [0.0, 0.0, 1.0, 1.0], // Top face
                [1.0, 1.0, 0.0, 1.0], // Bottom face
                [1.0, 0.0, 1.0, 1.0], // Right face
                [0.0, 1.0, 1.0, 1.0]  // Left face
            ];
            var vertexColors = [];
            for (var i in faceColors) {
                var color = faceColors[i];
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
        }

    };

    return AstronomicalObject;
});