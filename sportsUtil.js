const rp = require('request-promise')

const SeasonType = {
    PreSeason: 1,
    RegularSeason: 2,
    PostSeason: 3,
}

function getCurrentGameID(sport, league, team) {
    return new Promise((resolve, reject) => {
        rp.get(getScheduleURL(sport, league, team, SeasonType.RegularSeason)).then((dataString) => {
            const responseData = JSON.parse(dataString)
            const game = getCurrentGame(responseData.events)
            if (game) {
                resolve(game.id)
            } else {
                resolve(null)
            }
        }).catch((error) => {
            console.log('Error calling schedule API', error)
            reject(new Error('Error calling schedule API'))
        })
    })
}

function getGameStats(gameID, playerID, statType, sport, league, team) {
    const url = getGamecastURL(sport, league, gameID)
    return new Promise((resolve, reject) => {
        rp.get(url).then((dataString) => {
            const gamecastData = JSON.parse(dataString)
            const opponent = getOpponent(gamecastData, team)
            if (gamecastData.boxscore.players) {
                const arrayPosition = getArrayPositionOfStatType(statType, gamecastData)
                const allPlayersStats = gamecastData.boxscore.players.find(
                    teamAndStats => isTeamFollowing(teamAndStats.team, team)
                )
                const playerStats = allPlayersStats.statistics[0].athletes.find(
                    athleteProfile => athleteProfile.athlete.id === playerID
                )
                const stat = playerStats.stats[arrayPosition]
                resolve({
                    stat,
                    opponent,
                })
            } else {
                // As far as I can tell this means game hasn't started yet
                resolve({ stat: null, opponent })
            }
        }).catch((error) => {
            console.log('Error calling gamecast API', error)
            reject(new Error('Error calling gamecast API'))
        })
    })
}

function getOpponent(gamecastData, team) {
    const opponent = gamecastData.boxscore.teams.find(
        teamAndStats => !isTeamFollowing(teamAndStats.team, team)
    )
    return opponent.team
}

function isTeamFollowing(team, followingTeam) {
    return (team.abbreviation === followingTeam || team.id === followingTeam)
}

function getArrayPositionOfStatType(statType, gamecastData) {
    return gamecastData.boxscore.players[0].statistics[0].labels.findIndex(
        label => label === statType
    )
}

function getCurrentGame(events) {
    for (let i = 0; i < events.length; i += 1) {
        if (checkIfDateIsWithin5HoursAndInThePast(events[i].date)) {
            return events[i]
        }
    }
    return null
}

// TODO: Refactor and grab games that are live instead if possible
function checkIfDateIsWithin5HoursAndInThePast(dateString) {
    const currentDate = new Date()
    const dateToTest = new Date(dateString)
    const numOfHours = dateDiffInHours(currentDate, dateToTest)
    // console.log(numOfHours)
    return (numOfHours <= 5 && numOfHours >= 0)
}

function dateDiffInHours(current, test) {
    const MS_PER_HOUR = 1000 * 60 * 60
    return (current - test) / MS_PER_HOUR
}

function getScheduleURL(sport, league, team, seasonType) {
    return `http://site.web.api.espn.com/apis/site/v2/sports/${sport}/${league}/teams/${team}/schedule?region=us&lang=en&seasontype=${seasonType}`
}

function getGamecastURL(sport, league, gameID) {
    return `http://site.web.api.espn.com/apis/site/v2/sports/${sport}/${league}/summary?event=${gameID}&lang=en&region=us&contentorigin=espn`
}

module.exports = { getCurrentGameID, getGameStats, SeasonType }
