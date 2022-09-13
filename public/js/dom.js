export function displayContributionBudget(budget) {
    document.getElementById('contribution-budget').innerText = budget
}

export function displayNoise(l) {
    document.getElementById('laplace').innerText += ' ' + l
}

export function clearDataDisplay() {
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

    const flexWrapperDiv = document.createElement('div')
    flexWrapperDiv.setAttribute('class', 'flex')
    const simulationInputWrapperDiv = document.createElement('div')
    simulationInputWrapperDiv.setAttribute(
        'class',
        'simulation-wrapper-simple-mode-input'
    )
    const simulationOutputWrapperDiv = document.createElement('div')
    simulationOutputWrapperDiv.setAttribute(
        'class',
        'simulation-wrapper-simple-mode-output'
    )

    // Display simulation main info in the simulation wrapper div
    const simulationTitleDiv = document.createElement('h2')
    simulationTitleDiv.innerText = title
    simulationWrapperDiv.appendChild(simulationTitleDiv)

    // Display input parameters in the input simulation wrapper div
    const parametersTitleDiv = document.createElement('h3')
    parametersTitleDiv.innerText = 'Parameters (input)'
    simulationInputWrapperDiv.appendChild(parametersTitleDiv)
    displayInputParametersSimpleMode(simulationInputWrapperDiv, inputParameters)

    // Display reports in the output simulation wrapper div
    const reportsTitleDiv = document.createElement('h3')
    reportsTitleDiv.innerText = 'Summary reports (output)'
    simulationOutputWrapperDiv.appendChild(reportsTitleDiv)

    flexWrapperDiv.appendChild(simulationInputWrapperDiv)
    flexWrapperDiv.appendChild(simulationOutputWrapperDiv)
    simulationWrapperDiv.appendChild(flexWrapperDiv)

    reports.forEach((report) => {
        displayReport(simulationOutputWrapperDiv, report)
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

// !!!!!!!!!!
// Functions needed for ADVANCED MODE
// !!!!!!!!!

export function getNumberOfKeysFromDom() {
    return document.getElementById('dimensions-number').value
}

export function displayDimensionInputFields(id) {
    const dimensionsConfigDiv = document.getElementById('dimensions-div')
    const dimensionId = document.createElement('div')
    const dimensionTitle = document.createElement('h3')
    dimensionTitle.innerHTML = 'Dimension ' + id
    dimensionId.id = 'dimension' + id
    dimensionId.appendChild(dimensionTitle)

    const dimensionSize = document.createElement('input')
    dimensionSize.type = 'number'
    dimensionSize.id = 'dimension' + id + '-size'
    dimensionSize.setAttribute('placeholder', 'Dimension size')

    const dimensionName = document.createElement('input')
    dimensionName.type = 'text'
    dimensionName.id = 'dimension' + id + '-name'
    dimensionName.setAttribute('placeholder', 'Dimension name')

    // dimensionId.appendChild(document.createElement('br'))
    dimensionId.appendChild(dimensionSize)
    dimensionId.appendChild(document.createElement('br'))
    dimensionId.appendChild(dimensionName)
    //dimensionId.appendChild(document.createElement('br'))
    dimensionsConfigDiv.appendChild(dimensionId)
}

export function getFrequencyValue() {
    return document.getElementById('frequency').value
}

export function getDailyValue() {
    return document.getElementById('daily').value
}

export function getMaxCountPerPurchaseValue() {
    return document.getElementById('count').value
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

export function getAllDimensionNames() {
    var keyNo = document.getElementById('dimensions-number').value

    var ids = []
    for (var i = 1; i <= keyNo; i++) {
        ids.push(document.getElementById('dimension' + i + '-name').value)
    }
    return ids
}

export function displayAdvancedReports(
    mainDiv,
    simulation,
    metricName,
    scalingFactor,
    keyCombinationString
) {
    const allSimulationsWrapper = mainDiv

    const { data, averageNoisePercentage } = simulation

    // Prepare wrapper div that will contain the simulation
    const simulationWrapperDiv = document.createElement('div')
    simulationWrapperDiv.setAttribute('id', `simulation-wrapper-${Date.now()}`)
    allSimulationsWrapper.appendChild(simulationWrapperDiv)

    const metricTag = document.createElement('h4')
    metricTag.innerHTML = 'Metric:' + metricName
    allSimulationsWrapper.appendChild(metricTag)

    const dimensionsTag = document.createElement('h4')
    dimensionsTag.innerHTML = 'Dimensions: ' + keyCombinationString
    allSimulationsWrapper.appendChild(dimensionsTag)

    const scalingFactorTag = document.createElement('h4')
    scalingFactorTag.innerHTML = 'Scaling Factor: ' + scalingFactor
    allSimulationsWrapper.appendChild(scalingFactorTag)

    // Add current report in the simulation wrapper div
    const tableId = `output-data-table-${Date.now()}`
    const div = document.createElement('div')
    div.setAttribute('id', tableId)
    simulationWrapperDiv.appendChild(div)
    var table = new Tabulator(`#${tableId}`, {
        data: data,
        // Create columns from data field names
        autoColumns: true,
        layout: 'fitData',
    })

    const avgNoiseTitleSpan = document.createElement('span')
    const avgNoiseSpan = document.createElement('span')
    avgNoiseTitleSpan.innerText = '→ Average noise ratio (%): '
    avgNoiseSpan.innerText = averageNoisePercentage

    avgNoiseSpan.setAttribute('class', 'average-noise')
    simulationWrapperDiv.appendChild(avgNoiseTitleSpan)
    simulationWrapperDiv.appendChild(avgNoiseSpan)

    simulationWrapperDiv.appendChild(document.createElement('br'))

    // Create download button
    const downloadButton = document.createElement('button')
    downloadButton.innerHTML = '⬇️ Download'
    downloadButton.setAttribute('id', 'download-csv' + tableId)
    simulationWrapperDiv.appendChild(downloadButton)

    //Create eventListener for download of csv file
    document
        .getElementById('download-csv' + tableId)
        .addEventListener('click', function () {
            table.download('csv', 'data-' + tableId + '.csv')
        })

    // Layout hack TODO fix
    allSimulationsWrapper.appendChild(simulationWrapperDiv)
    allSimulationsWrapper.appendChild(document.createElement('br'))
    allSimulationsWrapper.appendChild(document.createElement('br'))
}

export function displayTabularDataEditable(tabularData) {
    // Create a wrapper div that will contain the table
    const parentDomEl = document.getElementById('metrics-div')
    const inputTableId = `metrics-table`
    const div = document.createElement('div')
    div.setAttribute('id', inputTableId)
    parentDomEl.appendChild(div)
    var table = new Tabulator(`#${inputTableId}`, {
        data: tabularData,
        // Create columns from data field names
        autoColumns: true,
        layout: 'fitData',
        autoColumnsDefinitions: function (definitions) {
            //definitions - array of column definition objects

            definitions.forEach((column) => {
                column.editor = 'input' // add input editor to every column
            })

            return definitions
        },
    })

    const addButton = document.createElement('button')
    addButton.setAttribute('id', 'add-row')
    addButton.innerHTML = 'Add Row'
    parentDomEl.appendChild(addButton)

    const delButton = document.createElement('button')
    delButton.setAttribute('id', 'del-row')
    delButton.innerHTML = 'Delete Last Row'
    parentDomEl.appendChild(delButton)

    //Add row on "Add Row" button click
    document.getElementById('add-row').addEventListener('click', function () {
        table.addRow({})
    })
}

export function resetDimensionsDiv() {
    const dimensionsConfigDiv = document.getElementById('dimensions-div')
    dimensionsConfigDiv.innerHTML = ''
}

export function getMetricsArray() {
    var len = document.getElementById('metrics-number').value
    var metrics = []
    for (let i = 1; i <= len; i++) {
        metrics.push({
            id: i,
            maxValue: document.getElementById('metric' + i + '-max').value,
            minValue: document.getElementById('metric' + i + '-def').value,
            name: document.getElementById('metric' + i + '-name').value,
        })
    }

    return metrics
}

export function createSimulationDiv(simulationNo, metrics, dimensions) {
    var allSimulationsWrapper = document.getElementById(
        'all-simulations-wrapper-advanced-mode'
    )

    var simulationDiv = document.createElement('div')
    simulationDiv.setAttribute('id', 'simulation-div' + simulationNo)
    simulationDiv.setAttribute('class', 'simulation-wrapper-advanced-mode')

    //Display simulation main info in the simulation wrapper div
    const simulationDateTime = new Date(Date.now())
    const simulationTitleDiv = document.createElement('h2')
    simulationTitleDiv.innerText = 'Simulation ' + simulationDateTime
    simulationDiv.appendChild(simulationTitleDiv)

    //Display simulation parameters:
    const simulationParams = document.createElement('div')
    simulationParams.setAttribute('id', 'simulation-params-div' + simulationNo)

    const dailyDiv = document.createElement('div')
    var dailyCount = document.getElementById('')
    dailyDiv.innerText =
        `Daily conversion count: ` + getElementValueById('daily')
    simulationDiv.appendChild(dailyDiv)

    const epsilonDiv = document.createElement('div')
    epsilonDiv.innerText = `Epsilon: ` + getEpsilonFromDom()

    simulationDiv.appendChild(epsilonDiv)

    const metricsDiv = document.createElement('div')
    metricsDiv.innerText = `${metrics.length} metric(s): ${metrics.map(
        (m) => m.name
    )}`
    simulationDiv.appendChild(metricsDiv)

    const keyStrategyDiv = document.createElement('div')
    keyStrategyDiv.innerText =
        `Key Strategy: ` + getElementValueById('granularity')
    simulationDiv.appendChild(keyStrategyDiv)

    const dimensionsTitleDiv = document.createElement('div')
    dimensionsTitleDiv.innerText = `Dimensions:` + JSON.stringify(dimensions)
    simulationDiv.appendChild(dimensionsTitleDiv)

    // Start reports section in div
    const reportsTitleDiv = document.createElement('h3')
    reportsTitleDiv.innerText = 'Output summary reports'
    simulationDiv.appendChild(reportsTitleDiv)

    allSimulationsWrapper.appendChild(simulationDiv)
    return simulationDiv
}

export function generateCustomMetrics() {
    const metricsDiv = document.getElementById('metrics')
    metricsDiv.innerHTML = ''

    const metricsNoInputLabel = document.createElement('label')
    metricsNoInputLabel.innerHTML = 'Number of metrics you want to track: '
    const metricsNoInput = document.createElement('input')
    metricsNoInput.setAttribute('id', 'metrics-number')
    metricsNoInput.setAttribute('type', 'number')
    metricsNoInput.setAttribute('max', '10')
    metricsNoInput.setAttribute('min', '1')

    const metricsNoSubmit = document.createElement('button')
    metricsNoSubmit.innerHTML = 'Submit'
    metricsNoSubmit.setAttribute('onClick', 'createCustomMetricsInputs()')

    metricsDiv.appendChild(metricsNoInputLabel)
    metricsDiv.appendChild(metricsNoInput)
    metricsDiv.appendChild(metricsNoSubmit)
}

export function createCustomMetricsInputs() {
    var noMetrics = document.getElementById('metrics-number').value
    var metricsDiv = document.getElementById('metrics-params')

    for (let i = 1; i <= noMetrics; i++) {
        var element = document.createElement('input')
        var label = document.createElement('label')
        label.innerHTML = '<h4>Metric ' + i + ':</h4>'
        var nameInput = document.createElement('input')
        nameInput.setAttribute('type', 'text')
        nameInput.setAttribute('id', 'metric' + i + '-name')
        nameInput.setAttribute('placeholder', 'Name of the metric')
        var maxInput = document.createElement('input')
        maxInput.setAttribute('type', 'number')
        maxInput.setAttribute('id', 'metric' + i + '-max')
        maxInput.setAttribute('placeholder', 'Maximum value for the metric')
        var maxInputLabel = document.createElement('div')
        maxInputLabel.innerText = 'Maximum value'

        var minInput = document.createElement('input')
        minInput.setAttribute('id', 'metric' + i + '-def')
        minInput.setAttribute('type', 'number')
        minInput.setAttribute(
            'placeholder',
            'Minimum/default value for the metric'
        )

        metricsDiv.appendChild(label)
        metricsDiv.appendChild(nameInput)
        metricsDiv.appendChild(document.createElement('br'))
        metricsDiv.appendChild(maxInput)
        metricsDiv.appendChild(maxInputLabel)
        metricsDiv.appendChild(document.createElement('br'))
        metricsDiv.appendChild(minInput)
    }
}

export function getDimensionsArray() {
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
    const keyStrategySelector = document.getElementById('granularity')
    const granularDiv = document.getElementById('granular')

    keyStrategySelector.addEventListener('change', function () {
        if (keyStrategySelector.value == 'A') {
            granularDiv.style.display = 'none'
        } else {
            granularDiv.style.display = 'block'
        }
    })
}

export function generateKeyStrategies() {
    const strategiesDiv = document.getElementById('strategies')
    strategiesDiv.innerHTML = ''
    const keyStrayegies = document.getElementById('structures-number').value

    for (let i = 1; i <= keyStrayegies; i++) {
        addCheckboxStrategy(i, strategiesDiv)
    }
}

function addCheckboxStrategy(id, parentDomEl) {
    const strategyTitle = document.createElement('h4')
    strategyTitle.innerHTML = 'Key Strategy ' + id

    parentDomEl.appendChild(strategyTitle)

    const cbName = 'strategy' + id
    const strategyDiv = document.createElement('div')
    strategyDiv.setAttribute('id', 'strategy' + id)
    parentDomEl.appendChild(strategyDiv)

    var dimensions = getDimensionsArray()

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

export function isGranular() {
    return document.getElementById('granularity').value == 'A' ? true : false
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
        metricDiv.appendChild(metricMaxLabel)
        metricDiv.appendChild(metricMax)
        metricDiv.appendChild(document.createElement('br'))

        var metricMin = document.createElement('input')
        metricMin.setAttribute('id', 'metric' + element.id + '-def')
        metricMin.setAttribute('type', 'number')
        metricMin.setAttribute('placeholder', 'Minimum value')
        metricMin.value = element.minValue
        const metricMinLabel = document.createElement('label')
        metricMinLabel.innerText = 'Min value:'
        metricDiv.appendChild(metricMinLabel)
        metricDiv.appendChild(metricMin)
        metricDiv.appendChild(document.createElement('br'))
        metricDiv.appendChild(document.createElement('br'))
    })
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
    metricHeader.innerHTML = 'Metric ' + metricsNo
    metricDiv.appendChild(metricHeader)

    var metricName = document.createElement('input')
    metricName.setAttribute('type', 'text')
    metricName.setAttribute('placeholder', 'Metric name')
    metricName.setAttribute('id', 'metric' + metricsNo + '-name')
    metricDiv.appendChild(metricName)
    metricDiv.appendChild(document.createElement('br'))

    var metricMax = document.createElement('input')
    metricMax.setAttribute('id', 'metric' + metricsNo + '-max')
    metricMax.setAttribute('type', 'number')
    metricMax.setAttribute('placeholder', 'Maximum value')
    metricDiv.appendChild(metricMax)
    metricDiv.appendChild(document.createElement('br'))

    var metricMin = document.createElement('input')
    metricMin.setAttribute('id', 'metric' + metricsNo + '-def')
    metricMin.setAttribute('type', 'number')
    metricMin.setAttribute('placeholder', 'Minimum value')
    metricDiv.appendChild(metricMin)

    metricsMainDiv.appendChild(metricDiv)
}

export function removeMetric() {
    var metricsNo = document.getElementById('metrics-number').value

    document.getElementById('metric' + metricsNo).remove()

    metricsNo = metricsNo * 1 - 1
    document.getElementById('metrics-number').value = metricsNo
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
        dimensionNameLabel.innerText = 'Name'
        dimensionDiv.appendChild(dimensionNameLabel)

        dimensionDiv.appendChild(dimensionName)
        dimensionDiv.appendChild(document.createElement('br'))

        var dimensionSize = document.createElement('input')
        dimensionSize.setAttribute('id', 'dimension' + element.id + '-size')
        dimensionSize.setAttribute('type', 'number')
        dimensionSize.setAttribute('placeholder', 'Dimension size')
        dimensionSize.value = element.size

        const dimensionSizeLabel = document.createElement('label')
        dimensionSizeLabel.innerText =
            'Number of possible different values for this dimension'
        dimensionDiv.appendChild(dimensionSizeLabel)

        dimensionDiv.appendChild(dimensionSize)
        dimensionDiv.appendChild(document.createElement('br'))

        dimensionsMainDiv.appendChild(dimensionDiv)
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
    dimensionHeader.innerHTML = 'Dimensions' + dimensionsNo
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
    dimensionSize.setAttribute('placeholder', 'Dimension size')
    dimensionDiv.appendChild(dimensionSize)
    dimensionDiv.appendChild(document.createElement('br'))

    dimensionsMainDiv.appendChild(dimensionDiv)
}

export function removeDimension() {
    var dimensionsNo = document.getElementById('dimensions-number').value

    document.getElementById('dimension' + dimensionsNo).remove()

    dimensionsNo = dimensionsNo * 1 - 1
    document.getElementById('dimensions-number').value = dimensionsNo
}

export function getKeyCombinationString(names) {
    return names.join(' x ')
}

window.createCustomMetricsInputs = createCustomMetricsInputs
window.generateCustomMetrics = generateCustomMetrics
window.generateKeyStrategies = generateKeyStrategies
