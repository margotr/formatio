function updateCamera() {
    updatePos()
    camera.focus = createVector(myPos.x,
                                myPos.y)

}

function getFocus(from) {
        return createVector(
                from.x - camera.focus.x,
                from.y - camera.focus.y)
                //p5.Vector.sub(from, camera.focus)
}

function updatePos() {
    if (status === alive)
    for (let cell of cells) {
      if (cell.owner === myid) {
        myPos = cell.pos
        break
      }
    }
  }

function halfScreen() {
    return createVector(width / 2, height / 2)
}

function inbounds(pos) {
    return (pos.x > 0 && pos.x < windowWidth && pos.y > 0 && pos.y < windowHeight)
}

function Environment() {
    this.draw = function() {
        this.drawLights()
        fill(bg)
        Rect(-halfScreen().x, -halfScreen().y, width, height, 0)
        this.drawCircle(createVector(0, 0), color(255, 255, 255))
        this.drawGrid(25)

        push()
        fill(255, 255, 0)
        noStroke()
        circle(0, 0, 40)
        circle(width, 0, 40)
        circle(0, height, 40)
        pop()
    }
    this.drawLights = function() {
        //ambientLight(0, 255, 255) // yellow light
        ambientLight(0,0,0)
    }
    this.drawCircle = function(pos, color) {
        let p = getFocus(pos)
        //console.log(p, camera.focus, pos)
        if (inbounds(p)) {
            push()
            fill(color)
            circle(p.x, p.y, 0, 30)
            pop()
        }
    }
    this.drawGrid = function(spacing) {
        let start = (myPos) ? p5.Vector.sub(myPos, halfScreen()) : halfScreen()
        let leftover = createVector(start.x % spacing, start.y % spacing)
        let roundedstart = p5.Vector.sub(start, leftover)
        let p = getFocus(roundedstart)
        let fourline = createVector(roundedstart.x % (spacing * 4), roundedstart.y % (spacing * 4))
        //console.log(p)
        push()
        textFont(font)
        textAlign(CENTER)
        fill(255)
            for (let x = p.x, i = fourline.x / spacing; x < p.x + width; x+= spacing, i++) {
                if (i % 4 === 0) {
                    let pos = start.x + x + halfScreen().x
                    noStroke()
                    fill(255)
                    text(Math.round(pos), x, -halfScreen().y + 50, 5)
                    fill(255, 0, 0, 70)
                } else {
                    fill(255, 255, 255, 70)
                }
                noStroke()
                FillLine(x, -halfScreen().y, 0, x, halfScreen().y, 0)
            }
            for (let y = p.y, i = fourline.y / spacing; y < p.y + height; y+= spacing, i++) {
                if (i % 4 === 0) {
                    let pos = start.y + y + halfScreen().y
                    noStroke()
                    fill(255)
                    text(Math.round(pos), -halfScreen().x + 50, y, 5)
                    fill(255, 0, 0, 70)
                } else {
                    fill(255, 255, 255, 70)
                }
                noStroke()
                //console.log(y)
                //Line(0, y, 0, width, y, 0)
               FillLine(-halfScreen().x, y, 0, halfScreen().x, y, 0)
            }
        pop()
    }
}
