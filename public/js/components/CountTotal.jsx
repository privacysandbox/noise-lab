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

export function CountTotal(props) {
    const {
        setDailyEventCountTotal,
        dailyEventCountTotal,
        dailyEventCountTotalOptions,
    } = props

    function handleChange(event) {
        const inputCountTotal = event.target.value
        setDailyEventCountTotal(inputCountTotal)
    }

    return (
        <div>
            <label>TOTAL daily attributable conversion count:</label>
            <select onInput={handleChange} name="event-count-daily-total">
                {Object.values(dailyEventCountTotalOptions).map((c) => (
                    <option
                        selected={c.value === dailyEventCountTotal}
                        value={c.value}
                    >
                        {c.name}
                    </option>
                ))}
            </select>
            <div class="help" id="help-daily-total" aria-expanded="true"></div>
        </div>
    )
}
