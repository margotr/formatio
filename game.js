const Cells = require('./cell.js')

let cellcount = 0

const player =   {
        type: 0,
        e_m: 1,
        heat: 0
    }
const fire = {
        type: 1,
        e_m: 10,
        heat: 1000
    }
const earth =   {
        type: 2,
        e_m: 0.2,
        heat: 0
    }
const water = {
        type: 3,
        e_m: 0.4,
        heat: 0
    }
const air = {
        type: 4,
        e_m: 2,
        heat: 0
    }

class Game {
    constructor() {
        this.cells = []
    }
    run() {
        //move all the cells belonging to players
        for (let cell of this.cells) {
            //console.log(cell)
            if (cell.getType() === player.type) cell.update(this.cells)
        }
    }
    getGameData() {
        let out = {}
        out.cells = this.getCells()
        return out
    }
    clean(ids) {
        for (let i = this.cells.length - 1; i >= 0; i--) {
            let owner = this.cells[i].owner
            let inlist = ids.find(id => owner === id || owner === 'none')
            if (!inlist) {
                console.log('removing cell: ', this.cells[i])
                this.cells.splice(i, 1)
            }
        }
    }
    getPlayers() {
        //FILTER !CREATES NEW ARRAY!
        return this.cells.filter(cell => cell.getType() === player.type)
    }
    getCells() {
        let out = []
        for (let cell of this.cells) {
            out.push({id: cell.owner, pos: cell.pos})
        }
        return out
    }
    addPlayer(id) {
        this.cells.push(new Cells.Player(id, player, {x: 0, y: 0}))
        console.log('current players: ', this.getPlayers())
    }
    getPlayer(id) {
        for (let cell of this.cells) {
            if (cell.getType() === player.type && cell.owner === id) return cell
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

module.exports = {
    Game
}