import { h, render, Component, Fragment } from 'preact'
import { SimpleMode } from './SimpleMode'
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
