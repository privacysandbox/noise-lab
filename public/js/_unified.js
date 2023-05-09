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
const simulation = {
    data: {
        report: [],
        noiseMetrics: {
            noise_ape: 12,
            noise_ape_percent: 12,
            noise_rmspe: 12,
            noise_rmspe_percent: 12,
        },
    },
    metadata: {
        // TODO rename to 'id'
        simulationId: 123,
        measurementGoalDisplayName: 'dfgh',
        scalingFactor: 123,
        keyCombinationString: 'werewrew',
    },
    // TODO remove once made unnecessary
    simulationNo,
    // TODO remove once made unnecessary
    metricsNo,
}
