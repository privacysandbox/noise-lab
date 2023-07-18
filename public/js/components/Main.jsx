import { h, render, Component, Fragment } from 'preact'
import { SimpleMode } from './SimpleMode'
import { loadPython } from '../dom'

export function Main(props) {
    const { currentMode } = props
    loadPython()
    return (
        <div class="mode-section">
            {currentMode === 'simple' && <SimpleMode />}
            {currentMode === 'advanced' && <div>advanced</div>}
        </div>
    )
}
