define(['glMatrix', 'glUtils', 'astronomical_object', 'gl', 'shaders'], function (glMatrix, glUtils, AstronomicalObject, gl, shaders) {

    var shaderProgram,
        projectionMatrix,
        modelViewMatrix;

    function init() {
        var canvas = document.getElementById('canvas_solar_system');
        initViewport(gl, canvas);

        var square = new AstronomicalObject();

        initMatrices(canvas);
        shaderProgram = shaders.init();
        run(gl, square);
    }


    function initViewport(gl, canvas) {
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function initMatrices(canvas) {
        // Create a model view matrix with camera at 0, 0, −3.333
        modelViewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -4.333]);

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

    function run(gl, cube) {
        requestAnimationFrame(function() {
            run(gl, cube);
        });
        draw(gl, cube);
        animate();
    }

    function draw(gl, obj) {
        // clear the background (with black)
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

        // set the shader to use
        gl.useProgram(shaderProgram);

        shaders.getReadyToDraw(projectionMatrix, modelViewMatrix, obj);

        obj.draw();
    }

    var duration = 5000; // ms
    var currentTime = Date.now();
    function animate() {
        var now = Date.now();
        var deltat = now - currentTime;
        currentTime = now;
        var fract = deltat / duration;
        var angle = Math.PI * 2 * fract;
        glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, angle, [0, 1, 1]);
    }

    return {
        init: init
    }

});