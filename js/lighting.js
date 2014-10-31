define(['gl', 'glMatrix'], function (gl, glMatrix) {

    function getInput(id) {
        return parseFloat(document.getElementById(id).value);
    }

    function prepareLighting(shaderProgram) {
        var lighting = true;

        gl.uniform1i(shaderProgram.useLightingUniform, lighting);
        if (lighting) {
            gl.uniform3f(
                shaderProgram.ambientColorUniform,
                getInput('ambientR'),
                getInput('ambientG'),
                getInput('ambientB')
            );
            var lightingDirection = [
                getInput('lightDirectionX'),
                getInput('lightDirectionY'),
                getInput('lightDirectionZ')
            ];
            var adjustedLD = glMatrix.vec3.create();
            glMatrix.vec3.normalize(lightingDirection, adjustedLD);
            glMatrix.vec3.scale(adjustedLD, -1);
            gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
            gl.uniform3f(
                shaderProgram.directionalColorUniform,
                getInput('directionalR'),
                getInput('directionalG'),
                getInput('directionalB')
            );
        }
    }

    return {
        prepare: prepareLighting
    };

});