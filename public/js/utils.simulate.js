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

import {
    validateInputsBeforeSimulation,
    // getKeyStrategyFromDom,
    getIsKeyStrategyGranularFromDom,
    getDailyEventCountPerBucket,
    getBudgetValueForMetricIdFromDom,
    getIsPercentageBudgetSplitFromDom,
    getKeyCombinationString,
    getStrategiesKeyCombinations,
} from './dom'
import { generateSimulationId, generateSimulationTitle } from './utils.misc'
import {
    getRandomLaplacianNoise,
    // getScalingFactorForMetric,
    getScalingFactorForMeasurementGoal,
    calculateNoisePercentage,
    generateKeyCombinationArray,
    generateSummaryValue,
    calculateAverageNoisePercentageRaw,
    getNoise_Rmsre,
} from './utils.noise'

// Generate dataset
// TODO use config object
export function simulate(
    metrics,
    dimensions,
    dimensionNames,
    dimensionSizes,
    epsilon,
    contributionBudget,
    isUseScaling,
    isGranular,
    batchingFrequency,
    dailyConversionCountPerBucket,
    dailyConversionCountTotal,
    zeroBucketsPercentage,
    keyStrategy,
    keyStructuresCount,
    keyStructures,
    budgetSplitMode,
    budgetSplit
) {
    // Validate inputs are correct
    // TODO fix
    if (
        !validateInputsBeforeSimulation(
            metrics,
            dimensions,
            isGranular,
            isUseScaling,
            keyStructuresCount
        )
    )
        return

    // TODO use keyStrategy OR keyStructuresCount OR isGranular
    console.log('STRAT', keyStrategy)
    console.log('KEY COUNT', keyStructuresCount)

    // Declare array containing possible combinations for keys
    var r = []
    var keyCombList = []

    // Logic for generating one dataset with all keys - string parameter 'all' is used
    if (isGranular) {
        var keyComb = generateKeyCombinationArray(dimensionSizes)
        console.log(keyComb)
        keyCombList.push({
            names: dimensionNames,
            combinations: keyComb,
        })
        console.log(keyCombList)
    } else {
        const allCombs = keyStructures
        for (let i = 0; i < allCombs.length; i++) {
            // TODO unify this code across the two branches (key strategies)
            keyCombList.push({
                names: allCombs[i].names,
                combinations: generateKeyCombinationArray(
                    allCombs[i].combinations
                ),
                // Calculate the size of the sub-key
                size: allCombs[i].combinations.reduce((acc, val) => {
                    acc = acc * val
                    return acc
                }, 1),
            })
        }
    }

    const simulation = {
        metadata: {
            simulationTitle: generateSimulationTitle(new Date(Date.now())),
            simulationId: generateSimulationId(),
        },
        inputParameters: {
            // Used later for display
            dailyConversionCountPerBucket,
            dimensions,
            epsilon,
            keyStrategy,
            metrics,
            batchingFrequency,
            isUseScaling,
        },
        summaryReports: [],
    }

    metrics.forEach((element) => {
        for (let i = 0; i < keyCombList.length; i++) {
            simulation.summaryReports.push(
                simulatePerMetric(
                    keyCombList[i],
                    element,
                    epsilon,
                    contributionBudget,
                    isUseScaling,
                    batchingFrequency,
                    isGranular
                        ? dailyConversionCountPerBucket
                        : Math.floor(
                              dailyConversionCountTotal / keyCombList[i].size
                          ),
                    i,
                    zeroBucketsPercentage,
                    budgetSplitMode,
                    budgetSplit
                )
            )
        }
    })

    console.log(simulation)

    return simulation
}

// TODO use config object
function simulatePerMetric(
    keyCombinations,
    metric,
    epsilon,
    contributionBudget,
    isUseScaling,
    batchingFrequency,
    dailyCount,
    simulationNo,
    zeroBucketsPercentage,
    budgetSplitMode,
    budgetSplit
) {
    console.log(budgetSplitMode)
    let scalingFactor = 1
    // TODO ensure it's a boolean
    if (!!isUseScaling) {
        scalingFactor = getScalingFactorForMeasurementGoal(
            metric,
            // TODO-array-learn forgot budget split prefixing
            // TODO simplify
            budgetSplit[
                budgetSplit.findIndex(
                    (entry) => entry.measurementGoal === metric.name
                )
            ].percentage,
            contributionBudget
        )
    }

    const report = []

    var noisePercentageSum = 0
    for (let i = 0; i < keyCombinations.combinations.length; i++) {
        const noise = getRandomLaplacianNoise(contributionBudget, epsilon)

        const randCount = generateSummaryValue(
            metric,
            i,
            dailyCount,
            batchingFrequency,
            zeroBucketsPercentage
        )

        const noiseValueAPE = calculateNoisePercentage(
            noise,
            // Noiseless summary value
            Math.round(randCount * scalingFactor)
        )
        noisePercentageSum += noiseValueAPE

        const summaryValue_scaled_noisy = Math.round(
            randCount * scalingFactor + noise
        )

        report.push({
            key: keyCombinations.combinations[i],
            summaryValue: randCount,
            summaryValue_scaled_noiseless: Math.round(
                randCount * scalingFactor
            ),
            summaryValue_scaled_noisy: summaryValue_scaled_noisy,
            noise: noise,
            noise_ape_individual: noiseValueAPE,
        })
    }

    const allSummaryValuesPreNoise = Object.values(report).map(
        (v) => v.summaryValue_scaled_noiseless
    )
    const allSummaryValuesPostNoise = Object.values(report).map(
        (v) => v.summaryValue_scaled_noisy
    )

    const noise_ape =
        calculateAverageNoisePercentageRaw(
            noisePercentageSum,
            keyCombinations.combinations.length
        ) * 100

    const noise_rmsre = getNoise_Rmsre(
        allSummaryValuesPostNoise,
        allSummaryValuesPreNoise,
        scalingFactor
    )

    const simulationReport = {
        data: report,
        noiseMetrics: {
            noise_ape_percent: noise_ape,
            noise_rmsre: noise_rmsre,
        },
        scalingFactor: scalingFactor,
        measurementGoal: metric.name,
        dimensionsString: getKeyCombinationString(keyCombinations.names),
        simulationNo: simulationNo,
    }

    return simulationReport
}
