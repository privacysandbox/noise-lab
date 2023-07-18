import { h, render, Component } from 'preact'

export function ContributionBudget(props) {
    const { contributionBudgetValue } = props
    return (
        <div>
            <label for="contribution-budget">Contribution budget:</label>
            <span id="contribution-budget">{contributionBudgetValue}</span>
            <div class="help" id="help-budget"></div>
        </div>
    )
}
