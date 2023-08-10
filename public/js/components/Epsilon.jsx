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
