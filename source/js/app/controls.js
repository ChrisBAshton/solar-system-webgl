define(['glMatrix', 'camera', 'controls__gui', 'solar_system', 'Mousetrap'], function (glMatrix, camera, gui, SolarSystem) {

    var canvas           = document.getElementById('canvas_solar_system');
    var triggerAnimation = function () {};
    var keyDown          = false;
    var mouseDown        = false;
    var lastMouseX       = null;
    var lastMouseY       = null;
    var paused           = false;
    var planetShortcuts  = {};

    /**
     * Initialises the controls.
     */
    function init() {
        bindKeysToPlanets();
        bindKeyboardControls();
        bindMouseControls();
        gui.init(planetShortcuts, triggerAnimation);
    }

    /**
     * Binds the mouse events to handler functions.
     */
    function bindMouseControls() {
        canvas.onmousedown   = handleMouseDown;
        document.onmouseup   = handleMouseUp;
        document.onmousemove = handleMouseMove;
    }

    /**
     * Handles binding certain key presses to calling the camera snapTo() function.
     */
    function bindKeysToPlanets() {

        /*
            This seems an awful way of doing it, but passing currentPlanet to the camera.snapTo function always snaps to Saturn's Rings (i.e. the last planet in the loop).

            @TODO - improve.
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

    /**
     * Binds some key events to handler functions.
     */
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
            triggerAnimation();
        }, 'keydown');
    }

    /**
     * Handles the mouse down event. In this case, we cache the position of the mouse so it can be used in rotation calculations later.
     * @param  {event} event The mouse event.
     */
    function handleMouseDown(event) {
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }

    /**
     * Handles the mouse up event.
     * @param  {event} event The mouse event.
     */
    function handleMouseUp(event) {
        mouseDown = false;
    }

    /**
     * Handles the mouse move event. In this case, we rotate the camera if the mouse button is down at the same time.
     * @param  {event} event The mouse event.
     */
    function handleMouseMove(event) {
        if (!mouseDown) {
            return;
        }
        var newX = event.clientX;
        var newY = event.clientY;

        var deltaX = newX - lastMouseX;
        var newRotationMatrix = glMatrix.mat4.create();
        glMatrix.mat4.identity(newRotationMatrix);
        glMatrix.mat4.rotate(newRotationMatrix, newRotationMatrix, degToRad(deltaX / 10), [0, 1, 0]);

        var deltaY = newY - lastMouseY;
        glMatrix.mat4.rotate(newRotationMatrix, newRotationMatrix, degToRad(deltaY / 10), [1, 0, 0]);

        camera.rotateView(newRotationMatrix);

        lastMouseX = newX;
        lastMouseY = newY;

        triggerAnimation();
    }

    /**
     * Converts degrees to radians. @TODO - this is a duplicate of degToRad in AstronomicalObject. Should remove the duplication.
     * @param  {int} celsius Value in degrees.
     * @return {float}       Converted value in radians.
     */
    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    return {
        /**
         * Provides a hook for app.js to call functions after we've manually triggered animation. i.e. If we update the view in controls.js we can trigger the callback and ensure that the changes are drawn immediately (useful if the solar system animation is paused).
         * @param  {Function} callback Function to call when we want to trigger the animation.
         */
        bindToAnimation: function (callback) {
            triggerAnimation = callback;
            init();
        },

        /**
         * Other modules can tell if the animation is paused by querying this. @TODO - this is a code smell
         * @return {boolean} True if animation is paused, false if not.
         */
        paused: function () {
            return paused;
        },

        /**
         * Grabs the milliseconds per dsy from the GUI form input.
         * @return {float} Milliseconds per day.
         */
        millisecondsPerDay: function () {
            return parseInt(document.getElementById('millisecondsPerDay').value, 10);
        }
    };
});