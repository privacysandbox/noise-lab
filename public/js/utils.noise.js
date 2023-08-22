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
import { RMSRE_THRESHOLD } from './config'

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

export function calculateNoisePercentage(noise, summaryValue_noiseless) {
    return Math.abs(noise / summaryValue_noiseless)
}

export function calculateAverageNoisePercentage(report) {
    const sum = report
        .map((entry) => entry.noise_ape_individual)
        .reduce((prev, curr) => prev + curr, 0)
    return calculateAverageNoisePercentageRaw(sum, report.length)
}

export function calculateAverageNoisePercentageRaw(sum, count) {
    const averageNoisePercentage = sum / count
    // Only display 3 decimal digits
    return Number.parseFloat(averageNoisePercentage.toFixed(5))
}

export function getNoise_Rmsre(
    allSummaryValuesPostNoise,
    allSummaryValuesPreNoise,
    scalingFactor
) {
    rmsre_t_function_js = pyscript.runtime.globals.get('rmsre_t')
    // rmsre_t_result is a JS Map.
    // Each key is a RMSRE_T value (so we could in theory get RMSRE_T for e.g. t=4, t=1 etc. if we decided to change the value of t or to parametrize it in the frontend for users to change).
    // Each key's corresponding value is an array:
    // Index 0: rmsre_t averaged over all entries i.e. all buckets
    // Index 1: array of individual rmsre_t value for each entry i.e. each bucket
    const rmsre_t_result = rmsre_t_function_js(
        allSummaryValuesPostNoise,
        allSummaryValuesPreNoise,
        // python code needs an integer as scaling factor
        Math.floor(scalingFactor),
        RMSRE_THRESHOLD
    ).toJs()
    // Get the rmsre_t average for RMSRE_THRESHOLD
    const rmsre_t = rmsre_t_result.get(RMSRE_THRESHOLD)[0]
    return Number.parseFloat(rmsre_t.toFixed(5))
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

export function generateSummaryValue(
    metric,
    deterministicValue,
    dailyConversionCount,
    batchingFrequency,
    zeroPct
) {
    // every 20th bucket gets 0 conversions -> ~5%

    if (
        zeroPct > 0 &&
        deterministicValue != 0 &&
        deterministicValue % Math.abs(100 / zeroPct) == 0
    )
        return 0

    // Calculate deterministic Number - variation between 0 and metric max
    // If the avg and max are equal, all buckets will be calculated with this value, no variation added
    if (metric.avgValue == metric.maxValue)
        var deterministicNumber = metric.avgValue
    else {
        var deterministicNumber = Math.abs(
            metric.avgValue * 1 +
                deterministicValue * 1 * (deterministicValue % 2 == 0 ? 1 : -1)
        )
        if (deterministicNumber == 0) deterministicNumber = metric.avgValue
        deterministicNumber = Math.min(deterministicNumber, metric.maxValue)
    }

    // calculate variation for conversions/bucket
    // we are adding/deducting the deterministic value
    var dailyConversionValue =
        deterministicValue % 2 == 0 && deterministicValue > 0
            ? Number(dailyConversionCount) + Number(deterministicValue)
            : Number(dailyConversionCount) - Number(deterministicValue)

    // Limit the number of conversaion per current bucket to double the avg
    dailyConversionValue =
        dailyConversionValue > 0 &&
        dailyConversionValue < 2 * Number(dailyConversionCount)
            ? dailyConversionValue
            : dailyConversionCount

    // result is the product between variated metric value, variated conversion count per current bucket and frequency
    var res = Math.floor(
        deterministicNumber * dailyConversionValue * batchingFrequency
    )

    return res
}
