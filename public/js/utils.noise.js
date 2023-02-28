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
import { getZeroConversionsPercentageFromDom } from './dom.js'
import { RMSPE_THRESHOLD } from './config'

// SHARED UTILS

export function getScalingFactorForMetric(
    metric,
    value,
    isPercentage,
    contributionBudget
) {
    const budgetForThisMetric = isPercentage
        ? contributionBudget * (value / 100)
        : value
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

export function getNoise_Rmspe(
    allSummaryValuesPostNoise,
    allSummaryValuesPreNoise,
    scalingFactor
) {
    rmspe_t_function_js = pyscript.runtime.globals.get('rmspe_t')
    const rmspe_t_result = rmspe_t_function_js(
        allSummaryValuesPostNoise,
        allSummaryValuesPreNoise,
        Math.floor(scalingFactor),
        RMSPE_THRESHOLD
    ).toJs()
    const rmspe_t = rmspe_t_result.get(RMSPE_THRESHOLD)[0]
    return rmspe_t
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
    // every 20th bucket gets 0 conversions -> ~5%
    var zeroPct = getZeroConversionsPercentageFromDom()

    if (
        zeroPct > 0 &&
        deterministicValue != 0 &&
        deterministicValue % Math.abs(100 / zeroPct) == 0
    )
        return 0

    // Calculate deterministic Number
    var deterministicNumber =
        metric.avgValue * 1 +
        deterministicValue * 1 * (deterministicValue % 2 == 0 ? 1 : -1)

    // calculate variation for conversions/bucket
    var dailyConversionValue = Math.abs(
        deterministicValue % 2 == 0 && deterministicValue > 0
            ? Math.abs(dailyConversionCount / deterministicValue) +
            1 * deterministicValue
            : dailyConversionCount * deterministicValue - 1 * deterministicValue
    )

    dailyConversionValue =
        dailyConversionValue > 0 ? dailyConversionValue : dailyConversionCount

    var calculationValue =
        deterministicNumber > 0 &&
            (metric.maxValue == metric.avgValue ||
                metric.maxValue > deterministicNumber)
            ? deterministicNumber
            : metric.maxValue

    var res = Math.floor(
        calculationValue * dailyConversionValue * batchingFrequency
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
