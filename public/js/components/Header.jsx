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

import { h, render, Component } from 'preact'
import { Navigation } from './Navigation'

export function Header(props) {
    const { name, version, currentMode } = props
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
