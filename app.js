const express = require("express");
const app = express();
var path = require("path");
const port = 3000;

const expressWS = require('express-ws')(app)
let clients = []
const bodyParser = require("body-parser");

var dogsArr = []
app.use(bodyParser.json());

const Game = require("./game.js");
const AccountManager = require("./accounts.js")
const accountmanager = new AccountManager()

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/landing", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/landing.html"));
});

app.post("/input_name", function (req, res) {
  console.log(req);
  res.send('hello!')
})

app.post("/game_id", (req, res) => {
  //read the cookies for a game account:
  let session = req.body.session
  console.log('session = ', session)
  let creds = accountmanager.getAccount(session)
  if (!creds) creds = accountmanager.addAccount()
  const response = {
    session: creds.session,
    id: game.addPlayer(creds)
  }
  console.log(response)
  res.send(response)
})


const server = app.listen(port, () => {
  console.log(`Formatio listening at http://localhost:${port}`);
})

app.ws('/gamestream', function(ws, req) {
  console.log('new client connected')
  clients.push(ws)
  ws.onmessage = function(body) {
    //console.log('got message: ', body)
    let data = JSON.parse(body.data)
    switch(data.type) {
      case 'input':
        updateInput(data)
      break
      case 'ready':
        game.startPlayer(data.id)
        ws.send(JSON.stringify({type: 'start'}))
    }
  }
  function updateInput(data) {
    game.updatePlayerInput(data.id, data.input)
  }
})

function checkClients() {
  //console.log('checking connections...')
  for (let i = clients.length - 1; i >= 0; i--) {
    if (clients[i].readyState === clients[i].CLOSED) {
      console.log('removing client')
      clients.splice(i, 1)
    }
  }
  setTimeout(checkClients, 1000)
}
checkClients()

function updateClientView(gamedata) {
  let out = JSON.stringify({type: 'update', gamedata})
  clients.forEach(client => {
    if (client.readyState === client.OPEN)
      client.send(out)
  })
}

const game = new Game()

function runGames() {
  game.run()
  updateClientView(game.getGameData())
  setTimeout(runGames, 34);
}
runGames();

// function newConnection(socket) {
//   //links the client with the actual server
//   console.log("new socket connected: ", socket.id);
//   socket.on("newplayer", addPlayer);
//   socket.on("input", handleInput);
//   socket.on("test", testfunction);

//   function testfunction(data) {
//     console.log(data);
//   }


// function cleanGame() {
//   let sockets = io.sockets.sockets;
//   let ids = [];
//   for (let id in sockets) {
//     ids.push(id);
//   }
//   game.clean(ids);
//   setTimeout(cleanGame, 1000);
// }
// cleanGame();
