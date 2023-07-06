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
    addKeyStrategyListener,
    addMetricsButtons,
    addDimensionsButtons,
    getEpsilonFromDom,
    getDailyValue,
    getBatchingFrequencyFromDom,
    getAllDimensionSizes,
    displaySimulationResults_advancedMode,
    getMetricsArrayFromDom,
    createSimulationDiv,
    getDimensionsArrayFromDom,
    getIsKeyStrategyGranularFromDom,
    getStrategiesKeyCombinations,
    getAllDimensionNamesFromDom,
    displayMetrics,
    displayDimensions,
    addMetric,
    removeMetric,
    initializeDisplayGeneric,
    addDimension,
    removeDimension,
    getIsUseScalingFromDom,
    getKeyCombinationString,
    validateInputsBeforeSimulation,
    getBudgetValueForMetricIdFromDom,
    displayBudgetSplit,
    getIsPercentageBudgetSplitFromDom,
    loadPython,
    getZeroConversionsPercentageFromDom,
    getEventCount,
} from './dom'
import { generateSimulationId, tempSaveTable, downloadAll } from './utils.misc'
import {
    CONTRIBUTION_BUDGET,
    DEFAULT_MEASUREMENT_GOALS,
    DEFAULT_DIMENSIONS,
} from './config'

import {
    getRandomLaplacianNoise,
    getScalingFactorForMetric,
    calculateNoisePercentage,
    generateKeyCombinationArray,
    generateSummaryValue,
    calculateAverageNoisePercentageRaw,
    getNoise_Rmsre,
} from './utils.noise'

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

export function initializeDisplay_advancedMode() {
    loadPython()
    initializeDisplayGeneric()
    updateDailyPerBucket()
    addKeyStrategyListener()
    displayMetrics(DEFAULT_MEASUREMENT_GOALS)
    addMetricsButtons()
    displayDimensions(DEFAULT_DIMENSIONS)
    addDimensionsButtons()
    displayBudgetSplit()
}
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

        const randCount = generateSummaryValue(
            metric,
            i,
            dailyCount,
            batchingFrequency,
            getZeroConversionsPercentageFromDom()
        )

        const noisePercentage = calculateNoisePercentage(
            noise,
            // Noiseless summary value
            randCount * scalingFactor
        )
        noisePercentageSum += noisePercentage

        const summaryValue_scaled_noisy = randCount * scalingFactor + noise

        report.push({
            key: keyCombinations.combinations[i],
            summaryValue: randCount,
            summaryValue_scaled_noiseless: randCount * scalingFactor,
            summaryValue_scaled_noisy: summaryValue_scaled_noisy,
            noise: noise,
            noisePercentage: noisePercentage,
        })
    }

    const allSummaryValuesPreNoise = Object.values(report).map(
        (v) => v.summaryValue_scaled_noiseless
    )
    const allSummaryValuesPostNoise = Object.values(report).map(
        (v) => v.summaryValue_scaled_noisy
    )

    const noise_ape = calculateAverageNoisePercentageRaw(
        noisePercentageSum,
        keyCombinations.combinations.length
    )

    const noise_rmsre = getNoise_Rmsre(
        allSummaryValuesPostNoise,
        allSummaryValuesPreNoise,
        scalingFactor
    )

    const simulationReport = {
        data: report,
        noise_ape: noise_ape,
        noise_ape_percent: Number.parseFloat((noise_ape * 100).toFixed(3)),
        noise_rmsre: noise_rmsre,
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
        getIsKeyStrategyGranularFromDom(),
        getBatchingFrequencyFromDom(),
        getEventCount()
    )
}

export function resetMetrics() {
    displayMetrics(defaultMetrics)
}

export function resetBudgetSplit() {
    displayBudgetSplit()
}

export function resetDimensions() {
    displayDimensions(DEFAULT_DIMENSIONS)
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
                // Calculate the size of the sub-key
                size: allCombs[i].combinations.reduce((acc, val) => {
                    acc = acc * val
                    return acc
                }, 1),
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
                getIsKeyStrategyGranularFromDom()
                    ? getDailyValue()
                    : Math.floor(dailyConversionCount / keyCombList[i].size),
                i
            )
        }
    })
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
window.resetBudgetSplit = resetBudgetSplit
