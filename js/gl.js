define(function () {

    var gl = null;

    function initWebGL(canvas) {

        var msg = "Your browser does not support WebGL, " +
        "or it is not enabled by default.";

        try {
            gl = canvas.getContext("experimental-webgl");
        } catch (e) {
            msg = "Error creating WebGL Context!: " + e.toString();
        }

        if (!gl) {
            alert(msg);
            throw new Error(msg);
        }
    }

    initWebGL(document.getElementById('canvas_solar_system'));

    return gl;

});