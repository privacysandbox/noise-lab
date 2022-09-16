import {
    clearDataDisplay,
    displayContributionBudget,
    getEpsilonFromDom,
    getFrequencyValue,
    getDailyValue,
    getAllDimensionSizes,
    displayAdvancedReports,
    getMetricsArray,
    createSimulationDiv,
    getDimensionsArray,
    addKeyStrategyListener,
    isGranular,
    getStrategiesKeyCombinations,
    getAllDimensionNames,
    displayMetrics,
    displayDimensions,
    addMetric,
    removeMetric,
    addMetricsButtons,
    addDimension,
    removeDimension,
    addDimensionsButtons,
    getIsUseScalingFromDom,
    getKeyCombinationString,
} from './dom.js'

import { CONTRIBUTION_BUDGET } from './consts.js'

import {
    getRandomLaplacianNoise,
    calculateMaximumCount,
    getScalingFactorForMetric,
    calculateNoisePercentage,
    generateKeyCombinationArray,
} from './utils.noise.js'

// global variables
var simulationNo = 1

// define default metrics
const defaultMetrics = [
    { id: 1, name: 'purchaseValue', maxValue: 120, minValue: 1000 },
    { id: 2, name: 'purchaseCount', maxValue: 1, minValue: 1 },
]

// define default dimensions
const defaultDimensions = [
    { id: '1', size: '3', name: 'geography' },
    { id: '2', size: '2', name: 'campaignId' },
    { id: '3', size: '2', name: 'productCategory' },
]

initialize()

function initialize() {
    displayContributionBudget(CONTRIBUTION_BUDGET)
    addKeyStrategyListener()
    displayMetrics(defaultMetrics)
    addMetricsButtons()
    displayDimensions(defaultDimensions)
    addDimensionsButtons()
}

function simulatePerMetric(mainDiv, keyCombinations, metricsNo, metric) {
    const scalingFactor = getIsUseScalingFromDom()
        ? getScalingFactorForMetric(metric, metricsNo, CONTRIBUTION_BUDGET)
        : 1
    const keyCombinationString = getKeyCombinationString(keyCombinations.names)


    const max = calculateMaximumCount(
        getFrequencyValue(),
        getDailyValue(),
        metric.maxValue
    )

    const min = metric.minValue * getFrequencyValue()
    const report = []
    var averageNoisePercentage = 0
    for (let i = 0; i < keyCombinations.combinations.length; i++) {
        const noise = getRandomLaplacianNoise(
            CONTRIBUTION_BUDGET,
            getEpsilonFromDom()
        )
        const randCount = Math.floor(Math.random() * (max - min) + min)
        const noisePercentage = calculateNoisePercentage(
            noise,
            randCount * scalingFactor + noise
        )
        averageNoisePercentage += noisePercentage

        report.push({
            key: keyCombinations.combinations[i],
            aggregatedValue: randCount,
            scaledAggregatedValue: randCount * scalingFactor,
            noisedScaledAggregatedValue: randCount * scalingFactor + noise,
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

    displayAdvancedReports(
        mainDiv,
        simulationReport,
        metric.name,
        scalingFactor,
        keyCombinationString
    )
}

export function resetMetrics() {
    displayMetrics(defaultMetrics)
}

export function resetDimensions() {
    displayDimensions(defaultDimensions)
}
// generate dataset
export function triggerSimulation() {
    // declare array containing possible combinations for keys
    var r = []
    var keyCombList = []

    var metrics = getMetricsArray()
    var dimensions = getDimensionsArray()

    // logic for generating one dataset with all keys - string parameter 'all' is used
    if (isGranular()) {
        var keyComb = generateKeyCombinationArray(getAllDimensionSizes())
        keyCombList.push({
            names: getAllDimensionNames(),
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

    var simulationDiv = createSimulationDiv(simulationNo, metrics, dimensions)

    metrics.forEach((element) => {
        for (let i = 0; i < keyCombList.length; i++) {
            simulatePerMetric(
                simulationDiv,
                keyCombList[i],
                metrics.length,
                element
            )
        }
    })

    simulationNo += 1
}

function clearAllAdvancedMode() {
    document.getElementById('all-simulations-wrapper-advanced-mode').innerHTML =
        ''
}

window.triggerSimulation = triggerSimulation
window.clearDataDisplay = clearDataDisplay
window.addMetric = addMetric
window.removeMetric = removeMetric
window.resetMetrics = resetMetrics
window.addDimension = addDimension
window.removeDimension = removeDimension
window.resetDimensions = resetDimensions
window.clearAllAdvancedMode = clearAllAdvancedMode
