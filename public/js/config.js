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

export const APP_VERSION = 'v3.1.0'

export const MODES = {
    simple: {
        name: 'simple',
        searchQueryParam: 'simple',
        displayName: 'simple mode',
    },
    advanced: {
        name: 'advanced',
        searchQueryParam: 'advanced',
        displayName: 'advanced mode',
    },
}

export const KEY_STRATEGIES = {
    A: { value: 'A', name: 'A' },
    B: { value: 'B', name: 'B' },
}

export const BATCHING_FREQUENCIES = {
    // value represents the multiplier on a daily reference value
    hourly: { name: 'hourly', value: 1 / 24 },
    daily: { name: 'daily', value: 1, isDefault: true },
    weekly: { name: 'weekly', value: 7 },
    monthly: { name: 'monthly', value: 30 },
}

export const DEFAULT_MEASUREMENT_GOALS = [
    { id: 1, name: 'purchaseValue', maxValue: 1000, avgValue: 120 },
    { id: 2, name: 'purchaseCount', maxValue: 1, avgValue: 1 },
]

export const DEFAULT_DIMENSIONS = [
    // dimension.size is the number of distinct values for that dimension
    // id is not needed for simple mode; TODO why needed for advanced?
    { id: '1', size: '3', name: 'geography' },
    { id: '2', size: '4', name: 'campaignId' },
    { id: '3', size: '2', name: 'productCategory' },
]


export const RMSRE_THRESHOLD = 5

export const CONTRIBUTION_BUDGET = 65536

export const modeSearchQueryParams = Object.values(MODES).map(
    (mode) => mode.searchQueryParam
)
