define(['glMatrix', 'camera', 'controls__gui', 'solar_system', 'Mousetrap'], function (glMatrix, camera, gui, SolarSystem) {

    var canvas           = document.getElementById('canvas_solar_system');
    var triggerAnimation = function () {};
    var keyDown          = false;
    var mouseDown        = false;
    var lastMouseX       = null;
    var lastMouseY       = null;
    var paused           = false;
    var planetShortcuts  = {};

    function init() {
        bindKeysToPlanets();
        bindKeyboardControls();
        bindMouseControls();
        gui.init(planetShortcuts);
    }

    function bindMouseControls() {
        canvas.onmousedown   = handleMouseDown;
        document.onmouseup   = handleMouseUp;
        document.onmousemove = handleMouseMove;
    }

    function bindKeysToPlanets() {

        /*
            This seems an awful way of doing it, but passing currentPlanet to the camera.snapTo function always snaps to Saturn's Rings (i.e. the last planet in the loop).
         */
        var arrayOfKeysToBind = [],
            currentPlanet;

        for (var i = 0; i < SolarSystem.length; i++) {
            currentPlanet = SolarSystem[i];
            if (currentPlanet.shortcutKey) {
                planetShortcuts[currentPlanet.shortcutKey] = currentPlanet;
                arrayOfKeysToBind.push(currentPlanet.shortcutKey);
            }
        }

        Mousetrap.bind(arrayOfKeysToBind, function (e, key) {
            camera.snapTo(planetShortcuts[key]);
            triggerAnimation();
        });
    }

    function bindKeyboardControls() {
        Mousetrap.bind(['w', 'a', 's', 'd'], function (e, key) {

            keyDown = keyDown ? ++keyDown : 1;

            var validKey = true;

            switch (key) {
                case 'w':
                    camera.goForwards(keyDown);
                    break;
                case 'a':
                    camera.goLeft(keyDown);
                    break;
                case 's':
                    camera.goBackwards(keyDown);
                    break;
                case 'd':
                    camera.goRight(keyDown);
                    break;
                default:
                    validKey = false;
            }

            if (validKey) {
                triggerAnimation();
            }

        }, 'keydown');

        Mousetrap.bind(['w', 'a', 's', 'd'], function (e, key) {
            keyDown = false;
        }, 'keyup');

        Mousetrap.bind(['f'], function (e, key) {
            camera.toggleFullScreen();
            triggerAnimation();
        }, 'keydown');

        Mousetrap.bind(['p'], function (e, key) {
            paused = !paused;
        }, 'keydown');

        Mousetrap.bind(['r'], function (e, key) {
            camera.resetPosition();
        }, 'keydown');
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