define(['gl', 'glMatrix'], function (gl, glMatrix) {

    function createShader(gl, str, type) {
        var shader;
        if (type == "fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (type == "vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

     var vertexShaderSource =
        'attribute vec3 aVertexPosition;' +
        'attribute vec3 aVertexNormal;' +
        'attribute vec2 aTextureCoord;' +
        'uniform mat4 uMVMatrix;' +
        'uniform mat4 uPMatrix;' +
        'uniform mat3 uNMatrix;' +
        'uniform vec3 uAmbientColor;' +
        'uniform vec3 uLightingDirection;' +
        'uniform vec3 uDirectionalColor;' +
        'uniform bool uUseLighting;' +
        'varying vec2 vTextureCoord;' +
        'varying vec3 vLightWeighting;' +
        'void main(void) {' +
            'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);' +
            'vTextureCoord = aTextureCoord;' +
            'if (!uUseLighting) {' +
                'vLightWeighting = vec3(1.0, 1.0, 1.0);' +
            '} else {' +
                'vec3 transformedNormal = uNMatrix * aVertexNormal;' +
                'float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);' +
                'vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;' +
            '}' +
        '}';

    var fragmentShaderSource =
        'precision mediump float;' +
        'varying vec2 vTextureCoord;' +
        'varying vec3 vLightWeighting;' +
        'uniform sampler2D uSampler;' +
        'void main(void) {' +
            'vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));' +
            'gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);' +
        '}';


    var shaderProgram;

    function initShaders() {

        // load and compile the fragment and vertex shader
        var fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
        var vertexShader = createShader(gl, vertexShaderSource, "vertex");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
        shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
        shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
        shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
        shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");

        return shaderProgram;
    }

    return initShaders();
});