const express = require("express");
const app = express();
var path = require("path");
const port = 3000;
const socket = require('socket.io')

//this should be moved to a seperate process to clear processing power
//for now it's fine
const gameEnv = require('./game.js')

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/landing", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/landing.html"));
});

const server = app.listen(port, () => {
  console.log(`Formatio listening at http://localhost:${port}`);
});

const io = socket(server)

io.sockets.on('connection', newConnection)
const game = new gameEnv.Game()

function runGames() {
  game.run()
  io.sockets.emit('update', game.getGameData())
  setTimeout(runGames, 20)
}
runGames()


function newConnection(socket) {
  //links the client with the actual server
  console.log('new socket connected: ', socket.id)
  socket.on('newplayer', addPlayer) 
  socket.on('input', handleInput)
  socket.on('test', testfunction)

  function testfunction(data) {
    console.log(data)
  }

  function addPlayer() {
    game.addPlayer(socket.id)
    socket.emit('start', socket.id)
  }
  function handleInput(data) {
    game.updatePlayerInput(socket.id, data)
  }
}

function cleanGame() {
    let sockets = io.sockets.sockets
    let ids = []
    for (let id in sockets) {
      ids.push(id)
    }
    game.clean(ids)
    setTimeout(cleanGame, 1000)
}
cleanGame()