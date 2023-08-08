import { h, render, Component } from 'preact'

export function BatchingFrequency(props) {
    const {
        setBatchingFrequency,
        batchingFrequency,
        batchingFrequenciesOptions,
    } = props

    function handleChange(event) {
        const inputBatchingFrequency = event.target.value
        setBatchingFrequency(inputBatchingFrequency)
    }

    return (
        <div>
            <label>Batching frequency:</label>
            <select onInput={handleChange}>
                {Object.values(batchingFrequenciesOptions).map((f) => (
                    <option
                        selected={f.value === batchingFrequency}
                        value={f.value}
                    >
                        {f.name}
                    </option>
                ))}
            </select>
            <div class="help" id="help-batching-frequency"></div>
        </div>
    )
}
