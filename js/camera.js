define(['gl', 'glMatrix'], function (gl, glMatrix) {

    var canvas           = document.getElementById('canvas_solar_system'),
        projectionMatrix = glMatrix.mat4.create(),
        cameraMatrix     = glMatrix.mat4.create(),
        x                = 0,
        y                = 20000,
        z                = 0,
        movementSpeed    = 500;

    function updateCameraMatrix() {
        glMatrix.mat4.lookAt(
            cameraMatrix, // the matrix we're writing to
            [0, 10000, y], // position of the camera in World Space
            [x, 0, z], // where we're looking at in World Space
            [0, 1, 0] // [0, -1, 0] would draw the world upside down
        );
    }

    updateCameraMatrix();

    return {

        getProjectionViewMatrix: function () {

            var projectionViewMatrix = glMatrix.mat4.create();

            // Create a project matrix with 45 degree field of view
            glMatrix.mat4.perspective(
                projectionMatrix,
                Math.PI / 4,        // 45 degree field of view
                canvas.width / canvas.height,
                1,
                100000
            );

            glMatrix.mat4.multiply(projectionViewMatrix, projectionMatrix, cameraMatrix);

            return projectionViewMatrix;
        },

        rotateView: function (rotationMatrix) {
            glMatrix.mat4.multiply(cameraMatrix, cameraMatrix, rotationMatrix);
        },

        goForwards: function () {
            y -= movementSpeed;
            updateCameraMatrix();
        },

        goBackwards: function () {
            y += movementSpeed;
            updateCameraMatrix();
        },

        goLeft: function () {
            x -= movementSpeed;
            updateCameraMatrix();
        },

        goRight: function () {
            x += movementSpeed;
            updateCameraMatrix();
        }
    }

});