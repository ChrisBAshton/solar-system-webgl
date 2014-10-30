define(['glMatrix', 'camera', 'Mousetrap'], function (glMatrix, camera) {

    var canvas           = document.getElementById('canvas_solar_system');
    var triggerAnimation = function () {};
    var mouseDown        = false;
    var lastMouseX       = null;
    var lastMouseY       = null;
    var paused           = false;

    function init() {
        bindKeyboardControls();
        bindMouseControls();
        createGUI();
    }

    function bindMouseControls() {
        canvas.onmousedown   = handleMouseDown;
        document.onmouseup   = handleMouseUp;
        document.onmousemove = handleMouseMove;
    }

    function bindKeyboardControls() {
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
    }

    function createGUI() {

        var guiContainer = document.createElement('DIV');
        guiContainer.id = 'webgl_solarsystem_gui';
        document.body.appendChild(guiContainer);

        var pauseButton     = document.createElement('BUTTON'),
            pauseButtonText = document.createTextNode("Play/pause");

        pauseButton.onclick = function () {
            paused = !paused;
        }

        pauseButton.appendChild(pauseButtonText);
        guiContainer.appendChild(pauseButton);

        var millisecondsPerDay   = document.createElement('INPUT');
        millisecondsPerDay.type  = 'range';
        millisecondsPerDay.id    = 'millisecondsPerDay';
        millisecondsPerDay.min   = 500;
        millisecondsPerDay.max   = 20000;
        millisecondsPerDay.value = 35000;

        guiContainer.appendChild(document.createTextNode(millisecondsPerDay.min));
        guiContainer.appendChild(millisecondsPerDay);
        guiContainer.appendChild(document.createTextNode(millisecondsPerDay.max));
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
        },

        paused: function () {
            return paused;
        },

        millisecondsPerDay: function () {
            return parseInt(document.getElementById('millisecondsPerDay').value, 10);
        }
    }

});