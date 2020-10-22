//Environment constants:
const TENLINE = 2 //width of fat lines
const NORMALLINE = 1 //width of thin lines
const INVERTED = -1 //invert the Y axis

let FACTOR = 30 //target amount of grids 

let scrollamount = 0

class Environment {
  constructor() {
   this.centerWindow = createVector(width / 2, height / 2); // the center of our screen
   this.focus = createVector(mouseX, mouseY); //where we are focused
    
   this.lastscroll = 0 //for keeping track of scrolling
    
    //Environment variables:
    this.BACKGROUND_COLOR = color(255, 255, 255); //sort of blue
    //this.BACKGROUND_COLOR = color(255, 255, 255); //white
    this.LINECOLOR = color(100, 100, 100, 100); //white with some alpha
    this.POSITIVE = color(0, 255, 0)
    this.NEGATIVE = color(255, 0, 0)
    
    this.zoomFactor = 0.05;
    
    this.maximumZoom = 10000000; //100 pixels per meter
    this.minimumZoom = 20; //0.1 pixel per meter
    this.factor = 1;
    this.defaultGrids = width / FACTOR
    this.pos = createVector(this.defaultGrids / 2, (height / FACTOR) / 2)
    this.bigPos = createVector(0, 0)
  }
  
  drawBlocks() {
   //draw the number positions
    //print(this.bigPos.x + ", " + this.bigPos.y);
    let x = this.bigPos.x * -1;
    let y = this.bigPos.y * -1;
    let xVal = this.pos.x * -1; //x as small pos
    let yVal = this.pos.y * -1;
    let mostRight = xVal + (width / FACTOR);
    let mostBottom = yVal + (height / FACTOR);
    //print(yVal + ", " + mostBottom);
    let totalMeters = (width > height ? width / FACTOR : height / FACTOR);
    
    if (totalMeters > this.defaultGrids * this.factor) {
      //print("bigger than default");
      while(totalMeters > this.defaultGrids * this.factor) {
        //print("looping");
      this.factor *= 2;
      }
    } else if (totalMeters < this.defaultGrids * this.factor) {
      while(totalMeters < this.defaultGrids * this.factor) {
        this.factor *= 0.5;
      }
    }

    let grid = this.factor * 4; //a grid is 4x4
    
    let startx = -grid; //start going off screen
    let xMod = xVal % grid; //how much is leftover
    let xs = xVal > 0 ? -xMod : -xMod - grid; //subtract and get the real first grid
    
    //print(xs + ", ", + xVal + ", " + pos.x);
    let starty = - grid;
    let yMod = yVal % grid;
    let ys = yVal > 0 ? -yMod : -yMod - grid;
    
    //print(xs, ys, this.factor, totalMeters, grid);
    for (let i = xs; i < totalMeters; i += grid) {
      for (let j = ys; j < totalMeters; j+= grid) {
     this.drawBlock(i, j, grid)
      }
    }
    
    let n_after_c = floor(FACTOR).toString().length - 1
    n_after_c = n_after_c > 0 ? n_after_c : 0
    
    push()
    textSize(12); //reset the font size
    noStroke(); //reset stroke
    //textStyle(ITALIC);
    fill(0);
    //xs = start position of number 1
    let boundary = 12; //minimum amount of space we want to give our scalar
    let Y = this.bigPos.y + boundary
      if (Y < boundary) {
        Y = boundary;
      } else if (Y > height - boundary) {
        Y = height - boundary
      }
    
    for (let i = xs; i < totalMeters; i+= grid) {
      let val = xVal + i
      
      text(val.toFixed(n_after_c), i * FACTOR, Y)
    }
    let X = this.bigPos.x - boundary
    if (X < boundary) {
     X = boundary
    } else if (X > width - boundary * 3) {
      X = width - boundary * 3
    }
    for (let i = ys; i < totalMeters; i+= grid) {
      //circle(i * PPM, 20, 20);
      let val = yVal + i
      fill(0)
      text((val * INVERTED).toFixed(n_after_c), X, i * FACTOR)
    }
    pop()
  }
  drawBlock(x, y, grid) {
    //x, y, grid is the width
    push()
    noFill()
    strokeWeight(TENLINE)
    stroke(this.LINECOLOR)
    rect(x * FACTOR, y * FACTOR, grid * FACTOR, grid * FACTOR) //boundary edge:
    strokeWeight(NORMALLINE)
    let firstLine = x + this.factor; //shift one line right
    //vertical grid
    for(let i = x + this.factor; i < x + grid; i += this.factor) {
     line(i * FACTOR, y * FACTOR, i * FACTOR, (y + grid) * FACTOR); 
    }
    //horizontal grid
    for(let i = y + this.factor; i < y + grid; i += this.factor) {
      line(x * FACTOR, i * FACTOR, (x + grid) * FACTOR, i * FACTOR);
    }
  pop();
    //line
  }
  drawBackground() {
   push();
    noStroke();
    fill(this.BACKGROUND_COLOR);
    rect(0, 0, width, height);
   pop();
  }
  
  drawZero() {
   push();
   strokeWeight(TENLINE);
   //horizontals
   stroke(this.NEGATIVE); //RED, for negative direction (from 0,0)
   line(0, this.bigPos.y, this.bigPos.x, this.bigPos.y);
   stroke(this.POSITIVE); //GREEN, for positive direction
   line(this.bigPos.x, this.bigPos.y, width, this.bigPos.y);
   //verticals
   stroke(INVERTED === 1 ? this.NEGATIVE : this.POSITIVE);
   line(this.bigPos.x, 0, this.bigPos.x, this.bigPos.y);
   stroke(INVERTED === 1 ? this.POSITIVE : this.NEGATIVE);
   line(this.bigPos.x, this.bigPos.y, this.bigPos.x, height);
    
   //actual zero: yellow
   if (this.bigPos.x !== null && this.bigPos.y !== null) {
   fill(255,255, 0);
   noStroke();
   rect(this.bigPos.x-TENLINE / 2, this.bigPos.y-TENLINE / 2, TENLINE, TENLINE);
   }
   pop();
  }
  
  updateFocus(pos) {
    //get's how much we have to move over the canvas based on how much we are zoomed in
    this.pos.x += pos.x / FACTOR;
    this.pos.y += pos.y / FACTOR;
    this.bigPos.x = this.pos.x * FACTOR;
    this.bigPos.y = this.pos.y * FACTOR;
  }
  updateZoom() {
  
    let preZoom = this.getFocus();
    //now apply our zoom
    FACTOR += ((this.lastscroll - scrollamount) * this.zoomFactor * (FACTOR / 40));
     //reset our scroll
    this.lastscroll = scrollamount;
    //keep it in bounds
    FACTOR = constrain(FACTOR, this.minimumZoom, this.maximumZoom)
    
    let offset = this.getFocus().sub(preZoom)
    
    this.pos.add(offset);
    
    this.bigPos.x = this.pos.x * FACTOR;
    this.bigPos.y = this.pos.y * FACTOR;
  }
  getFocus() {
    return createVector((mouseX / FACTOR) - this.pos.x, (mouseY / FACTOR) - this.pos.y);
  }
  update() {
    cursor(ARROW)
    this.updateZoom()
    if (mouseIsPressed && mouseButton === LEFT) { 
      this.updateFocus(createVector(mouseX - pmouseX, mouseY - pmouseY))
      cursor('grab');
      }
  }
  draw() {
    this.update();
    this.drawBackground();  
    this.drawBlocks()
    this.drawZero()
    this.showPosition()
  }
  showPosition() {
   if (keyIsDown(SHIFT)) {
     let n_after_c = floor(FACTOR).toString().length - 1
     let pos = this.getFocus()
     push()
    text('(' + pos.x.toFixed(n_after_c) + ',' + 
         (pos.y * INVERTED).toFixed(n_after_c) + ')', mouseX, mouseY)
     pop()
    // print('min',this.getBounds().min, 'max',this.getBounds().max);
   }
  }
  getBounds() {
    if (INVERTED === 1) 
      return({"min": createVector(this.pos.x * -1, this.pos.y * -1), 
              "max":(createVector(this.pos.x * -1 + width / FACTOR, 
              (this.pos.y * -1 + height / FACTOR)))})
    
     else 
       return({"max":(createVector(this.pos.x * -1 + width / FACTOR, this.pos.y)),
               "min": createVector(this.pos.x * -1,                                                    (this.pos.y * -1 + height / FACTOR) * -1)})
  }
  getPos(pos) {
    //say, I have something at 4, 4, where is this on the canvas?
    return (createVector((pos.x + this.pos.x) * FACTOR, 
                        ((pos.y * INVERTED) + this.pos.y) * FACTOR))
  }
  getX(x) {
    return (x + this.pos.x) * FACTOR
  }
  getY(y) {
    return (y) * FACTOR
  }
  getFactor() {
    return FACTOR
  }
  //returns the closest gridPoint to the value
  getClosestGrid(pos) {
    //to do this we need to know our mouse position
    let both = this.pos || this.getFocus()
    let s = this.factor
    let x = both.x / this.factor
    let y = both.y / this.factor
    
    x = round(x)
    y = round(y)
    x *= this.factor
    y *= this.factor
    return createVector(x, y)
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseWheel() {
  scrollamount += event.delta
}



