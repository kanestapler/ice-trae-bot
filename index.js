require('dotenv').config()
const SportsUtil = require('./sportsUtil')
const DatabaseUtil = require('./databaseUtil')
const PlayerUtil = require('./playerUtil')
const BroadcastUtil = require('./broadcastUtil')

const {
    PLAYER_ID,
} = process.env

function runPoller() {
    DatabaseUtil.getPlayer(PLAYER_ID).then((playerItem) => {
        const {
            Games,
            League,
            Team,
            Sport,
            StatLabel,
        } = playerItem
        SportsUtil.getCurrentGameID(Sport, League, Team).then((gameID) => {
            if (gameID) {
                SportsUtil.getGameStats(gameID, PLAYER_ID, StatLabel, Sport, League, Team)
                    .then((gameData) => {
                        if (gameID in Games) {
                            const statDifferences = PlayerUtil.getStatValueDifference(Games[gameID], gameData.stat)
                            if (statDifferences) { // Something needs to update
                                BroadcastUtil.broadcastStats(playerItem, statDifferences, gameData.stat, gameData.opponent.name)
                                DatabaseUtil.updatePlayerStatInfo(playerItem, gameID, gameData.stat) // Update the database with the new stats
                            } else { // No change. Do nothing
                            }
                        } else { // Game just started
                            DatabaseUtil.updatePlayerStatInfo(playerItem, gameID, null) // Add game to database
                            BroadcastUtil.broadcastGamestart(playerItem, gameData.opponent.name)
                        }
                    }).catch((error) => {
                        console.log('Error getting shots made from gameID', error)
                    })
            } else {
                console.log('No Active Game')
            }
        }).catch((error) => {
            console.log('Error getting current gameID', error)
        })
    }).catch((error) => {
        console.log('Error getting database item', error)
    })
}

module.exports.handler = runPoller
