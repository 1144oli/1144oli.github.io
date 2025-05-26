
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
