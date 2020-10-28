const World = require('./world.js')

class Game {
    constructor() {
        this.players = []
        this.world = new World()
        //console.log(this.players)
    }
    run() {
        for (let player of this.players) {
            player.update()
        }
        this.world.run()
    }
    getPlayers() {
        return this.players
    }
    getGameData() {
        let out = {}
        out.cells = this.getCells()
        return out
    }
    clean(ids) {
        for (let i = this.players.length - 1; i >= 0; i--) {
            let inlist = ids.find(id => this.players[i].getID() === id)
            if (!inlist) {
                console.log('removing player: ', this.players[i])
                this.players.splice(i, 1)
            }
        }
    }
    getCells() {
        let out = []
        for (let player of this.players) {
            out.push({id: player.id, pos: player.getPos()})
        }
        return out
    }
    addPlayer(id) {
        this.players.push(new Player(id, {x:0, y: 0}))
        console.log('current players: ', this.players)
    }
    getPlayer(id) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id === id) return this.players[i]
        }
        return null
    }
    updatePlayerInput(id, input) {
        let player = this.getPlayer(id)
        if (!player) 
        {
            //handle missing player input -> remove player(?)
            return null
        }
        player.updateInput(input)
    }
}

class Player {
    constructor(id, pos) {
        this.id = id
        this.pos = pos || {x: 0, y: 0}
        this.heading = {x: 0, y: 0}
        this.speed = 4
    }
    updateInput(input) {
        this.heading = input
        //console.log('updated heading:', this.heading)

    }
    getPos() {
        return this.pos
    }
    getID() {
        return this.id
    }
    update() {
        //console.log(this.heading)
        this.pos.x += this.heading.x * this.speed
        this.pos.y += this.heading.y * this.speed
    }
}

module.exports = {
    Game
}