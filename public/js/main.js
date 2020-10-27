const fire = 0, water = 1, earth = 2, air = 3
const alive = 1, dead = 0

let camera
let environment, screem

let myPos
let myid

let status = dead
let cells = []
//socket connection:
let socket
const host = 'http://localhost:3000'

function setup() {
  myPos = createVector(0, 0)
  camera = {focus: createVector(0, 0), zoom: 1}
  screen = createCanvas(windowWidth, windowHeight)
  environment = new Environment()
  
  //connect the socket
  socket = io.connect(host)

  socket.on('update', update)
  socket.on('start', startPlayer)

  //register as a player on the server
  registerPlayer()
  }

function draw() {
  updateCamera()
  environment.draw()
  cells.forEach(cell => cell.draw())
}

function registerPlayer() {
  socket.emit('newplayer')
}

function startPlayer(data) {
    myid = data
    status = alive
    console.log('game starting: ' ,myid)
    //then begin sending our input to the server
    updateInput()
}

function isDead() {
  status = dead
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

function update(data) {
  cells = []
  //console.log(data.cells)
  for (let cell of data.cells) {
    cells.push(new Cell(cell.id, cell.pos))
  }
}

class Cell {
  constructor(owner, pos) {
    this.owner = owner
    this.pos = createVector(pos.x, pos.y)
  }

  getPos() {
    return this.pos
  }
  draw() {
    push()
      let p = getFocus(this.pos)
      if (this.owner == myid) {
        //console.log('focus = ', p)
      }
      if (inbounds(p))
      {
        fill(255, 0, 0)
        circle(p.x, p.y, 50)
        fill(255)
        textAlign(CENTER)
        text(this.owner, p.x, p.y - 50)
      }
    pop()
  }
}

class Element extends Cell {
  constructor(owner, type, pos) {
    super(owner, pos)
    this.type = type
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

