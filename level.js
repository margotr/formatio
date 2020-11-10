module.exports = class Level {
    constructor() {
        this.food = []
        this.width = 2000
        this.height = 2000
        this.objects = this.generateWorld(10)
    }
    getall() {
        return this.objects
    }
    update() {
        this.addFood()
    }
    addFood() {
        this.food.push(this.randomPos())
    }
    collide(cell) {
        //if a cell is over a piece of food, the cell can eat it.
        //if a cell collides with an object, 
        //damage is transfered to both parties relative to their types

    }
    generateWorld(objectcount) {
        let objects = []
        for (let i = 0; i < objectcount; i ++) {
            let x = Math.random() * this.width
            let y = Math.random() * this.height
            objects.push(generateTree(x, y))
        }
        return objects
    }
}
function generateTree(x, y) {
    return {x, y, seed: Math.random() * 100000}
}