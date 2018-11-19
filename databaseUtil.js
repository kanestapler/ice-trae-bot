const dynamo = require('dynamodb')
const Joi = require('joi')
require('dotenv').config()

dynamo.AWS.config.update({ region: 'us-east-1' })

const Player = dynamo.define('ice-trae-bot-test', {
    hashKey: 'PlayerID',
    timestamps: true,
    schema: {
        PlayerID: Joi.string(),
        AccessToken: Joi.string(),
        AccessTokenSecret: Joi.string(),
        Games: Joi.object(),
        League: Joi.string(),
        PlayerName: Joi.string(),
        SlackWebHook: Joi.string(),
        Sport: Joi.string(),
        Team: Joi.string(),
    },
})

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

getPlayer('4277905').then((player) => {
    updatePlayerStatInfo(player, '8888', null)
})

module.exports = {
    getPlayer,
    updatePlayerStatInfo,
}
