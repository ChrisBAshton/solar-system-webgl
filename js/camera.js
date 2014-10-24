define(['gl', 'glMatrix'], function (gl, glMatrix) {


    var cameraMatrix = glMatrix.mat4.create();

    function updateCameraMatrix() {
        glMatrix.mat4.lookAt(
            cameraMatrix, // the matrix we're writing to
            [0, 10000, 20000], // position of the camera in World Space
            [0, 0, 0], // where we're looking at in World Space
            [0, 1, 0] // [0, -1, 0] would draw the world upside down
        );
    }

    updateCameraMatrix();

    return {
        getMatrix: function () {
            return cameraMatrix;
        }
    }

});