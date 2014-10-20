define(['gl'], function (gl) {

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

        "    attribute vec3 vertexPos;\n" +
        "    attribute vec4 vertexColor;\n" +
        "    uniform mat4 modelViewMatrix;\n" +
        "    uniform mat4 projectionMatrix;\n" +
        "    varying vec4 vColor;\n" +
        "    void main(void) {\n" +
        "        // Return the transformed and projected vertex value\n" +
        "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
        "            vec4(vertexPos, 1.0);\n" +
        "        // Output the vertexColor in vColor\n" +
        "        vColor = vertexColor;\n" +
        "    }\n";

    var fragmentShaderSource =
        "    precision mediump float;\n" +
        "    varying vec4 vColor;\n" +
        "    void main(void) {\n" +
        "    // Return the pixel color: always output white\n" +
        "    gl_FragColor = vColor;\n" +
        "}\n";


    var shaderProgram,
        shaderVertexPositionAttribute,
        shaderVertexColorAttribute,
        shaderProjectionMatrixUniform,
        shaderModelViewMatrixUniform;

    function initShaders() {

        // load and compile the fragment and vertex shader
        //var fragmentShader = getShader(gl, "fragmentShader");
        //var vertexShader = getShader(gl, "vertexShader");
        var fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
        var vertexShader = createShader(gl, vertexShaderSource, "vertex");

        // link them together into a new program
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // get pointers to the shader params
        shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
        gl.enableVertexAttribArray(shaderVertexPositionAttribute);
        shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
        gl.enableVertexAttribArray(shaderVertexColorAttribute);

        shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
        shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");


        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        return shaderProgram;
    }

    return {
        init: initShaders,

        getReadyToDraw: function (projectionMatrix, modelViewMatrix, obj) {
            // connect up the shader parameters: vertex position, color and projection/model matrices
            // set up the buffers
            gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
            gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
            gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

            gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
            gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);
        }
    }

});