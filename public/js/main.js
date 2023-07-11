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

import { generateConfirmMessage } from './utils.misc'
import { initializeDisplay_simpleMode } from './simple-mode'
import { initializeDisplay_advancedMode } from './advanced-mode'
import { APP_VERSION, MODES, modeSearchQueryParams } from './config'
import { 
    validateInputsBeforeSimulation,
    getKeyStrategyFromDom,
    getIsKeyStrategyGranularFromDom,
    getDailyValue,
    getBudgetValueForMetricIdFromDom,
    getIsPercentageBudgetSplitFromDom,
    getKeyCombinationString,
    getZeroConversionsPercentageFromDom,
    getStrategiesKeyCombinations
 } from './dom'
 import { generateSimulationId, 
    generateSimulationTitle,
 } from './utils.misc'
import {
    getRandomLaplacianNoise,
    getScalingFactorForMetric,
    calculateNoisePercentage,
    generateKeyCombinationArray,
    generateSummaryValue,
    calculateAverageNoisePercentageRaw,
    getNoise_Rmsre,
} from './utils.noise'

// Generate navigation menu automatically based on the available modes
function generateMenu() {
    const navWrapper = document.getElementById('nav')
    Object.values(MODES).forEach((mode) => {
        const { searchQueryParam, displayName } = mode
        const a = document.createElement('a')
        a.setAttribute(
            'data-href',
            `${location.origin}${location.pathname}?mode=${mode.searchQueryParam}`
        )
        a.setAttribute('id', searchQueryParam)
        a.addEventListener('click', () => {
            if (window.confirm(generateConfirmMessage())) {
                window.location = `${location.origin}${location.pathname}?mode=${mode.searchQueryParam}`
            }
        })
        a.innerText = displayName
        navWrapper.appendChild(a)
    })
}

function displayVersionNumber() {
    document.getElementById('app-version').innerText = APP_VERSION
}

export function getCurrentModeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search)
    let mode = urlParams.get('mode')
    return mode
}

window.addEventListener('load', function (event) {
    generateMenu()
    displayVersionNumber()

    // If the mode is unknown, redirect to simple mode (= fallback mode)
    if (!modeSearchQueryParams.includes(getCurrentModeFromUrl())) {
        window.location.href = `${location.origin}${location.pathname}?mode=${MODES.simple.searchQueryParam}`
    }

    // Highlight current menu item
    document.querySelectorAll('nav a').forEach((navItem) => {
        if (navItem.getAttribute('data-href') === document.URL) {
            navItem.className = 'current-menu-item'
        }
    })

    // Display correct section and hide the other ones
    const allSections = document.querySelectorAll('.mode-section')
    allSections.forEach((section) => {
        if (section.id !== `${getCurrentModeFromUrl()}-mode`) {
            // Mode isn't selected => remove it from the DOM
            section.parentElement.removeChild(section)
        }
    })

    // Initialize parameters and fields for the current mode
    const mode = getCurrentModeFromUrl()
    if (mode === MODES.simple.searchQueryParam) {
        initializeDisplay_simpleMode()
    } else if (mode === MODES.advanced.searchQueryParam) {
        initializeDisplay_advancedMode()
    } else {
        throw new Error('mode unkown')
    }
})

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
                    ? getDailyValue()
                    : Math.floor(dailyConversionCount / keyCombList[i].size),
                i
            ))
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

        const noiseValueAPE = calculateNoisePercentage(
            noise,
            // Noiseless summary value
            randCount * scalingFactor
        )
        noisePercentageSum += noiseValueAPE

        const summaryValue_scaled_noisy = randCount * scalingFactor + noise

        report.push({
            key: keyCombinations.combinations[i],
            summaryValue: randCount,
            summaryValue_scaled_noiseless: randCount * scalingFactor,
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

    const noise_ape = calculateAverageNoisePercentageRaw(
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
            noise_rmsre: noise_rmsre 
        },
        scalingFactor: scalingFactor,
        measurementGoal: metric.name,
        dimensionsString: keyCombinationString,
        simulationNo: simulationNo
       
    }

      return simulationReport
}