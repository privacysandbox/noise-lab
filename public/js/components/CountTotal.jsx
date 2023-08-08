import { h, render, Component } from 'preact'
import { getNumberOfBuckets } from '../dom'

export function CountTotal(props) {
    const {
        setDailyEventCountTotal,
        dailyEventCountTotal,
        dailyEventCountTotalOptions,
        setDailyEventCountPerBucket,
        dimensions,
    } = props

    function handleChange(event) {
        const inputCountTotal = event.target.value
        setDailyEventCountTotal(inputCountTotal)
        // TODO do I need to do that manually? no way to observe dimensions or total, and update dailyEventCountPerBucket when they change?
        setDailyEventCountPerBucket(
            Math.floor(inputCountTotal / getNumberOfBuckets(dimensions))
        )
    }

    // TODO update budget split when keys
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
