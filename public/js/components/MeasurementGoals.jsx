import { h, render, Component } from 'preact'

export function MeasurementGoals(props) {
    const {
        setMeasurementGoals,
        measurementGoals,
        updateBudgetSplit,
        keyStructuresCount,
    } = props

    // TOOD check if ID and idx do not interfere!

    function handleChange(event, fieldToUpdate, idx) {
        // TODO cap like epsilon!
        const newMeasurementGoals = [...measurementGoals]
        newMeasurementGoals[idx] = {
            ...newMeasurementGoals[idx],
            [fieldToUpdate]: event.target.value,
        }
        setMeasurementGoals(newMeasurementGoals)
        // updateBudgetSplit not needed here
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

    // TODO fix tooltips

    return (
        <div>
            {/* {JSON.stringify(measurementGoals)} */}
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
