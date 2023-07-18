import { h, render, Component } from 'preact'
import { useRef, useState, useEffect } from 'preact/hooks'
import { displayInputParameters } from '../dom'
import { SummaryReport } from './SummaryReport'

export function Simulation(props) {
    const { simulation } = props
    const { inputParameters, summaryReports } = simulation
    const { simulationId, simulationTitle } = simulation.metadata
    const inputParamsTableEl = useRef(null)

    console.log(simulation)

    useEffect(() => {
        const el = inputParamsTableEl.current
        displayInputParameters(el, inputParameters, simulationId)
    }, [])

    return (
        <div class="simulation-wrapper" id={simulationId}>
            <h2>{simulationTitle}</h2>
            <div class="simulation-id">
                Unique simulation ID: {simulationId}
            </div>
            <div>
                <h3>Parameters (input)</h3>
                <div ref={inputParamsTableEl}></div>
                <div>
                    <h3>Summary reports (output)</h3>
                    {summaryReports.map((r, idx) => (
                        <SummaryReport
                            simulationNo={idx}
                            report={r}
                            simulationId={simulationId}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

// TODO-FIX Missing tooltips, see legacy function updateTooltips()
// TODO-CHECK downloadAll
// TODO-NOTE idx
