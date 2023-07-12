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

let allSimulationDataTables = {}

export function saveTable(
    // newTable must be a TabulatorFull object
    newTable,
    newTableTitle
) {
    console.log(newTable)
    allSimulationDataTables = {
        ...allSimulationDataTables,
        // tableTitle already includes the simulation Id
        [`${newTableTitle}`]: newTable,
    }
    console.log(allSimulationDataTables)
}

export function downloadAll() {
    const dummyTableId = Object.keys(allSimulationDataTables)[0]
    const dummyTable = allSimulationDataTables[dummyTableId]
    // This is a hack; the TabulatorFull lib seems to have a bug where the first table isn't displayed unless we use the `table: true` syntax below
    delete allSimulationDataTables[dummyTableId]

    const d = new Date()
    if (dummyTable) {
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
}

export function resetData() {
    allSimulationDataTables = {}
}
