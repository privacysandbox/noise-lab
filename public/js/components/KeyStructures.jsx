import { h, render, Component } from 'preact'

export function KeyStructures(props) {
    const { keyStructuresCount, dimensions, keyStructures, setKeyStructures } =
        props
    console.log(keyStructuresCount)

    console.log(Array(Number(keyStructuresCount)).fill(0))

    console.log(dimensions)

    // TODO onchange!!!!

    const dimensionDiv = dimensions.map((d) => <div>{d.name}</div>)

    // TODO cleanup
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

    return Array(Number(keyStructuresCount))
        .fill(0)
        .map((value, idx) => (
            <div>
                <h5>Key structure {idx + 1}:</h5>
                {dimensions.map((d) => (
                    <div>
                        <input
                            type="checkbox"
                            checked={keyStructures[idx].names.includes(d.name)}
                        ></input>
                        <label>{d.name}</label>
                    </div>
                ))}
            </div>
        ))
}
