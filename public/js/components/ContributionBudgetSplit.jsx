import { h, render, Component } from 'preact'

export function ContributionBudgetSplit(props) {
    const { setBudgetSplit, budgetSplit, disabled } = props
    console.log(budgetSplit)

    const handleChange = (event) => {
        const x = event.target
        // setBudgetSplit
    }

    return (
        <div>
            <label class="long">Budget split (used for Scaling):</label>
            <div class="help" id="help-budget-split-simple-mode"></div>
            <div class="input-hint">
                ⚠️ The total contribution budget is split across measurement
                goals following the percentages below, so the sum of all
                percentages can't exceed 100.
            </div>
            <div id="budget-split-wrapper-el">
                {budgetSplit.map((m, idx) => (
                    <div>
                        <label>
                            Budget % for measurement goal {idx + 1} (
                            {budgetSplit[idx].measurementGoal}):
                        </label>
                        <input
                            id={(() => `budget-percent-meas-goal-${idx}`)()}
                            type="number"
                            disabled={disabled}
                            value={budgetSplit[idx].percentage}
                        ></input>
                    </div>
                ))}
            </div>
        </div>
    )
}
