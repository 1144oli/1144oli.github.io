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

const kateWindow = document.querySelector('.kate-window');
const kateIcon = document.querySelector('img[alt="kate"].taskbar-icon');
const kateCloseBtn = document.getElementById('kate-close-btn');

if (kateWindow) {
    kateWindow.classList.remove('open', 'close');

    function openKateWindow() {
        kateWindow.style.display = "";
        kateWindow.classList.remove('close');
        void kateWindow.offsetWidth;
        kateWindow.classList.add('open');
    }

    function closeKateWindow() {
        kateWindow.classList.remove('open');
        kateWindow.classList.add('close');
        kateWindow.addEventListener('animationend', function handler(e) {
            if (e.animationName === 'terminalClose') {
                kateWindow.style.display = "none";
                kateWindow.removeEventListener('animationend', handler);
            }
        });
    }

    if (kateIcon) {
        kateIcon.addEventListener('click', openKateWindow);
    }
    if (kateCloseBtn) {
        kateCloseBtn.addEventListener('click', closeKateWindow);
    }
}


makeWindowDraggableAndPersistent('.terminal-window', '.terminal-bar', 'terminalWindow');
makeWindowDraggableAndPersistent('.kate-window', '.terminal-bar', 'kateWindow');



document.addEventListener('DOMContentLoaded', function() {
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const terminalHistory = document.getElementById('terminal-history');
const commands = {
    man: 'Available commands: man, about, projects, contact, clear, github',
    about: `oli@archbook\n-------------------------\nOS: Arch Linux x86_64\nUptime: 19 years\nUni: Sheffileld Hallam University\nCourse: Cyber Security with Forensics\nTerminal: Kitty\nShell: Bash\nInterests: Linux\n-------------------------------`,
    projects: `- <a href="https://github.com/1144oli/1144oli.github.io" target="_blank">This Website</a>`,
    contact: `GitHub: <a href="https://github.com/1144oli" target="_blank">1144oli</a>`,
    clear: '',
    github: function() {
        window.open('https://github.com/1144oli', '_blank');
        return `<a href="https://github.com/1144oli" target="_blank">https://github.com/1144oli</a>`;
    },
    "sudo rm -rf /": function() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'black';
        overlay.style.zIndex = 99999;
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.flexDirection = 'column';
        overlay.style.pointerEvents = 'auto';

        const msg = document.createElement('div');
        msg.textContent = 'System destroyed. Closing tab... (Press any key or mouse button to cancel)';
        msg.style.color = 'white';
        msg.style.fontSize = '1.5em';
        msg.style.marginBottom = '2em';
        overlay.appendChild(msg);

        document.body.appendChild(overlay);

        let blackoutTimeout = setTimeout(() => {
            overlay.remove();
            window.close();
        }, 5000);

        function cancelBlackout() {
            clearTimeout(blackoutTimeout);
            overlay.remove();
            window.removeEventListener('keydown', cancelBlackout);
            window.removeEventListener('mousedown', cancelBlackout);
        }

        window.addEventListener('keydown', cancelBlackout);
        window.addEventListener('mousedown', cancelBlackout);

        return 'System destroyed. Closing tab... (Press any key or mouse button to cancel)';
    }
};

  if (terminalForm && terminalInput && terminalHistory) {
    terminalForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = terminalInput.value.trim();
      if (input === '') return;
      let output = '';
    if (input === 'clear') {
    terminalHistory.innerHTML = '';
    } else if (commands[input]) {
    let output;
    if (typeof commands[input] === 'function') {
        output = commands[input]();
    } else {
        output = commands[input];
    }
    terminalHistory.innerHTML += `<div><span class="prompt">$</span> ${input}</div><div class="response" style="white-space:pre-line;">${output}</div>`;
    } else {
    terminalHistory.innerHTML += `<div><span class="prompt">$</span> ${input}</div><div class="response">Command not found: ${input}</div>`;
    }
      terminalInput.value = '';
      terminalHistory.scrollTop = terminalHistory.scrollHeight;
    });

    document.getElementById('input-terminal').addEventListener('click', () => {
      terminalInput.focus();
    });
  }
});

window.addEventListener('beforeunload', () => {
    localStorage.setItem('terminalWindowOpen', terminalWindow && terminalWindow.classList.contains('open') ? '1' : '0');
    localStorage.setItem('kateWindowOpen', kateWindow && kateWindow.classList.contains('open') ? '1' : '0');
});

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('terminalWindowOpen') === '1' && terminalWindow) {
        terminalWindow.style.display = "";
        terminalWindow.classList.remove('close');
        void terminalWindow.offsetWidth;
        terminalWindow.classList.add('open');
    }
    if (localStorage.getItem('kateWindowOpen') === '1' && kateWindow) {
        kateWindow.style.display = "";
        kateWindow.classList.remove('close');
        void kateWindow.offsetWidth;
        kateWindow.classList.add('open');
    }
});

// moblie users eugh 
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
if (isMobileDevice()) {
    document.getElementById('mobile-warning').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

let neovimWindow, neovimIcon, neovimCloseBtn;

document.addEventListener("DOMContentLoaded", () => {
    neovimWindow = document.querySelector('.neovim-window');
    neovimIcon = document.querySelector('img[alt="neovim"].taskbar-icon');
    neovimCloseBtn = document.getElementById('neovim-close-btn');

    if (neovimWindow) {
        neovimWindow.classList.remove('open', 'close');

        function openNeovimWindow() {
            neovimWindow.style.display = "";
            neovimWindow.classList.remove('close');
            void neovimWindow.offsetWidth;
            neovimWindow.classList.add('open');
        }

        function closeNeovimWindow() {
            neovimWindow.classList.remove('open');
            neovimWindow.classList.add('close');
            neovimWindow.addEventListener('animationend', function handler(e) {
                if (e.animationName === 'terminalClose') {
                    neovimWindow.style.display = "none";
                    neovimWindow.removeEventListener('animationend', handler);
                }
            });
        }

        function toggleNeovimWindow() {
            if (neovimWindow.style.display === "none" || !neovimWindow.classList.contains('open')) {
                openNeovimWindow();
            } else {
                closeNeovimWindow();
            }
        }

        if (neovimIcon) {
            neovimIcon.addEventListener('click', toggleNeovimWindow);
        }
        if (neovimCloseBtn) {
            neovimCloseBtn.addEventListener('click', closeNeovimWindow);
        }
        const redDot = neovimWindow.querySelector('.dot.red');
        if (redDot) {
            redDot.addEventListener('click', closeNeovimWindow);
        }
    }

    makeWindowDraggableAndPersistent('.neovim-window', '.terminal-bar', 'neovimWindow');
});

window.addEventListener('beforeunload', () => {
    localStorage.setItem('neovimWindowOpen', neovimWindow && neovimWindow.classList.contains('open') ? '1' : '0');
});

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('neovimWindowOpen') === '1' && neovimWindow) {
        neovimWindow.style.display = "";
        neovimWindow.classList.remove('close');
        void neovimWindow.offsetWidth;
        neovimWindow.classList.add('open');
    }
});

function bringToFront(win) {
    const windows = document.querySelectorAll('.terminal-window, .kate-window, .neovim-window');
    let maxZ = 10;
    windows.forEach(w => {
        const z = parseInt(window.getComputedStyle(w).zIndex) || 10;
        if (z > maxZ) maxZ = z;
    });
    win.style.zIndex = maxZ + 1;
}

[
    { win: terminalWindow, bar: terminalWindow?.querySelector('.terminal-bar') },
    { win: kateWindow, bar: kateWindow?.querySelector('.terminal-bar') }
].forEach(({ win, bar }) => {
    if (win && bar) {
        bar.addEventListener('mousedown', () => bringToFront(win));
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const neovimWin = document.querySelector('.neovim-window');
    const neovimBar = neovimWin?.querySelector('.terminal-bar');
    if (neovimWin && neovimBar) {
        neovimBar.addEventListener('mousedown', () => bringToFront(neovimWin));
    }
});