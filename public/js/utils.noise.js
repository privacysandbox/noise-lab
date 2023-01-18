/* Copyright 2022 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import laplace from '@stdlib/random-base-laplace'

export function getScalingFactorForMetric(
    metric,
    percentage,
    contributionBudget
) {
    const budgetForThisMetric = contributionBudget * (percentage / 100)
    const scalingFactorForThisMetric = budgetForThisMetric / metric.maxValue
    return scalingFactorForThisMetric.toFixed(1)
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
    const sum = report
        .map((entry) => entry.noisePercentage)
        .reduce((prev, curr) => prev + curr, 0)
    return calculateAverageNoisePercentageRaw(sum, report.length)
}

export function calculateAverageNoisePercentageRaw(sum, count) {
    const averageNoisePercentage = sum / count
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

export function generateAggregatedValue(
    metric,
    deterministicValue,
    dailyConversionCount,
    batchingFrequency
) {
    // Calculate deterministic Number
    var deterministicNumber =
        metric.avgValue * 1 +
        deterministicValue * 1 * (deterministicValue % 2 == 0 ? 1 : -1)

    var dailyConversionValue = Math.abs(
        dailyConversionCount * 1 +
            (deterministicValue % 2 == 0
                ? 1 * deterministicValue
                : -1 * deterministicValue)
    )

    var calculationValue =
        deterministicNumber > 0 &&
        (metric.maxValue == metric.avgValue ||
            metric.maxValue > deterministicNumber)
            ? deterministicNumber
            : metric.maxValue

    var res = Math.floor(
        calculationValue * dailyConversionCount * batchingFrequency
    )

    return res
}

export function generateAggregatedValueTemp(
    metric,
    deterministicValue,
    dailyConversionCount,
    batchingFrequency
) {
    // Calculate deterministic Number
    var deterministicNumber =
        metric.avgValue * 1 +
        deterministicValue * 1 * (deterministicValue % 2 == 0 ? 1 : -1)

    var calculationValue =
        deterministicNumber > 0 &&
        (metric.maxValue == metric.avgValue ||
            metric.maxValue > deterministicNumber)
            ? deterministicNumber
            : metric.maxValue

    console.log('deter', deterministicNumber)
    console.log('calcVal', calculationValue)
    return Math.floor(
        calculationValue * dailyConversionCount * batchingFrequency
    )
}
