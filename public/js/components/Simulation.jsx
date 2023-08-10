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

import { h, render, Component } from 'preact'
import { useRef, useState, useEffect } from 'preact/hooks'
import { displayInputParameters } from '../dom'
import { SummaryReport } from './SummaryReport'

export function Simulation(props) {
    const { simulation } = props
    const { inputParameters, summaryReports } = simulation
    const { simulationId, simulationTitle } = simulation.metadata
    // `useRef`: https://react.dev/reference/react/useRef#manipulating-the-dom-with-a-ref
    const inputParamsTableEl = useRef(null)

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
                            // `idx` is now used as a `simulationNo`
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
