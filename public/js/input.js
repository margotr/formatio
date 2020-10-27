//here the functions that get input live happily

function sendInput() {
    //check if client is phone or computer
    
    //pc input:
    let input = getPCInput()

    let data = {id: myid, input}
    socket.emit('input', data)
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

function getInput() {
    // environment.drawCircle(dir, color(0, 255, 0))
    return dir
    //createVector(1, 0)
  }