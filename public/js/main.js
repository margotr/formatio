const player = 0, fire = 1, earth = 2, water = 3, air = 4

let camera
let environment, screem

let myPos
let myid = null

let cells = [], events = []

let myWeapons = [
  'fire', 'earth', 'soil', 'water', 'air'
]

let isMobile, fsbutton, orientation

let bg

let socket, udp
//change to host address
const host = '192.168.178.48:3000'

p5.disableFriendlyErrors = true

function setup() {
  myPos = createVector(0, 0)
  camera = {focus: createVector(0, 0)}
  bg = color(51, 51, 51)

  isMobile = isMobileDevice()
  screen = createCanvas(windowWidth, windowHeight)
  environment = new Environment()
  
  fsbutton = new FullScreenButton()

  //register as a player on the server
  registerPlayer()
  console.log(isClose)
  }

function draw() {
  updateCamera()
  environment.draw()
  cells.forEach(cell => cell.draw())

  fsbutton.draw()

  //console.log(width, height)

  if (isMobile) drawMobileInput()
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
    console.log('starting game: ', myid)
    openSocket()
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

function openSocket() {
  socket = new WebSocket('ws://' + host + '/gamestream')
  socket.onopen = () => {
    // now we are connected
    console.log('connected socket')
    socket.send(JSON.stringify({type: 'ready', id: myid})) //send a ready message
    socket.onmessage = (message) => {
      // here we got something sent from the server
      let data = JSON.parse(message.data)
      switch(data.type) {
        case 'start':
          console.log("we can start", myid)
          startGame()
        break
        case 'update':
          update(data)
        break
      }
    }
  }
}

function startGame() {
  initButtons(myWeapons)
  updateInput()
}

function update(data) {
  cells = []
  //console.log(data.gamedata.cells)
  /*
                id: cell.id, 
                pos: cell.pos,
                owner: cell.owner,
                type: cell.element.type,
                parent: (cell.parent) ? cell.parent.id : -1
  */
  for (let cell of data.gamedata.cells) {
    //console.log(cell.name)
    cells.push(new Cell(cell.owner, cell.name, cell.id, cell.pos, cell.type, cell.parent))
  }
  events = []
  for (let event of data.gamedata.events) {
    events.push(event)
  }
}


