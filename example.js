
let cells = []

let f_length = 20
let cellcount = 0

let e_input
function setup() {
  createCanvas(800, 800)
  e_input = new ElasticInput(width / 2, height / 2)
  cells.push(new Cell(width / 2, height / 2, 25))
  
  //attach cells
  let parent = cells[0]
  parent.setParent(parent.id)
  for (let i = 0; i < 4; i++) {
    let radius = (Math.random() * 20) + 15
    //get the pos of the parent
    let t_dist = getTargetDist(radius, parent.r) //target distance
    let randomAngle = PI / 4 + Math.random() * PI / 2
    let pos = getTarget(parent.pos, parent.angle - randomAngle, t_dist)
    //add the cell
    cells.push(new Cell(pos.x, pos.y, radius))
    //set parent linkage
    let lastcell = cells[cells.length - 1]
    lastcell.setParent(parent.id)
    parent = lastcell
  }
}

function draw() {
  background(51)
  let playercell = cells[0]
  e_input.update(mouseX, mouseY)
  playercell.setPos(e_input.pos)
  for (let i = 1; i < cells.length; i++) {
    let cell = cells[i]
    cell.update()
  }
  cells.forEach(cell => cell.draw())
}

class ElasticInput {
  constructor(x, y) {
    this.pos = createVector(x, y)
  }
  update(x, y) {
    //calc the vector between pos and new input
    let diff = createVector(x, y).sub(this.pos)
    this.pos.add(diff.mult(0.1))
  }
}

class Cell {
  constructor(x, y, r) {
    this.pos = createVector(x, y)
    this.prevPos = createVector(x, y)
    this.angle = 0 //your actual angle
    this.targetAngle = 0 //angle of your connection to your parent
    this.r = r
    this.parentid = 0
    this.id = cellcount
    cellcount ++
  }
  draw() {
    push()
    this.drawConnection()
    fill(255, 0, 0)
    noStroke()
    circle(this.pos.x, this.pos.y, this.r * 2)
    push()
      translate(this.pos.x, this.pos.y)
      rotate(this.angle)
      stroke(0)
      line(0,0, 100, 0)
    pop()
    push()
    translate(this.pos.x, this.pos.y)
    rotate((this.angle - this.targetAngle) + PI)
    stroke(0, 255, 0)
    line(0, 0, 25, 0)
    pop()   
    pop()
  }
  setParent(id) {
    this.parentid = id
    this.parent = getParent(this.parentid)
    let t_dist = getTargetDist(this.r, parent.r)
    this.targetAngle = p5.Vector.sub(this.parent.pos, this.pos).heading()
    console.log(this.targetAngle)
  }
  getAngleToParent() {
    return this.parent.angle - this.targetAngle
  }
  drawConnection() {
    //draws a line to the parent cell
    push()
    strokeWeight(5)
    stroke(0,0,255)
    line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y)
    pop()
  }
  update() {
    let t_dist = getTargetDist(this.r, this.parent.r)
    
    //what's the angle of my parent, and what would I like to have
    let angle = this.getAngleToParent()
    //where would I like to go to
    let target = getTarget(this.parent.pos, angle, t_dist)
    //this.pos.set(target.x, target.y)
    
    //let other cells change the position here
    
    
    //then add forcefield as counter
    this.pos.add(p5.Vector.sub(target, this.pos).mult(0.1))
    
    //finally
    this.updateAngle()
    //console.log(this.parent)
  }
  getDir() {
    return p5.Vector.sub(this.pos, this.prevPos)
  }
  updateAngle() {
    this.angle = convergeAngle(this.angle, this.parent.angle, 0.2)
    //this.angle += (this.parent.angle - this.angle) * 0.1
  }
  setPos(pos) {
    this.prevPos.set(this.pos.x, this.pos.y)
    this.pos.set(pos.x, pos.y)
    this.angle = convergeAngle(this.angle, this.getDir().heading(), 0.04)
    //this.angle = this.getDir().heading()
  }
}
function convergeAngle(a1, a2, mult) {
  let anglebetween = getRelativeAngle(a2, a1)
    let a = a1
    if (anglebetween > PI) {
      let f = ((PI * 2) - anglebetween)
      a += f * mult
    } else {
      let f = anglebetween
      a -= (anglebetween) * mult
    }
    return a %= (2 * PI)
}

function getParent(id) {
  for (let c of cells) {
    if (c.id === id) return c
  }
  return null
}
function getTarget(pos, angle, length) {
  return createVector
  (
    pos.x + cos(angle) * length,
    pos.y + sin(angle) * length
  )
}

function getRelativeAngle(angle1, angle2) {
    let a = PI - angle1
    let b = PI + angle2
    return( (a + b) % (2 * PI))
  }

function getTargetDist(r1, r2) {
  return r1 + r2 + f_length
}