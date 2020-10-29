const fire = 0, water = 1, earth = 2, air = 3
const alive = 1, dead = 0

let camera
let environment, screem

let myPos
let myid

let status = dead
let cells = []

let isMobile, fsbutton, orientation

let bg

let socket, udp
//change to host address
const host = 'http://82.197.208.126:3000'

function setup() {
  myPos = createVector(0, 0)
  camera = {focus: createVector(0, 0)}
  bg = color(51, 51, 51)

  isMobile = isMobileDevice()
  screen = createCanvas(windowWidth, windowHeight)
  environment = new Environment()
  
  fsbutton = new FullScreenButton()
  //connect the socket
  socket = io()

  socket.on('update', update)
  socket.on('start', startPlayer)

  //register as a player on the server
  registerPlayer()
  }

function draw() {
  updateCamera()
  environment.draw()
  cells.forEach(cell => cell.draw())

  fsbutton.draw()

  if (isMobile) drawMobileInput()
}

function registerPlayer() {
  socket.emit('newplayer')
}

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

function startPlayer(data) {
    myid = data
    status = alive
    console.log('game starting: ' ,myid)
    //then begin sending our input to the server
    updateInput()
}

function update(data) {
  cells = []
  //console.log(data.cells)
  for (let cell of data.cells) {
    cells.push(new Cell(cell.id, cell.pos))
  }
}


