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
