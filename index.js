const express = require('express')
const bodyParser = require('body-parser')
const serverless = require('serverless-http')
const rp = require('request-promise')
require('dotenv').config()
const app = express()
app.use(bodyParser.json())
const PORT = 3001
const SCHEDULE_URL = 'http://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/teams/atl/schedule?region=us&lang=en&seasontype='
const PRE_SEASON = '1'
const REGULAR_SEASON = '2'
const POST_SEASON = '3'

getCurrentGameID().then(function(gameID) {
    console.log(gameID)
}).catch(function(error) {
    console.log(error)
})

function getCurrentGameID() {
    return new Promise(function (resolve, reject) {
        rp.get(SCHEDULE_URL + REGULAR_SEASON).then(function (dataString) {
            const responseData = JSON.parse(dataString)
            const game = getCurrentGame(responseData.events)
            if (game) {
                resolve(game.id)
            } else {
                resolve()
            }
        }).catch(function (error) {
            console.log('Error calling schedule API', error)
            reject('Error calling schedule API')
        })
    })
}

function getCurrentGame(events) {
    for (let i = 0; i < events.length; i++) {
        if (checkIfDateIsWithin5Hours(events[i].date)) {
            return events[i]
        }
    }
    return null
}

function checkIfDateIsWithin5Hours(dateString) {
    const currentDate = new Date()
    const dateToTest = new Date(dateString)
    const numOfHours = dateDiffInHours(currentDate, dateToTest)
    return (numOfHours <= 5)
}

// a and b are javascript Date objects
function dateDiffInHours(date1, date2) {
    const MS_PER_HOUR = 1000 * 60 * 60;
    return Math.abs(Math.floor((date1 - date2) / MS_PER_HOUR));
}