class Cell {
    constructor(owner, pos) {
      this.owner = owner
      this.pos = createVector(pos.x, pos.y)
    }
  
    getPos() {
      return this.pos
    }
    draw() {
        let p = getFocus(this.pos)
        if (this.owner == myid) {
          //console.log('focus = ', p)
        }
        if (true)
        {
          push()
          fill(255, 0, 0, 255)
          //ambientMaterial(255, 100, 100, 255)
          //pointLight(250, 250, 250, 50, 0, 50)
          noStroke()
          Circle(p.x, p.y, ground, 50)
          fill(255)
          textAlign(CENTER)
          textFont(font)
          text('x: ' + Math.round(this.pos.x) + 'y: ' + Math.round(this.pos.y), p.x, p.y - 70)
          text(this.owner, p.x, p.y - 50)
          pop()
        }
    }
    drawLights() {
      pointLight(250, 250, 250, 0, 0, ground + 30)
     // directionalLight(255, 0, 255, 0.5, 1, -1)
      //drawLight(color(255, 255, 255), createVector(0, 0, 20))
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