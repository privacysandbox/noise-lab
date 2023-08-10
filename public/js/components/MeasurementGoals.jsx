// TODO-CLEAN Delete this whole file

/* Copyright 2022 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

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
        // `updateBudgetSplit` is not needed here, because `handleChange` is only called when the name or property of the measurement goals change (not when the number of goals change)
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