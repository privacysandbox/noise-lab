import { h, render, Component } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { createAndDisplayDataTable } from '../dom'
import { saveTable } from '../store'

export function SummaryReport(props) {
    const { report, simulationId, simulationNo } = props
    const { dimensionsString } = report

    const { noiseMetrics, data, measurementGoal, scalingFactor } = report
    const { noise_ape_percent, noise_rmsre } = noiseMetrics
    const [reportTable, setReportTable] = useState([])

    const tableId = `output-data-table-${simulationId}-${measurementGoal}-${simulationNo}`

    useEffect(() => {
        // TODO-CLEAN createAndDisplayDataTable vs appendDataTableChild
        const table = createAndDisplayDataTable(`#${tableId}`, data, {
            pagination: true,
            paginationSize: 5,
        })
        setReportTable(table)
        saveTable(table, `${simulationId}-${measurementGoal}-${simulationNo}`)
    }, [])

    return (
        <div>
            <h4>Measurement goal: {measurementGoal}</h4>
            <div class="noise-wrapper">
                <h5>Average percentage error (APE): </h5>
                <div class={getClassNoise_ape(noise_ape_percent)}></div>
                <div class="has-helper mono">
                    Exact value = {noise_ape_percent.toFixed(3)}%
                </div>
                <div class="help help-noise-ape"></div>
                <h5>RMSRE with t=5: </h5>
                <div class={getClassNoise_rmsre(noise_rmsre)}></div>
                {/* TODO remove inline toFixed */}
                <div class="has-helper mono">
                    Exact value = {noise_rmsre.toFixed(3)}
                </div>
                <div class="help help-noise-rmsre"></div>
            </div>
            <h5 class="has-helper">Details of the data: </h5>
            <div class="help help-data"></div>
            <h6>Dimensions:</h6>
            <div class="offset-left has-helper mono">{dimensionsString}</div>
            <h6>Scaling factor:</h6>
            <div class="offset-left has-helper mono">{scalingFactor}</div>
            <div class="help help-scaling-factor-value"></div>
            <h6>Data table:</h6>
            <details id={tableId} class="offset-left"></details>
        </div>
    )
}

function getClassNoise_ape(apeValue) {
    return `noise has-helper ${getNoiseBadgeType(apeValue, true)}`
}

function getClassNoise_rmsre(rmsreValue) {
    return `noise has-helper ${getNoiseBadgeType(rmsreValue, false)}`
}

function getNoiseBadgeType(noiseValue, isPercentage) {
    if (isPercentage) {
        if (noiseValue >= 100) {
            return 'over-100'
        } else if (noiseValue >= 20) {
            return 'over-20'
        } else if (noiseValue >= 15) {
            return 'over-15'
        } else if (noiseValue >= 10) {
            return 'over-10'
        } else if (noiseValue >= 5) {
            return 'over-5'
        } else if (noiseValue >= 1) {
            return 'over-1'
        } else {
            return 'under-1'
        }
    } else {
        if (noiseValue >= 1) {
            return 'r-over-1'
        } else if (noiseValue >= 0.2) {
            return 'r-over-02'
        } else if (noiseValue >= 0.15) {
            return 'r-over-015'
        } else if (noiseValue >= 0.1) {
            return 'r-over-01'
        } else if (noiseValue >= 0.05) {
            return 'r-over-005'
        } else if (noiseValue >= 0.01) {
            return 'r-over-001'
        } else {
            return 'r-under-001'
        }
    }
}
