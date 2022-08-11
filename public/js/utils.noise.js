import laplace from '@stdlib/random-base-laplace'

export function getScalingFactorForMetric(
    metric,
    totalNumberOfMetrics,
    contributionBudget
) {
    const budgetPerMetric = Math.floor(
        contributionBudget / totalNumberOfMetrics
    )
    const scalingFactorForThisMetric = Math.floor(
        budgetPerMetric / metric.maxValue
    )
    return scalingFactorForThisMetric
}

export function getRandomLaplacianNoise(budget, epsilon) {
    // Laplace parameters
    const mu = 0
    const b = Math.floor(budget / epsilon)
    const randomLaplacianNoise = Math.floor(laplace(mu, b))
    return randomLaplacianNoise
}

export function calculateNoisePercentage(noise, noisyAggregatedValue) {
    return Math.abs(noise / noisyAggregatedValue) * 100
}

export function calculateAverageNoisePercentage(report) {
    const averageNoisePercentage =
        report
            .map((entry) => entry.noisePercentage)
            .reduce((prev, curr) => prev + curr, 0) / report.length
    // Only display 3 decimal digits
    return Number.parseFloat(averageNoisePercentage).toFixed(3)
}
