/**
 * @module Shaders
 */
define(['gl', 'glMatrix', 'text!shader__fragment.shader', 'text!shader__vertex.shader'], function (gl, glMatrix, fragmentShaderCode, vertexShaderCode) {

    /**
     * Initialises the shaders.
     * @class Shaders
     * @constructor
     * @return {Object} The shader program containing the compiled shaders.
     */
    function initShaders() {
        var fragmentShader = compileShader(fragmentShaderCode, 'fragment');
        var vertexShader = compileShader(vertexShaderCode, 'vertex');
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
     * Compiles an OpenGL shader from raw shader code.
     * @method  compileShader
     * @param  {String} code    The uncompiled shader program.
     * @param  {String} type    The type of shader to compiled (fragment or vertex).
     * @return {Object}         The compiled gl shader.
     */
    function compileShader(code, type) {
        var shader;
        if (type === 'fragment') {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        }
        else if (type === 'vertex') {
            shader = gl.createShader(gl.VERTEX_SHADER);
        }
        else {
            return null;
        }

        gl.shaderSource(shader, code);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader), 'Error: could not compile shaders');
            return null;
        }
        
        return shader;
    }

    return initShaders();
});