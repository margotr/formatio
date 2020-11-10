function updateCamera() {
    updatePos()
    camera.focus = createVector(myPos.x - halfScreen().x,
                                myPos.y - halfScreen().y)

}

function getFocus(from) {
        return p5.Vector.sub(from, camera.focus)
}

function updatePos() {
    if (myid !== null) {
        for (let cell of cells) {
        if (cell.owner === myid && cell.type === player) {
            myPos = cell.pos
            break
            } 
        }    
    }
  }

function halfScreen() {
    return createVector(width / 2, height / 2)
}

function inbounds(pos) {
    return (pos.x > 0 && pos.x < windowWidth && pos.y > 0 && pos.y < windowHeight)
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    if (myid) input.initButtons(myWeapons)
    //alert(buttons[0].x + ' ' + buttons[0].y)
  }

class Level {
    constructor(leveldata) {
        console.log(leveldata)
        this.trees = []
        for (let tree of leveldata) {
            this.trees.push(new Tree(tree.x, tree.y, tree.seed))
        }
        console.log(this.trees)
    }
    draw() {
        for (let tree of this.trees) {
            tree.draw()
        }
    }
}

class Tree {
  constructor(x, y, seed) {
    randomSeed(seed)
    this.x = x
    this.y = y
    this.branchcount = 3 + (random() * 4)
    this.branches = this.divideBranches()
  }
  draw() {
    push()
    noStroke()
    fill(90, 60, 0)
    let origin = getFocus(createVector(this.x, this.y))
    circle(origin.x, origin.y, 30)
    for (let b of this.branches) {
      let x = origin.x + b.x
      let y = origin.y + b.y
      strokeWeight(7)
      stroke(90, 60, 0)
      line(origin.x, origin.y, x, y)
      for (let t of b.twigs) {
        line(x, y, x + t.x, y + t.y)
      }
    }
     for (let b of this.branches) {
      let x = origin.x + b.x
      let y = origin.y + b.y
      noStroke()
      fill(0, 255, 0, 255)
      circle(x, y, b.l * 2)
      for (let t of b.twigs) {
        circle(x + t.x, y + t.y, t.l * 2)
      }
    }
    pop()
  }
  divideBranches() {
    let branches = divideAngles(this.branchcount, 0, 0, 30)
    branches.forEach(branch => this.spread(branch))
    //console.log(branches)
    return branches
  }
  spread(branch) {
    let twigamount = Math.round(random() * (branch.l / 10))
    console.log(twigamount)
    branch.twigs = divideAngles(twigamount, 0, 0, branch.l *= 0.6)
  }
}

function divideAngles(amount, startleft, startright, minbranch) {
  let partitions = []
    let total = 0
    for (let i = 0; i < amount; i++) {
      let ratio = random()
      total += ratio
      partitions.push(ratio)
    }
  let piparts = partitions.map(part => 
      map(part, 0, total, 0, Math.PI * 2 - (startleft + startright)))
  let branches = []
  let a = startleft
    for (let p of piparts) {
      a += p
      let l = minbranch + (random() * 20)
      let x = Math.cos(a) * l
      let y = Math.sin(a) * l
      branches.push({a, l, x, y, twigs: []})
    }
  return branches
}









function Environment() {
    this.draw = function() {
        background(bg)
        this.drawCircle(createVector(0, 0), color(255, 255, 255))
        this.drawGrid(25)
        this.drawEvents()
    }

    this.drawCircle = function(pos, color) {
        let p = getFocus(pos)
        //console.log(p, camera.focus, pos)
        if (inbounds(p)) {
            push()
            fill(color)
            circle(p.x, p.y, 30)
            pop()
        }
    }
    this.drawEvents = function() {
        for (let e of events) {
            this.drawCircle(createVector(e.p1.x, e.p1.y), color(255, 0, 0, 100))
            this.drawCircle(createVector(e.p2.x, e.p2.y), color(0, 255, 0, 100))
        }
    }
    this.drawGrid = function(spacing) {
        let start = (myPos) ? p5.Vector.sub(myPos, halfScreen()) : halfScreen()
        let leftover = createVector(start.x % spacing, start.y % spacing)
        let roundedstart = p5.Vector.sub(start, leftover)
        let p = getFocus(roundedstart)
        let fourline = createVector(roundedstart.x % (spacing * 4), roundedstart.y % (spacing * 4))
        
        push()
        textAlign(CENTER)
        fill(255)
            for (let x = p.x, i = fourline.x / spacing; x < p.x + width; x+= spacing, i++) {
                if (i % 4 === 0) {
                    let pos = start.x + x
                    stroke(255, 0, 0, 100)
                    text(Math.round(pos), x, 50)
                } else {
                    stroke(255, 255, 255, 100)
                }
                line(x, 0, x, height)
            }
            for (let y = p.y, i = fourline.y / spacing; y < p.y + height; y+= spacing, i++) {
                if (i % 4 === 0) {
                    let pos = start.y + y
                    stroke(255, 0, 0, 100)
                    text(Math.round(pos), 50, y)
                } else {
                    stroke(255, 255, 255, 100)
                }
                line(0, y, width, y)
            }
        pop()
    }
}
