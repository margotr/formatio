class Cell {
  //cells.push(new Cell(cell.owner, cell.id, cell.pos, cell.type, cell.parent))
    constructor(owner, id, pos, type, parent) {
      this.owner = owner
      this.id = id
      this.pos = createVector(pos.x, pos.y)
      this.type = type
      this.parent = parent
    }
    draw() {
      push()
        let p = getFocus(this.pos)
        if (this.owner == myid) {
          //console.log('focus = ', p)
        }
        if (inbounds(p))
        {
          fill(255, 0, 0)
          circle(p.x, p.y, 50)
          fill(255)
          textAlign(CENTER)
          text(this.owner, p.x, p.y - 50)
        }
      pop()
    }
  }
  
  class Element extends Cell {
    constructor(owner, type, pos) {
      super(owner, pos)
      this.type = type
    }
    draw() {
      //
      //reference p:
      let p = getFocus(this.pos)
      if (inbounds(p)) {
        push()
          fill(255, 0, 0)
          circle(p.x, p.y, 30)
        pop()
      }
    }
  
    getWeight() {
      return 1
    }
    getPos() {
      return this.pos
    }
    move(amount) {
      this.pos.add(amount)
    }
  }