// const x = 'Hello World'
// eval('console.log(x)')
// const _SUCCESSES = 1
// const y = '"❄️".repeat(_SUCCESSES) + "Hello"'
// // const message = new Function(y)()
// const z = eval(y)
// console.log(z)

console.log(removeSuccessFromRaw('3-10'))

function removeSuccessFromRaw(rawStat) {
    const stats = rawStat.split('-')
    stats.forEach((stat, index) => {
        let statNum = Number(stat)
        statNum -= 1
        stats[index] = statNum
    })
    return stats.join('-')
}
