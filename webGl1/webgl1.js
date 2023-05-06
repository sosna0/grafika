const vertexShaderTxt = `
    precision mediump float;
    attribute vec2 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    void main()
    {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }

`

const fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;
    void main()
    {
        gl_FragColor = vec4(fragColor, 1.0); // R,G,B, opacity
    }
`
var a, b, c;

let RandomColors = function(){
    a = Math.random();
    b = Math.random();
    c = Math.random();
}

let Triangle = function () {
    let canvas = document.getElementById('main-canvas');
    let gl = canvas.getContext('webgl');

    if (!gl) {
        alert('webgl not supported');
    }

    gl.clearColor(0.950, 0.703, 0.276, 0.95);  // R,G,B, opacity
    gl.clear(gl.COLOR_BUFFER_BIT);

    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    
    gl.compileShader(vertexShader);
    // shaderCompileErr(vertexShader);
    gl.compileShader(fragmentShader);
    // shaderCompileErr(fragmentShader);

    
    let program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.detachShader(program, vertexShader); //https://www.khronos.org/opengl/wiki/Shader_Compilation#Before_linking
    gl.detachShader(program, fragmentShader);

    gl.validateProgram(program);
    
    
    let a = 0.5;
    let height = Math.sqrt(3)*0.5;

    RandomColors();

    let triangleVert = [
        // X, Y         this gets more complicated the longer it goes on
        -0.9, 0.9,          1.0, b, c,
        -0.9, 0.4,          b, c, a,
        -0.4, 0.4,          1.0, a, a,

        -0.9, 0.9,          1.0, b, c,
        -0.4, 0.9,          b, c, a,
        -0.4, 0.4,          1.0, a, a,
        
        //Hexagon made with 4triangles:
        -a/2, a*height,     1.0, b, c*0.5,
        -a/2, -a*height,    a, b, c,
        a, 0,               a, b, c,

        -a/2, a*height,     1.0, b, c*0.5,
        -a, 0,              a, b, c,
        -a/2, -a*height,    a, b, c,

        a/2, -a*height,     1.0, b, c*0.5,
        a, 0,               a, b, c,
        -a/2, -a*height,    a, b, c,
                       
        
        -a/2, a*height,     1.0, b, c*0.5,
        a/2, a*height,      a, b, c,
        a, 0,               a, b, c,

    ]

    const triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVert), gl.STATIC_DRAW); // since everything in JS is 64 bit floating point we need to convert to 32 bits

    const posAttrLocation = gl.getAttribLocation(program, 'vertPosition');
    const colorAttrLocation = gl.getAttribLocation(program, 'vertColor');

    gl.vertexAttribPointer(
        posAttrLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0,
    );

    gl.vertexAttribPointer(
         colorAttrLocation,
         3,
         gl.FLOAT,
         gl.FALSE,
         5 * Float32Array.BYTES_PER_ELEMENT,
         2* Float32Array.BYTES_PER_ELEMENT,

    )

    gl.enableVertexAttribArray(posAttrLocation);
    gl.enableVertexAttribArray(colorAttrLocation);

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 18);

}