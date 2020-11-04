//here the functions that get input live happily
let controller = {
    origin: {x: 0, y: 0},
    dir: {x: 0, y: 0},
    active: false,
    max: 40,
}
let drawer = {
    active: false,
    points: []
}

let buttons = []
let pressedButtons = []

let buttondia = 50

let leftBumper, rightBumper
let pcontrol = controller.origin

function sendInput() {
    //alert(isMobile)
    let input = (isMobile) ? getMobileInput() : getPCInput()
    socket.send(JSON.stringify({type: 'input', id: myid, input}))
}

function updateInput() {
    sendInput()
    //bg = Math.round(Math.random() * 255)
    setTimeout(updateInput, 34) //30hz input
}

function getPCInput() {
    let dir = createVector(mouseX, mouseY).sub(halfScreen())
    // multiply the direction so it's a value between -1 and 1
    dir.x /= halfScreen().x
    dir.y /= halfScreen().y

    return {x: dir.x, y: dir.y}
}

function getMobileInput() {
    let controllerfound = false, drawerfound = false
    let diff = {x: 0, y: 0}
    let attack = -1
    //bg = Math.round(touches.length * 30)
    for (let t of touches) 
    {
        if (newController(t)) 
        {
            controllerfound = true
            setController(t)
        }
        else 
        {
            //check if the touch has a line connected to the controller
            if (isController(t)) 
            {
                controllerfound = true
                diff = getBounceInput(t)
                pcontrol = t
            }
            else 
            {
                //handle button input for each touch
                if (newDrawer(t)) 
                {
                    drawerfound = true
                    setDrawer(t)
                }
                else if (isDrawer(t)) 
                {
                    drawerfound = true
                    drawer.points.push(t)
                }
            }
        }
    }

    if (!drawerfound) {
        let data = getDrawerData()
        if (data.length > 0) {
            //add data to outbound here
            console.log(data)
            pressedButtons = data
        }
        resetDrawer()
    }
    if (!controllerfound) resetController()
    
    return diff
}

function getBounceInput(t) {
    let angle = atan2(t.y - controller.origin.y , t.x - controller.origin.x)
    let mag = dist(controller.origin.x, controller.origin.y, t.x, t.y)
    mag = constrain(mag, 0, controller.max)
    controller.dir.x = mag * cos(angle)
    controller.dir.y = mag * sin(angle)
    let inv = 1 / sq(controller.max)
    return {x: controller.dir.x * mag * inv, y: controller.dir.y * mag * inv}
}

function drawMobileInput() {
    push()
    if (controller.active) {
        fill(255, 255, 255, 100)
        noStroke()
        let bounds = 30
        circle(controller.origin.x, controller.origin.y, controller.max * 2 + bounds * 2)
        circle(controller.origin.x + controller.dir.x, controller.origin.y + controller.dir.y, bounds * 2)
    }
    pop()
    showButtons()
    drawField()
}

function showButtons() {
    push()
    fill(255)
    if (buttons.length !== 0) {
        //console.log(buttons[0].pos, width, height)
    }
    for (let b of buttons) {
        circle(b.pos.x, b.pos.y, buttondia)
    }
    pop()
    //drawBumper(leftBumper, pressState[leftBumper.value])
    //drawBumper(rightBumper, pressState[rightBumper.value])
}

function drawBumper(bumper, pressed) {
    push()
    stroke(100, 240)
    strokeWeight(10)
    if (pressed) fill(100, 60)
    else fill(100, 0)
    rect(bumper.x, bumper.y, bumper.w, bumper.h)
    pop()
}
function getButtonInput(touch) {
    if (bumperPressed(leftBumper, touch)) return leftBumper.value
    if (bumperPressed(rigthBumper, touch)) return rightBumper.value
    return null
}

function getDist(a, b) {
    return sqrt(sq(a.x - b.x) + (a.y - b.y))
}

function drawField() {
    let pp = (drawer.points.length !== 0) ? drawer.points[0] : null
    if (!pp) return null
    push()
    stroke(255)
    strokeWeight(5)
    for (let i = 1; i < drawer.points.length; i++) {
        let p = drawer.points[i]
        line(pp.x, pp.y, p.x, p.y)
        pp = p
    }
    pop()
}

function setDrawer(touch) {
    drawer.active = true
    drawer.points.push(touch)
}
function resetDrawer() {
    drawer.active = false,
    drawer.points = []
}

function isDrawer(touch) {
    if (!drawer.active) return false
    return (isClose(touch, drawer.points[drawer.points.length - 1]))
}

function inDrawScreen(touch) {
    return (touch.x > halfScreen().x && touch.y > halfScreen().y - 100)
}

function newDrawer(touch) {
    return (inDrawScreen(touch) && !drawer.active)
}

function getDrawerData() {
    let diasq = Math.pow((buttondia / 2), 2)
    let pressed = []
    for (let b of buttons) {
        for (let p of drawer.points) {
        if (Math.pow(p.x - b.pos.x, 2) + Math.pow(p.y - b.pos.y, 2) < diasq) {
            pressed.push(b.button)
            break
            }
        }
    }
    return pressed
}

function setController(touch) {
    controller.active = true
    controller.origin = touch
    pcontrol = touch
}
function resetController() {
    controller.active = false
}

function isController(touch) {
    return (isClose(touch, pcontrol)) 
}

function newController(touch) {
    return (touch.x < halfScreen().x && touch.y > 100 && !controller.active)
}

function initButtons(visible) {
    let origin = {x: width - 120, y: height - 120}
    //45 degree start
    buttons = []
    if (visible.length !== 0) buttons.push({button: visible[0], pos: origin})
    for (let i = 0; i < visible.length - 1; i++) {
        let button = visible[i + 1]
        let angle = Math.PI * 2/3 - ((Math.PI * 2) / 6) * i
        let x = origin.x + Math.cos(angle) * 80
        let y = origin.y + Math.sin(angle) * 80
        buttons.push({button, pos: {x, y}})
    }
    
    leftBumper = {
        x: 70,
        y: 0,
        w: 150,
        h: 80,
        value: buttons.length + 1
    }
    rightBumper = {
        x: width - (150 + 70),
        y: 0,
        w: 150,
        h: 80,
        value: buttons.length + 2
    }
}