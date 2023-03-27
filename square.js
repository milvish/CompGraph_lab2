var vertexShaderText =
    `
        precision mediump float;
        
        attribute vec2 vertPosition;
        attribute vec3 vertColor;
        varying vec3 fragColor;
        varying vec2 vPos;
        
        void main()
        {
          fragColor = vertColor;
          gl_Position = vec4(vertPosition, 0.0, 1.0);
          vPos = vertPosition;
        }
    `

var fragmentShaderText =
    `
        precision mediump float;
        
        varying vec3 fragColor;
        varying vec2 vPos;
        
        void main()
        {
            float n = 16.0; 
            int sum = int( vPos.x * n);
            
            if ( (sum -sum/ 2 * 2)== 0 ) {  
                if (vPos.x <= 0.0) gl_FragColor = vec4(1);
                else gl_FragColor = vec4(0.6, 0, 0, 1);
            } else {  
                if (vPos.x <= 0.0) gl_FragColor = vec4(0.6, 0, 0, 1);
                else gl_FragColor = vec4(1);
            }
        }
    `

var InitDemo = function () {
    console.log('This is working');

    var canvas = document.getElementById('game-surface');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support WebGL');
    }

    gl.clearColor(0.9, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //
    // Create shaders
    //
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }

    //
    // Create buffer
    //
    let x = new Array(5);
    let y = new Array(5);

    for (let i=0; i<4; i++){

        let radius = 0.7
        x[i] = radius * Math.cos(Math.PI*2/4 *i);
        y[i] = radius * Math.sin(Math.PI*2/4 * i);
    }
    var squareVertices =
        [ // X, Y,       R, G, B
            0.5, 0.5,
            -0.5, 0.5,
            0.5, -0.5,
            -0.5, -0.5,
        ];

    var squareVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        false,
        2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );


    gl.enableVertexAttribArray(positionAttribLocation);

    //
    // Main render loop
    //
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};