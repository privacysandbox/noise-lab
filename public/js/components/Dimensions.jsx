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

export function Dimensions(props) {
    const { setDimensions, dimensions } = props

    function handleChange(event, fieldToUpdate, idx) {
        let newValue = event.target.value
        if (fieldToUpdate === 'size') {
            newValue = Number(newValue)
        }

        // Copy the object to prevent mutations
        const newDimensions = [...dimensions]
        newDimensions[idx] = {
            ...newDimensions[idx],
            [fieldToUpdate]: newValue,
        }
        setDimensions(newDimensions)
    }

    function removeDimension(event, idx) {
        if (dimensions.length > 1) {
            const newDimensions = [...dimensions]
            newDimensions.splice(idx, 1)
            setDimensions(newDimensions)
        }
    }

    return (
        <div>
            {dimensions.length < 2 && (
                <div class="input-hint margin-v">
                    ⚠️ At least one dimension required
                </div>
            )}
            {dimensions.map((d, idx) => (
                <div>
                    <div class="flex">
                        <h4>Dimension {idx + 1}:</h4>
                        <button
                            class="ternary-xs"
                            onclick={(event) => removeDimension(event, idx)}
                            disabled={
                                // Need at least one dimension
                                dimensions.length < 2 ? true : false
                            }
                        >
                            🗑️ Remove
                        </button>
                    </div>
                    <label>Name:</label>
                    <input
                        value={d.name}
                        type="text"
                        onInput={(event) => handleChange(event, 'name', idx)}
                    ></input>
                    <label>
                        Number of possible different values for this dimension:
                    </label>
                    <input
                        type="number"
                        value={d.size}
                        onInput={(event) => handleChange(event, 'size', idx)}
                        min="1"
                    ></input>
                </div>
            ))}
        </div>
    )
}
