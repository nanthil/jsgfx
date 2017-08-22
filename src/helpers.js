
//helpers
module.exports = {
    square:  (x) => x * x,
    print: (x) => x !== undefined ? console.log(x) : 0,
    error: (x) => x !== undefined ? console.error(x) : 0
}