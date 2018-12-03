const DatabaseUtil = require('./databaseUtil')
const PlayerUtil = require('./playerUtil')
const MessageBuilder = require('./messageBuilder')
const Broadcaster = require('./broadcaster')

function broadcastStats(playerItem, statDifference, rawStat, opponent) {
    // console.log(playerItem)
    // console.log(statDifference)
    let successBroadcastArray = []
    let failureBroadcastArray = []
    if (needToBroadcastSuccess(playerItem.NewSuccessMessage, statDifference.successes)) {
        let currentRawStat = rawStat
        const backwardsMessageArray = []
        for (let i = 0; i < statDifference.successes; i += 1) {
            backwardsMessageArray.push(getMessage(
                playerItem,
                opponent,
                currentRawStat,
                playerItem.NewSuccessMessage
            ))
            currentRawStat = removeSuccessFromRaw(currentRawStat)
        }
        successBroadcastArray = backwardsMessageArray.reverse()
    }
    if (needToBroadcastFailure(playerItem.NewFailureMessage, statDifference.failures)) {
        let currentRawStat = rawStat
        const backwardsMessageArray = []
        for (let i = 0; i < statDifference.failures; i += 1) {
            backwardsMessageArray.push(getMessage(
                playerItem,
                opponent,
                currentRawStat,
                playerItem.NewFailureMessage
            ))
            currentRawStat = removeFailureFromRaw(currentRawStat)
        }
        failureBroadcastArray = backwardsMessageArray.reverse()
    }
    broadcastArray(playerItem.AccessToken, playerItem.AccessTokenSecret, successBroadcastArray)
    broadcastArray(playerItem.AccessToken, playerItem.AccessTokenSecret, failureBroadcastArray)
}

async function broadcastArray(accessToken, accessTokenSecret, array) {
    for (let i = 0; i < array.length; i += 1) {
        await Broadcaster.broadcast(accessToken, accessTokenSecret, array[i])
    }
}

function removeSuccessFromRaw(rawStat) {
    const stats = rawStat.split('-')
    stats.forEach((stat, index) => {
        let statNum = Number(stat)
        statNum -= 1
        stats[index] = statNum
    })
    return stats.join('-')
}

function removeFailureFromRaw(rawStat) {
    const stats = rawStat.split('-')
    let statNum = Number(stats[stats.length - 1])
    statNum -= 1
    stats[stats.length - 1] = statNum
    return stats.join('-')
}

function broadcastGamestart(playerItem, opponent) {

}

function getMessage(playerItem, opponent, rawStat, codeString) {
    const stats = PlayerUtil.getStatValuesFromRaw(rawStat)
    const MB = new MessageBuilder.MessageBuilder(
        codeString,
        opponent,
        playerItem.PlayerName,
        playerItem.StatLabel,
        stats.successes,
        stats.failures,
        stats.attempts,
        rawStat
    )
    return MB.message
}

function needToBroadcastSuccess(successMessage, successes) {
    return (successMessage && successes > 0)
}

function needToBroadcastFailure(failureMessage, failures) {
    return (failureMessage && failures > 0)
}

DatabaseUtil.getPlayer('4277905').then((playerItem) => {
    const statDifference = PlayerUtil.getStatValuesDifferencesBetween('0-1', '3-6')
    broadcastStats(playerItem, statDifference, '3-6', 'Warriors')
})

module.exports = {
    broadcastStats,
    broadcastGamestart,
}
