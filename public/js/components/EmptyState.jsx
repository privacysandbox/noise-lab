import { h, render, Component } from 'preact'
import image from '../../assets/test-tube.png'

export function EmptyState(props) {
    return (
        <div id="empty-state">
            <div class="empty-state-inner">
                <img src={image} />
                <p>
                    No simulations yet. To generate your first simulation, click
                    the <strong>▶️ SIMULATE</strong> button at the bottom the{' '}
                    <strong>Parameters</strong> panel on the left.
                </p>
            </div>
        </div>
    )
}
