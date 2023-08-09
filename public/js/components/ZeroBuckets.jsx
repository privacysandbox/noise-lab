import { h, render, Component } from 'preact'
import { cap } from '../utils.misc'

export function ZeroBuckets(props) {
    const { setZeroBucketsPercentage, zeroBucketsPercentage } = props

    function handleChange(event) {
        const inputValue = event.target.value
        const cappedValue = cap(Number(inputValue), 0, 10)
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
