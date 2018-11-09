const AWS = require('aws-sdk')
require('dotenv').config()

AWS.config.update({ region: 'us-east-1' })
const ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' })

getPlayer('4277905').then((data) => {
    console.log(JSON.stringify(data))
})
function getPlayer(playerName) {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            PlayerID: { S: playerName },
        },
    }
    return new Promise((resolve, reject) => {
        ddb.getItem(params, (err, data) => {
            if (err) {
                reject(new Error(err))
            } else {
                resolve(data.Item)
            }
        })
    })
}

function updateItemInDB(playerTable, gameID, stat) {
    const newGamesMap = playerTable.Games.M
    newGamesMap[gameID] = stat
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            PlayerID: { S: playerTable.PlayerID.S },
        },
        ExpressionAttributeNames: {
            '#G': 'Games',
        },
        ExpressionAttributeValues: {
            ':g': {
                M: newGamesMap,
            },
        },
        UpdateExpression: 'SET #G = :g',
    }
    return new Promise((resolve, reject) => {
        ddb.updateItem(params, (err, data) => {
            if (err) {
                reject(new Error(err))
            } else {
                resolve(data)
            }
        })
    })
}

module.exports = { updateItemInDB, getPlayer }
