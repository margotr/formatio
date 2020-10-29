//here the functions that get input live happily
let controller = {
    origin: {x: 0, y: 0},
    dir: {x: 0, y: 0},
    active: false,
    max: 40
}
let pcontrol = controller.origin

function sendInput() {
    let input
    if (isMobile) input = getMobileInput()
    else input = getPCInput()

    socket.emit('input', input)
}

function updateInput() {
    sendInput()
    if (status === alive) setTimeout(updateInput, 20) //50hz input
}

function getPCInput() {
    let dir = createVector(mouseX, mouseY).sub(halfScreen())
    // multiply the direction so it's a value between -1 and 1
    dir.x /= halfScreen().x
    dir.y /= halfScreen().y

    return {x: dir.x, y: dir.y}
}

function getMobileInput() {
    let controllerfound = false
    let diff = {x: 0, y: 0}
    //bg = Math.round(touches.length * 30)
    for (let t of touches) {
        let isnewcontrol = newController(t)
        if (isnewcontrol) {
            controllerfound = true
            setController(t)
        }
        else {
            //check if the touch has a line connected to the controller
            let iscontrol = isController(t)
            if (iscontrol) {
                controllerfound = true
                diff = getBounceInput(t)
                pcontrol = t
            }
        }
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
}

function getDist(a, b) {
    return sqrt(sq(a.x - b.x) + (a.y - b.y))
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
    if (isClose(touch, pcontrol)) 
        return true
    return false
}

function newController(touch) {
    //bg = touch.x
    if (touch.x < halfScreen().x) {
        //alert('left')
        if (!controller.active) {
            //bg = color(255, 0, 0)
            return true
        }
    }
    //bg = 0
    return false
}
function getTouchType(touch) {
    for (let pt of ptouches) {

    }
}