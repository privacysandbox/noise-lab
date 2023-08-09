import { h, render, Component } from 'preact'

export function MeasurementGoals(props) {
    const {
        setMeasurementGoals,
        measurementGoals,
        updateBudgetSplit,
        keyStructuresCount,
    } = props

    function handleChange(event, fieldToUpdate, idx) {
        const newMeasurementGoals = [...measurementGoals]
        newMeasurementGoals[idx] = {
            ...newMeasurementGoals[idx],
            [fieldToUpdate]: event.target.value,
        }
        setMeasurementGoals(newMeasurementGoals)
        // Note that calling updateBudgetSplit is not needed here, because `handleChange` is only called when the name or property of the measurement goals change. Not when the number of goals change.
        // TODO associate setMeasurementGoals with updateBudgetSplit?
    }

    function removeMeasurementGoal(event, idx) {
        if (measurementGoals.length > 1) {
            const newMeasurementGoals = [...measurementGoals]
            newMeasurementGoals.splice(idx, 1)
            setMeasurementGoals(newMeasurementGoals)
            updateBudgetSplit(newMeasurementGoals, keyStructuresCount)
        }
    }

    return (
        <div>
            {measurementGoals.length < 2 && (
                <div class="input-hint margin-v">
                    ⚠️ At least one goal required
                </div>
            )}
            {measurementGoals.map((m, idx) => (
                <div>
                    <div class="flex">
                        <h4>Measurement goal {idx + 1}:</h4>
                        <button
                            class="ternary-xs"
                            onclick={(event) =>
                                removeMeasurementGoal(event, idx)
                            }
                            disabled={
                                // Need at least one measurement goal
                                measurementGoals.length < 2 ? true : false
                            }
                        >
                            🗑️ Remove
                        </button>
                    </div>

                    <label>Name:</label>
                    <input
                        value={m.name}
                        type="text"
                        onInput={(event) => handleChange(event, 'name', idx)}
                    ></input>
                    <label>Max value:</label>
                    <input
                        type="number"
                        value={m.maxValue}
                        onInput={(event) =>
                            handleChange(event, 'maxValue', idx)
                        }
                        min="1"
                    ></input>
                    <div class="help" id="help-outlier-management"></div>
                    <label>Average value:</label>
                    <input
                        type="number"
                        value={m.avgValue}
                        onInput={(event) =>
                            handleChange(event, 'avgValue', idx)
                        }
                        min="1"
                    ></input>
                </div>
            ))}
        </div>
    )
}
