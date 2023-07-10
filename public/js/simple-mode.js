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
    getEpsilonFromDom,
    getIsUseScalingFromDom,
    getBudgetValueForMetricIdFromDom,
    loadPython,
    displaySimulationResults_unified,
    getIsKeyStrategyGranularFromDom
} from './dom'
import {
    downloadAll,
    tempSaveTable,
} from './utils.misc'
import {
    CONTRIBUTION_BUDGET,
    DEFAULT_MEASUREMENT_GOALS,
    DEFAULT_DIMENSIONS,
} from './config'
import { triggerSimulation } from './main'

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

    const dimensionNames = DEFAULT_DIMENSIONS.map((dim) => dim.name)
    console.log(dimensionNames)
    const dimensionSizes = DEFAULT_DIMENSIONS.map((dim) => dim.size)
    console.log(dimensionSizes)

    const simulation = triggerSimulation(
        DEFAULT_MEASUREMENT_GOALS,
        DEFAULT_DIMENSIONS,
        dimensionNames,
        dimensionSizes,
        getEpsilonFromDom(),
        CONTRIBUTION_BUDGET,
        getIsUseScalingFromDom(),
        getIsKeyStrategyGranularFromDom(),
        getBatchingFrequencyFromDom(),
        getBatchingFrequencyFromDom()
    )

    displaySimulationResults_unified(simulation, "simple")
}


window.downloadAll_simpleMode = downloadAll_simpleMode
window.simulateAndDisplayResultsSimpleMode = simulateAndDisplayResultsSimpleMode
