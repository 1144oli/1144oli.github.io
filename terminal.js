
function typeText(element, text, speed = 100) {
    return new Promise((resolve) => {
        let i = 0;
        
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

function clearText(element) {
    element.textContent = '';
}

async function runTerminalAnimation() {
    const locationCommand = document.getElementById('location-command');
    const locationOutput = document.getElementById('location-output');
    
    if (locationCommand && locationOutput) {
        clearText(locationCommand);
        clearText(locationOutput);
        
        locationCommand.classList.add('typing');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        await typeText(locationCommand, './location.sh', 80);

        locationCommand.classList.remove('typing');
        locationOutput.classList.add('typing');

        await new Promise(resolve => setTimeout(resolve, 300));

        // ⭐ Instantly show Sheffield
        locationOutput.textContent = 'Sheffield';

        await new Promise(resolve => setTimeout(resolve, 3000));

        locationOutput.classList.remove('typing');
        
        runTerminalAnimation();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    runTerminalAnimation();
});
