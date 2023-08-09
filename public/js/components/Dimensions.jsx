import { h, render, Component } from 'preact'
import { getDailyEventCountPerBucket } from '../utils.misc'

export function Dimensions(props) {
    const {
        setDimensions,
        dimensions,
        setDailyEventCountPerBucket,
        dailyEventCountTotal,
    } = props

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

        setDailyEventCountPerBucket(
            getDailyEventCountPerBucket(dailyEventCountTotal, newDimensions)
        )
    }

    function removeDimension(event, idx) {
        if (dimensions.length > 1) {
            const newDimensions = [...dimensions]
            newDimensions.splice(idx, 1)
            setDimensions(newDimensions)

            setDailyEventCountPerBucket(
                getDailyEventCountPerBucket(dailyEventCountTotal, newDimensions)
            )
        }
    }

    return (
        <div>
            {/* {JSON.stringify(dimensions)} */}
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
