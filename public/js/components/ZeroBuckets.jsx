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
import { cap } from '../utils.misc'

export function ZeroBuckets(props) {
    const { setZeroBucketsPercentage, zeroBucketsPercentage } = props

    function handleChange(event) {
        const inputValue = event.target.value
        const cappedValue = cap(Number(inputValue), 0, 10)
        // Update the state in the parent component
        setZeroBucketsPercentage(cappedValue)
    }

    return (
        <div>
            <label>Percentage of buckets with 0 conversions:</label>
            <input
                type="number"
                min="0"
                max="10"
                onInput={handleChange}
                value={zeroBucketsPercentage}
            />
            <div class="help" id="help-zero-pct"></div>
            <div class="input-hint below-input">Min: 0, Max: 10</div>
        </div>
    )
}
