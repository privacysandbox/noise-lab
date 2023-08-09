import { h, render, Component } from 'preact'

export function KeyStrategy(props) {
    // TODO-FIX-MINOR Add mode-specific helper <div class="help" id="help-key-strategy-simple-mode"></div>
    const { setKeyStrategy, keyStrategy, keyStrategiesOptions, disabled } =
        props

    // TODO update budgetSplit when any of these change: (NONEED budgetSplitOption), numberOfMeasurementGoals, contributionBudget, noKeys

    function handleChange(event) {
        const inputKeyStrategy = event.target.value
        setKeyStrategy(inputKeyStrategy)
    }

    return (
        <div>
            <label for="key-strategy">Key strategy:</label>
            <select
                name="key-strategy"
                id="key-strategy-select"
                disabled={disabled}
                onInput={handleChange}
            >
                {Object.values(keyStrategiesOptions).map((k) => (
                    <option selected={k.value === keyStrategy} value={k.value}>
                        {k.name}
                    </option>
                ))}
            </select>
            <div class="help" id="help-key-strategy"></div>
        </div>
    )
}
