define(['gl', 'glMatrix'], function (gl, glMatrix) {

    var canvas           = document.getElementById('canvas_solar_system'),
        projectionMatrix = glMatrix.mat4.create(),
        cameraMatrix     = glMatrix.mat4.create(),
        movementSpeed    = 50;

    function init() {
        createProjectionMatrix();
        // camera's starting position
        glMatrix.mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -5000]);
    }

    function createProjectionMatrix() {
        // Create a project matrix with 45 degree field of view
        glMatrix.mat4.perspective(
            projectionMatrix,
            Math.PI / 4,        // 45 degree field of view
            canvas.width / canvas.height,
            1,
            100000
        );
    }

    init();

    return {

        getProjectionViewMatrix: function () {
            var projectionViewMatrix = glMatrix.mat4.create();
            glMatrix.mat4.multiply(projectionViewMatrix, projectionMatrix, cameraMatrix);
            return projectionViewMatrix;
        },

        rotateView: function (rotationMatrix) {
            glMatrix.mat4.multiply(cameraMatrix, cameraMatrix, rotationMatrix);
        },

        goForwards: function () {
            glMatrix.mat4.translate(cameraMatrix, cameraMatrix, [0, 0, movementSpeed]);
        },

        goBackwards: function () {
            glMatrix.mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -movementSpeed]);
        },

        goLeft: function () {
            glMatrix.mat4.translate(cameraMatrix, cameraMatrix, [movementSpeed, 0, 0]);
        },

        goRight: function () {
            glMatrix.mat4.translate(cameraMatrix, cameraMatrix, [-movementSpeed, 0, 0]);
        }
    }

});