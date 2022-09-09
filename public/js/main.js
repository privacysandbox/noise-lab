const modes = {
    simple: {
        searchQueryParam: 'simple',
        displayName: 'simple mode',
    },
    advanced: {
        searchQueryParam: 'advanced',
        displayName: 'advanced mode',
    },
}

const modeSearchQueryParam = Object.values(modes).map(
    (mode) => mode.searchQueryParam
)

generateMenu()

// Generate navigation menu automatically based on the available modes
export function generateMenu() {
    const navWrapper = document.getElementById('nav')
    Object.values(modes).forEach((mode) => {
        const { searchQueryParam, displayName } = mode
        const a = document.createElement('a')
        a.setAttribute(
            'href',
            `${location.origin}${location.pathname}?mode=${mode.searchQueryParam}`
        )
        a.setAttribute('id', searchQueryParam)
        a.innerText = displayName
        navWrapper.appendChild(a)
    })
}

export function getCurrentMode() {
    const urlParams = new URLSearchParams(window.location.search)
    let mode = urlParams.get('mode')
    return mode
}



window.addEventListener('load', function (event) {
    const mode = getCurrentMode()

    // If the mode is unknown, redirect to simple mode (= fallback mode)
    if (!modeSearchQueryParam.includes(mode)) {
        console.log(0)
        window.location.href = `${location.origin}${location.pathname}?mode=${modes.simple.searchQueryParam}`
    }

    document.querySelectorAll('nav a').forEach((navItem) => {
        console.log(navItem.href)
        if (navItem.href === document.URL) {
            navItem.className = 'current-menu-item'
        }
    })

    // Highlight current menu item
    // for (let i = 0; i < document.links.length; i++) {
    //     if (document.links[i].href === document.URL) {
    //         current = i
    //     }
    // //
    // document.links[current].className = 'current-menu-item'

    // Display correct section and hide the other ones
    const allSections = document.querySelectorAll('.mode-section')
    allSections.forEach((section) => {
        if (section.id !== `${mode}-mode`) {
            // Mode isn't selected => remove it from the DOM
            section.parentElement.removeChild(section)
        }
    })
})
