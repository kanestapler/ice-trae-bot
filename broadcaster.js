const rp = require('request-promise')

const {
    API_TOKEN,
    BROADCAST_URL,
} = process.env

function broadcast(twitterAccessToken, twitterAccessTokenSecret, message) {
    const options = {
        method: 'POST',
        uri: `${BROADCAST_URL}/broadcast`,
        body: {
            twitterAccessToken,
            twitterAccessTokenSecret,
            apiToken: API_TOKEN,
            message,
        },
        json: true,
    }
    console.log(options)
    return rp(options)
}

module.exports = {
    broadcast,
}
