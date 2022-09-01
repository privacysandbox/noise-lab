export function displayContributionBudget(budget) {
    document.getElementById('contribution-budget').innerText = budget
}

export function displayNoise(l) {
    document.getElementById('laplace').innerText += ' ' + l
}

export function clearDataDisplay() {
    console.log('cleaning div')
    var tablesDiv = document.getElementById('tables')
    tablesDiv.innerHtml = ''
}

export function displayEpsilon(epsilon) {
    document.getElementById('eps').value = epsilon
}

export function displayMaxPurchaseAmount(amount) {
    document.getElementById('amount').value = amount
}

export function getDailyConversionCountFromDom() {
    return document.getElementById('daily').value
}

export function getIsUseScalingFromDom() {
    // !! to convert to boolean
    return !!Number.parseInt(document.getElementById('scaling').value)
}

export function getKeyStrategyFromDom() {
    return document.getElementById('key-strategy-select').value
}

export function getBatchingFrequencyFromDom() {
    return document.getElementById('batching-frequency-select').value
}

export function getEpsilonFromDom() {
    return document.getElementById('eps').value
}

export function displayTabularData(parentDomEl, tabularData) {
    // Create a wrapper div that will contain the table
    const inputTableId = `data-table-${Date.now()}`
    const div = document.createElement('div')
    div.setAttribute('id', inputTableId)
    parentDomEl.appendChild(div)
    new Tabulator(`#${inputTableId}`, {
        data: tabularData,
        // Create columns from data field names
        autoColumns: true,
        layout: 'fitData',
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

export function initializeDisplaySimpleMode(
    keyStrategies, // as array
    batchingFrequencies, // as array
    metrics,
    dimensions
) {
    populateSelectDomElement(
        document.getElementById('key-strategy-select'),
        keyStrategies
    )
    populateSelectDomElement(
        document.getElementById('batching-frequency-select'),
        batchingFrequencies
    )
    displayTabularData(document.getElementById('metrics'), metrics)
    displayTabularData(document.getElementById('dimensions-table'), dimensions)
}

export function displayInputParametersSimpleMode(parentDomEl, inputParameters) {
    // inputParameters = { dailyConversionCount, dimensions, epsilon, metrics, keyStrategy }

    const { dailyConversionCount, dimensions, epsilon, metrics, keyStrategy } =
        inputParameters

    const dailyDiv = document.createElement('div')
    dailyDiv.innerText = `Daily conversion count: ${dailyConversionCount}`
    parentDomEl.appendChild(dailyDiv)

    const epsilonDiv = document.createElement('div')
    epsilonDiv.innerText = `Epsilon: ${epsilon}`
    parentDomEl.appendChild(epsilonDiv)

    const metricsDiv = document.createElement('div')
    metricsDiv.innerText = `${metrics.length} metric(s): ${metrics.map(
        (m) => m.name
    )}`
    parentDomEl.appendChild(metricsDiv)

    const keyStrategyDiv = document.createElement('div')
    keyStrategyDiv.innerText = `Key Strategy: ${keyStrategy}`
    parentDomEl.appendChild(keyStrategyDiv)

    const dimensionsTitleDiv = document.createElement('div')
    dimensionsTitleDiv.innerText = `Dimensions:`
    parentDomEl.appendChild(dimensionsTitleDiv)
    displayTabularData(dimensionsTitleDiv, dimensions)
}

export function displaySimulationResults(simulation) {
    const allSimulationsWrapper = document.getElementById(
        'all-simulations-wrapper-simple-mode'
    )
    const { title, inputParameters, reports } = simulation

    // Prepare wrapper div that will contain the simulation
    const simulationWrapperDiv = document.createElement('div')
    simulationWrapperDiv.setAttribute('id', `simulation-wrapper-${Date.now()}`)
    simulationWrapperDiv.setAttribute('class', 'simulation-wrapper-simple-mode')
    allSimulationsWrapper.appendChild(simulationWrapperDiv)

    // Display simulation main info in the simulation wrapper div
    const simulationTitleDiv = document.createElement('h2')
    simulationTitleDiv.innerText = title
    simulationWrapperDiv.appendChild(simulationTitleDiv)

    // Display input parameters in the simulation wrapper div
    const parametersTitleDiv = document.createElement('h3')
    parametersTitleDiv.innerText = 'Parameters'
    simulationWrapperDiv.appendChild(parametersTitleDiv)
    displayInputParametersSimpleMode(simulationWrapperDiv, inputParameters)

    // Display reports in the simulation wrapper div
    const reportsTitleDiv = document.createElement('h3')
    reportsTitleDiv.innerText = 'Output summary reports'
    simulationWrapperDiv.appendChild(reportsTitleDiv)
    reports.forEach((report) => {
        displayReport(simulationWrapperDiv, report)
    })
}

function displayReport(parentDomEl, report) {
    const { averageNoisePercentage, data, title } = report

    // Display report table title
    const titleDiv = document.createElement('div')
    titleDiv.innerText = title
    parentDomEl.appendChild(titleDiv)

    // Display table containing report data
    const tableId = `output-data-table-${Date.now()}`
    const div = document.createElement('div')
    div.setAttribute('id', tableId)
    parentDomEl.appendChild(div)
    new Tabulator(`#${tableId}`, {
        data,
        // Create columns from data field names
        autoColumns: true,
        layout: 'fitData',
    })

    // Display average noise
    const avgNoiseTitleSpan = document.createElement('span')
    const avgNoiseSpan = document.createElement('span')
    avgNoiseTitleSpan.innerText = '→ Average noise ratio (%): '
    avgNoiseSpan.innerText = averageNoisePercentage
    // Set a class to display noise in color
    avgNoiseSpan.setAttribute('class', 'average-noise')
    parentDomEl.appendChild(avgNoiseTitleSpan)
    parentDomEl.appendChild(avgNoiseSpan)
    // Layout hack TODO fix
    parentDomEl.appendChild(document.createElement('br'))
    parentDomEl.appendChild(document.createElement('br'))
}
