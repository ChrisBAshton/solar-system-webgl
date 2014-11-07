define(['gl', 'glMatrix', 'shaders'], function (gl, glMatrix, shaderProgram) {

    /**
     * Prepares the canvas for drawing lighting by grabbing the lighting parameters from the GUI.
     */
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
            shaderProgram.pointLightingSpecularColorUniform,
            getInput('pointRSpecular'),
            getInput('pointGSpecular'),
            getInput('pointBSpecular')
        );

        gl.uniform3f(
            shaderProgram.pointLightingDiffuseColorUniform,
            getInput('pointRDiffuse'),
            getInput('pointGDiffuse'),
            getInput('pointBDiffuse')
        );
    }

    /**
     * Gets a float value from a DOMElement Input.
     * @param  {String} id ID of the DOMElement whose value we want.
     * @return {float}    The parsed float value of that input.
     */
    function getInput(id) {
        return parseFloat(document.getElementById(id).value);
    }

    return {
        /**
         * Alias for prepareLighting().
         */
        prepare: prepareLighting,

        /**
         * Gets the shininess parameter from the GUI (used for Phong shading)
         * @return {float} Planet shininess (between 0 and 100).
         */
        getShininess: function () {
            return getInput('planetShininess');
        }
    };

});