define(['solar_system', 'gl', 'camera', 'controls', 'lighting', 'glUtils'], function (SolarSystem, gl, camera, controls, lighting) {

    /**
     * Initialises the application.
     */
    function init() {
        controls.bindToAnimation(function () {
            draw();
        });
        run();
    }

    /**
     * Runs on every animation frame.
     */
    function run() {
        requestAnimationFrame(run);
        
        if (!controls.paused()) {
            draw();
            animate(controls.millisecondsPerDay());
        }
    }

    /**
     * Draws to the canvas.
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
     */
    function cleanCanvas() {
        // clear the background (with black)
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Animates the objects in the Solar System.
     * @param  {float} millisecondsPerDay Determines the speed at which objects spin and orbit.
     */
    function animate(millisecondsPerDay) {
        for (var i = 0; i < SolarSystem.length; i++) {
            SolarSystem[i].animate(millisecondsPerDay);
        }
    }

    return {
        init: init
    };
});