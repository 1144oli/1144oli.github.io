let matrixColor = '#ff69b4';
const canvas = document.getElementById('matrix');
const ctx = canvas ? canvas.getContext('2d') : null;

if (localStorage.getItem('light-mode') === 'on') {
    document.body.classList.add('light-mode');
}

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

if (canvas) {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

const chars = '01';
const fontSize = 14;
let columns = canvas ? canvas.width / fontSize : 0;
let drops = [];

function initDrops() {
    if (!canvas) return;
    columns = canvas.width / fontSize;
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
}

if (canvas) {
    initDrops();
    window.addEventListener('resize', initDrops);
}

function drawMatrix() {
    if (!canvas || !ctx) return;
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = matrixColor;
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        
        drops[i]++;
    }
}

if (canvas) {
    setInterval(drawMatrix, 35);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

function openExternalLinksInNewTabs() {
    document.querySelectorAll('a[href]').forEach(link => {
        const url = new URL(link.href, window.location.href);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
            if (url.origin !== window.location.origin) {
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }
        }
    });
}

openExternalLinksInNewTabs();
window.addEventListener('postLoaded', openExternalLinksInNewTabs);

function updateAccessibilityThemeLabel() {
    const button = document.querySelector('[data-accessibility="theme"]');
    if (!button) return;
    const isLight = document.body.classList.contains('light-mode');
    button.textContent = isLight ? 'Dark mode' : 'Light mode';
    button.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
}

function initAccessibilityMenu() {
    if (document.querySelector('.accessibility-menu')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'accessibility-menu';
    wrapper.innerHTML = `
        <button class="accessibility-trigger" type="button" aria-label="Open accessibility options" aria-expanded="false">&hellip;</button>
        <div class="accessibility-panel" role="group" aria-label="Accessibility options" hidden>
            <button type="button" data-accessibility="theme">Light mode</button>
            <button type="button" data-accessibility="dyslexia">Dyslexia-friendly font</button>
            <button type="button" data-accessibility="contrast">High contrast</button>
            <button type="button" data-accessibility="motion">Reduce motion</button>
            <label class="text-size-control" for="accessibility-text-size">Text size <output id="accessibility-text-size-value">100%</output></label>
            <input id="accessibility-text-size" type="range" min="100" max="150" step="5" value="100" aria-label="Text size">
        </div>
    `;
    document.body.appendChild(wrapper);

    const trigger = wrapper.querySelector('.accessibility-trigger');
    const panel = wrapper.querySelector('.accessibility-panel');
    const preferences = {
        theme: 'light-mode',
        dyslexia: 'dyslexia-font',
        contrast: 'high-contrast',
        motion: 'reduced-motion'
    };

    const setPreference = (key, enabled) => {
        const className = preferences[key];
        document.body.classList.toggle(className, enabled);
        const storageKey = key === 'theme' ? 'light-mode' : `accessibility-${key}`;
        localStorage.setItem(storageKey, enabled ? 'on' : 'off');
        if (key === 'theme') updateAccessibilityThemeLabel();
        const button = wrapper.querySelector(`[data-accessibility="${key}"]`);
        if (button) {
            button.classList.toggle('active', enabled);
            button.setAttribute('aria-pressed', String(enabled));
            if (key === 'theme') {
                button.textContent = enabled ? 'Dark mode' : 'Light mode';
            }
        }
        if (key === 'motion') {
            window.dispatchEvent(new Event('accessibilityMotionChanged'));
        }
    };

    Object.keys(preferences).forEach(key => {
        const storageKey = key === 'theme' ? 'light-mode' : `accessibility-${key}`;
        setPreference(key, localStorage.getItem(storageKey) === 'on');
    });

    trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));
        panel.hidden = isOpen;
    });

    const textSize = wrapper.querySelector('#accessibility-text-size');
    const textSizeValue = wrapper.querySelector('#accessibility-text-size-value');
    const setTextSize = value => {
        const size = Math.min(150, Math.max(100, Number(value)));
        document.body.style.fontSize = `${size}%`;
        textSize.value = String(size);
        textSizeValue.value = `${size}%`;
        textSizeValue.textContent = `${size}%`;
        localStorage.setItem('accessibility-text-size', String(size));
    };

    setTextSize(localStorage.getItem('accessibility-text-size') || 100);
    textSize.addEventListener('input', event => setTextSize(event.target.value));

    wrapper.querySelectorAll('[data-accessibility]').forEach(button => {
        button.addEventListener('click', () => {
            const key = button.dataset.accessibility;
            setPreference(key, !document.body.classList.contains(preferences[key]));
        });
    });

    document.addEventListener('click', event => {
        if (!wrapper.contains(event.target)) {
            trigger.setAttribute('aria-expanded', 'false');
            panel.hidden = true;
        }
    });
}

initAccessibilityMenu();

function updateMatrixColor() {
    const computed = getComputedStyle(document.body).getPropertyValue('--matrix-color').trim();
    matrixColor = computed || '#ff69b4';
}

function initEasterEggs() {
    const toast = document.getElementById('easter-toast');
    const oliHeading = document.querySelector('header h1');
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    const robotTrigger = 'robots.txt';
    let robotBuffer = '';
    let robotTimer = null;

    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        window.clearTimeout(toast._hideTimer);
        toast._hideTimer = window.setTimeout(() => {
            toast.classList.remove('show');
        }, 1800);
    };

    const setupModal = (id) => {
        const modal = document.getElementById(id);
        if (!modal) return null;
        const closeBtn = modal.querySelector('.easter-close');
        const close = () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        };
        const open = () => {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        };
        if (closeBtn) closeBtn.addEventListener('click', close);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) close();
        });
        return { open, close };
    };

    const cveModal = setupModal('cve-modal');
    const robotsModal = setupModal('robots-modal');

    const setLightMode = (isOn) => {
        document.body.classList.toggle('light-mode', isOn);
        updateAccessibilityThemeLabel();
    };

    setLightMode(localStorage.getItem('light-mode') === 'on');

    if (cveModal) {
        [oliHeading].filter(Boolean).forEach(trigger => {
            trigger.style.cursor = 'pointer';
            trigger.addEventListener('click', () => {
                cveModal.open();
            });
        });
    }

    const toggleNeon = () => {
        const isOn = document.body.classList.toggle('neon-mode');
        localStorage.setItem('neon-mode', isOn ? 'on' : 'off');
        updateMatrixColor();
        showToast(isOn ? 'Neon unlocked.' : 'Neon disabled.');
    };

    if (localStorage.getItem('neon-mode') === 'on') {
        document.body.classList.add('neon-mode');
        updateMatrixColor();
    } else {
        updateMatrixColor();
    }

    document.addEventListener('keydown', (event) => {
        if (event.target && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) {
            return;
        }

        const key = event.key;
        const expected = konami[konamiIndex];
        if (key === expected || key.toLowerCase() === expected) {
            konamiIndex += 1;
            if (konamiIndex === konami.length) {
                konamiIndex = 0;
                toggleNeon();
            }
        } else {
            konamiIndex = key === konami[0] ? 1 : 0;
        }

        if (key === 'Backspace') {
            robotBuffer = robotBuffer.slice(0, -1);
            return;
        }

        if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            robotBuffer += key;
            if (robotBuffer.length > robotTrigger.length) {
                robotBuffer = robotBuffer.slice(-robotTrigger.length);
            }
            window.clearTimeout(robotTimer);
            robotTimer = window.setTimeout(() => {
                robotBuffer = '';
            }, 1500);
            if (robotBuffer.endsWith(robotTrigger) && robotsModal) {
                robotsModal.open();
                showToast('Hidden page found.');
                robotBuffer = '';
            }
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (cveModal) cveModal.close();
            if (robotsModal) robotsModal.close();
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initEasterEggs();
});
