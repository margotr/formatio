function FullScreenButton() {
    this.pos = createVector(0,0)
    this.width = 50
    this.height = 50

    this.draw = function() {
        push()
        fill(fullscreen() ? color(255, 0 ,0) : color(0, 255, 0))
        rect(this.pos.x, this.pos.y, this.width, this.height)
        pop()
    }
    this.check = function() {
        //alert(mouseX > this.pos.x + 200)
        if (mouseX > this.pos.x && mouseX < this.pos.x + this.width) {
            if (mouseY > this.pos.y && mouseY < this.pos.y + this.height) {
                return true
            }
        }
        return false
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
  }

// function updateScreen() {
//     if (orientation !== window.orientation) 
//     {
//         orientation = window.orientation
//     }
// }