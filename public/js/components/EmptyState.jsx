import { h, render, Component } from 'preact'

// TODO-FIX-MINOR Image
export function EmptyState(props) {
    return (
        <div id="empty-state">
            <div class="empty-state-inner">
                <img src="../../assets/test-tube.png" alt="" />
                <p>
                    No simulations yet. To generate your first simulation, click
                    the <strong>▶️ SIMULATE</strong> button at the bottom the{' '}
                    <strong>Parameters</strong> panel on the left.
                </p>
            </div>
        </div>
    )
}
