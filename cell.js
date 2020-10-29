const { timers } = require("jquery")

const forcefield_dist = 50

class Cell {
    constructor(owner, type, pos, cells) {
        this.element = type
        this.pos = pos
        this.owner = owner

        this.cells = cells //reference to the array
        this.parent = null
        this.targetAngle = 0
        this.mass = 100
        this.energy = 100
        this.radius = this.calcRadius()
    }
    //calculate the radius
    setParent(id, owner) {
        this.parent = getParent(id)
        this.owner = owner
        this.targetAngle = getAngleTo(this.pos, this.parent.pos)
    }
    getParent(id) {
       
      }
    calcRadius() {
        const c = 10
        const a = 4 / c
        const b = 1 / c
        return (this.energy * a + this.mass * b)
    }
    getType() {
        return this.element.type
    }
   
}

class Player extends Cell {
    constructor(id, type, pos, cellid) {
        super(id, type, pos, cellid)
        this.heading = {x: 0, y: 0}
        this.speed = 4
    }
    updateInput(input) {
        this.heading = input
    }
    getHeading() {
        return this.heading
    }
    getPos() {
        return this.pos
    }
    update(cells) {
        //move
        this.pos.x += this.heading.x * this.speed
        this.pos.y += this.heading.y * this.speed
        
        //move connected elements
        let moved = [this.parent]
        this.moveConnected(moved, cells)
    }
}
function getRelativeAngle(angle1, angle2) {
    let a = PI - angle1
    let b = PI + angle2
    return( (a + b) % (2 * PI))
  }

function getTargetDist(r1, r2) {
    return r1 + r2 + forcefield
}

function getAngleTo(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x)
}

module.exports = {
    Cell,
    Player
}