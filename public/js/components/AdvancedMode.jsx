import { h, render, Component, Fragment } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { simulate } from '../utils.simulate'
import { downloadAll } from '../store'
import {
    generateConfirmMessage,
    getKeyStrategy,
    getDailyEventCountPerBucket,
    generateKeyStructure,
} from '../utils.misc'
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

// TODO If only one key structure, enforce that all checkboxes for dimensions must always e checked
// TODO ensure key structure count and key structure list are in sync at all times

// For simple mode, TODO use generateKeyStructures in simulate (or pass it from parent)
// For simple mode, display number of key structures

// TODO when key count is reset to 1, hard reset and disable all fields!!

// Default values for simulation parameters
const defaultUseScaling = true
const defaultBatchingFrequency = BATCHING_FREQUENCIES.daily.value
const defaultDailyEventCountTotal = 1000
const defaultBudgetSplit = DEFAULT_MEASUREMENT_GOALS.map((m) => ({
    measurementGoal: m.name,
    percentage: 100 / DEFAULT_MEASUREMENT_GOALS.length,
    value: CONTRIBUTION_BUDGET / DEFAULT_MEASUREMENT_GOALS.length,
}))
const defaultKeyStructuresCount = 1

export function AdvancedMode(props) {
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
    const [keyStrategy, setKeyStrategy] = useState(
        getKeyStrategy(defaultKeyStructuresCount)
    )
    // Both `simulations` and `allSimulationDataTables` are needed
    const [simulations, setSimulations] = useState([])
    const [allSimulationDataTables, setAllSimulationDataTables] = useState({})
    const [measurementGoals, setMeasurementGoals] = useState(
        DEFAULT_MEASUREMENT_GOALS
    )
    const [zeroBucketsPercentage, setZeroBucketsPercentage] = useState(0)
    const [budgetSplitMode, setBudgetSplitMode] = useState('percentage')
    const [dimensions, setDimensions] = useState(DEFAULT_DIMENSIONS)
    const [dailyEventCountPerBucket, setDailyEventCountPerBucket] = useState(
        getDailyEventCountPerBucket(
            defaultDailyEventCountTotal,
            DEFAULT_DIMENSIONS
        )
    )
    const [keyStructuresCount, setKeyStructuresCount] = useState(
        defaultKeyStructuresCount
    )
    // By default: only one key structure, that uses all the default dimensions
    const [keyStructures, setKeyStructures] = useState([
        generateKeyStructure(DEFAULT_DIMENSIONS_NAMES, DEFAULT_DIMENSIONS),
    ])

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
        console.log(budgetSplit)
        const dimensionNames = dimensions.map((dim) => dim.name)
        const dimensionSizes = dimensions.map((dim) => dim.size)

        const simulation = simulate(
            measurementGoals,
            dimensions,
            dimensionNames,
            dimensionSizes,
            epsilon,
            CONTRIBUTION_BUDGET,
            useScaling,
            // TODO-CLEAN switch to DOM / source of truth function?
            keyStrategy === 'A', // TODO use IsKeyStrategyGranular, or directly keyStrategy
            batchingFrequency,
            dailyEventCountPerBucket,
            // Last param not is not needed in the simple mode
            dailyEventCountTotal, // TODO getDailyEventCountTotal(),
            zeroBucketsPercentage,
            keyStrategy,
            keyStructuresCount,
            keyStructures,
            // budgetSplitMode,
            budgetSplit
        )
        setSimulations([...simulations, simulation])
    }

    function clearAll() {
        // TODO-CHECK: reset form validation
        if (simulations.length > 0) {
            if (window.confirm(generateConfirmMessage())) {
                setSimulations([])
            }
        }
        // TODO-NOTE that displayEmptyState is not needed here anymore
    }

    function downloadAllTables() {
        downloadAll(allSimulationDataTables)
    }

    function addNewMeasurementGoal() {
        const newMeasurementGoals = [
            ...measurementGoals,
            {
                // TODO id????
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

    function updateBudgetSplit(newMeasurementGoals, keyStructuresCount) {
        console.log(keyStructuresCount)
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
            // TODO id????
            id: dimensions.length,
            name: 'newDimension',
            size: 2,
        }
        const newDimensions = [...dimensions, newDimension]
        setDimensions(newDimensions)
        setDailyEventCountPerBucket(
            getDailyEventCountPerBucket(dailyEventCountTotal, newDimensions)
        )
    }

    function resetDimensions() {
        setDimensions(DEFAULT_DIMENSIONS)
        setDailyEventCountPerBucket(
            getDailyEventCountPerBucket(
                dailyEventCountTotal,
                DEFAULT_DIMENSIONS
            )
        )
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
                                setDailyEventCountPerBucket={
                                    setDailyEventCountPerBucket
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
                                setDailyEventCountPerBucket={
                                    setDailyEventCountPerBucket
                                }
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
                                setKeyStrategy={setKeyStrategy}
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
