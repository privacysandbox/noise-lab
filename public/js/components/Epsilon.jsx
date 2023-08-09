import { h, render, Component } from 'preact'
import { cap } from '../utils.misc'

export function Epsilon(props) {
    const { setEpsilon, epsilon, minEpsilon, maxEpsilon } = props

    function handleChange(event) {
        const inputEpsilon = event.target.value
        const cappedEpsilon = cap(inputEpsilon, minEpsilon, maxEpsilon)
        // Update the state in the parent component
        setEpsilon(cappedEpsilon)
    }

    return (
        <div>
            <label>Epsilon:</label>
            <input
                type="number"
                min="0"
                max={maxEpsilon}
                onInput={handleChange}
                value={epsilon}
            />
            <div class="help" id="help-epsilon"></div>
            <div class="input-hint below-input">
                Min: {minEpsilon}, Max: {maxEpsilon}
            </div>
        </div>
    )
}
