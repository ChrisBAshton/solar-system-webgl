define(['gl', 'glMatrix'], function (gl, glMatrix) {

    var canvas           = document.getElementById('canvas_solar_system'),
        projectionMatrix = glMatrix.mat4.create(),
        cameraMatrix     = glMatrix.mat4.create();

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

        calculateMovementSpeed: function (acceleration) {
            return acceleration * acceleration; //acceleration < 10 ? 10 : acceleration > 100 ? 100 : acceleration;
        },

        rotateView: function (rotationMatrix) {
            glMatrix.mat4.multiply(cameraMatrix, cameraMatrix, rotationMatrix);
        },

        goForwards: function (acceleration) {
            glMatrix.mat4.translate(cameraMatrix, cameraMatrix, [0, 0, this.calculateMovementSpeed(acceleration)]);
        },

        goBackwards: function (acceleration) {
            glMatrix.mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -this.calculateMovementSpeed(acceleration)]);
        },

        goLeft: function (acceleration) {
            glMatrix.mat4.translate(cameraMatrix, cameraMatrix, [this.calculateMovementSpeed(acceleration), 0, 0]);
        },

        goRight: function (acceleration) {
            glMatrix.mat4.translate(cameraMatrix, cameraMatrix, [-this.calculateMovementSpeed(acceleration), 0, 0]);
        }
    }

});