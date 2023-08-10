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

export function Scaling(props) {
    const { setUseScaling, useScaling } = props

    function handleChange(event) {
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
