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
    help: 'Available commands: help, about, projects, contact, clear, github',
    about: `oli@archbook\n-------------------------\nOS: Arch Linux x86_64\nUptime: 19 years\nUni: Sheffileld Hallam University\nCourse: Cyber Security with Forensics\nTerminal: Kitty\nShell: Bash\nInterests: Linux\n-------------------------------`,
    projects: `- <a href="https://github.com/1144oli/1144oli.github.io" target="_blank">This Website</a>`,
    contact: `GitHub: <a href="https://github.com/1144oli" target="_blank">1144oli</a>`,
    clear: '',
    github: function() {
      window.open('https://github.com/1144oli', '_blank');
      return `<a href="https://github.com/1144oli" target="_blank">https://github.com/1144oli</a>`;
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