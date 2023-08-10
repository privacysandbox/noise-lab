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

import { BUDGET_SPLIT_PERCENTAGE, BUDGET_SPLIT_VALUE } from './config'

export function validateInputs(options) {
    const {
        contributionBudget,
        measurementGoals,
        dimensions,
        useScaling,
        dailyEventCountPerBucket,
        keyStructuresCount,
        keyStructures,
        budgetSplit,
        budgetSplitMode,
    } = options

    const errors = []
    validateMeasurementGoals(measurementGoals, errors)
    validateDimensions(dimensions, errors)
    validateDailyEventCountPerBucket(dailyEventCountPerBucket, errors)
    validateKeyStructures(errors, keyStructuresCount, keyStructures)
    if (useScaling) {
        validateBudgetSplit(
            budgetSplit,
            budgetSplitMode,
            contributionBudget,
            keyStructuresCount,
            errors
        )
    }
    return errors
}

function validateMeasurementGoals(measurementGoals, errors) {
    measurementGoals.forEach((measGoal) => {
        const { avgValue, maxValue, name } = measGoal
        if (maxValue * 1 < 1 || maxValue == undefined)
            errors.push(measGoal.name + ': Maximum value must be >= 1.')
        if (avgValue * 1 < 1 || avgValue == undefined)
            errors.push(measGoal.name + ': Average value must be >= 1.')
        if (avgValue * 1 > maxValue * 1)
            errors.push(
                name + ': Maximum value cannot be smaller than average value.'
            )
    })
}

function validateDimensions(dimensions, errors) {
    let totalNumberOfPossibleDistinctValues = 1
    dimensions.forEach((dimension) => {
        // `dimension.size` is the number of distinct values for that dimension
        if (
            dimension.size * 1 < 1 ||
            dimension.size == undefined ||
            dimension.size == ''
        )
            errors.push(dimension.name + ': Dimension size must be >=1.')
        totalNumberOfPossibleDistinctValues =
            totalNumberOfPossibleDistinctValues * dimension.size
    })
    if (totalNumberOfPossibleDistinctValues > Math.pow(2, 128))
        errors.push(
            'The dimensions sizes you defined would result in a key longer than 128 bits. Adjust the dimensions sizes so their product is <= 128.'
        )
}

function validateDailyEventCountPerBucket(dailyEventCountPerBucket, errors) {
    if (dailyEventCountPerBucket < 1) {
        errors.push(
            'The daily event count per bucket is too low. Increase it so there is at least 1 daily event per bucket.'
        )
    }
}

function validateBudgetSplit(
    // budgetSplit looks as follows: { measurementGoal: xxx, percentage: xxx, value: xxx }
    budgetSplit,
    budgetSplitMode,
    contributionBudget,
    keyStructuresCount,
    errors
) {
    // `keyStructuresCount` = 1 for Strategy A
    // `keyStructuresCount` > 1 for Strategy B
    if (budgetSplitMode === BUDGET_SPLIT_PERCENTAGE) {
        const sumOfAllPercentages = budgetSplit.reduce((sum, entry) => {
            return sum + entry.percentage
        }, 0)
        if (sumOfAllPercentages > Math.floor(100 / keyStructuresCount)) {
            errors.push(
                `The sum of all budget split percentages exceeds the maximum allowed per key: ${Math.floor(
                    100 / keyStructuresCount
                )} (= 100/<Number of key structures>).`
            )
        }
    } else if (budgetSplitMode === BUDGET_SPLIT_VALUE) {
        const sumOfAllValues = budgetSplit.reduce((sum, entry) => {
            return sum + entry.value
        }, 0)
        if (
            sumOfAllValues > Math.floor(contributionBudget / keyStructuresCount)
        ) {
            errors.push(
                `The sum of all budget split values exceeds the total contribution budget per key: ${Math.floor(
                    contributionBudget / keyStructuresCount
                )} (= contributionBudget/<Number of key structures>).`
            )
        }
    }
}

function validateKeyStructures(errors, keyStructuresCount, keyStructures) {
    if (keyStructuresCount !== keyStructures.length) {
        // This should never happen because we're keeping them in sync in the code, but just in case.
        errors.push(
            `The number of expected key structures (${keyStructuresCount.length}) and the actual number of key structures (${keyStructures.length}) don't match.`
        )
        return
    }
    keyStructures.forEach((keyStructure, idx) => {
        console.log(keyStructure)
        if (keyStructure.combinations.length < 2) {
            errors.push(
                `Key structure ${
                    idx + 1
                }: at least 2 dimensions should be checked for each key structure.`
            )
        }
    })
}
