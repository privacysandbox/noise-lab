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

import { generateSimulationId, generateSimulationTitle } from './utils.misc'
import {
    getRandomLaplacianNoise,
    getScalingFactorForMeasurementGoal,
    calculateNoisePercentage,
    generateKeyCombinationArray,
    generateSummaryValue,
    calculateAverageNoisePercentageRaw,
    getNoise_Rmsre,
} from './utils.noise'

export function simulate(options) {
    const {
        contributionBudget,
        epsilon,
        measurementGoals,
        dimensions,
        useScaling,
        batchingFrequency,
        dailyEventCountPerBucket,
        keyStrategy,
        keyStructures,
        budgetSplit,
        zeroBucketsPercentage,
    } = options

    // Declare array containing possible combinations for keys
    const keyCombList = []
    for (let i = 0; i < keyStructures.length; i++) {
        keyCombList.push({
            names: keyStructures[i].names,
            combinations: generateKeyCombinationArray(
                keyStructures[i].combinations
            ),
            // Calculate the size of the sub-key
            size: keyStructures[i].combinations.reduce((acc, val) => {
                acc = acc * val
                return acc
            }, 1),
        })
    }

    const simulation = {
        metadata: {
            simulationTitle: generateSimulationTitle(new Date(Date.now())),
            simulationId: generateSimulationId(),
        },
        inputParameters: {
            // Used later for display
            dailyEventCountPerBucket,
            dimensions,
            epsilon,
            keyStrategy,
            measurementGoals,
            batchingFrequency,
            useScaling,
        },
        summaryReports: [],
    }

    measurementGoals.forEach((measGoal) => {
        for (let i = 0; i < keyCombList.length; i++) {
            const options = {
                contributionBudget: contributionBudget,
                epsilon: epsilon,
                measurementGoal: measGoal,
                useScaling: useScaling,
                batchingFrequency: batchingFrequency,
                dailyEventCountPerBucket: dailyEventCountPerBucket,
                budgetSplit: budgetSplit,
                zeroBucketsPercentage: zeroBucketsPercentage,
                keyCombinations: keyCombList[i],
                simulationNo: i,
            }
            simulation.summaryReports.push(simulatePerMeasurementGoal(options))
        }
    })
    return simulation
}

function simulatePerMeasurementGoal(options) {
    const {
        contributionBudget,
        epsilon,
        measurementGoal,
        useScaling,
        batchingFrequency,
        dailyEventCountPerBucket,
        budgetSplit,
        zeroBucketsPercentage,
        keyCombinations,
        simulationNo,
    } = options

    let scalingFactor = 1
    if (useScaling) {
        scalingFactor = getScalingFactorForMeasurementGoal(
            measurementGoal,
            // TODO simplify
            budgetSplit[
                budgetSplit.findIndex(
                    (entry) => entry.measurementGoal === measurementGoal.name
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
            measurementGoal,
            i,
            dailyEventCountPerBucket,
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
        measurementGoal: measurementGoal.name,
        dimensionsString: keyCombinations.names.join(' x '),
        simulationNo: simulationNo,
    }
    return simulationReport
}
