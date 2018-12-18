const Joi = require('joi')

const PlayerObject = {
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
        StatLabel: Joi.string(),
        GameStartMessage: Joi.string(),
        NewSuccessMessage: Joi.string(),
        NewFailureMessage: Joi.string(),
    },
}

module.exports = {
    PlayerObject,
}
