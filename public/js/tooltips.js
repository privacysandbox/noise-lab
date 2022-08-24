import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css' // optional for styling
import 'tippy.js/themes/light.css'

const options = {
    allowHTML: true,
    duration: 0,
    placement: 'right',
    animation: 'fade',
    theme: 'light',
}

const docUrl =
    'https://docs.google.com/document/d/1bU0a_njpDcRd9vDR0AJjwJjrf3Or8vAzyfuK8JZDEfo/view'

const learnMoreHtml = `<br/><a href=${docUrl}>Learn more</a>`

tippy('#help-epsilon', {
    content: `A higher epsilon leads to lower noise. Epsilon can be altered by adtechs during the origin trial to evaluate various utility/privacy adjustments. ${learnMoreHtml}`,
    ...options,
})

tippy('#help-budget', {
    content: `The contribution budget is an upper limit to individual users' contributions to protect user privacy. Its value is a constant, set by the API. Adtechs can use this value to define their scaling strategy, in order to maximize signal-to-noise ratio on the final reports. ${learnMoreHtml}`,
    ...options,
})

tippy('#help-scaling', {
    content: `Adtechs can decide to use scaling, in order to maximize signal-to-noise ratio on the final reports. ${learnMoreHtml}`,
    ...options,
})

tippy('#help-daily', {
    content: `Average daily conversion count for one bucket with all
    dimensions combined. With our usual example set of dimensions (Campaign Id * Geography * Product category), it would be the average daily conversion count for a given Campaign Id AND Geography AND Product category. This is a naive approach but sufificent to get started.`,
    ...options,
})
