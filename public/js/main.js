const player = 0, fire = 1, earth = 2, water = 3, air = 4

let camera
let environment, level

let myPos
let myid = null

let cells = [], events = []

let myWeapons = [
  'fire', 'earth', 'soil', 'water', 'air'
]

let isMobile, fsbutton, orientation
let input

let bg

let gamestream
//change to host address
const host = 'localhost:3000'

p5.disableFriendlyErrors = true

function setup() {
  myPos = createVector(0, 0)
  camera = {focus: createVector(0, 0)}
  bg = color(51, 51, 51)

  isMobile = isMobileDevice()
  if (isMobile) input = new MobileInput()
  else input = new PCInput()

  screen = createCanvas(windowWidth, windowHeight)
  environment = new Environment()
  
  fsbutton = new FullScreenButton()

  //register as a player on the server
  registerPlayer()
  //console.log(isClose)
  }

function draw() {
  updateCamera()
  environment.draw()
  cells.forEach(cell => cell.draw())
  level.draw()
  fsbutton.draw()

  //console.log(width, height)

  if (isMobile) input.draw()
}

async function registerPlayer() {
  let session = getCookie('sess_id')
  const url = 'http://' + host + '/game_id'
  let gamedetails = await returnPost(url, {session})
  //console.log(gamedetails)
  if (gamedetails.id !== null) {
    myid = gamedetails.id
    if (gamedetails.session) {
      setCookie('sess_id', gamedetails.session, 7)
    }
    //console.log(gamedetails)
    level = new Level(gamedetails.level.level)
    //console.log('starting game: ', myid)
    openStream()
  }
}

async function returnPost(url, data) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      //'Access-Control-Allow-Origin': '192.168.178.48',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
  if (response) return response.json()
  else return null
}

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

function startGame() {
  if (isMobile) input.initButtons(myWeapons)
  updateInput()
}


