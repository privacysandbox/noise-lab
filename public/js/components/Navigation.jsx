import { h, render, Component } from 'preact'
import { MODES } from '../config'

function getClassNameForNavItem(navItemName, currentMode) {
    if (navItemName === currentMode) {
        return 'current-menu-item'
    } else return ''
}

export function Navigation(props) {
    const { currentMode } = props
    const menuJsx = Object.keys(MODES).map((mode) => {
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
