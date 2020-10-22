let screen
let enivornment
let myBlob

const fire = 0, water = 1, earth = 2, air = 3

function setup() {
  screen = createCanvas(600, 600)
  environment = new Environment()
  myBlob = new Blob(0, createVector(0, 0))
}

function draw() {
  environment.draw()
  //get the user input
  getInput()

  myBlob.draw()

  movePos(myBlob.move(getInput()))
}

function getPos(pos) {
  return environment.getPos(pos)
}
function movePos(pos) {
  environment.update(pos)
}

function getInput() {
  let a = myBlob.getPos()
  let b = environment.getFocus()
  drawCircle(b, color(255, 0, 255))
  let dir = p5.Vector.sub(b, a)
  dir.mult(0.1)
  drawCircle(dir, color(0, 255, 0))
  //console.log(dir)
  return dir
}

function drawCircle(pos, color) {
  let p = environment.getPos(pos)
  push()
  fill(color)
  circle(p.x, p.y, 30)
  pop()
}

class Blob {
  constructor(player, pos) {
    this.player = player
    this.pos = pos
    this.elements = []
    //add a random element:
    this.elements.push(new Element(fire, this.pos))
  }

  getPos() {
    return this.pos
  }

  draw() {
    this.elements.forEach(element => element.draw())
  }

  move(amount) {
    this.elements.forEach(element => element.move(amount))
    return this.getPos()
  }
  addElement(elem) {
    this.elements.push(elem)
  }
}

class Element {
  constructor(type, pos) {
    this.type = type
    this.pos = pos
  }
  draw() {
    push()
      fill(255, 0 ,0)

      let pos = getPos(this.pos)
      circle(pos.x, pos.y, 30)
    pop()
  }

  move(amount) {
    this.pos.add(amount)
  }
}

