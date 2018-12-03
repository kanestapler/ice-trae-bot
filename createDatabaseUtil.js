const dynamo = require('dynamodb')
const PlayerObject = require('./Player')

dynamo.AWS.config.update({ region: 'us-east-1' })

const Player = dynamo.define('ice-trae-bot-test', PlayerObject.PlayerObject)

// eslint-disable-next-line no-unused-vars
function createTable() {
    dynamo.createTables((err) => {
        if (err) {
            console.log(err)
        }
    })
}
// createTable()

// eslint-disable-next-line no-unused-vars
function createPlayer() {
    const trae = new Player({
        AccessToken: '1054466232223621120-OOv5FZeLOwoSZYZu3Zc8chxndmuhUN',
        AccessTokenSecret: 'CCz2fCJsxtbNcQJzUtO4v6wzNEcLoezI6OZUeVfgecYQZ',
        League: 'nba',
        PlayerID: '4277905',
        PlayerName: 'Trae Young',
        // SlackWebHook: '',
        Sport: 'basketball',
        Team: 'ATL',
        Games: {},
        StatLabel: '3PT',
        GameStartMessage: '"Ice Trae Ready #BeatThe" + _OPPONENT + " #TrueToAtlanta"',
        NewSuccessMessage: '"❄️".repeat(_SUCCESSES)',
        NewFailureMessage: '"🛑".repeat(_FAILURES)',
    })
    trae.save((error) => {
        if (error) {
            console.log(error)
        }
    })
}
// createPlayer()
