const dynamo = require('dynamodb')
const PlayerObject = require('./Player')

dynamo.AWS.config.update({ region: 'us-east-1' })
const Player = dynamo.define('ice-trae-bot-test', PlayerObject.PlayerObject)

function getPlayer(playerID) {
    return new Promise((resolve, reject) => {
        Player.get(playerID, (err, player) => {
            if (err) {
                reject(new Error(err))
            } else {
                resolve(player.attrs)
            }
        })
    })
}

function updatePlayerStatInfo(playerItem, gameID, stat) {
    const newGamesMap = playerItem.Games
    newGamesMap[gameID] = stat
    Player.update({
        PlayerID: playerItem.PlayerID,
        Games: newGamesMap,
    }, (err, player) => {
        if (err) {
            console.log(err)
        } else {
            console.log(player)
        }
    })
}

// getPlayer('4277905').then((player) => {
//     updatePlayerStatInfo(player, '8888', '0-1')
// })

module.exports = {
    getPlayer,
    updatePlayerStatInfo,
}
