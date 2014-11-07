define(['gl', 'glMatrix'], function (gl, glMatrix) {

    var canvas              = document.getElementById('canvas_solar_system'),
        projectionMatrix    = glMatrix.mat4.create(),
        cameraMatrix        = glMatrix.mat4.create(),
        fullScreen          = false,
        defaultCanvasWidth  = 800,
        defaultCanvasHeight = 400;

    function init() {
        setCanvasSize(defaultCanvasWidth, defaultCanvasHeight);
        moveCameraToStartingPosition();
    }

    function moveCameraToStartingPosition() {
        glMatrix.mat4.identity(cameraMatrix);
        glMatrix.mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -5000]);
    }

    function setCanvasSize(width, height) {
        canvas.width  = width;
        canvas.height = height;
        gl.viewport(0, 0, canvas.width, canvas.height);
        updateProjectionMatrix();
    }

    function updateProjectionMatrix() {
        // Create a project matrix with 45 degree field of view
        glMatrix.mat4.perspective(
            projectionMatrix,
            Math.PI / 4,        // 45 degree field of view
            canvas.width / canvas.height,
            1,
            1000000
        );
    }

    init();

    return {

        toggleFullScreen: function () {
            fullScreen = !fullScreen;

            if (fullScreen) {
                canvas.className = 'canvas_solar_system--full_screen';
                setCanvasSize(window.innerWidth, window.innerHeight);
            } else {
                canvas.className = 'canvas_solar_system';
                setCanvasSize(defaultCanvasWidth, defaultCanvasHeight);
            }
        },

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
        },

        resetPosition: moveCameraToStartingPosition,

        snapTo: function (planet) {
            // clean slate
            glMatrix.mat4.identity(cameraMatrix);

            // translate planet orbital distance
            glMatrix.mat4.translate(cameraMatrix, cameraMatrix, [
                planet.origin[0],
                planet.origin[1],
                planet.origin[2]
            ]);

            // zoom out a little so that we can see the planet
            glMatrix.mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -planet.radius * 5]);

            // rotate same amount as planet
            glMatrix.mat4.rotate(cameraMatrix, cameraMatrix, -planet.cumulativeOrbitAngle, [0, 1, 0]);

            // turn back to face the Sun
            glMatrix.mat4.rotate(cameraMatrix, cameraMatrix, Math.PI, [0, 1, 0]);
        }
    };
});