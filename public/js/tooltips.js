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

const options = {
    allowHTML: true,
    duration: 0,
    placement: 'right',
    animation: 'fade',
    theme: 'light',
    trigger: 'click',
    interactive: true,
}

const docUrl =
    'https://docs.google.com/document/d/1bU0a_njpDcRd9vDR0AJjwJjrf3Or8vAzyfuK8JZDEfo/view'

const learnMoreHtml = `<br/><a href=${docUrl}>Learn more</a>`

tippy('#help-epsilon', {
    content: `A higher epsilon leads to lower noise. Its maximum value for the aggregation service is 64. Epsilon can be altered by adtechs during the origin trial to evaluate various utility/privacy adjustments.<strong><br/>This impacts signal-to-noise ratios in the final summary reports.</strong><br/>${learnMoreHtml}`,
    ...options,
})

tippy('#help-budget', {
    content: `The contribution budget is an upper limit to individual users' contributions to protect user privacy. Its value is a constant, set by the API.<br/> Adtechs can use this value to define their scaling strategy, in order to maximize signal-to-noise ratio on the final reports.<br/><strong>This impacts signal-to-noise ratios in the final summary reports, but is a constant of the API (can't be configured by adtechs).</strong><br/>${learnMoreHtml}`,
    ...options,
})

tippy('#help-scaling', {
    content: `Adtechs can decide to use scaling, in order to maximize signal-to-noise ratio on the final reports. <br/><strong>This impacts signal-to-noise ratios in the final summary reports.</strong><br/> ${learnMoreHtml}`,
    ...options,
})

tippy('#help-daily', {
    content: `Average daily count of <em>attributable</em> conversions for one bucket (key) <em>with all
    dimensions combined</em>. 
    <ul>
    <li><em>attributable</em>: Attributable conversions are conversions that can be attributed to a given impression or click with the Attribution Reporting API. As of today, only <strong>single-touch, same-device conversions</strong> can be attributed with the API.</li>
    <li><em>with all
    dimensions combined</em>: For a set of dimensions <em>Campaign Id</em> x <em>Geography</em> x <em>Product category</em>, the average daily conversion count is the average daily conversion count for a given <em>Campaign Id</em> AND <em>Geography</em> AND <em>Product category</em>. This is a naive approach. Check out the advanced mode for more elaborate approaches. </li>
    </ul>
    <strong>This impacts signal-to-noise ratios in the final summary reports.</strong><br/> ${learnMoreHtml} <br/> Tip: Try and experiment with different conversion counts based on different campaign variables: campaign budget, user reach, ad efficiencies, etc. For example, all else being equal, what happens when your advertiser's budget is $10K vs. $100K? $10K will have less attributed conversions than $100K. Maybe the signal-to-noise ratio will be too high at $10K, but acceptable at $100K.`,
    ...options,
})

tippy('#help-batching-frequency', {
    content: `Frequency at which the adtech decides to batch the aggregatable reports, for aggregation by the aggregation service. <br/><strong>This impacts signal-to-noise ratios in the final summary reports.</strong> Batching less frequently leads to a higher value per bucket (key), leading to typically higher signal-to-noise ratios.<br/>${learnMoreHtml}`,
    ...options,
})

tippy('#help-key-strategy', {
    content: `<strong>A = one granular key structure. B = several coarse key structures.</strong><br />In Strategy A, you have "one deep tree": each summary value in summary reports is associated to all of the dimensions you're tracking. You can then roll up these values yourself as needed. In Strategy B, you have "several shallow threes": the summary values in summary reports map to one of several sets of dimensions. <br/><strong>Your key strategy impacts signal-to-noise ratios in the final summary reports.</strong><br/>${learnMoreHtml}<br/><br/>
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
    </ul>`,
    ...options,
})
