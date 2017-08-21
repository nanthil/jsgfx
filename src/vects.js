const {print, square} = require('./helpers')
//generic vector functions
let printVec = (vec)  => Object.keys(vec).forEach(x => print(x + ': ' + vec[x]))
let addVec   = (a, b) => Object.keys(a).map(x => a[x] + b[x]) //returns a tuple of any sized vector

//2d vector methods
let vec2d             = (x, y) => ({x:x, y:y})
let addVec2d          = (a, b) => vec2d(...addVec(a, b))
let dotProductVec2d   = (a, b) => (a.x * b.x) + (a.y * b.y)
let crossProductVec2d = (a, b) => (a.x * b.y) - (a.x * b.y)

//3d vector functions
let vec3d             = (x, y, z) => ({x:x, y:y, z:z})
let addVec3d          = (a, b)    => vec3d(...addVec(a, b))
let dotProductVec3d   = (a, b)    => (a.x * b.x) + (a.y * b.y) + (a.z * b.z)
let crossProductVec3d = (a, b)    => vec3d((a.y * b.z) - (a.z * b.y), 
                                           (a.z * b.x) - (a.x * b.z), 
                                           (a.x * b.y) - (a.y * b.x))

//3d matrix functions
let emptyMatrix = (n) => Array(n).fill(Array(n).fill(undefined)) // return n x n matrix
let filledMatrix = (n, values) => values && values.length === square(n)? 
             emptyMatrix(n).map((x,i)=> x.map((x,j) => x=values[(i*n)+j])) : 
             emptyMatrix(n)


let transform = (matrix, vec, vecArr = Object.keys(vec)) => matrix.map(row => 
                                                                       row.map((x,i) => 
                                                                                x * vec[vecArr[i]])
                                                                           .reduce((a,b) => a + b))
//testing
//2d vectors
let v2dx = vec2d(1,8)
let v2dy = vec2d(3,5)
print(addVec2d(v2dx, v2dy))

//3d vectors
let v3dx = vec3d(5, -6, 0)
let v3dy = vec3d(1, 2, 3)
print(crossProductVec3d(v3dx, v3dy)) //should be -18, -15, 16
print(dotProductVec3d(v3dx, v3dy))   //should be -7


//matrix
let size = 3
let values = [...Array(square(size)).keys()]
let fm = filledMatrix(size,values) //returns filled matrix
print(filledMatrix(size,[...Array(square(14)).keys()])) //returns empty matrix
print(vec3d(...transform(fm, v3dx)))
