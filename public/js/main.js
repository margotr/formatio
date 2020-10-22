let screen

function setup() {
  screen = createCanvas(600, 600)

}

function draw() {
  background(255, 0, 0)
}

class World {
  constructor() {
    
  }
}

class Blob {
  constructor(player, pos) {
    this.player = player
    this.pos = pos
    this.elements = []
    //add a random element:
  }
  move(input) {

  }
  addElement(elem) {
    this.elements.push(elem)
  }
}

class Element {
  constructor(type) {
    this.type = type
  }
}

