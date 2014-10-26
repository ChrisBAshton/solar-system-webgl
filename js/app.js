define(['glMatrix', 'glUtils', 'astronomical_object', 'gl', 'shaders', 'camera', 'controls'], function (glMatrix, glUtils, AstronomicalObject, gl, shaders, camera, controls) {

    var test = false;

    var canvas = document.getElementById('canvas_solar_system'),
        projectionViewMatrix = glMatrix.mat4.create(),
        projectionMatrix = glMatrix.mat4.create(),
        shaderProgram;

    function degreesToRadians(celsius) {
        return celsius * (Math.PI / 180);
    }

    function init() {
        initViewport();

        var theSun = new AstronomicalObject({
            name:    "Sun",
            origin:  [0, 0, 0],
            radius:  1000,
            axis:    degreesToRadians(7.25),
            texture: 'http://www.corsproxy.com/learningwebgl.com/lessons/lesson11/moon.gif'
        });

        var mercury = new AstronomicalObject({
            name:          "Mercury",
            orbits:        theSun,
            orbitDistance: 1000,
            radius:        100,
            axis:          degreesToRadians(0),
            faceColors: [
                [1.0, 1.0, 1.0, 1.0], // Front face
                [1.0, 1.0, 1.0, 1.0], // Back face
                [1.0, 1.0, 1.0, 1.0], // Top face
                [1.0, 1.0, 1.0, 1.0], // Bottom face
                [1.0, 1.0, 1.0, 1.0], // Right face
                [1.0, 1.0, 1.0, 1.0]  // Left face
            ]
        });

        var mars = new AstronomicalObject({
            name:          "Mars",
            orbits:        theSun,
            orbitDistance: 2200,
            radius:        300,
            axis:          degreesToRadians(25.19),
            faceColors: [
                [1.0, 0.0, 0.0, 1.0], // Front face
                [1.0, 0.0, 0.0, 1.0], // Back face
                [1.0, 0.0, 0.0, 1.0], // Top face
                [1.0, 0.0, 0.0, 1.0], // Bottom face
                [1.0, 0.0, 0.0, 1.0], // Right face
                [1.0, 0.0, 0.0, 1.0]  // Left face
            ]
        });

        var earth = new AstronomicalObject({
            name:          "Earth",
            orbits:        theSun,
            orbitDistance: 4000,
            radius:        300,
            axis:          degreesToRadians(23.4),
            faceColors: [
                [0.0, 1.0, 0.0, 1.0], // Front face
                [0.0, 1.0, 0.0, 1.0], // Back face
                [0.0, 1.0, 0.0, 1.0], // Top face
                [0.0, 1.0, 0.0, 1.0], // Bottom face
                [0.0, 1.0, 0.0, 1.0], // Right face
                [0.0, 1.0, 0.0, 1.0]  // Left face
            ]
        });

        var moon = new AstronomicalObject({
            name:          "Moon",
            orbits:        earth,
            orbitDistance: 150,
            radius:        90,
            axis:          degreesToRadians(6.68),
            texture:       'http://www.corsproxy.com/learningwebgl.com/lessons/lesson11/moon.gif'
        });

        var solarSystem = [theSun, mercury, mars, earth, moon];

        shaderProgram = shaders.init();
        
        controls.bindToAnimation(function () {
            draw(solarSystem);
        });

        draw(solarSystem);
        
        if (test) {
            var stepButton = document.createElement('BUTTON');
            stepButton.id = 'stepButton';
            var buttonText = document.createTextNode("Step through animation");
            stepButton.appendChild(buttonText);
            stepButton.onclick = function () {
                run(solarSystem);
            }
            document.body.appendChild(stepButton);
        }
        else {
            run(solarSystem);
        }
    }


    function initViewport() {
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

    function run(solarSystem, timesRan) {

        var numberOfFramesToRun = 5;

        timesRan = timesRan || 1;

        if (test) {
            // if (timesRan < numberOfFramesToRun) {
            //     setTimeout(function () {
            //         run(solarSystem, ++timesRan);
            //     }, 500);
            // }
        } else {
            requestAnimationFrame(function() {
                run(solarSystem);
            });
        }
        draw(solarSystem);
        animate(solarSystem);
    }

    function draw(solarSystem) {
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
            //solarSystem[i].orbit();
        }
    }

    return {
        init: init
    }

});