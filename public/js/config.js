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

export const APP_NAME = '🧪 Noise Lab'

export const APP_VERSION = 'v3.2.0'

export const SIMPLE = 'simple'
export const ADVANCED = 'advanced'
export const MODES = [SIMPLE, ADVANCED]


// Remove
export const KEY_STRATEGIES = {
    A: { name: 'A', value: 'A' },
    B: { name: 'B', value: 'B' },
}

export const BATCHING_FREQUENCIES = {
    // value represents the multiplier on a daily reference value
    hourly: { name: 'hourly', value: 1 / 24 },
    daily: { name: 'daily', value: 1, isDefault: true },
    weekly: { name: 'weekly', value: 7 },
    monthly: { name: 'monthly', value: 30 },
}

export const EVENT_COUNT_PER_BUCKET_OPTIONS = {
    // `value` represents the multiplier on a daily reference value
    5: { name: '5', value: 5 },
    10: { name: '10', value: 10 },
    100: { name: '100', value: 100 },
    1000: { name: '1000', value: 1000, isDefault: true },
    10000: { name: '10000', value: 10000 },
    100000: { name: '100000', value: 100000 },
}

export const EVENT_COUNT_TOTAL_OPTIONS = {
    // `value` represents the multiplier on a daily reference value
    5: { name: '5', value: 5 },
    10: { name: '10', value: 10 },
    100: { name: '100', value: 100 },
    100: { name: '500', value: 500 },
    1000: { name: '1000', value: 1000, isDefault: true },
    10000: { name: '10000', value: 10000 },
    100000: { name: '100000', value: 100000 },
}

export const DEFAULT_MEASUREMENT_GOALS = [
    { id: 0, name: 'purchaseValue', maxValue: 1000, avgValue: 120 },
    { id: 1, name: 'purchaseCount', maxValue: 1, avgValue: 1 },
]

export const DEFAULT_DIMENSIONS = [
    // dimension.size is the number of distinct values for that dimension
    { id: 0, size: '3', name: 'geography' },
    { id: 1, size: '4', name: 'campaignId' },
    { id: 2, size: '2', name: 'productCategory' },
]

export const RMSRE_THRESHOLD = 5

export const CONTRIBUTION_BUDGET = 65536

export const DEFAULT_EPSILON = 10
export const MIN_EPSILON = 0
export const MAX_EPSILON = 64



