document.addEventListener("DOMContentLoaded", () => {
    // Update time and date every second
    function updateTimeAndDate() {
        const timeElem = document.getElementById("taskbar-time");
        const dateElem = document.getElementById("taskbar-date");
        if (timeElem && dateElem) {
            const now = new Date();
            // Format time as HH:MM
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            timeElem.textContent = `${hours}:${minutes}`;
            // Format date as YYYY-MM-DD
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, "0");
            const day = now.getDate().toString().padStart(2, "0");
            dateElem.textContent = `${day}/${month}/${year}`;
        }
    }

    updateTimeAndDate();
    setInterval(updateTimeAndDate, 1000);

    // Handle taskbar icon clicks
    document.querySelectorAll('.taskbar-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            // Only toggle active state for icons in the left section
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
    terminalIcon.addEventListener('click', () => {
        // Show or hide the terminal window without using the 'minimized' class
        if (terminalWindow.style.display === "none") {
            terminalWindow.style.display = "";
        } else {
            terminalWindow.style.display = "none";
        }
    });
}
