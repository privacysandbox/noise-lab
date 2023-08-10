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
