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

import { h, render, Component } from 'preact'
import { MODES } from '../config'

function getClassNameForNavItem(navItemName, currentMode) {
    if (navItemName === currentMode) {
        return 'current-menu-item'
    } else return ''
}

export function Navigation(props) {
    const { currentMode } = props
    const menuJsx = MODES.map((mode) => {
        const navItemName = mode
        const href = `${location.origin}${location.pathname}?mode=${mode}`
        return (
            <a
                href={href}
                className={getClassNameForNavItem(navItemName, currentMode)}
            >
                {navItemName} mode
            </a>
        )
    })
    return <nav>{menuJsx}</nav>
}
