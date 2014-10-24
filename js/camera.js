define(['gl', 'glMatrix'], function (gl, glMatrix) {


    var cameraMatrix = glMatrix.mat4.create(),
        x = 0,
        y = 10000,
        z = 20000;

    function updateCameraMatrix() {

        console.log('camera matrix [x,y,z]', x, y, z);

        glMatrix.mat4.lookAt(
            cameraMatrix, // the matrix we're writing to
            [x, y, z], // position of the camera in World Space
            [0, 0, 0], // where we're looking at in World Space
            [0, 1, 0] // [0, -1, 0] would draw the world upside down
        );
    }

    updateCameraMatrix();

    var movementSpeed = 300;

    return {
        getMatrix: function () {
            return cameraMatrix;
        },

        goForwards: function () {
            z -= movementSpeed;
            updateCameraMatrix();
        },

        goBackwards: function () {
            z += movementSpeed;
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