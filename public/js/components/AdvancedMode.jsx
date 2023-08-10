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

import { h, render, Component, Fragment } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { simulate } from '../utils.simulate'
import { downloadAll } from '../store'
import {
    generateConfirmMessage,
    getKeyStrategy,
    getDailyEventCountPerBucket,
    generateKeyStructure,
    generateEqualBudgetSplit,
} from '../utils.misc'
import { validateInputs } from '../validate'
import {
    DEFAULT_MEASUREMENT_GOALS,
    DEFAULT_DIMENSIONS_NAMES,
    DEFAULT_DIMENSIONS,
    CONTRIBUTION_BUDGET,
    BATCHING_FREQUENCIES,
    DEFAULT_EPSILON,
    EVENT_COUNT_TOTAL_OPTIONS,
    MIN_EPSILON,
    MAX_EPSILON,
    BUDGET_SPLIT_PERCENTAGE,
} from '../config'
import { Epsilon } from './Epsilon'
import { ContributionBudget } from './ContributionBudget'
import { ContributionBudgetSplit } from './ContributionBudgetSplit'
import { CountTotal } from './CountTotal'
import { BatchingFrequency } from './BatchingFrequency'
import { Scaling } from './Scaling'
import { EmptyState } from './EmptyState'
import { KeyStrategy } from './KeyStrategy'
import { SimulationsList } from './SimulationsList'
import { MeasurementGoals } from './MeasurementGoals'
import { Dimensions } from './Dimensions'
import { ZeroBuckets } from './ZeroBuckets'
import { KeyStructuresCount } from './KeyStructuresCount'
import { KeyStructures } from './KeyStructures'

// Default values for simulation parameters
const defaultUseScaling = true
const defaultBatchingFrequency = BATCHING_FREQUENCIES.daily.value
const defaultDailyEventCountTotal = 1000
const defaultBudgetSplit = generateEqualBudgetSplit(
    DEFAULT_MEASUREMENT_GOALS,
    CONTRIBUTION_BUDGET
)
const defaultKeyStructuresCount = 1

export function AdvancedMode(props) {
    const [errors, setErrors] = useState([])
    // TODO Reorder
    const [epsilon, setEpsilon] = useState(DEFAULT_EPSILON)
    const [batchingFrequency, setBatchingFrequency] = useState(
        defaultBatchingFrequency
    )
    const [budgetSplit, setBudgetSplit] = useState(defaultBudgetSplit)
    const [useScaling, setUseScaling] = useState(defaultUseScaling)
    const [dailyEventCountTotal, setDailyEventCountTotal] = useState(
        defaultDailyEventCountTotal
    )
    // Both `simulations` and `allSimulationDataTables` are needed
    const [simulations, setSimulations] = useState([])
    const [allSimulationDataTables, setAllSimulationDataTables] = useState({})
    const [measurementGoals, setMeasurementGoals] = useState(
        DEFAULT_MEASUREMENT_GOALS
    )
    const [zeroBucketsPercentage, setZeroBucketsPercentage] = useState(0)
    const [budgetSplitMode, setBudgetSplitMode] = useState(
        BUDGET_SPLIT_PERCENTAGE
    )
    const [dimensions, setDimensions] = useState(DEFAULT_DIMENSIONS)

    const [keyStructuresCount, setKeyStructuresCount] = useState(
        defaultKeyStructuresCount
    )
    // By default: only one key structure, that uses all the default dimensions
    const [keyStructures, setKeyStructures] = useState([
        generateKeyStructure(DEFAULT_DIMENSIONS_NAMES, DEFAULT_DIMENSIONS),
    ])

    // No need to put `keyStrategy` in State, because it can be calculated from other state (`keyStructureCount`)
    // https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state
    // `keyStrategy` will be updated every time `keyStructureCount` is, because `keyStructureCount` is in the state
    const keyStrategy = getKeyStrategy(keyStructuresCount)
    // Same for `dailyEventCountPerBucket`: by defining it like this, we ensure it will be updated anytime `dailyEventCountTotal` or `dimensions` get updated
    const dailyEventCountPerBucket = getDailyEventCountPerBucket(
        dailyEventCountTotal,
        dimensions
    )

    // TODO: if key count changes and is set to one, regenerate keyStructures
    // TODO: if key count changes and is higher, regenerate keyStructures
    // TODO: if key count changes and is lower, regenerate keyStructures
    // TODO: if dimensions changes (name, count or even size(?)), regenerate keyStructures here
    // TODO: setKeyStructure within the keyStructure
    // TODO If only one key structure, enforce that all checkboxes for dimensions must always e checked
    // TODO ensure key structure count and key structure list are in sync at all times
    // TODO when key count is reset to 1, hard reset and disable all fields!!

    useEffect(() => {
        const simulationsCount = simulations.length
        if (simulationsCount > 0) {
            // Scroll to the latest simulation
            document
                .getElementById(
                    simulations[simulationsCount - 1].metadata.simulationId
                )
                .scrollIntoView({ block: 'end' })
        }
    }, [simulations])

    function simulateAdvancedMode() {
        let errs = validateInputs({
            contributionBudget: CONTRIBUTION_BUDGET,
            measurementGoals: measurementGoals,
            dimensions: dimensions,
            useScaling: useScaling,
            dailyEventCountPerBucket: dailyEventCountPerBucket,
            keyStructuresCount: keyStructuresCount,
            keyStructures: keyStructures,
            budgetSplit: budgetSplit,
            budgetSplitMode: budgetSplitMode,
        })
        setErrors(errs)

        if (errs.length > 0) {
            return
        } else {
            const options = {
                contributionBudget: CONTRIBUTION_BUDGET,
                epsilon: epsilon,
                measurementGoals: measurementGoals,
                dimensions: dimensions,
                useScaling: useScaling,
                batchingFrequency: batchingFrequency,
                dailyEventCountPerBucket: dailyEventCountPerBucket,
                keyStrategy: keyStrategy,
                keyStructures: keyStructures,
                budgetSplit: budgetSplit,
                zeroBucketsPercentage: zeroBucketsPercentage,
            }
            const simulation = simulate(options)
            setSimulations([...simulations, simulation])
        }
    }

    function clearAll() {
        if (simulations.length > 0) {
            if (window.confirm(generateConfirmMessage())) {
                setSimulations([])
                setAllSimulationDataTables({})
                setErrors([])
            }
        }
    }

    function downloadAllTables() {
        downloadAll(allSimulationDataTables)
    }

    function addNewMeasurementGoal() {
        const newMeasurementGoals = [
            ...measurementGoals,
            {
                // TODO-improvement Remove id if not needed
                id: measurementGoals.length,
                name: 'newMeasurementGoal',
                maxValue: 1,
                avgValue: 1,
            },
        ]
        setMeasurementGoals(newMeasurementGoals)
        updateBudgetSplit(newMeasurementGoals, keyStructuresCount)
    }

    function resetMeasurementGoals() {
        setMeasurementGoals(DEFAULT_MEASUREMENT_GOALS)
        updateBudgetSplit(DEFAULT_MEASUREMENT_GOALS, keyStructuresCount)
    }

    // `budgetSplit` must be updated when any of these change: `numberOfMeasurementGoals`, `contributionBudget`, `keyStructuresCount`
    // Or when the user manually updates the split across goals
    function updateBudgetSplit(newMeasurementGoals, keyStructuresCount) {
        const numberOfMeasurementGoals = newMeasurementGoals.length
        const newBudgetSplit = newMeasurementGoals.map((m) => ({
            measurementGoal: m.name,
            percentage: 100 / numberOfMeasurementGoals / keyStructuresCount,
            value:
                CONTRIBUTION_BUDGET /
                numberOfMeasurementGoals /
                keyStructuresCount,
        }))
        setBudgetSplit(newBudgetSplit)
    }

    function addNewDimension() {
        const newDimension = {
            // TODO-improvement Remove id if not needed
            id: dimensions.length,
            name: 'newDimension',
            size: 2,
        }
        const newDimensions = [...dimensions, newDimension]
        setDimensions(newDimensions)
    }

    function resetDimensions() {
        setDimensions(DEFAULT_DIMENSIONS)
    }

    return (
        <Fragment>
            <div class="launch-panel">
                <div class="launch-panel-content-wrapper">
                    <div class="input-fields">
                        <h2>Parameters</h2>
                        <div>
                            <h3>API parameters</h3>
                            <ContributionBudget
                                contributionBudgetValue={CONTRIBUTION_BUDGET}
                            />
                            <Epsilon
                                epsilon={epsilon}
                                setEpsilon={setEpsilon}
                                minEpsilon={MIN_EPSILON}
                                maxEpsilon={MAX_EPSILON}
                            />
                        </div>
                        <div>
                            <h3>Your conversion data</h3>

                            <label>
                                Average daily attributable conversion count PER
                                BUCKET:
                            </label>
                            {dailyEventCountPerBucket}
                            <div class="help" id="help-daily"></div>
                            <CountTotal
                                dailyEventCountTotalOptions={
                                    EVENT_COUNT_TOTAL_OPTIONS
                                }
                                dailyEventCountTotal={dailyEventCountTotal}
                                setDailyEventCountTotal={
                                    setDailyEventCountTotal
                                }
                                dimensions={dimensions}
                            />
                            <ZeroBuckets
                                zeroBucketsPercentage={zeroBucketsPercentage}
                                setZeroBucketsPercentage={
                                    setZeroBucketsPercentage
                                }
                            />
                        </div>
                        <div>
                            <h3>
                                Data you want to track: Measurement goals{' '}
                                <span class="header-count">
                                    ({measurementGoals.length})
                                </span>
                            </h3>
                            <div class="button-bar">
                                <button
                                    class="ternary-xs"
                                    onclick={addNewMeasurementGoal}
                                >
                                    ➕ Add new
                                </button>
                                <button
                                    class="ternary-xs"
                                    onclick={resetMeasurementGoals}
                                >
                                    🔄 Reset to default goals
                                </button>
                            </div>
                            <MeasurementGoals
                                measurementGoals={measurementGoals}
                                setMeasurementGoals={setMeasurementGoals}
                                updateBudgetSplit={updateBudgetSplit}
                                keyStructuresCount={keyStructuresCount}
                            />
                        </div>
                        <div>
                            <h3>
                                Data you want to track: Dimensions{' '}
                                <span class="header-count">
                                    ({dimensions.length})
                                </span>
                            </h3>
                            <div class="button-bar">
                                <button
                                    class="ternary-xs"
                                    onclick={addNewDimension}
                                >
                                    ➕ Add new
                                </button>
                                <button
                                    class="ternary-xs"
                                    onclick={resetDimensions}
                                >
                                    🔄 Reset to default dimensions
                                </button>
                            </div>
                            <Dimensions
                                dimensions={dimensions}
                                setDimensions={setDimensions}
                                dailyEventCountTotal={dailyEventCountTotal}
                            />
                        </div>
                        <div>
                            <h3>Your aggregation strategy</h3>
                            <BatchingFrequency
                                batchingFrequenciesOptions={
                                    BATCHING_FREQUENCIES
                                }
                                batchingFrequency={batchingFrequency}
                                setBatchingFrequency={setBatchingFrequency}
                            />
                            <Scaling
                                useScaling={useScaling}
                                setUseScaling={setUseScaling}
                            />
                            {useScaling && (
                                <ContributionBudgetSplit
                                    budgetSplit={budgetSplit}
                                    setBudgetSplit={setBudgetSplit}
                                    budgetSplitMode={budgetSplitMode}
                                    setBudgetSplitMode={setBudgetSplitMode}
                                />
                            )}
                            <h4>Key strategy:</h4>
                            <KeyStrategy keyStrategy={keyStrategy} />
                            <KeyStructuresCount
                                keyStructuresCount={keyStructuresCount}
                                setKeyStructuresCount={setKeyStructuresCount}
                                measurementGoals={measurementGoals}
                                updateBudgetSplit={updateBudgetSplit}
                                keyStructures={keyStructures}
                                setKeyStructures={setKeyStructures}
                            />
                            <KeyStructures
                                keyStructuresCount={keyStructuresCount}
                                dimensions={dimensions}
                                keyStructures={keyStructures}
                                setKeyStructures={setKeyStructures}
                            />
                        </div>
                    </div>
                    <div class="buttons-wrapper-launch-panel">
                        <button
                            id="button-simulate"
                            class="primary"
                            onclick={simulateAdvancedMode}
                        >
                            ▶️ SIMULATE
                        </button>
                    </div>
                </div>
            </div>
            {errors.length > 0 && (
                <div id="form-validation-wrapper">
                    Could not simulate. {errors.length} error(s):
                    <ul>
                        {errors.map((e) => (
                            <li>{e}</li>
                        ))}
                    </ul>
                </div>
            )}
            <main>
                <h2>Simulations</h2>
                <div class="global-buttons">
                    <button class="primary" onclick={downloadAllTables}>
                        ⬇️ Download all (.xlsx)
                    </button>
                    <button class="secondary destructive" onclick={clearAll}>
                        🗑 Clear all
                    </button>
                </div>
                {simulations.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div class="all-simulations-wrapper">
                        <SimulationsList
                            simulations={simulations}
                            setAllSimulationDataTables={
                                setAllSimulationDataTables
                            }
                            allSimulationDataTables={allSimulationDataTables}
                        />
                    </div>
                )}
            </main>
        </Fragment>
    )
}
