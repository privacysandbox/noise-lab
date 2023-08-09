import { h, render, Component } from 'preact'

export function KeyStructures(props) {
    const { keyStructuresCount, dimensions, keyStructures, setKeyStructures } =
        props

    function handleChange(event, idx, dimensionName) {
        const isChecked = event.target.checked
        const keyStructureToUpdate = keyStructures[idx]
        const newKeyStructure = {}

        if (isChecked) {
            // Add the dimension
            newKeyStructure.names = [
                ...keyStructureToUpdate.names,
                dimensionName,
            ]
        } else {
            // Remove the dimension
            newKeyStructure.names = [...keyStructureToUpdate.names].filter(
                (dimName) => dimName !== dimensionName
            )
        }
        // Generate the `combinations` field based on the new dimensions for this key structure
        newKeyStructure.combinations = newKeyStructure.names.map(
            (dimensionName) =>
                dimensions[
                    dimensions.findIndex((d) => d.name === dimensionName)
                ].size
        )
        // Replace the old key structure with the new one
        const newKeyStructures = [...keyStructures]
        newKeyStructures[idx] = newKeyStructure
        setKeyStructures(newKeyStructures)
    }

    return (
        <div class="framed">
            {Array(Number(keyStructuresCount))
                .fill(0)
                .map((value, idx) => (
                    <div>
                        <h5>Key structure {idx + 1}:</h5>
                        {dimensions.map((dim) => (
                            <div>
                                <input
                                    type="checkbox"
                                    checked={keyStructures[idx].names.includes(
                                        dim.name
                                    )}
                                    onClick={(event) =>
                                        handleChange(event, idx, dim.name)
                                    }
                                ></input>
                                <label>{dim.name}</label>
                            </div>
                        ))}
                    </div>
                ))}
        </div>
    )
}


