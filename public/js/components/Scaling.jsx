import { h, render, Component } from 'preact'

export function Scaling(props) {
    const { setUseScaling, useScaling } = props

    const handleChange = (event) => {
        const inputUseScaling = event.target.value
        // Hack because the value property of an option element can only be a string
        let useScaling = true
        if (inputUseScaling === 'false') {
            useScaling = false
        }
        setUseScaling(useScaling)
    }

    return (
        <div>
            <label>Use scaling (recommended):</label>
            <select name="scaling" id="scaling" onInput={handleChange}>
                <option value={true} selected={useScaling === true}>
                    Yes (recommended)
                </option>
                <option value={false} selected={useScaling === false}>
                    No
                </option>
            </select>
            <div class="help" id="help-scaling"></div>
        </div>
    )
}
// TODO-CHECK check values with and without scaling, check that budget split is working properly
