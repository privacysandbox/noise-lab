import { h, render, Component } from 'preact'

export function KeyStrategy(props) {
    const { keyStrategy } = props
    return (
        <div>
            <label for="key-strategy">Key strategy:</label>
            {keyStrategy}
            <div class="help" id="help-key-strategy"></div>
        </div>
    )
}
