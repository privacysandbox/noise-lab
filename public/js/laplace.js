import {
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
    clearAll,
    getBudgetValueForMetricIdFromDom,
    displayBudgetSplit,
    getIsPercentageBudgetSplitFromDom,
} from './dom'
import { generateSimulationId, tempSaveTable, downloadAll } from './utils.misc'
import { getNoise_Rmspe } from './utils.noise'
import { CONTRIBUTION_BUDGET, MODES } from './config'

import {
    getRandomLaplacianNoise,
    getScalingFactorForMetric,
    calculateNoisePercentage,
    generateKeyCombinationArray,
    generateAggregatedValue,
    calculateAverageNoisePercentageRaw,
} from './utils.noise'

// define default metrics
const defaultMetrics = [
    { id: 1, name: 'purchaseValue', maxValue: 1000, avgValue: 120 },
    { id: 2, name: 'purchaseCount', maxValue: 1, avgValue: 1 },
]

let allSimulationDataTables_advancedMode = {}

export function tempSaveTable_advancedMode(table, tableTitle) {
    allSimulationDataTables_advancedMode = tempSaveTable(
        table,
        tableTitle,
        allSimulationDataTables_advancedMode
    )
}

export function downloadAll_advancedMode() {
    downloadAll(allSimulationDataTables_advancedMode)
}

// define default dimensions
const defaultDimensions = [
    { id: '1', size: '3', name: 'geography' },
    { id: '2', size: '4', name: 'campaignId' },
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
    const value = getBudgetValueForMetricIdFromDom(metric.id)
    const isPercentage = getIsPercentageBudgetSplitFromDom()
    const scalingFactor = isUseScaling
        ? getScalingFactorForMetric(
              metric,
              value,
              isPercentage,
              contributionBudget
          )
        : 1
    const keyCombinationString = getKeyCombinationString(keyCombinations.names)

    const report = []
    var noisePercentageSum = 0
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
        noisePercentageSum += noisePercentage

        report.push({
            key: keyCombinations.combinations[i],
            summaryValue: randCount,
            scaledSummaryValue: randCount * scalingFactor,
            noisyScaledSummaryValue: randCount * scalingFactor + noise,
            noise: noise,
            noisePercentage: noisePercentage,
        })
    }

    const allSummaryValuesPreNoise = Object.values(report).map(
        (v) => v.scaledSummaryValue
    )
    const allSummaryValuesPostNoise = Object.values(report).map(
        (v) => v.noisyScaledSummaryValue
    )

    getNoise_Rmspe(allSummaryValuesPostNoise, allSummaryValuesPreNoise)
    report.noise_rmspe = getNoise_Rmspe(
        allSummaryValuesPostNoise,
        allSummaryValuesPreNoise
    )

    const simulationReport = {
        data: report,
        noise_naive: calculateAverageNoisePercentageRaw(
            noisePercentageSum,
            keyCombinations.combinations.length
        ),
    }

    displaySimulationResults_advancedMode(
        mainDiv,
        simulationReport,
        metric.name,
        scalingFactor,
        keyCombinationString,
        simulationId,
        simulationNo,
        metricsNo
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

export function resetBudgetSplit() {
    displayBudgetSplit()
}

export function resetDimensions() {
    displayDimensions(defaultDimensions)
}

// generate dataset
function triggerSimulation(
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
    clearAll(MODES.advanced.name)
}

window.simulateAndDisplayResultsAdvancedMode =
    simulateAndDisplayResultsAdvancedMode
window.downloadAll_advancedMode = downloadAll_advancedMode

window.addMetric = addMetric
window.removeMetric = removeMetric
window.resetMetrics = resetMetrics
window.addDimension = addDimension
window.removeDimension = removeDimension
window.resetDimensions = resetDimensions
window.clearAllAdvancedMode = clearAllAdvancedMode
window.resetBudgetSplit = resetBudgetSplit
