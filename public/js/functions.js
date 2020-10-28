//random functions meant for general in game purposes
function mousePressed() {
    let fsswitch= fsbutton.check()
    if (fsswitch) 
    {
    let fs = fullscreen()
    fullscreen(!fs)
    }
}

function isClose(a, b) {
    return (dist(a.x, a.y, b.x, b.y) < 100)   
}

function Circle(x, y, z, radius) {
beginShape()
for (let a = 0; a < 2 * PI; a+= 0.4) {
    let x1 = x + (radius * cos(a))
    let x2 = y + (radius * sin(a))
    vertex(x1, x2, z)
}
endShape()
}

function Rect(x, y, w, h, z) {
    beginShape()
    vertex(x,y,z)
    vertex(x + w, y,z)
    vertex(x + w, y + h,z)
    vertex(x, y + h, z)
    endShape()
}

function FillLine(x1, y1, z1, x2, y2, z2) {
    beginShape()
   if (x1 == x2) {
        vertex(x1 - 1, y1 - 1, z1)
        vertex(x1 + 1, y1 - 1, z1)
        vertex(x2 + 1, y2 + 1, z2)
        vertex(x2 -1, y2 + 1, z2)
    } else {
        vertex(x1 - 1, y1 - 1, z1)
        vertex(x2 + 1, y2 - 1, z2)
        vertex(x2 + 1, y2 + 1, z2)
        vertex(x1 -1, y1 + 1, z1)
    }
    endShape()
}

function drawLight(color, pos) {
    let p = getFocus(pos)
    push()
    pointLight(color, p.x, p.y, pos.z)
    pop()
}