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

import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css' // optional for styling
import 'tippy.js/themes/light.css'

const mainOptions = {
    allowHTML: true,
    duration: 0,
    animation: 'fade',
    theme: 'light',
    trigger: 'click',
    interactive: true,
}

const defaultOptions = {
    ...mainOptions,
    placement: 'right',
}

const bottomOptions = {
    ...mainOptions,
    placement: 'bottom',
}

const quickGuideUrl =
    'https://developer.chrome.com/docs/privacy-sandbox/summary-reports/design-decisions/'

const detailedGuideUrl =
    'https://docs.google.com/document/d/1bU0a_njpDcRd9vDR0AJjwJjrf3Or8vAzyfuK8JZDEfo/view'

const apeDescriptionUrl = `${quickGuideUrl}#ape`
const rmspe_tDescriptionUrl = `${quickGuideUrl}#rmspe_t`

const learnMoreHtml = `<br/>Learn more:<br/><a href='${quickGuideUrl}'>Quick guide</a> · <a href='${detailedGuideUrl}'>Detailed guide</a>`

tippy('#help-epsilon', {
    content: `A higher epsilon leads to lower noise. Its maximum value for the aggregation service is 64. Epsilon can be altered by adtechs during the origin trial to evaluate various utility/privacy adjustments.<strong><br/>This impacts signal-to-noise ratios in the final summary reports.</strong><br/>${learnMoreHtml}`,
    ...defaultOptions,
})

tippy('#help-budget', {
    content: `The contribution budget is an upper limit to individual users' contributions to protect user privacy. Its value is a constant, set by the API.<br/> Adtechs can use this value to define their scaling strategy, in order to increase signal-to-noise ratio on the final reports.<br/><strong>This impacts signal-to-noise ratios in the final summary reports, but is a constant of the API (can't be configured by adtechs).</strong><br/>${learnMoreHtml}`,
    ...defaultOptions,
})

tippy('#help-scaling', {
    content: `Adtechs can decide to use scaling, in order to increase signal-to-noise ratio on the final reports. <br/><strong>This impacts signal-to-noise ratios in the final summary reports.</strong><br/> ${learnMoreHtml}`,
    ...defaultOptions,
})

tippy('#help-daily-total', {
    content: `Average daily count of attributable conversions over all buckets (keys).`,
    ...defaultOptions,
})

tippy('#help-daily', {
    content: `Average daily count of <em>attributable</em> conversions for one bucket (key) <em>with all
    dimensions combined</em>. 
    <ul>
    <li><em>attributable</em>: Attributable conversions are conversions that can be attributed to a given impression or click with the Attribution Reporting API. As of today, only <strong>single-touch, same-device conversions</strong> can be attributed with the API.</li>
    <li><em>with all
    dimensions combined</em>: For a set of dimensions <em>Campaign Id</em> x <em>Geography</em> x <em>Product category</em>, the average daily conversion count is the average daily conversion count for a given <em>Campaign Id</em> AND <em>Geography</em> AND <em>Product category</em>. This is a simple approach. Check out the advanced mode for more elaborate approaches. </li>
    </ul>
    <strong>This impacts signal-to-noise ratios in the final summary reports.</strong><br/> ${learnMoreHtml} <br/><br/> Tip: Try and experiment with different conversion counts based on different campaign variables: campaign budget, user reach, ad efficiencies, etc. For example, all else being equal, what happens when your advertiser's budget is $10K vs. $100K? $10K will have less attributed conversions than $100K. Maybe the signal-to-noise ratio will be too high at $10K, but acceptable at $100K.`,
    ...defaultOptions,
})

tippy('#help-batching-frequency', {
    content: `Frequency at which the adtech decides to batch the aggregatable reports, for aggregation by the aggregation service. <br/><strong>This impacts signal-to-noise ratios in the final summary reports.</strong> Batching less frequently leads to a higher value per bucket (key), leading to typically higher signal-to-noise ratios.<br/>${learnMoreHtml}`,
    ...defaultOptions,
})

const keyStrategyHelperHTML = `<strong>A = one granular key structure. B = several coarse key structures.</strong><br />In Strategy A, you have "one deep tree": each summary value in summary reports is associated to all of the dimensions you're tracking. You can then roll up these values yourself as needed, after aggregation. In Strategy B, you have "several shallow threes": the summary values in summary reports map to one of several sets of dimensions. <br/><strong>Your key strategy impacts signal-to-noise ratios in the final summary reports.</strong><br/>${learnMoreHtml}<br/><br/>
Example:<br/>
Let's consider this set of dimensions: <em>Measurement goal type</em> x <em>Campaign ID</em> x <em>Geo ID</em> x <em>Product category</em>
<ul>
<li>
In Strategy A, you use one granular key structure, that includes all your dimensions: <em>Measurement goal type</em> x <em>Campaign ID</em> x <em>Geo ID</em> x <em>Product category</em>. All your keys use this structure. 
</li>
<li>
In Strategy B, you use two coarse key structures, each including a subset of your dimensions. For example:
Key structure I: <em>Measurement goal type</em> x <em>Geo ID</em> x <em>Product category</em>.
Key structure II: <em>Measurement goal type</em> x <em>Campaign ID</em> x <em>Geo ID</em>.
</li>
</ul>`

const advancedModeOnly = `This option is only available in the <strong>Advanced mode</strong>.<br/><br/>`

tippy('#help-key-strategy-simple-mode', {
    content: `${advancedModeOnly}${keyStrategyHelperHTML}`,
    ...defaultOptions,
})

tippy('#help-key-strategy-advanced-mode', {
    content: keyStrategyHelperHTML,
    ...defaultOptions,
})

tippy('#help-key-strategy-number', {
    content: `The number of coarse key structures that you want to use. Each includes a subset of your dimensions. \n
    For example: 
    <ul>
    <li>
    Key structure I: <em>Measurement goal type</em> x <em>Geo ID</em> x <em>Product category</em>.
    </li>
    <li>
    Key structure II: <em>Measurement goal type</em> x <em>Campaign ID</em> x <em>Geo ID</em>.
    </li>
    </ul>`,
    ...defaultOptions,
})

const budgetHelperHTML = `When scaling, adtechs can decide to split their contribution budget in various ways. You can split the budget equally across measurement goals⏤this is the more basic approach, and the default Noise Lab uses⏤, or to split it inequally by assigning more budget to a measurement goal⏤this leads to <strong>higher signal-to-noise ratios</strong>.`

tippy('#help-budget-split-simple-mode', {
    content: `${advancedModeOnly}${budgetHelperHTML}`,
    ...defaultOptions,
})

tippy('#help-budget-split-advanced-mode', {
    content: budgetHelperHTML,
    ...defaultOptions,
})

export function updateTooltips() {
    tippy('.help-scaling-factor-value', {
        content: `Noise Lab calculates the scaling factor based on your input parameters; for testing with end-users, you would implement that calculation yourself.<br/><br/>The scaling factor is calculated as follows:<br/>Scaling factor for one measurement goal = contribution budget for this measurement goal / max value for this measuremnt goal.<br/><br/>For an equal budget split, the contribution budget per measurement goal is the same for all measurement goals, and equals: 65,536 / number of measurement goals.`,
        ...defaultOptions,
    })

    tippy('.help-noise-ape', {
        content: `<a href='${apeDescriptionUrl}'>APE explanation</a>`,
        ...defaultOptions,
    })

    tippy('.help-noise-rmspe', {
        content: `<a href='${rmspe_tDescriptionUrl}'>RMSPE_T explanation</a>`,
        ...defaultOptions,
    })

    tippy('.help-data', {
        content: `Based on your input, Noise Lab generates dummy data⏤but applies to it noise in the exact same way as the aggregation service. key and noisyScaledSummaryValue in the table below represent a noisy summary report (for this measurement goal) you would typically get from a real system.
        <br/>
        Each row in this table represents an {aggregation key, noisy post-aggregation summary value} pair. Noise Lab generates that data as follows:
        <ol>
        <li>Noise Lab generates dummy data for summary values, by multiplying the average value for that measurement goal with: the average attributable conversion count, a multiplier based on your selected batching frequency, and a scaling factor (if scaling is enabled).</li>
        <li>Noise Lab adds some variability to that data, so that each aggregation key is associated with slightly different summary values, for realism. This variability is  deterministic: if you run two simulations with the same conversion parameters, you'll see the same summary values. This is intentional: it helps you compare the impact of an aggregation strategy parameter in an isolated fashion.</li>
        <li>Laplace noise⏤drawn from a distribution with a scale parameter of b = CONTRIBUTION_BUDGET / epsilon⏤is then added to each summary value. Noise can be negative or positive, just like in the real aggregation service.</li>
        </ol>
        Parts of this flow that carry over to a real testing system would be the Scaling bit of 1., as well as 3.`,
        ...defaultOptions,
    })
}

tippy('#feedback', {
    content: `
    <div class="feedback-links-wrapper">
        To give public feedback on this tool (ask a question, report a bug, request a feature): 
        <a
            target="_blank"
            href="https://github.com/GoogleChromeLabs/privacy-sandbox-dev-support/issues"
        >
            Create a new issue here
        </a>
        <br/>
        To give public feedback on utility/privacy of the API (epsilon) and your observations when simulating with this tool: <a
            target="_blank"
            href="https://github.com/WICG/attribution-reporting-api/issues/485"
        >
            Comment on this issue
        </a>
        <br/>
        To give public feedback on another aspect of the API (use cases...):
        <a
        target="_blank"
        noreferrer noopeneer
        href="https://github.com/WICG/attribution-reporting-api/issues/"
    >
        Create a new issue here
    </a>
    </div>`,
    ...bottomOptions,
})

tippy('#about-info', {
    content: `<strong>Noise Lab is experimental!</strong> Expect quirks. Your feedback is needed and welcome. <br/><br/><strong>Download your simulations. </strong> Noise Lab simulations are not saved (neither in your browser nor in a a database).<br/><br/><strong>Noise Lab is open source. </strong><a target="_blank" noreferrer noopeneer href="https://github.com/privacysandbox/noise-lab/">Open source GitHub repository</a>`,
    ...bottomOptions,
})

tippy('#user-guide', {
    content: `<a target="_blank" noreferrer noopeneer href='${quickGuideUrl}'>Noise Lab user guide</a>`,
    ...bottomOptions,
})

export function updateOutlierNote() {
    tippy('#help-outlier-management', {
        content: `'Max value' will be used for calculating the scaling factor. If this maximum value includes outliers, you may want to consider setting up a different key structure as explained in this section of the user guide - <a href="${quickGuideUrl}/#outlier-management-advanced">Advanced outlier management</a>, or by removing outliers, when figuring out the maximum value, if they account for a small percentage of all the values.`,
        ...defaultOptions,
    })
}
