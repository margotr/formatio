const forcefield_dist = 50

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

class Cell {
    constructor(owner, pos, id) {
        this.owner = owner
        this.element = fire
        this.pos = pos
        this.id = id

        this.angle = 0
        this.parent = null
        this.targetAngle = 0
        this.mass = 100
        this.energy = 100
        this.radius = this.calcRadius()
    }
    //calculate the radius
    update(cells, events) {
        //apply forces to cells outside of this cell's structure
        this.captureCells(cells, events)
        if (this.parent) {
            //update the distance to the target
            this.updateTargetDist()
            this.updateAngle()
            let targetAngle = this.getAngleToParent()
            //console.log(targetAngle)
            let target = getTarget(this.parent.pos, targetAngle, this.targetDist)

            let diff = subtract(target, this.pos)
            this.pos = add(this.pos, multiply(diff, 0.1))
        }
        //move cells that are connected to this cell
        this.moveConnected(cells, events)
    }
    captureCells(cells, events) {
        //apply force on other cells
        for (let cell of cells) {
            //don't apply force on own structure
            if (cell.owner === this.owner) continue
            if (cell.owner === -1)
            {
                let capturedistance = getTargetDist(this.radius, cell.radius)
                //console.log(capturedistance)
                if (dist(this.pos, cell.pos) < capturedistance )
                    cell.setParent(this.id, this.owner, cells, events)
            } else 
            {
                //try to capture cells from other players
            }
        }
    }
    moveConnected(cells, events) {
        for (let cell of cells) {
            if (cell.parent) 
                if (cell.parent.id === this.id) cell.update(cells, events)
        }
    }
    getAngleToParent() {
        // let a = getRelativeAngle(this.targetAngle, this.parent.angle)
        // console.log(a)
        // return this.angle + a
        //console.log(this.parent.angle, this.angle, this.targetAngle)
        return (this.parent.angle - this.targetAngle)
    }
    setParent(parentid, owner, cells, events) {
        this.parent = getCell(parentid, cells)
        //console.log(this.parent.name)
        this.owner = owner
        this.angle = this.parent.angle
        //this.targetAngle = getAngleTo(this.parent.pos, this.pos)
        let targetDist = getTargetDist(this.parent.radius, this.radius)
        let a = Math.atan2(this.pos.y - this.parent.pos.y, this.pos.x - this.parent.pos.x)
        this.targetAngle = this.parent.angle - a
        events.push({p1: this.parent.pos, p2: getTarget(this.parent.pos, this.targetAngle, targetDist)})
    }
    updateTargetDist() {
        this.targetDist = getTargetDist(this.radius, this.parent.radius)
    } 
    updateAngle() {
        this.angle = convergeAngle(this.angle, this.parent.angle, 0.2)
        if (this.angle < 0)  this.angle = (Math.PI * 2) - Math.abs(this.angle)
        this.angle %= (Math.PI * 2)
        //console.log(this.angle)
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
    constructor(name, owner, pos, id) {
        super(owner, pos, id)
        this.element = player
        this.name = name
        this.heading = {x: 0, y: 0}
        this.speed = 2
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
    getDir() {
        return getAngleTo({x: 0, y:0}, this.heading)
    }
    move(cells, events) {
        //move
        this.pos.x += this.heading.x * this.speed
        this.pos.y += this.heading.y * this.speed
        //converge the angle in movement direction
        this.angle = convergeAngle(this.angle, this.getDir(), 0.04)
        if (this.angle < 0)  this.angle = (Math.PI * 2) - Math.abs(this.angle)
        this.angle %= (Math.PI * 2)
        //console.log(this.angle)
        //update the cell
        this.update(cells, events)
    }
}

function getCell(id, cells) {
    for (let c of cells) {
        if (c.id === id) return c
    }
    return null
}
function subtract(p1, p2) {
    return {
        x: p1.x - p2.x,
        y: p1.y - p2.y
    }
}
function add(p1, p2) {
    return {
        x: p1.x + p2.x,
        y: p1.y + p2.y
    }
}
function multiply(a, factor) {
    return {
        x: a.x * factor,
        y: a.y * factor
    }
}

function dist(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

function convergeAngle(a1, a2, mult) {
    let anglebetween = getRelativeAngle(a2, a1)
      let a = a1
      if (anglebetween > Math.PI) {
        let f = ((Math.PI * 2) - anglebetween)
        a += f * mult
      } else {
        let f = anglebetween
        a -= (anglebetween) * mult
      }
      return a %= (2 * Math.PI)
  }

  function getTarget(pos, angle, length) {
    return  {
        x: pos.x + Math.cos(angle) * length, 
        y: pos.y + Math.sin(angle) * length
        }
}

function getRelativeAngle(angle1, angle2) {
    let a = Math.PI - angle1
    let b = Math.PI + angle2
    return( (a + b) % (2 * Math.PI))
  }

function getTargetDist(r1, r2) {
    return r1 + r2 + forcefield_dist
}

//this.targetAngle = (getAngleTo(this.parent.pos, this.pos)) % Math.PI * 2
 //       let targetDist = getTargetDist(this.parent.radius, this.radius)
 //       console.log('original pos: ', this.pos)
 //       console.log('dist between both: ', dist(this.parent.pos, this.pos))
 //       let a = Math.atan2(this.pos.y - this.parent.pos.y, this.pos.x - this.parent.pos.x)

function getAngleTo(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x)
}

module.exports = {
    Cell,
    Player,
    player,
    fire,
    water,
    earth,
    air
}