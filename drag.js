const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
let matrixColor = '#ff69b4';

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = '01';
const fontSize = 14;
let columns = canvas.width / fontSize;
let drops = [];

function initDrops() {
    columns = canvas.width / fontSize;
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
}

initDrops();
window.addEventListener('resize', initDrops);

function drawMatrix() {
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

setInterval(drawMatrix, 35);

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

function updateMatrixColor() {
    const computed = getComputedStyle(document.body).getPropertyValue('--matrix-color').trim();
    matrixColor = computed || '#ff69b4';
}

function initEasterEggs() {
    const toast = document.getElementById('easter-toast');
    const profilePic = document.querySelector('.profile-pic');
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

    if (profilePic && cveModal) {
        profilePic.style.cursor = 'pointer';
        profilePic.addEventListener('click', () => {
            cveModal.open();
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
