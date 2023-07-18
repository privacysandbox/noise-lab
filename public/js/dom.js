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
import {
    generateSimulationWrapperElId,
    generateConfirmMessage,
} from './utils.misc'
// TODO-NOTE the non needed deps. Changing this to avoid circular dependencies in tooltips
import { RMSRE_THRESHOLD } from './config'
import { resetData, saveTable, downloadAll } from './store'
//  TODO-NOTE Keeping this below breaks!! Changed this to avoid circular dependencies in tooltips that caused a module loading issue
// import { updateTooltips, updateOutlierNote } from './tooltips'

export function downloadAllDom() {
    downloadAll()
}

export function displayContributionBudget(budget) {
    document.getElementById('contribution-budget').innerText = budget
}

export function displayEpsilon(epsilon) {
    document.getElementById('eps').value = epsilon
}

export function displayMaxPurchaseAmount(amount) {
    document.getElementById('amount').value = amount
}

export function getIsUseScalingFromDom() {
    // !! to convert to boolean
    return !!Number.parseInt(document.getElementById('scaling').value)
}

export function getKeyStrategyFromDom() {
    return document.getElementById('key-strategy-select').value
}

export function getIsKeyStrategyGranularFromDom() {
    return document.getElementById('key-strategy-select').value == 'A'
        ? true
        : false
}

// TODO-CLEAN Remove all unused functions
export function getBatchingFrequencyFromDom() {
    return document.getElementById('batching-frequency-select').value
}

export function getEpsilonFromDom() {
    return document.getElementById('eps').value
}

export function getIsPercentageBudgetSplitFromDom() {
    return document.getElementById('percentage')
        ? document.getElementById('percentage').checked
        : true
}
function getFormValidationElFromDom() {
    return document.getElementById('form-validation-wrapper')
}

function getContributionBudgetFromDom() {
    return document.getElementById('contribution-budget').innerHTML
}

function getBudgetSplitOptionFromDom() {
    return document.querySelector('input[name="budget-split-option"]:checked')
        .value
}
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

// TODO-CLEAN: merge appendDataTableChild with createAndDisplayDataTable
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

export function populateSelectDomElement(selectDomElement, options) {
    options.forEach((option) => {
        const optEl = document.createElement('option')
        optEl.value = option.value
        optEl.innerHTML = option.name
        if (option.isDefault) {
            optEl.setAttribute('selected', true)
        }
        selectDomElement.appendChild(optEl)
    })
}

export function displayBudgetSplit() {
    const budgetSplitWrapperEl = document.getElementById(
        'budget-split-wrapper-el'
    )
    budgetSplitWrapperEl.innerHTML = ''
    const measurementGoals = getMetricsArrayFromDom()
    const contributionBudget = getContributionBudgetFromDom()
    const numberOfMeasurementGoals = measurementGoals.length
    const budgetSplitOption = getBudgetSplitOptionFromDom()

    const noKeys = getIsKeyStrategyGranularFromDom()
        ? 1
        : getKeyStrategiesNumberFromDom()

    const defaultValueOfBudgetPerMeasurementGoal =
        budgetSplitOption == 'percentage'
            ? (100 / numberOfMeasurementGoals / noKeys).toFixed(0)
            : (contributionBudget / numberOfMeasurementGoals / noKeys).toFixed(
                  0
              )

    measurementGoals.forEach((m) => {
        const { id } = m
        const label = document.createElement('label')
        label.innerText =
            `Budget ` + budgetSplitOption + ` for measurement goal ${id}:`
        const input = document.createElement('input')
        input.id = `budget-percent-meas-goal-${id}`
        input.value = defaultValueOfBudgetPerMeasurementGoal
        input.setAttribute('type', 'number')
        budgetSplitWrapperEl.appendChild(label)
        budgetSplitWrapperEl.appendChild(input)
    })
}

export function addScalingListener() {
    const scalingSelector = document.getElementById('scaling')
    const budgetSplitDiv = document.getElementById('budget-split')

    scalingSelector.addEventListener('change', function () {
        if (scalingSelector.value == 0) {
            budgetSplitDiv.style.display = 'none'
        } else {
            budgetSplitDiv.style.display = 'block'
        }
    })
}

export function initializeDisplayGeneric(
    CONTRIBUTION_BUDGET,
    KEY_STRATEGIES,
    BATCHING_FREQUENCIES
) {
    displayContributionBudget(CONTRIBUTION_BUDGET)
    populateSelectDomElement(
        document.getElementById('key-strategy-select'),
        Object.values(KEY_STRATEGIES)
    )
    populateSelectDomElement(
        document.getElementById('batching-frequency-select'),
        Object.values(BATCHING_FREQUENCIES)
    )
    addScalingListener()
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
        metrics,
        keyStrategy,
        batchingFrequency,
        isUseScaling,
    } = inputParameters

    const metricsDisplay = document.createElement('div')
    metricsDisplay.innerText = metrics
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

    // TODO-CLEAN Move this out
    const batchingFrequenciesMap = {
        [1 / 24]: 'hourly',
        1: 'daily',
        7: 'weekly',
        30: 'monthly',
    }

    // TODO-CLEAN Move this out
    const scalingMap = {
        true: 'Yes (recommended)',
        false: 'No',
    }

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
                Parameter: 'Metrics',
                'Value (raw)': JSON.stringify(metrics),
                'Value (formatted)': metricsDisplay,
            },
            {
                Parameter: 'Batching frequency',
                'Value (raw)': batchingFrequency,
                'Value (formatted)': batchingFrequenciesMap[batchingFrequency],
            },
            {
                Parameter: 'Scaling',
                'Value (raw)': isUseScaling,
                'Value (formatted)': scalingMap[isUseScaling],
            },
        ],
        true
    )

    saveTable(table, `${simulationId}-params`)
}

// TODO-CLEAN Remove this
function displayEmptyState() {
    const emptyStateDivs = document.querySelectorAll(`.empty-state`)
    emptyStateDivs.forEach((el) => (el.className = 'empty-state visible'))
}
function hideEmptyState() {
    const emptyStateDiv = document.getElementById('empty-state')
    emptyStateDiv.className = 'empty-state hidden'
}

function displayNoiseAsPercentageWithBadge(
    parentDomEl,
    noise_value,
    noiseMetricDisplayName,
    noiseMetricId,
    isPercentage
) {
    // noiseMetricName = Average percentage error (APE)
    const labelEl = document.createElement('h5')
    const valueEl = document.createElement('div')
    labelEl.innerText = `${noiseMetricDisplayName}: `
    // Set a class to display noise in color
    valueEl.setAttribute(
        'class',
        `noise ${getNoiseBadgeType(noise_value, isPercentage)} has-helper`
    )

    const exactValueEl = document.createElement('div')
    exactValueEl.setAttribute('class', 'has-helper mono')
    var exactValueText = `Exact value = ${noise_value}`
    if (isPercentage) exactValueText += '%'

    exactValueEl.innerText = exactValueText

    const helper = document.createElement('div')
    helper.setAttribute('class', `help help-noise-${noiseMetricId}`)

    parentDomEl.appendChild(labelEl)
    parentDomEl.appendChild(valueEl)
    parentDomEl.appendChild(exactValueEl)
    parentDomEl.appendChild(helper)
}

function displayDataDetailsTitle(parentDomEl) {
    const dataDetailsTitle = document.createElement('h5')
    dataDetailsTitle.innerText = 'Details of the data: '
    dataDetailsTitle.setAttribute('class', 'has-helper')
    const dataTableHelper = document.createElement('div')
    dataTableHelper.setAttribute('class', 'help help-data')
    parentDomEl.appendChild(dataDetailsTitle)
    parentDomEl.appendChild(dataTableHelper)
}

function displayDimensionsInOutput(parentDomEl, keyCombinationDisplay) {
    const dimensionsTitle = document.createElement('h6')
    dimensionsTitle.innerText = 'Dimensions:'
    const dimensionsValue = document.createElement('div')
    dimensionsValue.setAttribute('class', 'offset-left mono')
    dimensionsValue.innerText = keyCombinationDisplay
    parentDomEl.appendChild(dimensionsTitle)
    parentDomEl.appendChild(dimensionsValue)
}

function displayScalingFactor(parentDomEl, scalingFactor) {
    const scalingFactorTitle = document.createElement('h6')
    scalingFactorTitle.innerText = 'Scaling factor:'
    const scalingFactorValue = document.createElement('div')
    scalingFactorValue.setAttribute('class', 'offset-left has-helper mono')
    const scalingFactorHelper = document.createElement('div')
    scalingFactorHelper.setAttribute('class', 'help help-scaling-factor-value')
    scalingFactorValue.innerText = scalingFactor
    parentDomEl.appendChild(scalingFactorTitle)
    parentDomEl.appendChild(scalingFactorValue)
    parentDomEl.appendChild(scalingFactorHelper)
}

function displayNoiseAsPercentage(parentDomEl, noise_ape_percent, noise_rmsre) {
    const noiseWrapperDiv = document.createElement('div')
    noiseWrapperDiv.setAttribute('class', 'noise-wrapper')
    parentDomEl.appendChild(noiseWrapperDiv)

    displayNoiseAsPercentageWithBadge(
        noiseWrapperDiv,
        noise_ape_percent,
        'Average percentage error (APE)',
        'ape',
        true
    )
    displayNoiseAsPercentageWithBadge(
        noiseWrapperDiv,
        noise_rmsre,
        `RMSRE with t=${RMSRE_THRESHOLD}`,
        'rmsre',
        false
    )
}

export function getBudgetValueForMetricIdFromDom(metricId) {
    return Number.parseInt(
        getElementValueById(`budget-percent-meas-goal-${metricId}`)
    )
}

// TODO-CLEAN Check / Remove
export function resetUi() {
    // reset form validation
    // clear output
    resetFormValidation()
    clearSimulationArea()
    resetData()
}

function resetFormValidation() {
    const formValidationWrapperEl = getFormValidationElFromDom()
    if (formValidationWrapperEl) {
        formValidationWrapperEl.innerText = ''
        formValidationWrapperEl.className = 'hidden'
    }
}
function clearSimulationArea() {
    // Prompt user to confirm
    if (window.confirm(generateConfirmMessage())) {
        document
            .querySelectorAll('.all-simulations-wrapper')
            .forEach((el) => (el.innerHTML = ''))
        resetData()
    }
    displayEmptyState()
}

// !!!!!!!!!!
// Functions needed for ADVANCED MODE
// !!!!!!!!!

export function getDailyEventCountPerBucket() {
    return document.getElementById('event-count-daily-bucket').value
}

export function getDailyEventCountTotal() {
    return document.getElementById('event-count-daily-total').value
}

export function getElementValueById(id) {
    return document.getElementById(id).value
}

export function getAllDimensionSizes() {
    var keyNo = document.getElementById('dimensions-number').value

    var dimensions = []
    for (var i = 1; i <= keyNo; i++) {
        dimensions.push(
            document.getElementById('dimension' + i + '-size').value
        )
    }
    return dimensions
}

export function getAllDimensionNamesFromDom() {
    var keyNo = document.getElementById('dimensions-number').value

    var ids = []
    for (var i = 1; i <= keyNo; i++) {
        ids.push(document.getElementById('dimension' + i + '-name').value)
    }
    return ids
}

export function getMetricsArrayFromDom() {
    var len = document.getElementById('metrics-number').value
    var metrics = []
    for (let i = 1; i <= len; i++) {
        metrics.push({
            id: i,
            maxValue: document.getElementById('metric' + i + '-max').value,
            avgValue: document.getElementById('metric' + i + '-def').value,
            name: document.getElementById('metric' + i + '-name').value,
        })
    }

    return metrics
}

export function getDimensionsArrayFromDom() {
    var len = document.getElementById('dimensions-number').value
    var dimensions = []
    for (let i = 1; i <= len; i++) {
        dimensions.push({
            id: i,
            size: document.getElementById('dimension' + i + '-size').value,
            name: document.getElementById('dimension' + i + '-name').value,
        })
    }

    return dimensions
}

export function addKeyStrategyListener() {
    const keyStrategySelector = document.getElementById('key-strategy-select')
    const granularDiv = document.getElementById('granular')
    const budgetSplitWarn = document.getElementById('help-budget-split-warning')

    keyStrategySelector.addEventListener('change', function () {
        if (keyStrategySelector.value == 'A') {
            granularDiv.style.display = 'none'
            budgetSplitWarn.style.display = 'none'
        } else {
            granularDiv.style.display = 'block'
            budgetSplitWarn.style.display = 'block'
        }
        displayBudgetSplit()
    })
}

export function generateKeyStructures() {
    const strategiesDiv = document.getElementById('strategies')
    strategiesDiv.innerHTML = ''
    const keyStrayegies = document.getElementById('structures-number').value

    for (let i = 1; i <= keyStrayegies; i++) {
        addCheckboxStrategy(i, strategiesDiv)
    }
}

function addCheckboxStrategy(id, parentDomEl) {
    const strategyTitle = document.createElement('h4')
    strategyTitle.innerHTML = 'Key structure ' + id

    parentDomEl.appendChild(strategyTitle)

    const cbName = 'strategy' + id
    const strategyDiv = document.createElement('div')
    strategyDiv.setAttribute('id', 'strategy' + id)
    parentDomEl.appendChild(strategyDiv)

    var dimensions = getDimensionsArrayFromDom()

    dimensions.forEach((element) => {
        const checkBox = document.createElement('input')
        checkBox.setAttribute('type', 'checkbox')
        checkBox.setAttribute('value', element.id)
        checkBox.setAttribute('name', cbName)
        checkBox.setAttribute('id', 'cb' + id + '-' + element.id)
        const cbLabel = document.createElement('label')
        cbLabel.htmlFor = 'cb' + id + '-' + element.id
        cbLabel.innerHTML = element.name
        strategyDiv.appendChild(checkBox)
        strategyDiv.appendChild(cbLabel)
        strategyDiv.appendChild(document.createElement('br'))
    })
}

export function getKeyStrategiesNumberFromDom() {
    return document.getElementById('structures-number').value
}

export function getStrategiesKeyCombinations(dimensions) {
    const keyStrategies = document.getElementById('structures-number').value
    var allCombs = []

    for (let i = 1; i <= keyStrategies; i++) {
        var combinations = []
        var names = []
        var checkboxes = document.getElementsByName('strategy' + i)
        for (var j = 0; j < checkboxes.length; j++) {
            if (checkboxes[j].checked) {
                combinations.push(dimensions[checkboxes[j].value - 1].size)
                names.push(dimensions[checkboxes[j].value - 1].name)
            }
        }

        allCombs.push({
            names: names,
            combinations: combinations,
        })
    }

    return allCombs
}

export function displayMetrics(metrics) {
    // Update metrics number
    var metricsNo = document.getElementById('metrics-number')
    metricsNo.value = metrics.length
    metricsNo.disabled = true

    // Get metrics main div
    var metricsMainDiv = document.getElementById('metrics-div')
    metricsMainDiv.innerHTML = ''

    // Parse metrics
    metrics.forEach((element) => {
        var metricDiv = document.createElement('div')
        metricDiv.setAttribute('id', 'metric' + element.id)
        metricsMainDiv.appendChild(metricDiv)

        var metricHeader = document.createElement('h4')
        metricHeader.innerHTML = 'Measurement goal ' + element.id
        metricDiv.appendChild(metricHeader)

        var metricName = document.createElement('input')
        metricName.setAttribute('type', 'text')
        metricName.setAttribute('placeholder', 'Measurement goal name')
        metricName.setAttribute('id', 'metric' + element.id + '-name')
        metricName.value = element.name
        const metricNameLabel = document.createElement('label')
        metricNameLabel.innerText = 'Name:'
        metricDiv.appendChild(metricNameLabel)
        metricDiv.appendChild(metricName)
        metricDiv.appendChild(document.createElement('br'))

        var metricMax = document.createElement('input')
        metricMax.setAttribute('id', 'metric' + element.id + '-max')
        metricMax.setAttribute('type', 'number')
        metricMax.setAttribute('placeholder', 'Maximum value')
        metricMax.value = element.maxValue
        const metricMaxLabel = document.createElement('label')
        metricMaxLabel.innerText = 'Max value:'

        const outlierNote = document.createElement('div')
        outlierNote.setAttribute('class', 'help')
        outlierNote.setAttribute('id', 'help-outlier-management')
        metricMaxLabel.appendChild(outlierNote)

        metricDiv.appendChild(metricMaxLabel)
        metricDiv.appendChild(metricMax)
        metricDiv.appendChild(document.createElement('br'))

        var metricAvg = document.createElement('input')
        metricAvg.setAttribute('id', 'metric' + element.id + '-def')
        metricAvg.setAttribute('type', 'number')
        metricAvg.setAttribute('placeholder', 'Average value')
        metricAvg.value = element.avgValue
        const metricAvgLabel = document.createElement('label')
        metricAvgLabel.innerText = 'Average value:'
        metricDiv.appendChild(metricAvgLabel)
        metricDiv.appendChild(metricAvg)
        metricDiv.appendChild(document.createElement('br'))
    })

    updateOutlierNote()
    displayBudgetSplit()
}

export function addMetricsButtons() {
    const metricsButtonDiv = document.getElementById('metrics-buttons-div')

    var addMetricBtn = document.createElement('button')
    addMetricBtn.setAttribute('id', 'add-metric-button')
    addMetricBtn.setAttribute('class', 'ternary-xs')
    addMetricBtn.setAttribute('onclick', 'addMetric()')
    addMetricBtn.innerHTML = 'Add'
    metricsButtonDiv.appendChild(addMetricBtn)

    var removeMetricBtn = document.createElement('button')
    removeMetricBtn.setAttribute('id', 'remove-metric-button')
    removeMetricBtn.setAttribute('class', 'ternary-xs')

    removeMetricBtn.setAttribute('onclick', 'removeMetric()')
    removeMetricBtn.innerHTML = 'Remove'
    metricsButtonDiv.appendChild(removeMetricBtn)

    var resetMetricsBtn = document.createElement('button')
    resetMetricsBtn.setAttribute('id', 'reset-metrics-button')
    resetMetricsBtn.setAttribute('class', 'ternary-xs')
    resetMetricsBtn.setAttribute('onclick', 'resetMetrics()')
    resetMetricsBtn.innerHTML = 'Reset'
    metricsButtonDiv.appendChild(resetMetricsBtn)
}

export function addMetric() {
    var metricsNo = document.getElementById('metrics-number').value
    metricsNo = metricsNo * 1 + 1
    document.getElementById('metrics-number').value = metricsNo

    var metricsMainDiv = document.getElementById('metrics-div')

    var metricDiv = document.createElement('div')
    metricDiv.setAttribute('id', 'metric' + metricsNo)
    metricDiv.setAttribute('class', 'metric-item')
    metricsMainDiv.appendChild(metricDiv)

    var metricHeader = document.createElement('h4')
    metricHeader.innerHTML = 'Measurement goal ' + metricsNo
    metricDiv.appendChild(metricHeader)

    var metricName = document.createElement('input')
    metricName.setAttribute('type', 'text')
    metricName.setAttribute('placeholder', 'Measurement goal name')
    metricName.setAttribute('id', 'metric' + metricsNo + '-name')
    metricDiv.appendChild(metricName)
    metricDiv.appendChild(document.createElement('br'))

    var metricMax = document.createElement('input')
    metricMax.setAttribute('id', 'metric' + metricsNo + '-max')
    metricMax.setAttribute('type', 'number')
    metricMax.setAttribute('placeholder', 'Maximum value')
    const outlierNote = document.createElement('div')
    outlierNote.setAttribute('class', 'help')
    outlierNote.setAttribute('id', 'help-outlier-management')
    metricDiv.appendChild(metricMax)
    metricDiv.appendChild(outlierNote)

    metricDiv.appendChild(document.createElement('br'))

    var metricAvg = document.createElement('input')
    metricAvg.setAttribute('id', 'metric' + metricsNo + '-def')
    metricAvg.setAttribute('type', 'number')
    metricAvg.setAttribute('placeholder', 'Average value')
    metricDiv.appendChild(metricAvg)

    metricsMainDiv.appendChild(metricDiv)
    updateOutlierNote()
    displayBudgetSplit()
}

export function removeMetric() {
    var metricsNo = document.getElementById('metrics-number').value

    document.getElementById('metric' + metricsNo).remove()

    metricsNo = metricsNo * 1 - 1
    document.getElementById('metrics-number').value = metricsNo

    displayBudgetSplit()
}

export function displayDimensions(dimensions) {
    // Update dimensions number
    var dimensionsNo = document.getElementById('dimensions-number')
    dimensionsNo.value = dimensions.length
    dimensionsNo.disabled = true

    // Get dimensions main div
    var dimensionsMainDiv = document.getElementById('dimensions-div')
    dimensionsMainDiv.innerHTML = ''

    // Parse dimensions
    dimensions.forEach((element) => {
        var dimensionDiv = document.createElement('div')
        dimensionDiv.setAttribute('id', 'dimension' + element.id)
        dimensionsMainDiv.appendChild(dimensionDiv)

        var dimensionHeader = document.createElement('h4')
        dimensionHeader.innerHTML = 'Dimension ' + element.id
        dimensionDiv.appendChild(dimensionHeader)

        var dimensionName = document.createElement('input')
        dimensionName.setAttribute('type', 'text')
        dimensionName.setAttribute('placeholder', 'Dimension name')
        dimensionName.setAttribute('id', 'dimension' + element.id + '-name')
        dimensionName.value = element.name

        const dimensionNameLabel = document.createElement('label')
        dimensionNameLabel.innerText = 'Name:'
        dimensionDiv.appendChild(dimensionNameLabel)

        dimensionDiv.appendChild(dimensionName)
        dimensionDiv.appendChild(document.createElement('br'))
        dimensionDiv.addEventListener('change', () => {
            updateDailyPerBucket()
        })

        var dimensionSize = document.createElement('input')
        dimensionSize.setAttribute('id', 'dimension' + element.id + '-size')
        dimensionSize.setAttribute('type', 'number')
        dimensionSize.setAttribute('placeholder', 'Dimension size')
        dimensionSize.setAttribute('class', 'dimension-size')
        dimensionSize.value = element.size

        const dimensionSizeLabel = document.createElement('label')
        dimensionSizeLabel.innerText =
            'Number of possible different values for this dimension:'
        dimensionDiv.appendChild(dimensionSizeLabel)

        dimensionDiv.appendChild(dimensionSize)
        dimensionDiv.appendChild(document.createElement('br'))

        dimensionsMainDiv.appendChild(dimensionDiv)

        updateDailyPerBucket()
    })
}

export function addDimensionsButtons() {
    const dimensionsButtonDiv = document.getElementById(
        'dimensions-buttons-div'
    )

    var addDimensionBtn = document.createElement('button')
    addDimensionBtn.setAttribute('id', 'add-dimension-button')
    addDimensionBtn.setAttribute('onclick', 'addDimension()')
    addDimensionBtn.setAttribute('class', 'ternary-xs')
    addDimensionBtn.innerHTML = 'Add'
    dimensionsButtonDiv.appendChild(addDimensionBtn)

    var removeDimensionBtn = document.createElement('button')
    removeDimensionBtn.setAttribute('id', 'remove-metric-button')
    removeDimensionBtn.setAttribute('class', 'ternary-xs')
    removeDimensionBtn.setAttribute('onclick', 'removeDimension()')
    removeDimensionBtn.innerHTML = 'Remove'
    dimensionsButtonDiv.appendChild(removeDimensionBtn)

    var resetDimensionsBtn = document.createElement('button')
    resetDimensionsBtn.setAttribute('id', 'reset-metrics-button')
    resetDimensionsBtn.setAttribute('class', 'ternary-xs')
    resetDimensionsBtn.setAttribute('onclick', 'resetDimensions()')
    resetDimensionsBtn.innerHTML = 'Reset'
    dimensionsButtonDiv.appendChild(resetDimensionsBtn)
}

export function addDimension() {
    var dimensionsNo = document.getElementById('dimensions-number').value
    dimensionsNo = dimensionsNo * 1 + 1
    document.getElementById('dimensions-number').value = dimensionsNo

    var dimensionsMainDiv = document.getElementById('dimensions-div')

    var dimensionDiv = document.createElement('div')
    dimensionDiv.setAttribute('id', 'dimension' + dimensionsNo)
    dimensionsMainDiv.appendChild(dimensionDiv)

    var dimensionHeader = document.createElement('h4')
    dimensionHeader.innerHTML = 'Dimension ' + dimensionsNo
    dimensionDiv.appendChild(dimensionHeader)

    var dimensionName = document.createElement('input')
    dimensionName.setAttribute('type', 'text')
    dimensionName.setAttribute('placeholder', 'Dimension name')
    dimensionName.setAttribute('id', 'dimension' + dimensionsNo + '-name')
    dimensionDiv.appendChild(dimensionName)
    dimensionDiv.appendChild(document.createElement('br'))

    var dimensionSize = document.createElement('input')
    dimensionSize.setAttribute('id', 'dimension' + dimensionsNo + '-size')
    dimensionSize.setAttribute('type', 'number')
    dimensionSize.setAttribute('class', 'dimension-size')
    dimensionSize.setAttribute('placeholder', 'Dimension size')
    dimensionSize.addEventListener('input', () => updateDailyPerBucket())
    dimensionDiv.appendChild(dimensionSize)
    dimensionDiv.appendChild(document.createElement('br'))

    dimensionsMainDiv.appendChild(dimensionDiv)
}

export function removeDimension() {
    var dimensionsNo = document.getElementById('dimensions-number').value

    document.getElementById('dimension' + dimensionsNo).remove()

    dimensionsNo = dimensionsNo * 1 - 1
    document.getElementById('dimensions-number').value = dimensionsNo

    updateDailyPerBucket()
}

export function getKeyCombinationString(names) {
    return names.join(' x ')
}

export function capEpsilon(event, inputEl) {
    const currentValue = inputEl.value
    if (currentValue < 0) {
        inputEl.value = 0
    }
    if (currentValue > 64) {
        inputEl.value = 64
    }
}

export function getNumberOfBuckets() {
    const allDimensionSizes = document.querySelectorAll('.dimension-size')
    let nbOfBuckets = 1
    allDimensionSizes.forEach((dimSize) => {
        nbOfBuckets = nbOfBuckets * dimSize.value
    })
    return nbOfBuckets
}

export function updateDailyPerBucket() {
    const dailyTotal = document.getElementById('event-count-daily-total').value
    const nbOfBuckets = getNumberOfBuckets()
    const d = document.getElementById('event-count-daily-bucket')
    d.value = Math.floor(dailyTotal / nbOfBuckets)
}

export function resetFormValidation() {
    const formValidationWrapperEl = getFormValidationElFromDom()
    if (formValidationWrapperEl) {
        formValidationWrapperEl.innerText = ''
        formValidationWrapperEl.className = 'hidden'
    }
}

// Validate the inputs are correct
// TODO-CLEAN Base this on state source of truth, not on DOM!
export function validateInputsBeforeSimulation(
    metrics,
    dimensions,
    isGranular
) {
    var errors = []
    validateBudgetPercentages(metrics, errors)
    validateMetrics(metrics, errors)
    validateDimensions(dimensions, errors)
    if (!isGranular) validateKeyStrategy(errors)
    validateConversionsPerBucket(errors)

    const formValidationWrapperEl = getFormValidationElFromDom()

    if (errors.length <= 0) {
        resetFormValidation()
        return true
    }

    formValidationWrapperEl.className = ''
    const suffix = errors.length > 1 ? 's' : ''
    const title = `❌ Could not simulate. ${errors.length} error${suffix}: \n`
    const errorListAsString = errors.map((e) => `• ${e}.`).join('\n')
    formValidationWrapperEl.innerText = `${title} \n ${errorListAsString}`
    return false
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

function validateBudgetPercentages(metrics, errors) {
    const sumOfAllPercentages = metrics.reduce((sum, metric) => {
        return sum + getBudgetValueForMetricIdFromDom(metric.id)
    }, 0)

    if (getIsPercentageBudgetSplitFromDom() && sumOfAllPercentages > 100) {
        errors.push('The sum of all budget split percentages exceeds 100')
    }

    if (
        getIsPercentageBudgetSplitFromDom() &&
        !getIsKeyStrategyGranularFromDom() &&
        sumOfAllPercentages > Math.floor(100 / getKeyStrategiesNumberFromDom())
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
            Math.floor(
                getContributionBudgetFromDom() / getKeyStrategiesNumberFromDom()
            )
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

function validateKeyStrategy(errors) {
    var keyStructNumber = getKeyStrategiesNumberFromDom()
    if (keyStructNumber <= 1) {
        errors.push(
            'When using Key Strategy B (less granular), the number of key structures must be >1 '
        )
        return
    }
    for (var i = 1; i <= keyStructNumber; i++) {
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

export function getZeroConversionsPercentageFromDom() {
    return document.getElementById('zero-pct')
        ? document.getElementById('zero-pct').value
        : true
}

export function loadPython() {
    // pyCode is the var declared in python-file.js and containing the full python code
    var pyCodeText = document.createTextNode(pyCode)

    var pyScriptSection = document.getElementById('py-script')
    pyScriptSection.appendChild(pyCodeText)
}

export function displaySimulationResults(simulation) {
    hideEmptyState()

    const allSimulationsWrapper = document.getElementById(
        'all-simulations-wrapper'
    )
    const { metadata, inputParameters, summaryReports } = simulation
    const { simulationTitle, simulationId } = metadata

    // Prepare wrapper div that will contain the simulation
    const simulationWrapperDiv = document.createElement('div')
    simulationWrapperDiv.setAttribute(
        'id',
        generateSimulationWrapperElId(simulationId)
    )
    simulationWrapperDiv.setAttribute('class', 'simulation-wrapper')
    allSimulationsWrapper.appendChild(simulationWrapperDiv)
    const simulationInputWrapperDiv = document.createElement('div')
    const simulationOutputWrapperDiv = document.createElement('div')

    // Display simulation main info in the simulation wrapper div
    const simulationTitleDiv = document.createElement('h2')
    simulationTitleDiv.innerText = simulationTitle
    simulationWrapperDiv.appendChild(simulationTitleDiv)

    const simulationIdDiv = document.createElement('div')
    simulationIdDiv.setAttribute('class', 'simulation-id')
    simulationIdDiv.innerText = `Unique simulation ID: ${simulationId}`
    simulationWrapperDiv.appendChild(simulationIdDiv)

    simulationWrapperDiv.appendChild(simulationInputWrapperDiv)
    simulationWrapperDiv.appendChild(simulationOutputWrapperDiv)

    // Display input parameters in the input simulation wrapper div
    displayInputParameters(
        simulationInputWrapperDiv,
        inputParameters,
        simulationId
    )

    // Display reports in the output simulation wrapper div
    const reportsTitleDiv = document.createElement('h3')
    reportsTitleDiv.innerText = 'Summary reports (output)'
    simulationOutputWrapperDiv.appendChild(reportsTitleDiv)

    summaryReports.forEach((report, index) => {
        displayReport(
            simulationOutputWrapperDiv,
            report,
            simulationId,
            index,
            report.dimensionsString
        )
    })

    simulationWrapperDiv.scrollIntoView({ block: 'end' })
}

function displayReport(
    parentDomEl,
    report,
    simulationId,
    simulationNo,
    dimensionsString
) {
    const { noiseMetrics, data, measurementGoal, scalingFactor } = report
    const { noise_ape_percent, noise_rmsre } = noiseMetrics

    // Display report table title
    const titleDiv = document.createElement('h4')
    titleDiv.innerText = 'Measurement goal: ' + measurementGoal
    parentDomEl.appendChild(titleDiv)
    // Display noise
    displayNoiseAsPercentage(parentDomEl, noise_ape_percent, noise_rmsre)
    // Display details section title
    displayDataDetailsTitle(parentDomEl)
    parentDomEl.appendChild(document.createElement('br'))
    // Display dimensions
    displayDimensionsInOutput(parentDomEl, dimensionsString)
    // Display scaling factor
    displayScalingFactor(parentDomEl, scalingFactor)

    // Display table containing report data
    const dataTableTitle = document.createElement('h6')
    dataTableTitle.innerText = 'Data table:'
    parentDomEl.appendChild(dataTableTitle)
    const tableId = `output-data-table-${simulationId}-${measurementGoal}-${simulationNo}`
    const detailsDiv = document.createElement('details')
    detailsDiv.setAttribute('id', tableId)
    detailsDiv.setAttribute('class', 'offset-left')
    parentDomEl.appendChild(detailsDiv)

    // Generate data table
    const table = new TabulatorFull(`#${tableId}`, {
        data,
        // Create columns from data field names
        autoColumns: true,
        layout: 'fitColumns',
        pagination: true,
        paginationSize: 5,
    })

    console.log(`${simulationId}-${measurementGoal}-${simulationNo}`)
    // Save table temporarily; used for XLSX multi-table download
    saveTable(table, `${simulationId}-${measurementGoal}-${simulationNo}`)

    // Update tooltips
    updateTooltips()
}

// TODO-CLEAN Remove
window.generateKeyStructures = generateKeyStructures
window.capEpsilon = capEpsilon
window.updateDailyPerBucket = updateDailyPerBucket
window.resetUi = resetUi
window.downloadAllDom = downloadAllDom
