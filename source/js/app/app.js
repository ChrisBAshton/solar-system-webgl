/**
 * Initialises the application
 * @module App
 */
define(['solar_system', 'gl', 'camera', 'controls', 'lighting', 'glUtils'], function (SolarSystem, gl, camera, controls, lighting) {

    var timeLastFrame = false;

    /**
    * Initialises the application.
    *
    * @class App
    * @constructor
    */
    function init() {
        waitUntilAssetsDownloadedThen(function () {
            document.body.className += ' webgl_solarsystem__loaded';
            controls.bindToAnimation(function () {
                draw();
            });
            run();
        });
    }

    function waitUntilAssetsDownloadedThen(callback) {
        var allAssetsDownloaded = true;
        for (var i = 0; i < SolarSystem.length; i++) {
            if (!SolarSystem[i].isReady) {
                allAssetsDownloaded = false;
                break;
            }
        }

        if (allAssetsDownloaded) {
            callback();
        }
        else {
            setTimeout(function () {
                waitUntilAssetsDownloadedThen(callback);
            }, 25);
        }
    }

    /**
     * Runs on every animation frame.
     * @method run
     */
    function run() {
        requestAnimationFrame(run);
        
        if (controls.paused()) {
            timeLastFrame = false;
        }
        else {
            draw();
            animate(controls.millisecondsPerDay());
        }
    }

    /**
     * Draws to the canvas.
     * @method draw
     */
    function draw() {
        cleanCanvas();
        lighting.prepare();
        for (var i = 0; i < SolarSystem.length; i++) {
            var planet = SolarSystem[i];
            planet.draw(camera.getProjectionViewMatrix());
        }
    }

    /**
     * Cleans the canvas.
     * @method cleanCanvas
     */
    function cleanCanvas() {
        // clear the background (with black)
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Animates the objects in the Solar System.
     * @method animate
     * @param  {float} millisecondsPerDay Determines the speed at which objects spin and orbit.
     */
    function animate(millisecondsPerDay) {
        var deltaT = millisecondsSinceLastFrame();
        for (var i = 0; i < SolarSystem.length; i++) {
            SolarSystem[i].animate(millisecondsPerDay, deltaT);
        }
    }

    /**
     * Returns the number of milliseconds since the last frame.
     * @method millisecondsSinceLastFrame
     * @return {int} Number of milliseconds since the last frame.
     */
    function millisecondsSinceLastFrame() {
        var timeThisFrame = Date.now(),
            millisecondsSinceLastFrame = 0;

        if (!timeLastFrame) {
            timeLastFrame = timeThisFrame;
        }

        millisecondsSinceLastFrame = timeThisFrame - timeLastFrame;
        timeLastFrame = timeThisFrame;
        return millisecondsSinceLastFrame;
    }

    return {
        init: init
    };
});