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
