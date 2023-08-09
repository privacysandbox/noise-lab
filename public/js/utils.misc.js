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

export function generateRandomTableId(prefix = '') {
    return `data-table-${prefix}-${crypto.randomUUID().substring(0, 5)}`
}

export function generateSimulationWrapperElId(simulationId) {
    return `simulation-wrapper-${simulationId}`
}

export function generateConfirmMessage() {
    return 'This will clear all simulations, so make sure to download your simulation data before you continue. Continue?'
}

export function cap(input, min, max) {
    if (max !== undefined && input > max) {
        return max
    } else if (input < min) {
        return min
    } else {
        return input
    }
}

export function getKeyStrategy(keyStructuresCount) {
    return keyStructuresCount > 1 ? 'B' : 'A'
}

export function getDailyEventCountPerBucket(dailyEventCountTotal, dimensions) {
    return Math.floor(dailyEventCountTotal / getNumberOfBuckets(dimensions))
}

export function getNumberOfBuckets(dimensions) {
    let nbOfBuckets = 1
    dimensions
        .map((d) => d.size)
        .forEach((dimSize) => {
            nbOfBuckets = nbOfBuckets * dimSize
        })
    return nbOfBuckets
}