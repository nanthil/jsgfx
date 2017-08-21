const print = require('./src/helpers').print

let vertexShader = [
    '',
    '',
    ''
]


function Init() {
    let canvas = document.getElementById('surface')
    let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if(!gl) print('Your Browser Doesn\'t support webgl')

    //set and draw color on canvas
    gl.clearColor(0.5,0.3,0.7,1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER)
    //continue at 18:12

   //https://www.youtube.com/watch?v=kB0ZVUrI4Aw&t=461s 
}