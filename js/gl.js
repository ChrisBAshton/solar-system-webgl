define(function () {

    var canvas = document.getElementById('canvas_solar_system'),
        gl = null;

    function initWebGL(canvas) {

        var msg = "Your browser does not support WebGL, " +
        "or it is not enabled by default.";

        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewport(0, 0, canvas.width, canvas.height);
        } catch (e) {
            msg = "Error creating WebGL Context!: " + e.toString();
        }

        if (!gl) {
            alert(msg);
            throw new Error(msg);
        }
    }

    initWebGL(canvas);

    return gl;

});