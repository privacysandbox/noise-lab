import { h, render, Component } from 'preact'
import { Navigation } from './Navigation'

export function Header(props) {
    const { name, version, currentMode } = props
    console.log(name)
    return (
        <div id="menu">
            <div class="flex">
                <div class="app-name">
                    {name}
                    <div id="app-version" class="version">
                        {version}
                    </div>
                </div>
                <div class="app-info">
                    <div id="about-info">About</div>
                    <div id="user-guide">How to use Noise Lab?</div>
                </div>
            </div>
            <Navigation currentMode={currentMode} />
            <button id="feedback">Give feedback</button>
        </div>
    )
}
