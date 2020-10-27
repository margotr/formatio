function updateCamera() {
    updatePos()
    //console.log(myPos, halfScreen())
    camera.focus = createVector(myPos.x - halfScreen().x,
                                myPos.y - halfScreen().y)

}

function getFocus(from) {
    //console.log('focus from: ', from)
        return p5.Vector.sub(from, camera.focus)
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
        this.drawGrid(25)
    }

    this.drawCircle = function(pos, color) {
        let p = getFocus(pos)
        //console.log(p, camera.focus, pos)
        if (inbounds(p)) {
            push()
            fill(color)
            circle(p.x, p.y, 30)
            pop()
        }
    }
    this.drawGrid = function(spacing) {
        let start = (myPos) ? p5.Vector.sub(myPos, halfScreen()) : halfScreen()
        let leftover = createVector(start.x % spacing, start.y % spacing)
        let roundedstart = p5.Vector.sub(start, leftover)
        let p = getFocus(roundedstart)
        let fourline = createVector(roundedstart.x % (spacing * 4), roundedstart.y % (spacing * 4))
        
        push()
        textAlign(CENTER)
        fill(255)
            for (let x = p.x, i = fourline.x / spacing; x < p.x + width; x+= spacing, i++) {
                if (i % 4 === 0) {
                    let pos = start.x + x
                    stroke(255, 0, 0)
                    text(Math.round(pos), x, 50)
                } else {
                    stroke(255, 255, 255)
                }
                line(x, 0, x, height)
            }
            for (let y = p.y, i = fourline.y / spacing; y < p.y + width; y+= spacing, i++) {
                if (i % 4 === 0) {
                    let pos = start.y + y
                    stroke(255, 0, 0)
                    text(Math.round(pos), 50, y)
                } else {
                    stroke(255, 255, 255)
                }
                line(0, y, width, y)
            }
        pop()
    }
}
