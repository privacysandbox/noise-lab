import laplace from '@stdlib/random-base-laplace'

export function getScalingFactorForMetric(
    metric,
    totalNumberOfMetrics,
    contributionBudget
) {
    const budgetPerMetric = Math.floor(
        contributionBudget / totalNumberOfMetrics
    )
    const scalingFactorForThisMetric = Math.floor(
        budgetPerMetric / metric.maxValue
    )
    return scalingFactorForThisMetric
}

export function getRandomLaplacianNoise(budget, epsilon) {
    // Laplace parameters
    const mu = 0
    const b = Math.floor(budget / epsilon)
    const randomLaplacianNoise = Math.floor(laplace(mu, b))
    return randomLaplacianNoise
}

export function calculateNoisePercentage(noise, noisyAggregatedValue) {
    return Number.parseFloat(
        (Math.abs(noise / noisyAggregatedValue) * 100).toFixed(3)
    )
}

export function calculateAverageNoisePercentage(report) {
    const averageNoisePercentage =
        report
            .map((entry) => entry.noisePercentage)
            .reduce((prev, curr) => prev + curr, 0) / report.length
    // Only display 3 decimal digits
    return Number.parseFloat(averageNoisePercentage).toFixed(3)
}

// ADVANCED MODE UTILS

export function calculateMaximumCount(frequency, daily, count) {
    return daily * frequency * count
}

export function generateKeyCombinationArray(params) {
    var keysArray = []

    for (var i = 0; i < params.length; i++) {
        var keyLength = params[i]
        var arr = []
        for (var x = 0; x < keyLength; x++) {
            arr.push(x)
        }
        keysArray.push(arr)
    }

    var keysComb = cartesian(...keysArray)

    keysComb.forEach((element) => (element = element.join('')))

    return keysComb
}

// generate all possible key values combinations
function cartesian(...args) {
    var r = [],
        max = args.length - 1
    function helper(arr, i) {
        for (var j = 0, l = args[i].length; j < l; j++) {
            var a = arr.slice(0) // clone arr
            a.push(args[i][j])
            if (i == max) r.push(a)
            else helper(a, i + 1)
        }
    }
    helper([], 0)
    // return combinations
    return r
}


export function generateAggregatedValue(metric, deterministicValue, dailyConversionCount, batchingFrequency) {

    var calculationValue = ((metric.maxValue == metric.minValue) || 
        (metric.maxValue > (metric.minValue * 1 + deterministicValue * 1)) ?
            (metric.minValue * 1 + deterministicValue * 1) : metric.maxValue)
    return Math.floor(calculationValue *
        dailyConversionCount *
        batchingFrequency)

}