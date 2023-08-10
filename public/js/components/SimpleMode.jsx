import { h, render, Component, Fragment } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { appendDataTableChild } from '../dom'
import { simulate } from '../utils.simulate'
import { downloadAll } from '../store'
import {
    generateConfirmMessage,
    getKeyStrategy,
    generateEqualBudgetSplit,
    generateKeyStructure,
} from '../utils.misc'
import { validateInputs } from '../validate'
import {
    DEFAULT_MEASUREMENT_GOALS,
    DEFAULT_DIMENSIONS,
    DEFAULT_DIMENSIONS_NAMES,
    CONTRIBUTION_BUDGET,
    BATCHING_FREQUENCIES,
    DEFAULT_EPSILON,
    MIN_EPSILON,
    MAX_EPSILON,
    EVENT_COUNT_PER_BUCKET_OPTIONS,
    BUDGET_SPLIT_PERCENTAGE,
} from '../config'
import { Epsilon } from './Epsilon'
import { ContributionBudget } from './ContributionBudget'
import { ContributionBudgetSplit } from './ContributionBudgetSplit'
import { CountPerBucket } from './CountPerBucket'
import { BatchingFrequency } from './BatchingFrequency'
import { Scaling } from './Scaling'
import { EmptyState } from './EmptyState'
import { KeyStrategy } from './KeyStrategy'
import { SimulationsList } from './SimulationsList'

// Default values for simulation parameters
const defaultUseScaling = true
const defaultDailyEventCountPerBucket =
    EVENT_COUNT_PER_BUCKET_OPTIONS[100].value
const defaultBatchingFrequency = BATCHING_FREQUENCIES.daily.value
const defaultBudgetSplit = generateEqualBudgetSplit(
    DEFAULT_MEASUREMENT_GOALS,
    CONTRIBUTION_BUDGET
)

// TODO display budget split
// TODO display the one key
// TODO clearAll!

const useMountEffect = (fun) => useEffect(fun, [])

export function SimpleMode(props) {
    const [errors, setErrors] = useState([])
    const [epsilon, setEpsilon] = useState(DEFAULT_EPSILON)
    const [batchingFrequency, setBatchingFrequency] = useState(
        defaultBatchingFrequency
    )
    const [budgetSplit, setBudgetSplit] = useState(defaultBudgetSplit)
    const [useScaling, setUseScaling] = useState(defaultUseScaling)
    const [dailyEventCountPerBucket, setDailyEventCountPerBucket] = useState(
        defaultDailyEventCountPerBucket
    )
    const keyStrategy = getKeyStrategy(1)
    // Both `simulations` and `allSimulationDataTables` are needed
    const [simulations, setSimulations] = useState([])
    const [allSimulationDataTables, setAllSimulationDataTables] = useState({})

    const keyStructures = [
        generateKeyStructure(DEFAULT_DIMENSIONS_NAMES, DEFAULT_DIMENSIONS),
    ]

    function clearAll() {
        // TODO-CHECK: reset form validation
        if (simulations.length > 0) {
            if (window.confirm(generateConfirmMessage())) {
                setSimulations([])
                setAllSimulationDataTables({})
            }
        }
    }

    function downloadAllTables() {
        downloadAll(allSimulationDataTables)
    }

    // useMountEffect ensures that the appendDataTableChild functions run only once. Otherwise we end up with duplicated content in the dimensions and measurementGoals tables
    // See https://css-tricks.com/run-useeffect-only-once/
    useMountEffect(() => {
        appendDataTableChild(
            document.getElementById('measurement-goals-table'),
            DEFAULT_MEASUREMENT_GOALS,
            false
        )
        appendDataTableChild(
            document.getElementById('dimensions-table'),
            DEFAULT_DIMENSIONS,
            false
        )
    })

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

    function simulateSimpleMode() {
        let errs = validateInputs({
            contributionBudget: CONTRIBUTION_BUDGET,
            measurementGoals: DEFAULT_MEASUREMENT_GOALS,
            dimensions: DEFAULT_DIMENSIONS,
            useScaling: useScaling,
            dailyEventCountPerBucket: dailyEventCountPerBucket,
            keyStructuresCount: 1,
            keyStructures: keyStructures,
            budgetSplit: budgetSplit,
            budgetSplitMode: BUDGET_SPLIT_PERCENTAGE,
        })
        setErrors(errs)

        const options = {
            contributionBudget: CONTRIBUTION_BUDGET,
            epsilon: epsilon,
            measurementGoals: DEFAULT_MEASUREMENT_GOALS,
            dimensions: DEFAULT_DIMENSIONS,
            useScaling: useScaling,
            batchingFrequency: batchingFrequency,
            // TODO rename conversion to event
            dailyConversionCountPerBucket: dailyEventCountPerBucket,
            // Not needed for simple mode
            // TODO change that
            dailyConversionCountTotal: null,
            keyStrategy: keyStrategy,
            // TODO change that - Not needed for simple mode (?)
            keyStructures: keyStructures,
            // TODO generate this from the measurementGoal etc
            // TODO change budgetSplit data structure: Use an object for faster retrieval
            budgetSplit,
            zeroBucketsPercentage: 0,
        }
        const simulation = simulate(options)
        setSimulations([...simulations, simulation])
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
                            <CountPerBucket
                                dailyEventCountPerBucketOptions={
                                    EVENT_COUNT_PER_BUCKET_OPTIONS
                                }
                                dailyEventCountPerBucket={
                                    dailyEventCountPerBucket
                                }
                                setDailyEventCountPerBucket={
                                    setDailyEventCountPerBucket
                                }
                            />
                        </div>
                        <div>
                            <h3>Data you want to track: Measurement goals</h3>
                            <div>
                                <div id="measurement-goals-table"></div>
                            </div>
                        </div>
                        <div>
                            <h3>Data you want to track: Dimensions</h3>
                            <div>
                                <div id="dimensions-table"></div>
                            </div>
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
                            <ContributionBudgetSplit
                                budgetSplit={budgetSplit}
                                setBudgetSplit={setBudgetSplit}
                                disabled
                            />
                            <h4>Key strategy:</h4>
                            <KeyStrategy keyStrategy={keyStrategy} />
                        </div>
                    </div>
                    <div class="buttons-wrapper-launch-panel">
                        <button
                            id="button-simulate"
                            class="primary"
                            onclick={simulateSimpleMode}
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
