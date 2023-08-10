// TODO-CLEAN Delete this whole file

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

import { h, render, Component, Fragment } from 'preact'
import { SimpleMode } from './SimpleMode'
import { AdvancedMode } from './AdvancedMode'
import { loadPython } from '../dom'
import { SIMPLE, ADVANCED } from '../config'

export function Main(props) {
    const { currentMode } = props
    loadPython()
    return (
        <div class="mode-section">
            {currentMode === SIMPLE && <SimpleMode />}
            {currentMode === ADVANCED && <AdvancedMode />}
        </div>
    )
}
