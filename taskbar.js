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
    terminalWindow.style.display = "none";
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

