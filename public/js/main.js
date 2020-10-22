const fire = 0, water = 1, earth = 2, air = 3

let camera
let environment, screem
let blobs = []
let myblob
let myid

//socket connection:
let socket

function setup() {
  camera = {focus: createVector(0, 0), zoom: 1}
  screen = createCanvas(windowWidth, windowHeight)
  environment = new Environment()
  
  //begin the socket here


  //get a player id from the server
  myid = getPlayerId()
  myid.then((id) => {
    blobs.push(new Blob(player = id, pos = createVector(0, 0)))
    console.log(blobs)
    console.log(id)
    for (let b of blobs) {
      if (b.player === id)
        {
          myblob = b
          break
        }
    }
    console.log('id: ', myid)
    console.log('my blob status: ', myblob)
    updateCamera()
  })

  //define functions to update the blocks based on server data here

  //update a blob list

  //

}

function draw() {
  environment.draw()
  myblob.update()
  blobs.forEach(blob => blob.draw())
  updateCamera()
}

function updateblobs(newblobs) {
  blobs = readbloblist(newblobs)
}
function readbloblist(blobs) {
  // should be a js object of the form:
  // blobs = [{id:[array positions], elements: [array]}]


  //could clear the array and refill it

  //could 

}

function createbloblist() {
  let list = []
  blobs.forEach(blob => {
    list.push({id: blob.player, elements: blob.getElements()})
  })
}

async function getPlayerId() {
  //should be calling the server for an assigned id
    return new Promise( ( resolve ) => {
      resolve( 0 )
    } )
}

//server function calling readbloblist(blobs)
function updateblobs() {

}

function getInput() {
  let dir = halfScreen().sub(createVector(mouseX, mouseY))
  // environment.drawCircle(dir, color(0, 255, 0))
  return dir
  //createVector(1, 0)
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

  getElements() {
    return this.elements
  }

  draw() {
    this.elements.forEach(element => element.draw())
  }

  update() {
    //console.log(this.pos)
    //console.log(getFocus(this.pos))
    //only update if it's our blob
      let userinput = getInput()
      userinput.mult(0.01)
      this.elements.forEach(element => element.move(userinput))
      this.calcAveragePos()
      return this.getPos()
  }

  calcAveragePos() {
    let avg = createVector(0, 0)
    for (let e of this.elements) {
      avg.add(e.getPos())
    }
    avg.mult(this.elements.length)
    this.pos = avg
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
    //
    //reference p:
    let p = getFocus(this.pos)
    if (inbounds(p)) {
      push()
        fill(255, 0, 0)
        circle(p.x, p.y, 30)
      pop()
    }
  }

  getWeight() {
    return 1
  }
  getPos() {
    return this.pos
  }
  move(amount) {
    this.pos.add(amount)
  }
}

