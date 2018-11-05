
const rp = require('request-promise')
require('dotenv').config()
const PRE_SEASON = '1'
const REGULAR_SEASON = '2'
const POST_SEASON = '3'

function runPoller() {
    getCurrentGameID().then(function (gameID) {
        if (gameID) {
            getMadeShots(gameID, process.env.STAT_LABEL).then(function (gameData) {
                console.log(`Has made: ${gameData.numberOfMadeShots} ${process.env.STAT_LABEL} againt the ${gameData.opponent}`)
                tellValidatorShotsMade(gameID, gameData.numberOfMadeShots, gameData.opponent).then(function (response) {
                    console.log('Success to vali')
                }).catch(function (error) {
                    console.log('Error calling vali', error)
                })
            }).catch(function (error) {
                console.log('Error getting shots made from gameID', error)
            })
        } else {
            console.log('No Active Game')
        }
    }).catch(function (error) {
        console.log(error)
    })
}

function tellValidatorShotsMade(gameID, amount, opponent) {
    const options = {
        method: 'POST',
        uri: process.env.VALIDATOR_URL,
        body: {
            shots: amount,
            gameID: gameID.toString(),
            opponent: opponent,
            token: process.env.API_TOKEN
        },
        json: true // Automatically stringifies the body to JSON
    }
    return rp.post(options)
}

function getMadeShots(gameID, shotType) {
    const url = getGamecastURL(gameID)
    return new Promise(function (resolve, reject) {
        rp.get(url).then(function (dataString) {
            const gamecastData = JSON.parse(dataString)
            const opponentName = getOpponentName(gamecastData)
            if (gamecastData.boxscore.players) {
                const arrayPosition = getArrayPosition(shotType, gamecastData)
                const allPlayersStats = gamecastData.boxscore.players.find(function (teamAndStats) {
                    return isTeamFollowing(teamAndStats.team)
                })
                const playerStats = allPlayersStats.statistics[0].athletes.find(function (athleteProfile) {
                    return athleteProfile.athlete.id === process.env.PLAYER_ID
                })
                const shotStats = playerStats.stats[arrayPosition]
                resolve({ numberOfMadeShots: getMadeShotsFromString(shotStats), opponent: opponentName })
            } else {
                // As far as I can tell this means game hasn't started yet
                resolve({ numberOfMadeShots: '0', opponent: opponentName })
            }
        }).catch(function (error) {
            console.log('Error calling gamecast API', error)
            reject('Error calling gamecast API')
        })
    })
}

function getMadeShotsFromString(shotStats) {
    return shotStats.split('-')[0]
}

function getArrayPosition(shotType, gamecastData) {
    return gamecastData.boxscore.players[0].statistics[0].labels.findIndex(function (label) {
        return label === shotType
    })
}

function getCurrentGameID() {
    return new Promise(function (resolve, reject) {
        rp.get(getScheduleURL()).then(function (dataString) {
            const responseData = JSON.parse(dataString)
            const game = getCurrentGame(responseData.events)
            if (game) {
                resolve(game.id)
            } else {
                resolve('401070809')
            }
        }).catch(function (error) {
            console.log('Error calling schedule API', error)
            reject('Error calling schedule API')
        })
    })
}

function getCurrentGame(events) {
    for (let i = 0; i < events.length; i++) {
        if (checkIfDateIsWithin5HoursAndInThePast(events[i].date)) {
            return events[i]
        }
    }
    return null
}

function checkIfDateIsWithin5HoursAndInThePast(dateString) {
    const currentDate = new Date()
    const dateToTest = new Date(dateString)
    const numOfHours = dateDiffInHours(currentDate, dateToTest)
    //console.log(numOfHours)
    return (numOfHours <= 5 && numOfHours >= 0)
}

// a and b are javascript Date objects
function dateDiffInHours(current, test) {
    const MS_PER_HOUR = 1000 * 60 * 60
    return (current - test) / MS_PER_HOUR
}

function getOpponentName(gamecastData) {
    const opponent = gamecastData.boxscore.teams.find(function (teamAndStats) {
        return !isTeamFollowing(teamAndStats.team)
    })
    return opponent.team.name
}

function isTeamFollowing(team) {
    const followingTeam = process.env.TEAM
    return (team.abbreviation === followingTeam || team.id === followingTeam)
}

function getScheduleURL() {
    const sport = process.env.SPORT
    const league = process.env.LEAGUE
    const team = process.env.TEAM
    return `http://site.web.api.espn.com/apis/site/v2/sports/${sport}/${league}/teams/${team}/schedule?region=us&lang=en&seasontype=${REGULAR_SEASON}`
}

function getGamecastURL(gameID) {
    const sport = process.env.SPORT
    const league = process.env.LEAGUE
    return `http://site.web.api.espn.com/apis/site/v2/sports/${sport}/${league}/summary?event=${gameID}&lang=en&region=us&contentorigin=espn`
}

module.exports.handler = runPoller