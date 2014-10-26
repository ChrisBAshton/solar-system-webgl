define(['solar_system', 'gl', 'shaders', 'camera', 'controls', 'glUtils'], function (SolarSystem, gl, shaderProgram, camera, controls) {

    var test = false;

    function init() {
        
        if (test) {
            createStepThroughButton();
        }

        controls.bindToAnimation(function () {
            draw();
        });

        run();
    }

    function createStepThroughButton() {
        var stepButton     = document.createElement('BUTTON'),
            stepButtonText = document.createTextNode("Step through animation");

        stepButton.onclick = function () {
            run();
        }

        stepButton.appendChild(stepButtonText);
        document.body.appendChild(stepButton);
    }

    function run() {
        if (!test) {
            requestAnimationFrame(run);
        }
        draw();
        animate();
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