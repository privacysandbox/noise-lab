const modes = {
    simple: {
        path: 'simple',
        displayName: 'simple mode',
    },
    advanced: {
        path: 'advanced',
        displayName: 'advanced mode',
    },
}

const modePaths = Object.values(modes).map((mode) => mode.path)

generateMenu()

// Generate navigation menu automatically based on the available modes
export function generateMenu() {
    const navWrapper = document.getElementById('nav')
    Object.values(modes).forEach((mode) => {
        const { path, displayName } = mode
        const a = document.createElement('a')
        a.setAttribute('href', path)
        a.setAttribute('id', path)
        a.innerText = displayName
        navWrapper.appendChild(a)
    })
}

export function getCurrentMode() {
    return location.pathname.substring(1)
}

window.addEventListener('load', function (event) {
    const mode = getCurrentMode()

    // Highlight current menu item
    for (let i = 0; i < document.links.length; i++) {
        if (document.links[i].href === document.URL) {
            current = i
        }
    }
    document.links[current].className = 'current-menu-item'

    // Display correct section and hide the other ones
    const allSections = document.querySelectorAll('.mode-section')
    allSections.forEach((section) => {
        if (section.id === `${mode}-mode`) {
            section.className = 'mode-section current-mode'
        } else {
            section.className = 'mode-section not-current-mode'
        }
    })

    // If the mode is unknown, redirect to simple mode (= fallback mode)
    if (!modePaths.includes(mode)) {
        window.location.href = modes.simple.path
    }
})
