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
            radius:  432.45,
            axis:    degreesToRadians(7.25),
            texture: "textures/sunmap.jpg"
        });

        var mercury = new AstronomicalObject({
            name:          "Mercury",
            orbits:        theSun,
            orbitDistance: 36000,
            radius:        1.516,
            axis:          degreesToRadians(0),
            texture:       "textures/mercurymap.jpg"
        });

        var venus = new AstronomicalObject({
            name:          "Venus",
            orbits:        theSun,
            orbitDistance: 67000,
            radius:        3.761,
            axis:          degreesToRadians(177.36),
            texture:       "textures/venusmap.jpg"
        });

        var earth = new AstronomicalObject({
            name:          "Earth",
            orbits:        theSun,
            orbitDistance: 93000,
            radius:        3.959,
            axis:          degreesToRadians(23.45),
            texture:       "textures/earthmap1k.jpg"
        });

        var mars = new AstronomicalObject({
            name:          "Mars",
            orbits:        theSun,
            orbitDistance: 141000,
            radius:        2.460,
            axis:          degreesToRadians(25.19),
            texture:       "textures/marsmap1k.jpg"
        });

        var jupiter = new AstronomicalObject({
            name:          "Jupiter",
            orbits:        theSun,
            orbitDistance: 483000,
            radius:        43.441,
            axis:          degreesToRadians(3.13),
            texture:       "textures/jupitermap.jpg"
        });

        var saturn = new AstronomicalObject({
            name:          "Saturn",
            orbits:        theSun,
            orbitDistance: 886000,
            radius:        36.184,
            axis:          degreesToRadians(26.73),
            texture:       "textures/saturnmap.jpg"
        });

        var uranus = new AstronomicalObject({
            name:          "Uranus",
            orbits:        theSun,
            orbitDistance: 1782000,
            radius:        15.759,
            axis:          degreesToRadians(97.77),
            texture:       "textures/uranusmap.jpg"
        });

        var neptune = new AstronomicalObject({
            name:          "Neptune",
            orbits:        theSun,
            orbitDistance: 2794000,
            radius:        15.299,
            axis:          degreesToRadians(28.32),
            texture:       "textures/neptunemap.jpg"
        });

        var earthsMoon = new AstronomicalObject({
            name:          "Earth's Moon",
            orbits:        earth,
            orbitDistance: 240,
            radius:        1,
            axis:          degreesToRadians(1.5)
        });

        var solarSystem = [theSun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune/*, earthsMoon*/];

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
            planet.draw(shaderProgram, getProjectionViewMatrix());
        }
    }

    function animate(solarSystem) {
        for (var i = 0; i < solarSystem.length; i++) {
            //solarSystem[i].spin();
            solarSystem[i].orbit();
        }
    }

    return {
        init: init
    }

});