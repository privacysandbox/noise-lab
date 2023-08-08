import { h, render, Component } from 'preact'

// TODO-refactor make capEpsilon a utility function
function capEpsilon(inputEpsilon) {
    if (inputEpsilon < 0) {
        return 0
    } else if (inputEpsilon > 64) {
        return 64
    } else return inputEpsilon
}

export function Epsilon(props) {
    const { setEpsilon, epsilon } = props

    function handleChange(event) {
        const inputEpsilon = event.target.value
        const cappedEpsilon = capEpsilon(inputEpsilon)
        // Update the state in the parent component
        setEpsilon(cappedEpsilon)
    }

    return (
        <div>
            <label>Epsilon:</label>
            <input
                type="number"
                min="0"
                max="64"
                onInput={handleChange}
                value={epsilon}
            />
            <div class="help" id="help-epsilon"></div>
            <div class="input-hint below-input">Min: 0, Max: 64</div>
        </div>
    )
}
