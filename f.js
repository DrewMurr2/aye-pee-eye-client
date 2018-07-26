module.exports = f

function f() {
    let counter = 0
    return function () {
        counter = counter + 1
        return function () { return counter }
    }
}
