define(['glMatrix', 'glUtils', 'astronomical_object', 'gl', 'shaders'], function (glMatrix, glUtils, AstronomicalObject, gl, shaders) {

    var shaderProgram,
        projectionMatrix;

    function init() {
        var canvas = document.getElementById('canvas_solar_system');
        initViewport(gl, canvas);

        var square = new AstronomicalObject([0, -2, -7.333]);
        var square2 = new AstronomicalObject([0, 2, -7.333]);

        var solarSystem = [square, square2];

        initMatrices(canvas);
        shaderProgram = shaders.init();
        run(gl, solarSystem);
    }


    function initViewport(gl, canvas) {
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function initMatrices(canvas) {
        // Create a project matrix with 45 degree field of view
        projectionMatrix = glMatrix.mat4.create();
        glMatrix.mat4.perspective(
            projectionMatrix,
            Math.PI / 4,        // 45 degree field of view
            canvas.width / canvas.height,
            1,
            10000
        );
    }

    function run(gl, solarSystem) {
        requestAnimationFrame(function() {
            run(gl, solarSystem);
        });
        draw(gl, solarSystem);
        animate(solarSystem);
    }

    function draw(gl, solarSystem) {
        // clear the background (with black)
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

        // set the shader to use
        gl.useProgram(shaderProgram);


        for (var i = 0; i < solarSystem.length; i++) {
            var planet = solarSystem[i];
            shaders.getReadyToDraw(projectionMatrix, planet.getModelViewMatrix(), planet);
            planet.draw();
        }
    }

    function animate(solarSystem) {
        for (var i = 0; i < solarSystem.length; i++) {
            solarSystem[i].spin();
        }
    }

    return {
        init: init
    }

});