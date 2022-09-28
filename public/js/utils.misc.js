export function generateSimulationId() {
    return crypto.randomUUID().substring(0, 8)
}

export function generateSimulationTitle(dateTime) {
    return `Simulation ${dateTime} ${dateTime.toLocaleDateString()}`
}

export function generateCsvFileName(simulationId, tableName) {
    return `${simulationId}-${tableName}-noiseLab.csv`
}
