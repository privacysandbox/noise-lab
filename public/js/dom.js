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
// TODO-NOTE the non needed deps. Changing this to avoid circular dependencies in tooltips
import { BATCHING_FREQUENCIES_MAP, SCALING_MAP } from './config'
import { saveTable } from './store'
//  TODO-NOTE Keeping this below breaks!! Changed this to avoid circular dependencies in tooltips that caused a module loading issue
// import { updateTooltips, updateOutlierNote } from './tooltips'

// TODO-CLEAN Remove all unneeded functions

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
        dailyConversionCountPerBucket,
        dimensions,
        epsilon,
        measurementGoals,
        keyStrategy,
        batchingFrequency,
        scaling,
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
                'Value (raw)': dailyConversionCountPerBucket,
                'Value (formatted)': dailyConversionCountPerBucket,
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
                'Value (raw)': scaling,
                'Value (formatted)': SCALING_MAP[scaling],
            },
        ],
        true
    )

    saveTable(table, `${simulationId}-params`)
}

// Validate the inputs are correct
// TODO FIX and Base this on state source of truth, not on DOM!
export function validateInputsBeforeSimulation(
    metrics,
    dimensions,
    isGranular,
    isUseScaling,
    keyStructuresCount
) {
    // var errors = []
    // if (isUseScaling) {
    //     validateBudgetPercentages(metrics, errors, keyStructuresCount)
    // }
    // validateMetrics(metrics, errors)
    // validateDimensions(dimensions, errors)
    // if (!isGranular) validateKeyStrategy(errors, keyStructuresCount)
    // validateConversionsPerBucket(errors)
    // const formValidationWrapperEl = getFormValidationElFromDom()
    // if (errors.length <= 0) {
    //     resetFormValidation()
    //     return true
    // }
    // formValidationWrapperEl.className = ''
    // const suffix = errors.length > 1 ? 's' : ''
    // const title = `❌ Could not simulate. ${errors.length} error${suffix}: \n`
    // const errorListAsString = errors.map((e) => `• ${e}.`).join('\n')
    // formValidationWrapperEl.innerText = `${title} \n ${errorListAsString}`
    // return false
    return true
}

function validateMetrics(metrics, errors) {
    metrics.forEach((element) => {
        if (element.maxValue * 1 < 1 || element.maxValue == undefined)
            errors.push(element.name + ' - maximum value must be >= 1')
        if (element.avgValue * 1 < 1 || element.avgValue == undefined)
            errors.push(element.name + ' - average value must be >= 1')
        if (element.avgValue * 1 > element.maxValue * 1)
            errors.push(
                element.name +
                    ' - maximum value cannot be smaller than average value'
            )
    })
}

function validateBudgetPercentages(metrics, errors, keyStructuresCount) {
    const sumOfAllPercentages = metrics.reduce((sum, metric) => {
        return sum + getBudgetValueForMetricIdFromDom(metric.id)
    }, 0)

    if (getIsPercentageBudgetSplitFromDom() && sumOfAllPercentages > 100) {
        errors.push('The sum of all budget split percentages exceeds 100')
    }

    if (
        getIsPercentageBudgetSplitFromDom() &&
        !getIsKeyStrategyGranularFromDom() &&
        sumOfAllPercentages > Math.floor(100 / keyStructuresCount)
    ) {
        errors.push(
            'The sum of all budget split percentages exceeds the maximum allowed per key: 100/<the number of all keys>'
        )
    }

    if (
        !getIsPercentageBudgetSplitFromDom() &&
        sumOfAllPercentages > getContributionBudgetFromDom()
    ) {
        errors.push(
            'The sum of all budget split values exceeds the total contribution budget ' +
                getContributionBudgetFromDom()
        )
    }

    if (
        !getIsPercentageBudgetSplitFromDom() &&
        !getIsKeyStrategyGranularFromDom() &&
        sumOfAllPercentages >
            Math.floor(getContributionBudgetFromDom() / keyStructuresCount)
    ) {
        errors.push(
            'The sum of all budget split values exceeds the total contribution budget per key - <total contribution budget>/<total number of keys>'
        )
    }
}

function validateDimensions(dimensions, errors) {
    var totalNumberOfPossibleDistinctValues = 1

    dimensions.forEach((dimension) => {
        // dimension.size is the number of distinct values for that dimension
        if (
            dimension.size * 1 < 1 ||
            dimension.size == undefined ||
            dimension.size == ''
        )
            errors.push(dimension.name + ' - dimension size must be >=1 ')
        totalNumberOfPossibleDistinctValues =
            totalNumberOfPossibleDistinctValues * dimension.size
    })

    if (totalNumberOfPossibleDistinctValues > Math.pow(2, 128))
        errors.push(
            'The dimensions sizes you defined would result in a key longer than 128 bits. Please adjust the dimensions sizes so their product is <= 128'
        )
}

function validateKeyStrategy(errors, keyStructuresCount) {
    if (keyStructuresCount <= 1) {
        errors.push(
            'When using Key Strategy B (less granular), the number of key structures must be >1 '
        )
        return
    }
    for (var i = 1; i <= keyStructuresCount; i++) {
        var checkboxes = document.getElementsByName('strategy' + i)
        checkboxes = Array.prototype.slice.call(checkboxes, 0)
        var noChecked = checkboxes.filter((element) => element.checked).length
        if (noChecked < 2)
            errors.push(
                'Key structure ' +
                    i +
                    ': at least 2 dimensions should be checked for each key structure'
            )
    }
}

function validateConversionsPerBucket(errors) {
    var convPerBucket = getDailyEventCountPerBucket()

    if (convPerBucket < 1) {
        errors.push(
            'The daily conversion count is too low. Please increase it so there is at least 1 conversion per bucket'
        )
    }
}

export function loadPython() {
    // pyCode is the var declared in python-file.js and containing the full python code
    var pyCodeText = document.createTextNode(pyCode)

    var pyScriptSection = document.getElementById('py-script')
    pyScriptSection.appendChild(pyCodeText)
}
