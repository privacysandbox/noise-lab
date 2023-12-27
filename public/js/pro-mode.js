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
    getBatchingFrequencyFromDom,
    getAllDimensionSizes,
    displaySimulationResults,
    getMetricsArrayFromDom,
    getDimensionsArrayFromDom,
    getIsKeyStrategyGranularFromDom,
    getAllDimensionNamesFromDom,
    displayMetrics,
    displayDimensions,
    displayDimensionsPro,
    addMetric,
    removeMetric,
    initializeDisplayGeneric,
    addDimension,
    removeDimension,
    getIsUseScalingFromDom,
    displayBudgetSplit,
    loadPython,
    getDailyEventCountPerBucket,
    getDailyEventCountTotal,
    updateDailyPerBucket,
} from './dom'
import {
    CONTRIBUTION_BUDGET,
    DEFAULT_MEASUREMENT_GOALS,
    DEFAULT_DIMENSIONS,
} from './config'

import { simulate } from './utils.simulate'

export function initializeDisplay_proMode() {
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

export function simulateAndDisplayResults_proMode() {

    const simulation = simulate(
        getMetricsArrayFromDom(),
        getDimensionsArrayFromDom(),
        getAllDimensionNamesFromDom(),
        getAllDimensionSizes(),
        getEpsilonFromDom(),
        CONTRIBUTION_BUDGET,
        getIsUseScalingFromDom(),
        getIsKeyStrategyGranularFromDom(),
        getBatchingFrequencyFromDom(),
        getDailyEventCountPerBucket(),
        getDailyEventCountTotal()
    )

    displaySimulationResults(simulation)


    // generateDataset(0.39, 0.14, 15, [3,4], [2], 3)
}

export function resetMetrics() {
    displayMetrics(DEFAULT_MEASUREMENT_GOALS)
}

export function resetBudgetSplit() {
    displayBudgetSplit()
}

export function resetDimensions() {
    displayDimensions(DEFAULT_DIMENSIONS)
}

window.simulateAndDisplayResults_proMode =
    simulateAndDisplayResults_proMode
window.addMetric = addMetric
window.removeMetric = removeMetric
window.resetMetrics = resetMetrics
window.addDimension = addDimension
window.removeDimension = removeDimension
window.resetDimensions = resetDimensions
window.resetBudgetSplit = resetBudgetSplit
