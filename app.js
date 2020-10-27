const express = require("express");
const app = express();
var path = require("path");
const port = 3000;
const socket = require('socket.io')

const gameEnv = require('./game.js') //load in the game environment (SHOULD BE MOVED TO A SEPERATE PROCESS)

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

  function addPlayer() {
    game.addPlayer(socket.id)
    socket.emit('start', socket.id)
  }
  function handleInput(data) {
    //console.log(game.getPlayer(id))
    game.updatePlayer(data)
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