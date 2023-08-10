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
                                    // A key structure's dimensions can only be edited if there are multiple key structures (Strategy B)
                                    // If there's only 1 key structure, we consider this to be Strategy A, i.e. the one and only key structure encodes all the dimensions
                                    disabled={keyStructuresCount === 1}
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
