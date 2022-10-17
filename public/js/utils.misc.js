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

export function generateSimulationId() {
    return crypto.randomUUID().substring(0, 8)
}

export function generateSimulationTitle(dateTime) {
    return `Simulation ${dateTime.toLocaleTimeString()} ${dateTime.toLocaleDateString()} `
}

export function generateCsvFileName(simulationId, tableName) {
    return `${simulationId}-${tableName}-noiseLab.csv`
}

export function generateRandomTableId(prefix = '') {
    return `data-table-${prefix}-${crypto.randomUUID().substring(0, 5)}`
}

export function generateSimulationWrapperElId(simulationId) {
    return `simulation-wrapper-${simulationId}`
}

export function generateConfirmMessage() {
    return 'This will clear all simulations, so make sure to download your simulation data before you continue. Continue?'
}

export function tempSaveTable(
    // newTable must be a TabulatorFull object
    newTable,
    newTableTitle,
    allSimulationDataTables
) {
    return {
        ...allSimulationDataTables,
        // tableTitle already includes the simulation Id
        [`${newTableTitle}`]: newTable,
    }
}

export function downloadAll(allSimulationDataTables) {
    const dummyTableId = Object.keys(allSimulationDataTables)[0]
    const dummyTable = allSimulationDataTables[dummyTableId]
    // This is a hack; the TabulatorFull lib seems to have a bug where the first table isn't displayed unless we use the `table: true` syntax below
    delete allSimulationDataTables[dummyTableId]

    const d = new Date()
    dummyTable.download(
        'xlsx',
        `Noise Lab ${d.toLocaleTimeString()} ${d.toLocaleDateString()}.xlsx`,
        {
            sheets: {
                [`${dummyTableId}`]: true,
                ...allSimulationDataTables,
            },
        }
    )
}
