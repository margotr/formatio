const Cells = require('./cell.js')

module.exports = class Game {
    constructor() {
        this.cells = []
        this.queue = []
        this.events = []
        this.playercount = 0
        this.cellcount = 0
        this.addCells(50, 3000)
    }
    run() {
        //move all the cells belonging to players
        for (let cell of this.cells) {
            if (cell.getType() === Cells.player.type) cell.move(this.cells, this.events)
        }
    }
    getGameData() {
        let out = {}
            out.cells = this.getCells()
            out.events = this.getEvents()
        return out
    }
    getEvents() {
        return this.events
    }
    addEvent(p1, p2) {
        this.events.push({p1, p2})
    }
    clean(ids) {
        for (let i = this.cells.length - 1; i >= 0; i--) {
            let owner = this.cells[i].owner
            let inlist = ids.find(id => owner === id)
            if (!inlist && owner !== 'none') {
                console.log('removing cell: ', this.cells[i])
                this.cells.splice(i, 1)
            }
        }
    }
    getPlayers() {
        //FILTER !CREATES NEW ARRAY!
        return this.cells.filter(cell => cell.getType() === Cells.player.type)
    }
    createGameID() {
        return this.playercount++
    }
    getCells() {
        let out = []
        for (let cell of this.cells) {
            out.push(
                {
                id: cell.id, 
                pos: cell.pos,
                owner: cell.owner,
                name: (cell.getType() === Cells.player.type) ? cell.name : 0,
                type: cell.element.type,
                parent: (cell.parent) ? cell.parent.id : -1
            })
        }
        return out
    }
    addCells(amount, spread) {
        for (let i = 0; i < amount; i++) {
            let x = (Math.random() - 0.5) * spread * 2
            let y = (Math.random() -0.5) * spread * 2
            this.cells.push(new Cells.Cell(-1, {x, y}, this.cellcount++))
        }
    }
    getQueued(game_id) {
        for (let player of this.queue) {
            if (player.owner === game_id) return player
        }
        return null
    }
    removeFromQueue(game_id) {
        for (let i = this.queue.length - 1; i >= 0; i--) {
            if (this.queue[i].owner === game_id)
            {
                this.queue.splice(i, 1)
                break
            }
        }
    }
    startPlayer(game_id) {
        //adds queued players to the game
        let player = this.getQueued(game_id)
        this.cells.push(player)
        console.log('players', this.getPlayers())
        this.removeFromQueue(game_id)
    } 
    addPlayer(creds) {
        let name = creds.username
        let game_id = this.createGameID()
        //added to queue instead of directly to game since socket still has to be set up
        //that takes +- 1 second
        this.queue.push(new Cells.Player(name, game_id, {x: 0, y: 0}, this.cellcount++))
        return game_id
    }
    getPlayer(id) {
        for (let cell of this.cells) {
            if (cell.getType() === Cells.player.type && cell.owner === id) return cell
        }
        return null
    }
    updatePlayerInput(id, input) {
        let player = this.getPlayer(id)
        if (!player) 
        {
            //handle missing player input -> remove player?
            return null
        }
        player.updateInput(input)
    }
}