const _ = require('lodash')

function getDifferences(oldStats, newStats) {
    /*
    Currently there is no way to tell what happened in between pollings.
    This means that if a person was to make a shot and miss a shot inbetween pollings,
    then we don't know which happened first.
    Therefor at this moment this code will just send back the difference between the two
    */

    if (_.isEqual(oldStats, newStats)) {
        return null
    }
    let {
        successes: oldSuccesses,
        failures: oldFailures,
        attempts: oldAttempts,
    } = oldStats
    const {
        successes: newSuccesses,
        failures: newFailures,
        attempts: newAttempts,
    } = newStats
    if (!oldSuccesses) {
        oldSuccesses = 0
    }
    if (!oldFailures && newFailures) {
        oldFailures = 0
    }
    if (!oldAttempts && newAttempts) {
        oldAttempts = 0
    }
    const statValuesOutput = new StatValues(
        newSuccesses - oldSuccesses,
        newFailures - oldFailures,
        newAttempts - oldAttempts
    )
    return statValuesOutput
}

function getStatValuesFromRaw(stat) {
    if (!stat) return stat
    const rawStats = new StatValues()
    if (stat.includes('-')) {
        // Stat can have success and failure (Makes/Misses or Completions/Incompletions)
        const stats = stat.split('-')
        const [
            successes,
            attempts,
        ] = stats
        rawStats.successes = successes
        rawStats.attempts = attempts
        rawStats.failures = attempts - successes
    } else {
        // Stat only increases singularly (Rebounds, Assists, Touchdowns, Fumbles)
        rawStats.successes = stat
    }
    return rawStats
}

function getStatValueDifference(oldRawStats, newRawStats) {
    let oldStatValues = getStatValuesFromRaw(oldRawStats)
    let newStatValues = getStatValuesFromRaw(newRawStats)
    if (!oldStatValues) { oldStatValues = {} }
    if (!newStatValues) { newStatValues = {} }
    const statDifferences = getDifferences(oldStatValues, newStatValues)
    return statDifferences
}

class StatValues {
    constructor(successes, failures, attempts) {
        this.successes = Number(successes)
        this.failures = Number(failures)
        this.attempts = Number(attempts)
    }
}

module.exports = {
    getStatValueDifference,
    getStatValuesFromRaw,
}
