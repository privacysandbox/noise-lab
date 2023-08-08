import { h, render, Component } from 'preact'

// TODO-refactor make capValue a utility function
function capValue(inputValue) {
    if (inputValue < 0) {
        return 0
    } else if (inputValue > 10) {
        return 10
    } else return Number(inputValue)
}

export function ZeroBuckets(props) {
    const { setZeroBucketsPercentage, zeroBucketsPercentage } = props

    function handleChange(event) {
        const inputValue = event.target.value
        const cappedValue = capValue(inputValue)
        // Update the state in the parent component
        setZeroBucketsPercentage(cappedValue)
    }

    return (
        <div>
            <label>Percentage of buckets with 0 conversions:</label>
            <input
                type="number"
                min="0"
                max="10"
                onInput={handleChange}
                value={zeroBucketsPercentage}
            />
            <div class="help" id="help-zero-pct"></div>
            <div class="input-hint below-input">Min: 0, Max: 10</div>
        </div>
    )
}
