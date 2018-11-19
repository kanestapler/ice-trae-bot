const dynamo = require('dynamodb')
const Joi = require('joi')

dynamo.AWS.config.update({ region: 'us-east-1' })

const playerID = '4277905'
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

dynamo.createTables((err) => {
    if (err) {
        console.log(err)
    } else {
        const trae = new Player({
            AccessToken: 'Insert Twitter bots token',
            AccessTokenSecret: 'Insert Twitter bots token secret',
            League: 'nba',
            PlayerID: playerID,
            PlayerName: 'Trae Young',
            SlackWebHook: 'Insert Slack hook here',
            Sport: 'basketball',
            Team: 'ATL',
            Games: {},
        })
        trae.save((error) => {
            if (error) {
                console.log(error)
            }
        })
    }
})
