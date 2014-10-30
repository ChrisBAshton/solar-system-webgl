define(['gl', 'glMatrix'], function (gl, glMatrix) {

    var ambientR        = 0.2,
        ambientG        = 0.2,
        ambientB        = 0.2,
        lightDirectionX = -1.0,
        lightDirectionY = -1.0,
        lightDirectionZ = -1.0,
        directionalR    = 0.8,
        directionalG    = 0.8,
        directionalB    = 0.8;


    function prepareLighting(shaderProgram) {
        var lighting = false;

        gl.uniform1i(shaderProgram.useLightingUniform, lighting);
        if (lighting) {
            gl.uniform3f(
                shaderProgram.ambientColorUniform,
                ambientR,
                ambientG,
                ambientB
            );
            var lightingDirection = [
                lightDirectionX,
                lightDirectionY,
                lightDirectionZ
            ];
            var adjustedLD = glMatrix.vec3.create();
            glMatrix.vec3.normalize(lightingDirection, adjustedLD);
            glMatrix.vec3.scale(adjustedLD, -1);
            gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
            gl.uniform3f(
                shaderProgram.directionalColorUniform,
                directionalR,
                directionalG,
                directionalB
            );
        }
    }

    return {
        prepare: prepareLighting
    };

});