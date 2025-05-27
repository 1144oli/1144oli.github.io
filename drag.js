
document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.querySelector(".terminal-window");
  const terminalBar = document.querySelector(".terminal-bar");

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  if (!terminal || !terminalBar) return;

  terminalBar.style.cursor = "grab";
  terminal.style.position = "absolute";

  terminalBar.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - terminal.offsetLeft;
    offsetY = e.clientY - terminal.offsetTop;
    terminalBar.style.cursor = "grabbing";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    terminalBar.style.cursor = "grab";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    e.preventDefault();
    terminal.style.left = `${e.clientX - offsetX}px`;
    terminal.style.top = `${e.clientY - offsetY}px`;
  });
});

const kateWindow = document.getElementById('kate-window');
const kateBar = document.querySelector('#kate-window .terminal-bar');

if (kateWindow && kateBar) {
    let isKateDragging = false;
    let kateOffsetX = 0;
    let kateOffsetY = 0;

    kateBar.style.cursor = "grab";
    kateWindow.style.position = "absolute";

    kateBar.addEventListener("mousedown", (e) => {
        isKateDragging = true;
        kateOffsetX = e.clientX - kateWindow.offsetLeft;
        kateOffsetY = e.clientY - kateWindow.offsetTop;
        kateBar.style.cursor = "grabbing";
    });

    document.addEventListener("mouseup", () => {
        isKateDragging = false;
        kateBar.style.cursor = "grab";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isKateDragging) return;

        e.preventDefault();
        kateWindow.style.left = `${e.clientX - kateOffsetX}px`;
        kateWindow.style.top = `${e.clientY - kateOffsetY}px`;
    });
}

document.getElementById('open-kate-btn').onclick = function() {
    document.getElementById('kate-window').style.display = 'block';
};
document.getElementById('kate-close-btn').onclick = function() {
    document.getElementById('kate-window').style.display = 'none';
};


