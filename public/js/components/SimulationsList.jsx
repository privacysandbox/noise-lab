import { h, render, Component } from 'preact'
import { Simulation } from './Simulation'

export function SimulationsList(props) {
    const { simulations, setAllSimulationDataTables, allSimulationDataTables } =
        props

    return (
        <div>
            {simulations.map((s) => (
                <Simulation
                    simulation={s}
                    setAllSimulationDataTables={setAllSimulationDataTables}
                    allSimulationDataTables={allSimulationDataTables}
                />
            ))}
        </div>
    )
}
