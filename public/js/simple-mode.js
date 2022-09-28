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
    initializeDisplaySimpleMode,
    getBatchingFrequencyFromDom,
    getDailyConversionCountFromDom,
    getEpsilonFromDom,
    getKeyStrategyFromDom,
    displaySimulationResults,
    getIsUseScalingFromDom,
} from './dom'
import {
    getScalingFactorForMetric,
    getRandomLaplacianNoise,
    calculateNoisePercentage,
    calculateAverageNoisePercentage,
} from './utils.noise'
import { generateSimulationId, generateSimulationTitle } from './utils.misc'

import { CONTRIBUTION_BUDGET } from './consts.js'

const keyStrategies = {
    A: { value: 'A', name: 'A' },
    B: { value: 'B', name: 'B' },
}

const batchingFrequencies = {
    // value represents the multiplier on a daily reference value
    hourly: { name: 'hourly', value: 1 / 24 },
    daily: { name: 'daily', value: 1, isDefault: true },
    weekly: { name: 'weekly', value: 7 },
    monthly: { name: 'monthly', value: 30 },
}

const dimensions = [
    {
        name: 'campaignID',
        numberOfDistinctValues: 2,
    },
    {
        name: 'geography',
        numberOfDistinctValues: 3,
    },
    {
        name: 'productCategory',
        numberOfDistinctValues: 2,
    },
]

const metrics = [
    { name: 'purchaseValue', defaultValuePerConversion: 120, maxValue: 1000 },
    { name: 'purchaseCount', defaultValuePerConversion: 1, maxValue: 1 },
]

function initializeDisplaySimpleModeWithParams() {
    initializeDisplaySimpleMode(
        Object.values(keyStrategies),
        Object.values(batchingFrequencies),
        metrics,
        dimensions,
        CONTRIBUTION_BUDGET
    )
}

export function simulateAndDisplayResultsSimpleMode() {
    const simulation = simulate(
        getDailyConversionCountFromDom(),
        dimensions,
        getEpsilonFromDom(),
        getKeyStrategyFromDom(),
        metrics,
        getBatchingFrequencyFromDom(),
        CONTRIBUTION_BUDGET,
        getIsUseScalingFromDom()
    )
    displaySimulationResults(simulation)
    console.table(simulation.reports)
}

function getNumberOfDistinctKeyValuesPerKey(dimensions) {
    return dimensions
        .map((dimension) => dimension.numberOfDistinctValues)
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
        title: generateSimulationTitle(new Date(Date.now())),
        simulationId: generateSimulationId(),
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
        reports: [],
    }
    const numberOfMetrics = metrics.length
    for (let i = 0; i < numberOfMetrics; i++) {
        const metric = metrics[i]
        const dailyReportPreNoise = generateUnnoisyKeyValuePairsReport(
            metric,
            numberOfMetrics,
            budget,
            dailyConversionCount,
            batchingFrequency,
            dimensions,
            isUseScaling
        )
        const dailyReportWithNoise =
            generateNoisyReportFromUnnoisyKeyValuePairsReport(
                dailyReportPreNoise,
                budget,
                epsilon
            )
        simulation.reports.push({
            title: metric.name,
            averageNoisePercentage:
                calculateAverageNoisePercentage(dailyReportWithNoise),
            data: dailyReportWithNoise,
        })
    }
    return simulation
}

function generateUnnoisyKeyValuePairsReport(
    metric,
    numberOfMetrics,
    budget,
    dailyConversionCount,
    batchingFrequency,
    dimensions,
    isUseScaling
) {
    const report = []
    const scalingFactorForThisMetric = isUseScaling
        ? getScalingFactorForMetric(metric, numberOfMetrics, budget)
        : 1

    for (let j = 0; j < getNumberOfDistinctKeyValuesPerKey(dimensions); j++) {
        report.push({
            // TODO, though the exact key doesn't really matter
            key: '--',
            aggregatedValue:
                // TODO fix - right now we're using j to add a deterministic variation to the numbers, so that they remain the same across simulations. It does the job but is clunky.
                (metric.defaultValuePerConversion + j) *
                scalingFactorForThisMetric *
                dailyConversionCount *
                batchingFrequency,
        })
    }
    return report
}

function generateNoisyReportFromUnnoisyKeyValuePairsReport(
    unnoisyKeyValuePairReport,
    budget,
    epsilon
) {
    return unnoisyKeyValuePairReport.map((entry) => {
        const { key, aggregatedValue } = entry
        const noise = getRandomLaplacianNoise(budget, epsilon)
        const aggregatedValuePostNoise = entry.aggregatedValue + noise
        return {
            key,
            summaryValuePreNoise: aggregatedValue,
            summaryValuePostNoise: aggregatedValuePostNoise,
            noise,
            noisePercentage: calculateNoisePercentage(
                noise,
                aggregatedValuePostNoise
            ),
        }
    })
}

function clearAllSimpleMode() {
    document.getElementById('all-simulations-wrapper-simple-mode').innerHTML =
        ''
}

window.simulateAndDisplayResultsSimpleMode = simulateAndDisplayResultsSimpleMode

window.clearAllSimpleMode = clearAllSimpleMode
window.initializeDisplaySimpleModeWithParams =
    initializeDisplaySimpleModeWithParams
