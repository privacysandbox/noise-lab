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
    displaySimulationResults_unified,
    getMetricsArrayFromDom,
    getDimensionsArrayFromDom,
    getIsKeyStrategyGranularFromDom,
    getAllDimensionNamesFromDom,
    displayMetrics,
    displayDimensions,
    addMetric,
    removeMetric,
    initializeDisplayGeneric,
    addDimension,
    removeDimension,
    getIsUseScalingFromDom,
    displayBudgetSplit,
    loadPython,
    getEventCount,
} from './dom'
import {
    tempSaveTable,
    downloadAll
} from './utils.misc'
import {
    CONTRIBUTION_BUDGET,
    DEFAULT_MEASUREMENT_GOALS,
    DEFAULT_DIMENSIONS,
} from './config'

import { triggerSimulation } from './main'

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

export function simulateAndDisplayResultsAdvancedMode() {
    const simulation = triggerSimulation(
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

    displaySimulationResults_unified(simulation, "advanced")
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
