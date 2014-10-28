define(['solar_system', 'gl', 'shaders', 'camera', 'controls', 'glUtils'], function (SolarSystem, gl, shaderProgram, camera, controls) {

    function init() {
        controls.bindToAnimation(function () {
            draw();
        });
        run();
    }

    function run() {
        requestAnimationFrame(run);
        
        if (!controls.paused()) {
            draw();
            animate();
        }
    }

    function draw() {        
        cleanCanvas();

        for (var i = 0; i < SolarSystem.length; i++) {
            var planet = SolarSystem[i];
            planet.draw(shaderProgram, camera.getProjectionViewMatrix());
        }
    }

    function cleanCanvas() {
        // clear the background (with black)
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);
    }

    function animate() {
        for (var i = 0; i < SolarSystem.length; i++) {
            SolarSystem[i].animate();
        }
    }

    return {
        init: init
    }
});