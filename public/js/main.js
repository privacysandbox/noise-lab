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

import { generateConfirmMessage } from './utils.misc'
import { initializeDisplay_simpleMode } from './simple-mode'
import { initializeDisplay_advancedMode } from './laplace'
import { APP_VERSION, MODES, modeSearchQueryParams } from './config'

// Generate navigation menu automatically based on the available modes
function generateMenu() {
    const navWrapper = document.getElementById('nav')
    Object.values(MODES).forEach((mode) => {
        const { searchQueryParam, displayName } = mode
        const a = document.createElement('a')
        a.setAttribute(
            'data-href',
            `${location.origin}${location.pathname}?mode=${mode.searchQueryParam}`
        )
        a.setAttribute('id', searchQueryParam)
        a.addEventListener('click', () => {
            if (window.confirm(generateConfirmMessage())) {
                window.location = `${location.origin}${location.pathname}?mode=${mode.searchQueryParam}`
            }
        })
        a.innerText = displayName
        navWrapper.appendChild(a)
    })
}

function displayVersionNumber() {
    document.getElementById('app-version').innerText = APP_VERSION
}

function getCurrentModeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search)
    let mode = urlParams.get('mode')
    return mode
}

window.addEventListener('load', function (event) {
    generateMenu()
    displayVersionNumber()

    // If the mode is unknown, redirect to simple mode (= fallback mode)
    if (!modeSearchQueryParams.includes(getCurrentModeFromUrl())) {
        window.location.href = `${location.origin}${location.pathname}?mode=${MODES.simple.searchQueryParam}`
    }

    // Highlight current menu item
    document.querySelectorAll('nav a').forEach((navItem) => {
        if (navItem.getAttribute('data-href') === document.URL) {
            navItem.className = 'current-menu-item'
        }
    })

    // Display correct section and hide the other ones
    const allSections = document.querySelectorAll('.mode-section')
    allSections.forEach((section) => {
        if (section.id !== `${getCurrentModeFromUrl()}-mode`) {
            // Mode isn't selected => remove it from the DOM
            section.parentElement.removeChild(section)
        }
    })

    // Initialize parameters and fields for the current mode
    const mode = getCurrentModeFromUrl()
    if (mode === MODES.simple.searchQueryParam) {
        initializeDisplay_simpleMode()
    } else if (mode === MODES.advanced.searchQueryParam) {
        initializeDisplay_advancedMode()
    } else {
        throw new Error('mode unkown')
    }
})
