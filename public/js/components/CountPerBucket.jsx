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

export function CountPerBucket(props) {
    const {
        setDailyEventCountPerBucket,
        dailyEventCountPerBucket,
        dailyEventCountPerBucketOptions,
    } = props

    function handleChange(event) {
        const inputCountPerBucket = event.target.value
        setDailyEventCountPerBucket(inputCountPerBucket)
    }

    return (
        <div>
            <label>
                Average daily attributable conversion count PER BUCKET:
            </label>
            <select onInput={handleChange} name="event-count-daily-bucket">
                {Object.values(dailyEventCountPerBucketOptions).map((c) => (
                    <option
                        selected={c.value === dailyEventCountPerBucket}
                        value={c.value}
                    >
                        {c.name}
                    </option>
                ))}
            </select>
            <div class="help" id="help-daily"></div>
        </div>
    )
}
