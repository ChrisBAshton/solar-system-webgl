define(['gl', 'glMatrix'], function (gl, glMatrix) {


    var cameraMatrix = glMatrix.mat4.create(),
        x = 0,
        y = 20000,
        z = 0;

    function updateCameraMatrix() {
        glMatrix.mat4.lookAt(
            cameraMatrix, // the matrix we're writing to
            [0, 10000, y], // position of the camera in World Space
            [x, 0, z], // where we're looking at in World Space
            [0, 1, 0] // [0, -1, 0] would draw the world upside down
        );
    }

    updateCameraMatrix();

    var movementSpeed = 500;

    return {
        getMatrix: function () {
            return cameraMatrix;
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