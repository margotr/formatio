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