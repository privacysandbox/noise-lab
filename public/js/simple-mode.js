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
    displayTabularData,
    initializeDisplayGeneric,
    getBatchingFrequencyFromDom,
    getDailyConversionCountFromDom,
    getEpsilonFromDom,
    getKeyStrategyFromDom,
    displaySimulationResults_simpleMode,
    getIsUseScalingFromDom,
    getBudgetValueForMetricIdFromDom,
    loadPython,
} from './dom'
import {
    getScalingFactorForMetric,
    getRandomLaplacianNoise,
    calculateNoisePercentage,
    calculateAverageNoisePercentage,
    generateKeyCombinationArray,
    getNoise_Rmsre,
    generateSummaryValue,
} from './utils.noise'
import {
    generateSimulationId,
    generateSimulationTitle,
    downloadAll,
    tempSaveTable,
} from './utils.misc'
import {
    CONTRIBUTION_BUDGET,
    DEFAULT_MEASUREMENT_GOALS,
    DEFAULT_DIMENSIONS,
} from './config'

let allSimulationDataTables_simpleMode = {}

export function initializeDisplay_simpleMode() {
    loadPython()
    initializeDisplayGeneric()
    displayTabularData(
        document.getElementById('metrics'),
        DEFAULT_MEASUREMENT_GOALS,
        false
    )
    displayTabularData(
        document.getElementById('dimensions-table'),
        DEFAULT_DIMENSIONS,
        false
    )
}

export function tempSaveTable_simpleMode(table, tableTitle) {
    allSimulationDataTables_simpleMode = tempSaveTable(
        table,
        tableTitle,
        allSimulationDataTables_simpleMode
    )
}

export function downloadAll_simpleMode() {
    downloadAll(allSimulationDataTables_simpleMode)
}

export function simulateAndDisplayResultsSimpleMode() {
    const simulation = simulate(
        getDailyConversionCountFromDom(),
        DEFAULT_DIMENSIONS,
        getEpsilonFromDom(),
        getKeyStrategyFromDom(),
        DEFAULT_MEASUREMENT_GOALS,
        getBatchingFrequencyFromDom(),
        CONTRIBUTION_BUDGET,
        getIsUseScalingFromDom()
    )
    displaySimulationResults_simpleMode(simulation)
}

function getNumberOfDistinctKeyValuesPerKey(dimensions) {
    return dimensions
        .map((dimension) => dimension.size)
        .reduce((prev, current) => prev * current, 1)
}

function simulate(
    dailyConversionCount,
    dimensions,
    epsilon,
    keyStrategy,
    metrics,
    batchingFrequency,
    budget,
    isUseScaling
) {
    const simulation = {
        metadata: {
            simulationTitle: generateSimulationTitle(new Date(Date.now())),
            simulationId: generateSimulationId(),
        },
        inputParameters: {
            // Used later for display
            dailyConversionCount,
            dimensions,
            epsilon,
            keyStrategy,
            metrics,
            batchingFrequency,
            isUseScaling,
        },
        summaryReports: [],
    }
    const numberOfMetrics = metrics.length
    for (let i = 0; i < numberOfMetrics; i++) {
        const metric = metrics[i]
        const isPercentage = true
        const percentage = getBudgetValueForMetricIdFromDom(i + 1)
        const scalingFactorForThisMetric = isUseScaling
            ? getScalingFactorForMetric(
                  metric,
                  percentage,
                  isPercentage,
                  budget
              )
            : 1
        const dailyReport_noiseless = generateNoiselessReport(
            metric,
            dailyConversionCount,
            batchingFrequency,
            dimensions,
            scalingFactorForThisMetric
        )
        const dailyReport_noisy = generateNoisyReportFromNoiselessReport(
            dailyReport_noiseless,
            budget,
            epsilon,
            scalingFactorForThisMetric
        )

        const noise_ape = calculateAverageNoisePercentage(dailyReport_noisy)
        const noise_rmsre = dailyReport_noisy.noise_rmsre

        simulation.summaryReports.push({
            data: dailyReport_noisy,
            scalingFactor: scalingFactorForThisMetric,
            measurementGoal: metric.name,
            dimensionsString: dimensions.map((d) => d.name).join(' x '),
            noiseMetrics: {
                noise_ape_percent: Number.parseFloat(
                    (noise_ape * 100).toFixed(3)
                ),
                noise_rmsre: noise_rmsre,
            },
        })
    }
    console.log(simulation)
    return simulation
}

function generateNoiselessReport(
    metric,
    dailyConversionCount,
    batchingFrequency,
    dimensions,
    scalingFactorForThisMetric
) {
    const keyCombinations = generateKeyCombinationArray(
        dimensions.map((dim) => dim.size)
    )

    // TODO fix - right now we're using j to add a deterministic variation to the numbers, so that they remain the same across simulations. It does the job but is clunky.

    const report = []
    keyCombinations.forEach((k, idx) => {
        var summaryValue = generateSummaryValue(
            metric,
            idx,
            dailyConversionCount,
            batchingFrequency,
            0
        )

        const summaryValue_scaled_noiseless =
            summaryValue * scalingFactorForThisMetric

        report.push({
            // TODO, though the exact key doesn't really matter
            key: k,
            summaryValue,
            summaryValue_scaled_noiseless,
        })
    })
    return report
}

function generateNoisyReportFromNoiselessReport(
    noiselessReport,
    budget,
    epsilon,
    scalingFactor
) {
    const noisyReport = noiselessReport.map((entry) => {
        const { key, summaryValue, summaryValue_scaled_noiseless } = entry
        const noise = getRandomLaplacianNoise(budget, epsilon)
        return {
            key,
            summaryValue,
            summaryValue_scaled_noiseless,
            noise,
            summaryValue_scaled_noisy: summaryValue_scaled_noiseless + noise,
            noise_ape_individual: calculateNoisePercentage(
                noise,
                summaryValue_scaled_noiseless
            ),
        }
    })

    const allSummaryValuesPreNoise = Object.values(noisyReport).map(
        (v) => v.summaryValue_scaled_noiseless
    )
    const allSummaryValuesPostNoise = Object.values(noisyReport).map(
        (v) => v.summaryValue_scaled_noisy
    )

    noisyReport.noise_rmsre = getNoise_Rmsre(
        allSummaryValuesPostNoise,
        allSummaryValuesPreNoise,
        scalingFactor
    )

    return noisyReport
}

window.downloadAll_simpleMode = downloadAll_simpleMode
window.simulateAndDisplayResultsSimpleMode = simulateAndDisplayResultsSimpleMode
