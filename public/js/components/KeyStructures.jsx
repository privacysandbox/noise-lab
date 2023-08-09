import { h, render, Component } from 'preact'
import { generateKeyStructure } from '../utils.misc'

export function KeyStructures(props) {
    const { keyStructuresCount, dimensions, keyStructures, setKeyStructures } =
        props

    function handleChange(event, idx, dimensionName) {
        const isChecked = event.target.checked
        const keyStructureToUpdate = keyStructures[idx]
        const dimensionSetToUpdate = keyStructureToUpdate.names

        let newDimensionSet = []
        if (isChecked) {
            // Add the dimension
            newDimensionSet = [...dimensionSetToUpdate, dimensionName]
        } else {
            // Remove the dimension
            newDimensionSet = [...dimensionSetToUpdate].filter(
                (dimName) => dimName !== dimensionName
            )
        }
        // Generate the `combinations` field based on the new dimensions for this key structure
        const newKeyStructure = generateKeyStructure(
            newDimensionSet,
            dimensions
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



    // Key structure 1
    // x geography
    // o campaignId
    // x productCategory

    // Key structure 2
    // x geography
    // x campaignId
    // o productCategory

    // Key structure 3
    // o geography
    // x campaignId
    // x productCategory
    // [
    //     {
    //         "names": [
    //             "geography",
    //             "productCategory"
    //         ],
    //         "combinations": [
    //             "3",
    //             "2"
    //         ]
    //     },
    //     {
    //         "names": [
    //             "geography",
    //             "campaignId"
    //         ],
    //         "combinations": [
    //             "3",
    //             "4"
    //         ]
    //     },
    //     {
    //         "names": [
    //             "campaignId",
    //             "productCategory"
    //         ],
    //         "combinations": [
    //             "4",
    //             "2"
    //         ]
    //     }
    // ]

    // -----------------------------
    // -----------------------------

    // Key structure 1
    // o geography
    // x campaignId
    // x productCategory

    // Key structure 2
    // x geography
    // x campaignId
    // x productCategory

    // [
    //     {
    //         "names": [
    //             "campaignId",
    //             "productCategory"
    //         ],
    //         "combinations": [
    //             "4",
    //             "2"
    //         ]
    //     },
    //     {
    //         "names": [
    //             "geography",
    //             "campaignId",
    //             "productCategory"
    //         ],
    //         "combinations": [
    //             "3",
    //             "4",
    //             "2"
    //         ]
    //     }
    // ]