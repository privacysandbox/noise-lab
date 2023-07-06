let allSimulationTables = {}

function initialize() {
    loadPython()
    initializeDisplay()
}

// UI
function resetUi() {
    // reset form validation
    // clear output
    resetFormValidation()
    clearSimulationArea()
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
        // TODO check absence of mode OK
        document.getElementById(`all-simulations-wrapper`).innerHTML = ''
    }
    displayEmptyState(mode)
}

// Tables
function saveSimulationAsTable(table, tableTitle) {
    allSimulationTables = {
        ...allSimulationTables,
        // tableTitle includes the simulation Id
        [`${tableTitle}`]: table,
    }
}
function downloadAllSimulationsAsTables() {
    const dummyTableId = Object.keys(allSimulationDataTables)[0]
    const dummyTable = allSimulationTables[dummyTableId]
    // This is a hack; the TabulatorFull lib seems to have a bug where the first table isn't displayed unless we use the `table: true` syntax below
    delete allSimulationTables[dummyTableId]

    const d = new Date()
    dummyTable.download(
        'xlsx',
        `Noise Lab ${d.toLocaleTimeString()} ${d.toLocaleDateString()}.xlsx`,
        {
            sheets: {
                [`${dummyTableId}`]: true,
                ...allSimulationTables,
            },
        }
    )
}

// Actual simulation
function simulate() {
    // const simulation = generateSimulation()
    // displaySimulation(simulation)
}
function generateSimulation() {}

// simulation object
// One simulation is per goal
const simulation = {
    metadata: {
        // TODO rename to 'id'
        simulationTitle: 'Simulation 13:30:27 05/07/2023',
        simulationId: 'e3b77a88',
    },
    inputParameters: {
        dailyConversionCount: '100',
        dimensions: [
            {
                name: 'campaignId',
                numberOfDistinctValues: 4,
            },
        ],
        epsilon: '10',
        keyStrategy: 'A',
        metrics: [
            {
                id: 2,
                name: 'purchaseCount',
                maxValue: 1,
                avgValue: 1,
            },
        ],
        batchingFrequency: '1',
        isUseScaling: true,
    },
    summaryReports: [
        {
            data: [
                {
                    key: [0, 0, 0],
                    summaryValue: 12000,
                    summaryValue_scaled_noiseless: 393599.99999999994,
                    summaryValue_scaled_noisy: 389797.99999999994,
                    noise: 23232, // NEW for simple
                    noise_ape_individual: 0.009659552845528456,
                },
            ],
            noiseMetrics: {
                noise_ape_percent: 1.508,
                noise_rmsre: 0.02115,
            },
            scalingFactor: 32.8,
            measurementGoal: 'purchaseValue', // formerly "title"
            dimensionsString: 'campaignId x geography x productCategory', // formerly keyCombinationString
        },
        // Another report { ... }
    ],
    // Used for table display to disambiguate / Have unique IDs
    simulationNo: 1,
    metricsNo: 1,
}
