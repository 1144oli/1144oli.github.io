document.addEventListener("DOMContentLoaded", () => {
    // time
    function updateTimeAndDate() {
        const timeElem = document.getElementById("taskbar-time");
        const dateElem = document.getElementById("taskbar-date");
        if (timeElem && dateElem) {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            const seconds = now.getSeconds().toString().padStart(2, "0");
            timeElem.textContent = `${hours}:${minutes}:${seconds}`;
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, "0");
            const day = now.getDate().toString().padStart(2, "0");
            dateElem.textContent = `${day}/${month}/${year}`;
        }
    }

    updateTimeAndDate();
    setInterval(updateTimeAndDate, 1000);
    document.querySelectorAll('.taskbar-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            if (icon.closest('.taskbar-left')) {
                document.querySelectorAll('.taskbar-left .taskbar-icon').forEach(i => i.classList.remove('taskbar-active'));
                icon.classList.add('taskbar-active');
            }
        });
    });
});

const terminalIcon = document.querySelector('img[alt="Terminal"].taskbar-icon');
const terminalWindow = document.querySelector('.terminal-window');
if (terminalIcon && terminalWindow) {

    terminalWindow.classList.remove('open', 'close');

    function openTerminalWindow() {
        terminalWindow.style.display = "";
        terminalWindow.classList.remove('close');
        void terminalWindow.offsetWidth;
        terminalWindow.classList.add('open');
    }

    function closeTerminalWindow() {
        terminalWindow.classList.remove('open');
        terminalWindow.classList.add('close');
        terminalWindow.addEventListener('animationend', function handler(e) {
            if (e.animationName === 'terminalClose') {
                terminalWindow.style.display = "none";
                terminalWindow.removeEventListener('animationend', handler);
            }
        });
    }

    function toggleTerminalWindow() {
        if (terminalWindow.style.display === "none" || !terminalWindow.classList.contains('open')) {
            openTerminalWindow();
        } else {
            closeTerminalWindow();
        }
    }

    terminalIcon.addEventListener('click', toggleTerminalWindow);


    //red dot
    const redDot = terminalWindow.querySelector('.dot.red');
    if (redDot) {
        redDot.addEventListener('click', closeTerminalWindow);
    }


    const closeBtn = document.getElementById('close-btn');
    if (closeBtn) {
        closeBtn.onclick = closeTerminalWindow;
    }
}


function makeWindowDraggableAndPersistent(windowSelector, barSelector, storageKey) {
    const win = document.querySelector(windowSelector);
    const bar = win?.querySelector(barSelector);
    if (!win || !bar) return;

    const savedTop = localStorage.getItem(storageKey + 'Top');
    const savedLeft = localStorage.getItem(storageKey + 'Left');
    if (savedTop && savedLeft) {
        win.style.position = 'absolute';
        win.style.top = savedTop;
        win.style.left = savedLeft;
    }

    let offsetX, offsetY, isDragging = false;
    bar.style.cursor = 'move';

    bar.addEventListener('mousedown', function(e) {
        isDragging = true;
        const rect = win.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        win.style.position = 'absolute';
        win.style.top = (e.clientY - offsetY) + 'px';
        win.style.left = (e.clientX - offsetX) + 'px';
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            localStorage.setItem(storageKey + 'Top', win.style.top);
            localStorage.setItem(storageKey + 'Left', win.style.left);
        }
        isDragging = false;
        document.body.style.userSelect = '';
    });
}
makeWindowDraggableAndPersistent('.terminal-window', '.terminal-bar', 'terminalWindow');
makeWindowDraggableAndPersistent('.kate-window', '.terminal-bar', 'kateWindow');