const fire = 0, water = 1, earth = 2, air = 3
const alive = 1, dead = 0

const ground = 3

let camera
let environment, screem

let myPos
let myid

let status = dead
let cells = []

let isMobile, fsbutton, orientation

let bg
let font

let socket
//change to host address
const host = 'http://localhost:3000'
function preload() {
  font = loadFont(host + '/fonts')
}
function setup() {
  myPos = createVector(0, 0)
  camera = {focus: createVector(0, 0)}
  bg = color(51, 51, 51)
  textSize(16)
  isMobile = isMobileDevice()
  screen = createCanvas(windowWidth, windowHeight, WEBGL)
  ortho()
  environment = new Environment()
  
  fsbutton = new FullScreenButton()
  //orientation = window.orientation
  //connect the socket
  socket = io()

  socket.on('update', update)
  socket.on('start', startPlayer)

  //register as a player on the server
  registerPlayer()
  }

function draw() {
  updateCamera()
  cells.forEach(cell => cell.drawLights())
  cells.forEach(cell => cell.draw())
  environment.draw()

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
    //begin sending inputs to the server
    updateInput()
}

function update(data) {
  cells = []
  //console.log(data.cells)
  for (let cell of data.cells) {
    cells.push(new Cell(cell.id, cell.pos))
  }
}


