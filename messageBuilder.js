/* eslint-disable no-unused-vars */

class MessageBuilder {
    constructor(codeString,
        _OPPONENT,
        _PLAYER_NAME,
        _STAT_TYPE,
        _SUCCESSES,
        _FAILURES,
        _ATTEMPTS,
        _RAW_STAT) {
        this.message = eval(codeString)
    }
}

module.exports = {
    MessageBuilder,
}
