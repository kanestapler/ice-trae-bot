const AWS = require('aws-sdk')

AWS.config.update({ region: 'us-east-1' })
const ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' })

let playerItem = {}

// Get player from environment variable
// Store data in playerItem
// Get schedule using data from player
// Is there a game right now
    // Get gamecast data
    // Is the game in the database already
        // Is there a difference between gamecast and table stats
            // Form an array of the difference (example: gamecast = 1 and table = 3. Array=[2,3])
            // Tweet the array. In sequence if possible
            // Update the table with the new value. Don't forget to include all Games
        // else
            // Nothing new to update. END
    // Else
        // Tweet game starting
        // Update the table with the new value. Don't forget to include all Games
// No game
    // END

updateItemInDB()
function updateItemInDB(gameID, stat) {
    const params = {
        TableName: 'ice-trae-bot-test',
        Key: {
            Player: { S: 'Trae Young' },
        },
        ExpressionAttributeNames: {
            '#G': 'Games',
        },
        ExpressionAttributeValues: {
            ':g': {
                M: {
                    123: { S: '5' },
                    456: { S: '0' },
                    789: { S: '1' },
                },
            },
        },
        UpdateExpression: 'SET #G = :g',
    }

    ddb.updateItem(params, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
        }
    })
}
