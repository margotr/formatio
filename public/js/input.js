//here the functions that get input live happily
function sendInput() {
    //alert(isMobile)
    gamestream.send(JSON.stringify({
        type: 'input', 
        id: myid, 
        input: input.get()
    }))
}

function updateInput() {
    sendInput()
    //bg = Math.round(Math.random() * 255)
    setTimeout(updateInput, 34) //30hz input
}

class MobileInput {
    constructor() {
        this.controller = {
            origin: {x: 0, y: 0},
            dir: {x: 0, y: 0},
            active: false,
            max: 40,
        }
        this.pcontrol = this.controller.origin
        this.drawer = {
            active: false,
            points: []
        }
        this.buttons = []
        this.rotationLock = false
        this.buttondia = 50
    }
    get() {
        let controllerfound = false, drawerfound = false
        let diff = {x: 0, y: 0}
        let attack = -1
        for (let t of touches) {
                if (this.newController(t)) {
                controllerfound = true
                this.setController(t)
            }
            else {
                if (this.isController(t))  {
                    controllerfound = true
                    diff = this.getBounceInput(t)
                    this.pcontrol = t
                }
                else 
                {
                    //handle button input for each touch
                    if (this.newDrawer(t)) 
                    {
                        drawerfound = true
                        this.setDrawer(t)
                    }
                    else if (this.isDrawer(t)) 
                    {
                        drawerfound = true
                        this.drawer.points.push(t)
                    }
                    else {
                        //check for other buttons
                        //if ()
                    }
                }
            } 
        }
        if (!drawerfound) {
            let data = this.getDrawerData()
            if (data.length > 0) {
                //add data to outbound here
                console.log(data)
            }
            this.resetDrawer()
        }
        if (!controllerfound) this.resetController()
        
        return diff
    }
    draw() {
        push()
        if (this.controller.active) {
            fill(255, 255, 255, 100)
            noStroke()
            let bounds = 30
            circle(this.controller.origin.x, this.controller.origin.y, this.controller.max * 2 + bounds * 2)
            circle(this.controller.origin.x + this.controller.dir.x, this.controller.origin.y + this.controller.dir.y, bounds * 2)
        }
        pop()
        this.drawButtons()
        this.drawField()
    }
    drawButtons() {
        push()
        fill(255)
        if (this.buttons.length !== 0) {
            //console.log(buttons[0].pos, width, height)
        }
        for (let b of this.buttons) {
            circle(b.pos.x, b.pos.y, this.buttondia)
        }
        pop()
    }
    getBounceInput(t) {
        let angle = atan2(t.y - this.controller.origin.y , t.x - this.controller.origin.x)
        let mag = dist(this.controller.origin.x, this.controller.origin.y, t.x, t.y)
        mag = constrain(mag, 0, this.controller.max)
        this.controller.dir.x = mag * cos(angle)
        this.controller.dir.y = mag * sin(angle)
        let inv = 1 / sq(this.controller.max)
        return {x: this.controller.dir.x * mag * inv, y: this.controller.dir.y * mag * inv}
    }
    drawField() {
    let pp = (this.drawer.points.length !== 0) ? this.drawer.points[0] : null
    if (!pp) return null
    push()
    stroke(255)
    strokeWeight(5)
    for (let i = 1; i < this.drawer.points.length; i++) {
        let p = this.drawer.points[i]
        line(pp.x, pp.y, p.x, p.y)
        pp = p
    }
    pop()
}
setDrawer(touch) {
    this.drawer.active = true
    this.drawer.points.push(touch)
}
resetDrawer() {
    this.drawer.active = false,
    this.drawer.points = []
}

isDrawer(touch) {
    if (!this.drawer.active) return false
    return (isClose(touch, this.drawer.points[this.drawer.points.length - 1]))
}
inDrawScreen(touch) {
    return (touch.x > halfScreen().x && touch.y > halfScreen().y - 100)
}
newDrawer(touch) {
    return (this.inDrawScreen(touch) && !this.drawer.active)
}
getDrawerData() {
    let diasq = Math.pow((this.buttondia / 2), 2)
    let pressed = []
    for (let b of this.buttons) {
        for (let p of this.drawer.points) {
        if (Math.pow(p.x - b.pos.x, 2) + Math.pow(p.y - b.pos.y, 2) < diasq) {
            pressed.push(b.button)
            break
            }
        }
    }
    return pressed
}
 setController(touch) {
    this.controller.active = true
    this.controller.origin = touch
    this.pcontrol = touch
} 
resetController() {
    this.controller.active = false
}
 isController(touch) {
    return (isClose(touch, this.pcontrol)) 
}
newController(touch) {
    return (touch.x < halfScreen().x && touch.y > 100 && !this.controller.active)
}
initButtons(visible) {
    let origin = {x: width - 120, y: height - 120} 
    this.buttons = []
    if (visible.length !== 0) this.buttons.push({button: visible[0], pos: origin})
        for (let i = 0; i < visible.length - 1; i++) {
            let button = visible[i + 1]
            let angle = Math.PI * 2/3 - ((Math.PI * 2) / 6) * i
            let x = origin.x + Math.cos(angle) * 80
            let y = origin.y + Math.sin(angle) * 80
            this.buttons.push({button, pos: {x, y}})
        }
    }
}

class PCInput {
    constructor() {

    }
    get() {
        let dir = createVector(mouseX, mouseY).sub(halfScreen())
        // multiply the direction so it's a value between -1 and 1
        dir.x /= halfScreen().x
        dir.y /= halfScreen().y
    
        return {x: dir.x, y: dir.y}
    }
}

