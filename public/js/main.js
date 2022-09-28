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
    // If the mode is unknown, redirect to simple mode (= fallback mode)
    if (!modeSearchQueryParam.includes(getCurrentMode())) {
        window.location.href = `${location.origin}${location.pathname}?mode=${modes.simple.searchQueryParam}`
    }

    // Highlight current menu item
    document.querySelectorAll('nav a').forEach((navItem) => {
        if (navItem.href === document.URL) {
            navItem.className = 'current-menu-item'
        }
    })

    // Display correct section and hide the other ones
    const allSections = document.querySelectorAll('.mode-section')
    allSections.forEach((section) => {
        if (section.id !== `${getCurrentMode()}-mode`) {
            // Mode isn't selected => remove it from the DOM
            section.parentElement.removeChild(section)
        }
    })

    // Initialize parameters and fields for the current mode
    const mode = getCurrentMode()
    if (mode === modes.simple.searchQueryParam) {
        initializeDisplaySimpleModeWithParams()
    } else if (mode === modes.advanced.searchQueryParam) {
        initializeDisplayAdvancedModeWithParams()
    } else {
        throw new Error('mode unkown')
    }
})
