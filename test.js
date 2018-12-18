const fs = require('fs')

const rawdata = fs.readFileSync('beforeGameStart.json')
const student = JSON.parse(rawdata)
console.log(student.boxscore)
