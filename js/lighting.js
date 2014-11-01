define(['gl', 'glMatrix', 'shaders'], function (gl, glMatrix, shaderProgram) {

    function getInput(id) {
        return parseFloat(document.getElementById(id).value);
    }

    function prepareLighting() {
        var lighting = true;

        gl.uniform1i(shaderProgram.useLightingUniform, lighting);
        if (lighting) {
            gl.uniform3f(
                shaderProgram.ambientColorUniform,
                getInput('ambientR'),
                getInput('ambientG'),
                getInput('ambientB')
            );

            gl.uniform3f(
                shaderProgram.pointLightingLocationUniform,
                getInput('lightPositionX'),
                getInput('lightPositionY'),
                getInput('lightPositionZ')
            );

            gl.uniform3f(
                shaderProgram.pointLightingColorUniform,
                getInput('pointR'),
                getInput('pointG'),
                getInput('pointB')
            );
        }
    }

    function setMatrixUniforms(perspectiveMatrix, modelViewMatrix) {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, perspectiveMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, modelViewMatrix);
        
        var normalMatrix = glMatrix.mat3.create();
        glMatrix.mat3.normalFromMat4(normalMatrix, modelViewMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }

    return {
        prepare: prepareLighting,
        setMatrixUniforms: setMatrixUniforms
    };

});