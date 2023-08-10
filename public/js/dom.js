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

import { TabulatorFull } from 'tabulator-tables'
import { BATCHING_FREQUENCIES_MAP, SCALING_MAP } from './config'
import { saveTable } from './store'

export function appendDataTableChild(
    parentDomEl,
    tabularData,
    collapsable = false
) {
    // Create a wrapper div that will contain the table
    const tableEl = collapsable
        ? document.createElement('details')
        : document.createElement('div')
    parentDomEl.appendChild(tableEl)

    return createAndDisplayDataTable(tableEl, tabularData, {
        columnDefaults: {
            headerSort: false,
            formatter: 'html',
        },
        selectable: false,
    })
}

export function createAndDisplayDataTable(
    htmlSelector,
    tabularData,
    tableOptions
) {
    return new TabulatorFull(htmlSelector, {
        data: tabularData,
        autoColumns: true,
        layout: 'fitColumns',
        ...tableOptions,
    })
}

export function displayInputParameters(
    parentDomEl,
    inputParameters,
    simulationId
) {
    const tableContainerEl = document.createElement('div')
    parentDomEl.appendChild(tableContainerEl)

    const {
        dailyEventCountPerBucket,
        dimensions,
        epsilon,
        measurementGoals,
        keyStrategy,
        batchingFrequency,
        useScaling,
    } = inputParameters

    const measGoalsDisplay = document.createElement('div')
    measGoalsDisplay.innerText = measurementGoals
        .map((m) =>
            Object.entries(m)
                .map(([k, v]) => `${k}: ${v}`)
                .join(' \n ')
        )
        .join('\n⏤⏤⏤\n ')

    const dimensionsDisplay = document.createElement('div')
    dimensionsDisplay.innerText = dimensions
        .map((m) =>
            Object.entries(m)
                .map(([k, v]) => `${k}: ${v}`)
                .join(' \n ')
        )
        .join('\n⏤⏤⏤\n ')

    const table = appendDataTableChild(
        tableContainerEl,
        [
            {
                Parameter: 'Epsilon',
                'Value (raw)': epsilon,
                'Value (formatted)': epsilon,
            },
            {
                Parameter: 'Key Strategy',
                'Value (raw)': keyStrategy,
                'Value (formatted)': keyStrategy,
            },
            {
                Parameter:
                    'Average daily attributable conversion count PER BUCKET',
                'Value (raw)': dailyEventCountPerBucket,
                'Value (formatted)': dailyEventCountPerBucket,
            },
            {
                Parameter: 'Dimensions',
                'Value (raw)': JSON.stringify(dimensions),
                'Value (formatted)': dimensionsDisplay,
            },
            {
                Parameter: 'Measurement goals',
                'Value (raw)': JSON.stringify(measurementGoals),
                'Value (formatted)': measGoalsDisplay,
            },
            {
                Parameter: 'Batching frequency',
                'Value (raw)': batchingFrequency,
                'Value (formatted)':
                    BATCHING_FREQUENCIES_MAP[batchingFrequency],
            },
            {
                Parameter: 'Scaling',
                'Value (raw)': useScaling,
                'Value (formatted)': SCALING_MAP[useScaling],
            },
        ],
        true
    )

    saveTable(table, `${simulationId}-params`)
}

export function loadPython() {
    // pyCode is the var declared in python-file.js and containing the full python code
    var pyCodeText = document.createTextNode(pyCode)

    var pyScriptSection = document.getElementById('py-script')
    pyScriptSection.appendChild(pyCodeText)
}
