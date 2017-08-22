//this file rotates a triangle
let vertexShaderText = [
    'precision mediump float;',
    '',
    'attribute vec3 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    'uniform mat4 mWorld;',
    'uniform mat4 mView;',
    'uniform mat4 mProj;',
    '',
    'void main() {',
    '    fragColor = vertColor;',
    '    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
    '',
    '',
    '}'
].join('\n')

let fragmentShaderText = [
    'precision mediump float;',
    'varying vec3 fragColor;',
    '',
    'void main() {',
    '    gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join('\n')

function Init() {
    let canvas = document.getElementById('surface')
    let gl     = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

    if(!gl) return error('Your Browser Doesn\'t support webgl')

    //set and draw color on canvas
    gl.clearColor(0.5,0.3,0.7,1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER)

    //create shaders
    let vertexShader   = gl.createShader(gl.VERTEX_SHADER)
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(vertexShader,   vertexShaderText)
    gl.shaderSource(fragmentShader, fragmentShaderText)
    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)

    if(!gl.getShaderParameter(vertexShader,   gl.COMPILE_STATUS) || 
       !gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) return error('Error compiling fragment or vertex shader')
    
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
            //x, y, z          R, G, B
             0.0,  0.5, 0.0,     1.0, 1.0, 0.0,
            -0.5, -0.5, 0.0,     0.7, 0.0, 1.0,
             0.5, -0.5, 0.0,     0.5, 0.6, 0.7
        ]
        triangleVertexBufferObject = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW)

        let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition')
        let colorAttribLocation    = gl.getAttribLocation(program, 'vertColor')
        gl.vertexAttribPointer(
            positionAttribLocation,             //location
            3,                                  //num of elements per attrib
            gl.FLOAT,                           //type of element
            gl.FALSE,                           //normalized
            6 * Float32Array.BYTES_PER_ELEMENT, //size of individual vertex
            0                                   //offset from the beginning of a single vertex 
        )
        gl.vertexAttribPointer(
            colorAttribLocation,                //location
            3,                                  //num of elements per attrib
            gl.FLOAT,                           //type of element
            gl.FALSE,                           //normalized
            6 * Float32Array.BYTES_PER_ELEMENT, //size of individual vertex
            3 * Float32Array.BYTES_PER_ELEMENT   //offset from the beginning of a single vertex 
        )

        gl.enableVertexAttribArray(positionAttribLocation)
        gl.enableVertexAttribArray(colorAttribLocation)

        //tell gl to use this program before using program for intializing matrices
        gl.useProgram(program)

        //init matrices
        let matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld')
        let matViewUniformLocation  = gl.getUniformLocation(program, 'mView')
        let matProjUniformLocation  = gl.getUniformLocation(program, 'mProj')
        let worldMatrix = new Float32Array(16)
        let viewMatrix  = new Float32Array(16)
        let projMatrix  = new Float32Array(16)
        mat4.identity(worldMatrix)
        mat4.lookAt(viewMatrix, [0,0,-5],[0,0,0],[0,1,0])//look at mat4 docs
        mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0)
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)
        gl.uniformMatrix4fv(matViewUniformLocation,  gl.FALSE, viewMatrix)
        gl.uniformMatrix4fv(matProjUniformLocation,  gl.FALSE, projMatrix)


        let identityMatrix = new Float32Array(16) // set default identiy matrix
        mat4.identity(identityMatrix)

        let angle = () => performance.now() / 1000 / 6 * 2 * Math.PI

        //render loop
        let loop = () => {
            mat4.rotate(worldMatrix, identityMatrix, angle(), [0,1,0])
            gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)

            gl.clearColor(0.75, 0.85, 0.8, 1.0)
            gl.clear(gl.DEPTH_BUFFER_BIT, gl.COLOR_BUFFER_BIT)

            gl.drawArrays(gl.TRIANGLES, 0, 3)
            requestAnimationFrame(loop) //recursive 
        }
        requestAnimationFrame(loop)//start loop
    }
    //draw a triangle
    drawTriangle()

   //https://www.youtube.com/watch?v=kB0ZVUrI4Aw&t=461s 
}
