import { h, render, Component, Fragment } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { appendDataTableChild } from '../dom'
import { simulate } from '../utils.simulate'
import { downloadAll } from '../store'
import { generateConfirmMessage } from '../utils.misc'
import {
    DEFAULT_MEASUREMENT_GOALS,
    DEFAULT_DIMENSIONS,
    CONTRIBUTION_BUDGET,
    BATCHING_FREQUENCIES,
    DEFAULT_EPSILON,
    EVENT_COUNT_PER_BUCKET,
    KEY_STRATEGIES,
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
const defaultDailyEventCountPerBucket = EVENT_COUNT_PER_BUCKET[100].value
const defaultKeyStrategy = KEY_STRATEGIES.A.value
const defaultBatchingFrequency = BATCHING_FREQUENCIES.daily.value
const defaultBudgetSplit = DEFAULT_MEASUREMENT_GOALS.map((m) => ({
    measurementGoal: m.name,
    percentage: 100 / DEFAULT_MEASUREMENT_GOALS.length,
}))

const useMountEffect = (fun) => useEffect(fun, [])

export function SimpleMode(props) {
    const [epsilon, setEpsilon] = useState(DEFAULT_EPSILON)

    const [batchingFrequency, setBatchingFrequency] = useState(
        defaultBatchingFrequency
    )
    const [budgetSplit, setBudgetSplit] = useState(defaultBudgetSplit)

    const [useScaling, setUseScaling] = useState(defaultUseScaling)
    const [dailyEventCountPerBucket, setDailyEventCountPerBucket] = useState(
        defaultDailyEventCountPerBucket
    )
    const [keyStrategy, setKeyStrategy] = useState(defaultKeyStrategy)
    const [simulations, setSimulations] = useState([])
    const [allSimulationDataTables, setAllSimulationDataTables] = useState({})

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
        const dimensionNames = DEFAULT_DIMENSIONS.map((dim) => dim.name)
        const dimensionSizes = DEFAULT_DIMENSIONS.map((dim) => dim.size)
        const simulation = simulate(
            DEFAULT_MEASUREMENT_GOALS,
            DEFAULT_DIMENSIONS,
            dimensionNames,
            dimensionSizes,
            epsilon,
            CONTRIBUTION_BUDGET,
            useScaling,
            // TODO-CLEAN switch to DOM / source of truth function?
            true,
            batchingFrequency,
            dailyEventCountPerBucket,
            // Last param not is not needed in the simple mode
            null
        )
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
                            />
                        </div>
                        <div>
                            <h3>Your conversion data</h3>
                            <CountPerBucket
                                dailyEventCountPerBucketOptions={
                                    EVENT_COUNT_PER_BUCKET
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
                                setBudgetSplit={setKeyStrategy}
                                disabled={true}
                            />
                            <KeyStrategy
                                keyStrategiesOptions={KEY_STRATEGIES}
                                keyStrategy={keyStrategy}
                                setKeyStrategy={setKeyStrategy}
                            />
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