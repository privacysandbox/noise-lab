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
    getKeyStrategyFromDom,
    getIsKeyStrategyGranularFromDom,
    getDailyEventCountPerBucket,
    getBudgetValueForMetricIdFromDom,
    getIsPercentageBudgetSplitFromDom,
    getKeyCombinationString,
    getZeroConversionsPercentageFromDom,
    getStrategiesKeyCombinations,
    getRateOneFromDom,
    getRateTwoFromDom,
    getDimensionsArrayFromDom,
    getMpcFromDom,
    getConversionsPerImpressionFromDom
} from './dom'
import { getCurrentModeFromUrl } from './main'
import { generateSimulationId, generateSimulationTitle } from './utils.misc'
import {
    getRandomLaplacianNoise,
    getScalingFactorForMetric,
    calculateNoisePercentage,
    generateKeyCombinationArray,
    generateSummaryValue,
    generateSummaryValuePro,
    calculateAverageNoisePercentageRaw,
    getNoise_Rmsre,
    generateDataset,
    generateDatasetValue,
} from './utils.noise'

// generate dataset
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
    dailyConversionCountTotal
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

    const keyStrategy = getKeyStrategyFromDom()

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
                    getIsKeyStrategyGranularFromDom()
                        ? getDailyEventCountPerBucket()
                        : Math.floor(
                            dailyConversionCountTotal / keyCombList[i].size
                        ),
                    i
                )
            )
        }
    })

    return simulation
}

function simulatePerMetric(
    keyCombinations,
    metric,
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


    const mode = getCurrentModeFromUrl()
    let syntheticData = undefined
    let syntheticDataV = undefined

    if (mode == 'pro') {
        const rateOne = getRateOneFromDom()
        const rateTwo = getRateTwoFromDom()

        const dimensionsArray = getDimensionsArrayFromDom()
        const filtered = dimensionsArray.filter((dimension) => dimension.side === '0')

        const impressionDimensionsArray = dimensionsArray.filter((dimension) => dimension.side === '0').map(({size})=> parseInt(size))
        const conversionDimensionsArray = dimensionsArray.filter((dimension) => dimension.side === '1').map(({size})=> parseInt(size))
        const conversionsPerImpression = getConversionsPerImpressionFromDom()

        const mpc = getMpcFromDom()

       // syntheticData  syntheticData = generateDataset(rateOne, rateTwo, conversionsPerImpression, impressionDimensionsArray, conversionDimensionsArray, mpc)
        syntheticDataV = generateDatasetValue(rateOne, rateTwo, conversionsPerImpression, impressionDimensionsArray, conversionDimensionsArray, parseInt(metric.avgValue), parseInt(metric.modeValue), mpc)

    }   

    const report = []



    var noisePercentageSum = 0
    for (let i = 0; i < keyCombinations.combinations.length; i++) {
        const noise = getRandomLaplacianNoise(contributionBudget, epsilon)

        var randCount = 0;

        if(mode == 'pro') 
        {
            const dataKey = keyCombinations.combinations[i].toString()
            const val = syntheticDataV[dataKey]
            randCount = val * batchingFrequency
        } 
        else 
        {
            randCount = generateSummaryValue(
                metric,
                i,
                dailyCount,
                batchingFrequency,
                getZeroConversionsPercentageFromDom()
            )
        }


        const noiseValueAPE = calculateNoisePercentage(
            noise,
            // Noiseless summary value
            Math.round(randCount * scalingFactor)
        )
        noisePercentageSum += noiseValueAPE

        const summaryValue_scaled_noisy = Math.round(randCount * scalingFactor + noise)

        report.push({
            key: keyCombinations.combinations[i],
            summaryValue: randCount,
            summaryValue_scaled_noiseless: Math.round(randCount * scalingFactor),
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
        dimensionsString: keyCombinationString,
        simulationNo: simulationNo,
    }

    return simulationReport
}
