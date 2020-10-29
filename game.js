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
        this.addCells(5)
    }
    run() {
        //move all the cells belonging to players
        for (let cell of this.cells) {
            if (cell.getType() === player.type) cell.move(this.cells)
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
            let inlist = ids.find(id => owner === id)
            if (!inlist && owner !== 'none') {
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
            
            out.push(
                {id: cell.id, 
                pos: cell.pos,
                owner: cell.owner,
                type: cell.element.type,
                parent: (cell.parent) ? cell.parent.id : -1
            })
        }
        //console.log(out.length)
        return out
    }
    addCells(amount) {
        for (let i = 0; i < amount; i++) {
            let x = (Math.random() - 0.5) * 1000
            let y = (Math.random() -0.5) * 1000
            this.cells.push(new Cells.Cell('none', fire, {x, y}, cellcount))
            cellcount ++
        }
    }
    addPlayer(id) {
        this.cells.push(new Cells.Player(id, player, {x: 0, y: 0}, cellcount))
        cellcount ++ //used for unique cell id's
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