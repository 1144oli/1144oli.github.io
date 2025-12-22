
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

        locationOutput.textContent = 'Sheffield';

        await new Promise(resolve => setTimeout(resolve, 3000));

        locationOutput.classList.remove('typing');
        
        runTerminalAnimation();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    runTerminalAnimation();
});


function initUniversityTimeline(){
    const overallStart = new Date(2024,8,1).getTime();
    const overallEnd = new Date(2028,4,31).getTime();
    const now = Date.now();
    const total = overallEnd - overallStart;
    let pct = total <= 0 ? 0 : (now - overallStart) / total;
    pct = Math.max(0, Math.min(1, pct));
    const percent = Math.round(pct * 100);

    const fill = document.getElementById('timeline-fill');
    const current = document.getElementById('timeline-current');
    const yearsContainer = document.querySelector('.timeline-years');
    const line = document.querySelector('.timeline-line');

    if(line && fill){
        const lineRect = line.getBoundingClientRect();
        const trackRect = line.parentElement ? line.parentElement.getBoundingClientRect() : line.getBoundingClientRect();
        const lineWidth = lineRect.width;
        const relLeft = lineRect.left - (yearsContainer ? yearsContainer.getBoundingClientRect().left : trackRect.left);
        fill.style.width = (lineWidth * pct) + 'px';
        if(current){
                const curLeftPx = (relLeft + lineWidth * pct);
                current.style.left = curLeftPx + 'px';
                current.title = `Progress: ${percent}%`;


                let tooltip = document.getElementById('timeline-tooltip');
                if(!tooltip){
                    tooltip = document.createElement('div');
                    tooltip.id = 'timeline-tooltip';
                    tooltip.className = 'timeline-tooltip';
                    document.body.appendChild(tooltip);
                }
                tooltip.textContent = `${percent}% completed`;

                const tipX = lineRect.left + lineWidth * pct;
                const tipY = lineRect.top - 10; 
                tooltip.style.left = tipX + 'px';
                tooltip.style.top = (tipY - 28) + 'px';

                const showTip = () => { tooltip.style.opacity = '1'; };
                const hideTip = () => { tooltip.style.opacity = '0'; };
                current.onmouseenter = showTip;
                current.onmouseleave = hideTip;
        }
    } else {
        if(fill) fill.style.width = percent + '%';
        if(current){ current.style.left = percent + '%'; current.title = `Progress: ${percent}%`; }
    }

    if(yearsContainer){
        yearsContainer.innerHTML = '';
        const yearInfos = [
            {label: 'Year 1', start: new Date(2024,8,1).getTime(), title: 'Sep 2024 – mid 2025'},
            {label: 'Year 2', start: new Date(2025,8,1).getTime(), title: 'Sep 2025 – mid 2026'},
            {label: 'Year 3', start: new Date(2026,8,1).getTime(), title: 'Sep 2026 – mid 2027'},
            {label: 'Year 4', start: new Date(2027,8,1).getTime(), title: 'Sep 2027 – May/July 2028'}
        ];

        const lineRect2 = line ? line.getBoundingClientRect() : null;
        const yearsRect2 = yearsContainer.getBoundingClientRect();
        const lineWidth2 = lineRect2 ? lineRect2.width : 0;
        const relLeft2 = lineRect2 ? (lineRect2.left - yearsRect2.left) : 0;

        for(let i=0;i<yearInfos.length;i++){
            const info = yearInfos[i];
            let fracPos = total <= 0 ? 0 : (info.start - overallStart) / total;
            fracPos = Math.max(0, Math.min(1, fracPos));

            if(lineRect2){
                let x = relLeft2 + fracPos * lineWidth2;
                const pad = 8;
                x = Math.max(pad, Math.min(yearsContainer.clientWidth - pad, x));
                const el = document.createElement('div');
                el.className = 'year';
                el.style.left = x + 'px';
                el.style.position = 'absolute';
                el.style.transform = 'translateX(-50%)';
                el.textContent = info.label;
                el.title = info.title;
                yearsContainer.appendChild(el);
            } else {
                const pos = Math.round(fracPos * 100);
                const el = document.createElement('div');
                el.className = 'year';
                el.style.left = pos + '%';
                el.textContent = info.label;
                el.title = info.title;
                yearsContainer.appendChild(el);
            }
        }
        if(lineRect2){
            const endX = relLeft2 + lineWidth2;
            const pad = 8;
            const marginOffset = 18; 
            const desired = endX - marginOffset;
            const gx = Math.max(pad, Math.min(yearsContainer.clientWidth - pad, desired));
            const grad = document.createElement('div');
            grad.className = 'year graduation';
            grad.style.left = gx + 'px';
            grad.style.position = 'absolute';
            grad.style.transform = 'translateX(-50%)';
            grad.textContent = 'Graduation';
            grad.setAttribute('title', 'Graduation');
            yearsContainer.appendChild(grad);
        } else {
            const grad = document.createElement('div');
            grad.className = 'year graduation';
            grad.style.position = 'absolute';
            grad.style.right = '6px';
            grad.style.transform = 'translateX(0)';
            grad.textContent = 'Graduation';
            grad.setAttribute('title', 'Graduation');
            yearsContainer.appendChild(grad);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    initUniversityTimeline();
    setInterval(initUniversityTimeline, 60 * 1000); 
});
