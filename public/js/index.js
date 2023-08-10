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

import 'preact/debug'
import { h, render, Component, Fragment } from 'preact'
import { APP_VERSION, APP_NAME, MODES, SIMPLE } from './config'
import { Header } from './components/Header.jsx'
import { Main } from './components/Main.jsx'

// Get the name of the currently selected mode
// https:<BASE-URL>/?mode=simple
function getCurrentModeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('mode')
}

// If the mode is unknown or URL scheme isn't standard, redirect to the simple mode as a fallback
if (!MODES.includes(getCurrentModeFromUrl())) {
    window.location.href = `${location.origin}/?mode=${SIMPLE}`
}

class App extends Component {
    render() {
        return (
            <Fragment>
                <Header
                    name={APP_NAME}
                    version={APP_VERSION}
                    currentMode={getCurrentModeFromUrl()}
                ></Header>
                <Main currentMode={getCurrentModeFromUrl()}></Main>
            </Fragment>
        )
    }
}

render(<App />, document.getElementById('app'))
