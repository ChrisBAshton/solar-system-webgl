define(['gl', 'glMatrix', 'shaders'], function (gl, glMatrix, shaderProgram) {

    function getInput(id) {
        return parseFloat(document.getElementById(id).value);
    }

    function prepareLighting() {
        gl.uniform3f(
            shaderProgram.ambientColorUniform,
            getInput('ambientR'),
            getInput('ambientG'),
            getInput('ambientB')
        );

        gl.uniform3f(
            shaderProgram.pointLightingLocationUniform,
            // same origin as the Sun, so that light appears to emanate from the Sun
            0, 0, 0
        );

        gl.uniform3f(
            shaderProgram.pointLightingColorUniform,
            getInput('pointR'),
            getInput('pointG'),
            getInput('pointB')
        );
    }

    return {
        prepare: prepareLighting
    };

});