const winter = {
    name: 'winter',
    temp: -15,
    daystart: 10,
    dayend: 18
}
const spring = {
    name: 'spring',
    temp: 15,
    daystart: 8,
    dayend: 20
}
const summer = {
    name: 'summer',
    temp: 40,
    daystart: 6,
    dayend: 22
}
const fall = {
    name: 'fall',
    temp: 15,
    daystart: 8,
    dayend: 20
}

const seasons = [winter, spring, summer, fall]
const daylength = 120 * 34 //target = 2 minute days = 120 seconds
const seasonlength = 10 //a season is 10 days

const daytemperature = 10 //could be perlin noise
const nighttemperature = -10

module.exports = class World {
    constructor() {
        this.time = 0
        this.date = 0
        this.year = 0
        this.temp = seasons[0].temp
        this.seasoncov = this.getSeasonCov()
        this.day = {start: seasons[0].daystart, end: seasons[0].dayend}
    }
    getWorld() {
        let temperature = getTemperature()
        return {
            time: this.time, 
            temperature: temperature, 
            season: this.seasoncov.current
        }
    }
    getSeasonCov() {
        let index = this.getSeasonIndex()
        let previndex = (index + (seasons.length - 1)) % seasons.length
        let nextindex = (index + 1) % seasons.length
        let previous = {
            season: seasons[previndex],
            daysoff: this.getDaysOff(previndex)
        }
        let current = {
            season: seasons[index],
            daysoff: this.getDaysOff(index)
        }
        let next = {
            season: seasons[nextindex],
            daysoff: this.getDaysOff(nextindex)
        }
        //if (current.daysoff == 35) console.log(this.date)
        return {
           previous, current, next
        }
    }
    getDaysOff(index) {
        if (this.date >= seasonlength * seasons.length - (seasonlength / 2)) 
            return this.date - seasons.length * seasonlength
        else
            return this.date - index * seasonlength
    }
    getSeasonIndex() {
        return Math.round(this.date / seasonlength) % seasons.length
    }
    getDay() {
        let cov = this.seasoncov
        //console.log(cov)
        //how many days are we off? 
        let start_diff = Math.abs(cov.previous.season.daystart - cov.current.season.daystart) // 8 - 10  = -2
        start_diff *= (cov.current.daysoff) / (seasonlength)
        start_diff *= (this.date > (seasons.length * seasonlength) / 2) ? -1 : 1
        let end_diff = Math.abs(cov.previous.season.dayend - cov.current.season.dayend) //18 - 20 == -2
        end_diff *= (cov.current.daysoff / seasonlength)
        end_diff *= (this.date > (seasons.length * seasonlength) / 2) ? -1 : 1
        return {
            start: cov.current.season.daystart - start_diff,
            end: cov.current.season.dayend + end_diff
        }
    }
    isDay() {
        let time = (this.time / daylength) * 24
        return (time > this.day.start && time < this.day.end)
    }
    getTemperature() {
        return this.temp
    }
    calcTemp() {
        let season = this.seasoncov.current.season
        let isday = this.isDay()
        let target = (season.temp + (isday ? daytemperature : nighttemperature))
        let diff = target - this.temp
        this.temp += (diff / 500)
    }
    run() {
        this.time ++
        this.calcTemp()
        if (this.time > daylength) {
            this.date ++
            this.time = 0
            this.seasoncov = this.getSeasonCov()
            this.day = this.getDay()
            //console.log(this.day)
        }
        if (this.date >= seasonlength * seasons.length)
        {
            this.year ++
            this.date = 0
        }
    }
}

function map(value, v_min, v_max, out_min, out_max) {
    let d1 = v_max - v_min
    let d2 = out_max - out_min
    return value * (d2 / d1)
}