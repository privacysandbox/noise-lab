// TODO-CLEAN Delete this whole file

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

// import {
//     appendDataTableChild,
//     initializeDisplayGeneric,
//     getBatchingFrequencyFromDom,
//     getEpsilonFromDom,
//     getIsUseScalingFromDom,
//     loadPython,
//     displaySimulationResults,
//     getIsKeyStrategyGranularFromDom,
//     getDailyEventCountPerBucket,
// } from './dom'
// import {
//     CONTRIBUTION_BUDGET,
//     DEFAULT_MEASUREMENT_GOALS,
//     DEFAULT_DIMENSIONS,
// } from './config'
// import { simulate } from './utils.simulate'

// export function initializeDisplay_simpleMode() {
//     loadPython()
//     initializeDisplayGeneric(
//         CONTRIBUTION_BUDGET,
//         KEY_STRATEGIES,
//         BATCHING_FREQUENCIES
//     )
//     appendDataTableChild(
//         document.getElementById('metrics'),
//         DEFAULT_MEASUREMENT_GOALS,
//         false
//     )
//     appendDataTableChild(
//         document.getElementById('dimensions-table'),
//         DEFAULT_DIMENSIONS,
//         false
//     )
// }

// export function simulateAndDisplayResults_simpleMode() {
//     const dimensionNames = DEFAULT_DIMENSIONS.map((dim) => dim.name)
//     const dimensionSizes = DEFAULT_DIMENSIONS.map((dim) => dim.size)

//     const simulation = simulate(
//         DEFAULT_MEASUREMENT_GOALS,
//         DEFAULT_DIMENSIONS,
//         dimensionNames,
//         dimensionSizes,
//         getEpsilonFromDom(),
//         CONTRIBUTION_BUDGET,
//         getIsUseScalingFromDom(),
//         getIsKeyStrategyGranularFromDom(),
//         getBatchingFrequencyFromDom(),
//         getDailyEventCountPerBucket(),
//         // last param not needed in the simple mode
//         undefined
//     )

//     displaySimulationResults(simulation)
// }

// window.simulateAndDisplayResults_simpleMode =
//     simulateAndDisplayResults_simpleMode
