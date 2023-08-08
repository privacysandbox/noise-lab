import { h, render, Component } from 'preact'
import { CONTRIBUTION_BUDGET } from '../config'

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
        if (budgetSplitMode === 'percentage') {
            newPercentage = event.target.value
            newValue = (CONTRIBUTION_BUDGET * newPercentage) / 100
        } else if (budgetSplitMode === 'value') {
            newValue = event.target.value
            newPercentage = (newValue * 100) / CONTRIBUTION_BUDGET
        }
        const newBudgetSplit = [...budgetSplit]
        newBudgetSplit[idx] = {
            ...budgetSplit[idx],
            percentage: newPercentage,
            value: newValue,
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
                        value="percentage"
                        onInput={handleModeChange}
                        checked={budgetSplitMode === 'percentage'}
                    ></input>
                    <label for="percentage">Percentage</label>
                </div>
                <div>
                    <input
                        type="radio"
                        id="value"
                        value="value"
                        onInput={handleModeChange}
                        checked={budgetSplitMode === 'value'}
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
                                budgetSplitMode === 'percentage'
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
