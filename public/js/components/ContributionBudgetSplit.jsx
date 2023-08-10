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
import {
    CONTRIBUTION_BUDGET,
    BUDGET_SPLIT_PERCENTAGE,
    BUDGET_SPLIT_VALUE,
} from '../config'

// TODO-improvement Change budgetSplit data structure: Use an object for faster retrieval
export function ContributionBudgetSplit(props) {
    const {
        setBudgetSplit,
        budgetSplit,
        disabled,
        setBudgetSplitMode,
        budgetSplitMode,
    } = props

    function handleChange(event, idx) {
        let newPercentage,
            newValue = 0
        if (budgetSplitMode === BUDGET_SPLIT_PERCENTAGE) {
            newPercentage = event.target.value
            newValue = (CONTRIBUTION_BUDGET * newPercentage) / 100
        } else if (budgetSplitMode === BUDGET_SPLIT_VALUE) {
            newValue = event.target.value
            newPercentage = (newValue * 100) / CONTRIBUTION_BUDGET
        }
        const newBudgetSplit = [...budgetSplit]
        newBudgetSplit[idx] = {
            ...budgetSplit[idx],
            percentage: Number(newPercentage),
            value: Number(newValue),
        }
        setBudgetSplit(newBudgetSplit)
    }

    function handleModeChange(event) {
        setBudgetSplitMode(event.target.value)
    }

    return (
        <div>
            <h4>
                Budget split (used for Scaling):
                <div class="help" id="help-budget-split-advanced-mode"></div>
            </h4>

            <div>
                Split the budget by...
                <div>
                    <input
                        type="radio"
                        id="percentage"
                        value={BUDGET_SPLIT_PERCENTAGE}
                        onInput={handleModeChange}
                        checked={budgetSplitMode === BUDGET_SPLIT_PERCENTAGE}
                    ></input>
                    <label for="percentage">Percentage</label>
                </div>
                <div>
                    <input
                        type="radio"
                        id="value"
                        value={BUDGET_SPLIT_VALUE}
                        onInput={handleModeChange}
                        checked={budgetSplitMode === BUDGET_SPLIT_VALUE}
                    ></input>
                    <label for="value">Value</label>
                </div>
            </div>
            <div class="framed">
                <div class="input-hint">
                    ⚠️ The total contribution budget ({CONTRIBUTION_BUDGET}) is
                    split across measurement goals following the
                    percentages/values below. So the sum of all
                    percentages/values can't exceed 100/total contribution
                    budget.
                </div>
                <br />
                {budgetSplit.map((m, idx) => (
                    <div>
                        <label>
                            Budget {budgetSplitMode} for measurement goal{' '}
                            {idx + 1} ({budgetSplit[idx].measurementGoal}):
                        </label>
                        <input
                            id={(() => `budget-percent-meas-goal-${idx}`)()}
                            type="number"
                            disabled={disabled}
                            value={
                                budgetSplitMode === BUDGET_SPLIT_PERCENTAGE
                                    ? budgetSplit[idx].percentage
                                    : budgetSplit[idx].value
                            }
                            onInput={(event) => handleChange(event, idx)}
                        ></input>
                    </div>
                ))}
            </div>
        </div>
    )
}
