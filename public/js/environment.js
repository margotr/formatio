function updateCamera() {
    camera.focus = halfScreen().add(myblob.getPos())
    //console.log(camera.focus)
    camera.zoom = 1
}

function getFocus(from) {
    return p5.Vector.sub(camera.focus, from).mult(camera.zoom)
}

function halfScreen() {
    return createVector(width / 2, height / 2)
}
function inbounds(pos) {
    return (pos.x > 0 && pos.x < windowWidth && pos.y > 0 && pos.y < windowHeight)
}

function Environment() {
    this.draw = function() {
        background(51)
        this.drawCircle(createVector(0, 0), color(255, 255, 255))
    }

    this.drawCircle = function(pos, color) {
        let p = getFocus(pos)
        if (inbounds(p)) {
            push()
            fill(color)
            circle(p.x - pos.x, p.y - pos.y, 30)
            pop()
        }
    }
}
