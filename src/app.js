const print = require('./src/helpers').print
const error = require('./src/helpers').error

let vertexShaderText = [
    'precision mediump float;',
    '',
    'attribute vec2 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    '',
    'void main(){',
    '    fragColor = vertColor;',
    '    gl_Position = vec4(vertPosition, 0.0, 1.0);',
    '',
    '',
    '}'
].join('\n')

let fragmentShaderText = [
    'precision mediump float;',
    'varying vec3 fragColor;',
    '',
    'void main(){',
    '    gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join('\n')


function Init() {
    let canvas = document.getElementById('surface')
    let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if(!gl) return error('Your Browser Doesn\'t support webgl')

    //set and draw color on canvas
    gl.clearColor(0.5,0.3,0.7,1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER)

    //create shaders
    let vertexShader = gl.createShader(gl.VERTEX_SHADER)
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertexShader, vertexShaderText)
    gl.shaderSource(fragmentShader, fragmentShaderText)

    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS) || 
       !gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
           return error('Error compiling fragment or vertex shader')
    
    //int program
    let program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    //check program for issues
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) return error(['ERROR linking program', gl.getProgramInfoLog(program)])

    // // // DEBUG ONLY // // //
    gl.validateProgram(program)
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) return error(['ERROR validating program!', gl.getProgramInfoLog(program)])


    let drawTriangle = () => {
        let triangleVertices = [
            //x, y          R, G, B
             0.0,  0.5,     1.0, 1.0, 0.0,
            -0.5, -0.5,     0.7, 0.0, 1.0,
             0.5, -0.5,     0.5, 0.6, 0.7
        ]
        triangleVertexBufferObject = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW)

        let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition')
        let colorAttribLocation = gl.getAttribLocation(program, 'vertColor')
        gl.vertexAttribPointer(
            positionAttribLocation,             //location
            2,                                  //num of elements per attrib
            gl.FLOAT,                           //type of element
            gl.FALSE,                           //normalized
            5 * Float32Array.BYTES_PER_ELEMENT, //size of individual vertex
            0                                   //offset from the beginning of a single vertex 
        )
        gl.vertexAttribPointer(
            colorAttribLocation,                //location
            3,                                  //num of elements per attrib
            gl.FLOAT,                           //type of element
            gl.FALSE,                           //normalized
            5 * Float32Array.BYTES_PER_ELEMENT, //size of individual vertex
            2 * Float32Array.BYTES_PER_ELEMENT  //offset from the beginning of a single vertex 
        )

        gl.enableVertexAttribArray(positionAttribLocation)
        gl.enableVertexAttribArray(colorAttribLocation)
        gl.useProgram(program)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    //draw a triangle
    drawTriangle()

   //https://www.youtube.com/watch?v=kB0ZVUrI4Aw&t=461s 
}
