/**
 * @module Shaders
 */
define(['gl', 'glMatrix'], function (gl, glMatrix) {

    /**
     * Initialises the shaders.
     * @class Shaders
     * @constructor
     * @return {Object} The shader program containing the compiled shaders.
     */
    function initShaders() {
        // load and compile the fragment and vertex shader
        var fragmentShader = getShader('webgl_solarsystem__shader--fragment');
        var vertexShader = getShader('webgl_solarsystem__shader--vertex');
        var shaderProgram = gl.createProgram();

        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Could not initialise shaders');
        }
        
        gl.useProgram(shaderProgram);
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, 'aVertexNormal');
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
        shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, 'uNMatrix');
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, 'uSampler');
        shaderProgram.showSpecularSamplerUniform = gl.getUniformLocation(shaderProgram, 'uShowSpecularSampler');
        shaderProgram.specularSamplerUniform = gl.getUniformLocation(shaderProgram, 'uSpecularSampler');
        shaderProgram.materialShininessUniform = gl.getUniformLocation(shaderProgram, 'uMaterialShininess');
        shaderProgram.showSpecularHighlightsUniform = gl.getUniformLocation(shaderProgram, 'uShowSpecularHighlights');
        shaderProgram.useTexturesUniform = gl.getUniformLocation(shaderProgram, 'uUseTextures');
        shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, 'uUseLighting');
        shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, 'uAmbientColor');
        shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, 'uPointLightingLocation');
        shaderProgram.pointLightingSpecularColorUniform = gl.getUniformLocation(shaderProgram, 'uPointLightingSpecularColor');
        shaderProgram.pointLightingDiffuseColorUniform = gl.getUniformLocation(shaderProgram, 'uPointLightingDiffuseColor');
        shaderProgram.alphaUniform = gl.getUniformLocation(shaderProgram, 'uAlpha');

        return shaderProgram;
    }

    /**
     * Gets an OpenGL shader from a DOM element's innerHTML, given its ID.
     * @method  getShader
     * @param  {String} id ID of the DOM element containing the shader program.
     * @return {Object}    The compiled gl shader (fragment or vertex).
     */
    function getShader(id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }
        var str = '';
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType === 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type === 'x-shader/x-fragment') {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type === 'x-shader/x-vertex') {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            console.log('could not compile shaders');
            return null;
        }
        
        return shader;
    }

    return initShaders();
});