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
