import { h, render, Component } from 'preact'

export function KeyStrategy(props) {
    const { keyStrategy } = props

    // TODO update budgetSplit when any of these change: (NONEED budgetSplitOption), numberOfMeasurementGoals, contributionBudget, noKeys

    return (
        <div>
            <label for="key-strategy">Key strategy:</label>
            {keyStrategy}
            <div class="help" id="help-key-strategy"></div>
        </div>
    )
}
