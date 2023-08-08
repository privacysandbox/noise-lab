import { h, render, Component } from 'preact'

// TODO-refactor make this a utility function
function capValue(inputValue) {
    if (inputValue < 1) {
        return 1
    } else return inputValue
}

export function KeyStructuresCount(props) {
    const {
        setKeyStructures,
        keyStructures,
        setKeyStructuresCount,
        keyStructuresCount,
        measurementGoals,
        updateBudgetSplit,
    } = props

    function handleChange(event) {
        const inputValue = event.target.value
        const newKeyStructuresCount = capValue(inputValue)
        setKeyStructuresCount(newKeyStructuresCount)
        updateBudgetSplit(measurementGoals, newKeyStructuresCount)

        const numberOfKeyStructuresToAdd =
            newKeyStructuresCount - keyStructuresCount

        // TOOD update when dimensions update????
        if (numberOfKeyStructuresToAdd > 0) {
            const newKeyStructures = Array(numberOfKeyStructuresToAdd)
                .fill(0)
                .map((v, idx) => ({
                    names: [],
                    combinations: [],
                }))
            setKeyStructures([...keyStructures, ...newKeyStructures])
        } else if (numberOfKeyStructuresToAdd < 0) {
            // TODO fix bug is tuis taken into account?
            const newKeyStructures = [...keyStructures].splice(
                keyStructures.length - Math.abs(numberOfKeyStructuresToAdd),
                Math.abs(numberOfKeyStructuresToAdd)
            )
            setKeyStructures(newKeyStructures)
        }
    }

    return (
        <div>
            <label>Number of key structures:</label>
            <input
                type="number"
                min="0"
                onInput={handleChange}
                value={keyStructuresCount}
            />
            <div class="help" id="help-key-strategy-number"></div>
            {/* TODO tooltip */}
            <div class="input-hint below-input">Min: 1</div>
        </div>
    )
}
