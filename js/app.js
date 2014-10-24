define(['glMatrix', 'glUtils', 'astronomical_object', 'gl', 'shaders', 'camera'], function (glMatrix, glUtils, AstronomicalObject, gl, shaders, camera) {

    var canvas = document.getElementById('canvas_solar_system'),
        projectionViewMatrix = glMatrix.mat4.create(),
        projectionMatrix = glMatrix.mat4.create(),
        shaderProgram;

    function init() {
        initViewport(gl);

        var theSun = new AstronomicalObject({
            name:    "Sun",
            origin:  [0, 0, 0],
            radius:  1000,
            axis:    0,
            texture: 'http://www.corsproxy.com/learningwebgl.com/lessons/lesson11/moon.gif'/*,
            faceColors: [
                [1.0, 1.0, 1.0, 1.0], // Front face
                [1.0, 1.0, 1.0, 1.0], // Back face
                [1.0, 1.0, 1.0, 1.0], // Top face
                [1.0, 1.0, 0.0, 1.0], // Bottom face
                [1.0, 1.0, 1.0, 1.0], // Right face
                [1.0, 1.0, 1.0, 1.0]  // Left face
            ]*/
        });

        var mercury = new AstronomicalObject({
            name:          "Mercury",
            orbits:        theSun,
            orbitDistance: 1000,
            radius:        100,
            axis:          0,
            texture:       'http://www.corsproxy.com/learningwebgl.com/lessons/lesson11/moon.gif'
        });

        var earth = new AstronomicalObject({
            name:          "Earth",
            orbits:        theSun,
            orbitDistance: 2200,
            radius:        300,
            axis:          0,
            texture:       'http://www.corsproxy.com/learningwebgl.com/lessons/lesson11/moon.gif'
        });

        var moon = new AstronomicalObject({
            name:          "Moon",
            orbits:        earth,
            orbitDistance: 150,
            radius:        90,
            axis:          0,
            texture:       'http://www.corsproxy.com/learningwebgl.com/lessons/lesson11/moon.gif'
        });

        var solarSystem = [theSun, mercury, earth, moon];

        shaderProgram = shaders.init();
        run(gl, solarSystem);
    }


    function initViewport(gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function getProjectionViewMatrix() {
        // Create a project matrix with 45 degree field of view
        glMatrix.mat4.perspective(
            projectionMatrix,
            Math.PI / 4,        // 45 degree field of view
            canvas.width / canvas.height,
            1,
            100000
        );

        glMatrix.mat4.multiply(projectionViewMatrix, projectionMatrix, camera.getMatrix());

        return projectionViewMatrix;
    }

    function run(gl, solarSystem, timesRan) {

        var test = true,
            numberOfFramesToRun = 5;

        timesRan = timesRan || 1;

        if (test) {
            if (timesRan < numberOfFramesToRun) {
                setTimeout(function () {
                    run(gl, solarSystem, ++timesRan);
                }, 500);
            }
        } else {
            requestAnimationFrame(function() {
                run(gl, solarSystem);
            });
        }
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
            shaders.getReadyToDraw(getProjectionViewMatrix(), planet.getModelViewMatrix(), planet);
            planet.draw();
        }
    }

    function animate(solarSystem) {
        for (var i = 0; i < solarSystem.length; i++) {
            solarSystem[i].spin();
            solarSystem[i].orbit();
        }
    }

    return {
        init: init
    }

});