import {
    clearDataDisplay,
    getEpsilonFromDom,
    getFrequencyValue,
    getDailyValue,
    getAllDimensionSizes,
    displaySimulationResults_advancedMode,
    getMetricsArrayFromDom,
    createSimulationDiv,
    getDimensionsArrayFromDom,
    getIsGranularFromDom,
    getStrategiesKeyCombinations,
    getAllDimensionNamesFromDom,
    displayMetrics,
    displayDimensions,
    addMetric,
    removeMetric,
    initializeDisplayAdvancedMode,
    addDimension,
    removeDimension,
    getIsUseScalingFromDom,
    getKeyCombinationString,
    validateInputsBeforeSimulation,
    resetFormValidation,
} from './dom.js'
import { generateSimulationId } from './utils.misc'
import { CONTRIBUTION_BUDGET } from './consts.js'

import {
    getRandomLaplacianNoise,
    calculateMaximumCount,
    getScalingFactorForMetric,
    calculateNoisePercentage,
    generateKeyCombinationArray,
    generateAggregatedValue,
} from './utils.noise.js'

// define default metrics
const defaultMetrics = [
    { id: 1, name: 'purchaseValue', maxValue: 1000, minValue: 120 },
    { id: 2, name: 'purchaseCount', maxValue: 1, minValue: 1 },
]

// define default dimensions
const defaultDimensions = [
    { id: '1', size: '3', name: 'geography' },
    { id: '2', size: '2', name: 'campaignId' },
    { id: '3', size: '2', name: 'productCategory' },
]

export function initializeDisplayAdvancedModeWithParams() {
    initializeDisplayAdvancedMode(
        defaultMetrics,
        defaultDimensions,
        CONTRIBUTION_BUDGET
    )
}

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

function simulatePerMetric(
    mainDiv,
    keyCombinations,
    metricsNo,
    metric,
    simulationId,
    epsilon,
    contributionBudget,
    isUseScaling,
    batchingFrequency,
    dailyCount,
    simulationNo
) {
    const scalingFactor = isUseScaling
        ? getScalingFactorForMetric(metric, metricsNo, contributionBudget)
        : 1
    const keyCombinationString = getKeyCombinationString(keyCombinations.names)

    const report = []
    var averageNoisePercentage = 0
    for (let i = 0; i < keyCombinations.combinations.length; i++) {
        const noise = getRandomLaplacianNoise(contributionBudget, epsilon)

        const randCount = generateAggregatedValue(
            metric,
            i,
            dailyCount,
            batchingFrequency
        )
        const noisePercentage = calculateNoisePercentage(
            noise,
            randCount * scalingFactor + noise
        )
        averageNoisePercentage += noisePercentage

        report.push({
            key: keyCombinations.combinations[i],
            summaryValue: randCount,
            scaledSummaryValue: randCount * scalingFactor,
            noisyScaledSummaryValue: randCount * scalingFactor + noise,
            noise: noise,
            noisePercentage: noisePercentage,
        })
    }

    averageNoisePercentage =
        averageNoisePercentage / keyCombinations.combinations.length

    const simulationReport = {
        data: report,
        averageNoisePercentage: averageNoisePercentage,
    }

    displaySimulationResults_advancedMode(
        mainDiv,
        simulationReport,
        metric.name,
        scalingFactor,
        keyCombinationString,
        simulationId,
        simulationNo
    )
}

export function simulateAndDisplayResultsAdvancedMode() {
    triggerSimulation(
        getMetricsArrayFromDom(),
        getDimensionsArrayFromDom(),
        getAllDimensionNamesFromDom(),
        getAllDimensionSizes(),
        getEpsilonFromDom(),
        CONTRIBUTION_BUDGET,
        getIsUseScalingFromDom(),
        getIsGranularFromDom(),
        getFrequencyValue(),
        getDailyValue()
    )
}

export function resetMetrics() {
    displayMetrics(defaultMetrics)
}

export function resetDimensions() {
    displayDimensions(defaultDimensions)
}

// generate dataset
export function triggerSimulation(
    metrics,
    dimensions,
    dimensionNames,
    dimensionSizes,
    epsilon,
    contributionBudget,
    isUseScaling,
    isGranular,
    batchingFrequency,
    dailyConversionCount
) {
    // Validate inputs are correct
    if (!validateInputsBeforeSimulation(metrics, dimensions, isGranular)) return

    console.log(batchingFrequency)
    // declare array containing possible combinations for keys
    var r = []
    var keyCombList = []

    // logic for generating one dataset with all keys - string parameter 'all' is used
    if (isGranular) {
        var keyComb = generateKeyCombinationArray(dimensionSizes)
        keyCombList.push({
            names: dimensionNames,
            combinations: keyComb,
        })
    } else {
        const allCombs = getStrategiesKeyCombinations(dimensions)

        for (let i = 0; i < allCombs.length; i++) {
            keyCombList.push({
                names: allCombs[i].names,
                combinations: generateKeyCombinationArray(
                    allCombs[i].combinations
                ),
            })
        }
    }

    const simulationId = generateSimulationId()

    var simulationDiv = createSimulationDiv(simulationId, {
        metrics,
        dimensions,
        epsilon,
        contributionBudget,
        isUseScaling,
        isGranular,
        batchingFrequency,
        dailyConversionCount,
    })

    metrics.forEach((element) => {
        for (let i = 0; i < keyCombList.length; i++) {
            simulatePerMetric(
                simulationDiv,
                keyCombList[i],
                metrics.length,
                element,
                simulationId,
                epsilon,
                contributionBudget,
                isUseScaling,
                batchingFrequency,
                dailyConversionCount,
                i
            )
        }
    })
}

function clearAllAdvancedMode() {
    resetFormValidation()
    document.getElementById('all-simulations-wrapper-advanced-mode').innerHTML =
        ''
}

window.triggerSimulation = triggerSimulation
window.simulateAndDisplayResultsAdvancedMode =
    simulateAndDisplayResultsAdvancedMode

window.clearDataDisplay = clearDataDisplay
window.addMetric = addMetric
window.removeMetric = removeMetric
window.resetMetrics = resetMetrics
window.addDimension = addDimension
window.removeDimension = removeDimension
window.resetDimensions = resetDimensions
window.clearAllAdvancedMode = clearAllAdvancedMode
window.initializeDisplayAdvancedModeWithParams =
    initializeDisplayAdvancedModeWithParams
