import { h, render, Component } from 'preact'
import { cap } from '../utils.misc'

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
        const newKeyStructuresCount = Number(cap(inputValue, 1))
        setKeyStructuresCount(newKeyStructuresCount)
        updateBudgetSplit(measurementGoals, newKeyStructuresCount)

        // TOOD update when dimensions update
        if (newKeyStructuresCount > keyStructuresCount) {
            const numberOfKeyStructuresToAdd =
                newKeyStructuresCount - keyStructuresCount
            const newKeyStructures = Array(numberOfKeyStructuresToAdd)
                .fill(0)
                .map((v, idx) => ({
                    names: [],
                    combinations: [],
                }))
            setKeyStructures([...keyStructures, ...newKeyStructures])
        } else {
            const numberOfKeyStructuresToRemove =
                keyStructuresCount - newKeyStructuresCount
            const newKeyStructures = [...keyStructures]
            // `splice` mutates the object or array!
            newKeyStructures.splice(
                keyStructures.length - numberOfKeyStructuresToRemove,
                numberOfKeyStructuresToRemove
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
            <div class="input-hint below-input">Min: 1</div>
        </div>
    )
}
