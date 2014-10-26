define(['glMatrix', 'camera', 'Mousetrap'], function (glMatrix, camera) {

    var canvas           = document.getElementById('canvas_solar_system');
    var triggerAnimation = function () {};

    Mousetrap.bind(['w', 'a', 's', 'd'], function (e, key) {

        var validKey = true;

        switch (key) {
            case 'w':
                camera.goForwards();
                break;
            case 'a':
                camera.goLeft();
                break;
            case 's':
                camera.goBackwards();
                break;
            case 'd':
                camera.goRight();
                break;
            default:
                validKey = false;
        }

        if (validKey) {
            triggerAnimation();
        }

    }, 'keydown');

    var mouseDown = false;
    var lastMouseX = null;
    var lastMouseY = null;

    function init() {
        canvas.onmousedown   = handleMouseDown;
        document.onmouseup   = handleMouseUp;
        document.onmousemove = handleMouseMove; 
    }

    function handleMouseDown(event) {
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }

    function handleMouseUp(event) {
        mouseDown = false;
    }

    function handleMouseMove(event) {
        if (!mouseDown) {
            return;
        }
        var newX = event.clientX;
        var newY = event.clientY;

        var deltaX = newX - lastMouseX
        var newRotationMatrix = glMatrix.mat4.create();
        glMatrix.mat4.identity(newRotationMatrix);
        glMatrix.mat4.rotate(newRotationMatrix, newRotationMatrix, degToRad(deltaX / 10), [0, 1, 0]);

        var deltaY = newY - lastMouseY;
        glMatrix.mat4.rotate(newRotationMatrix, newRotationMatrix, degToRad(deltaY / 10), [1, 0, 0]);

        camera.rotateView(newRotationMatrix);

        lastMouseX = newX
        lastMouseY = newY;

        triggerAnimation();
    }

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }


    return {
        bindToAnimation: function (callback) {
            triggerAnimation = callback;
            init();
        }
    }

});