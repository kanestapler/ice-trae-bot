const rp = require('request-promise')
require('dotenv').config()
const SportsUtil = require('./sportsUtil')

function runPoller() {
    SportsUtil.getCurrentGameID(sport, league, team).then((gameID) => {
        if (gameID) {
            SportsUtil.getGameStats(gameID, playerID, process.env.STAT_LABEL, sport, league).then((gameData) => {
                console.log(`Has made: ${gameData.numberOfMadeShots} ${process.env.STAT_LABEL} againt the ${gameData.opponent}`)
                tellValidatorShotsMade(gameID, gameData.numberOfMadeShots, gameData.opponent)
                    .then(() => {
                        console.log('Success to vali')
                    }).catch((error) => {
                        console.log('Error calling vali', error)
                    })
            }).catch((error) => {
                console.log('Error getting shots made from gameID', error)
            })
        } else {
            console.log('No Active Game')
        }
    }).catch((error) => {
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
            opponent,
            token: process.env.API_TOKEN,
        },
        json: true, // Automatically stringifies the body to JSON
    }
    return rp.post(options)
}

module.exports.handler = runPoller
