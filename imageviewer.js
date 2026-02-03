const modal = document.createElement('div');
modal.className = 'image-modal';
modal.innerHTML = `
    <div class="image-modal-container">
        <div class="image-modal-controls">
            <button class="image-modal-btn" id="zoom-in" title="Zoom In">+</button>
            <button class="image-modal-btn" id="zoom-out" title="Zoom Out">−</button>
            <button class="image-modal-btn" id="rotate-btn" title="Rotate 90°">⟲</button>
        </div>
        <div class="image-wrapper">
            <img class="image-modal-content" alt="">
        </div>
        <span class="image-modal-close">&times;</span>
    </div>
`;
document.body.appendChild(modal);

const modalImg = modal.querySelector('.image-modal-content');
const closeBtn = modal.querySelector('.image-modal-close');
const zoomInBtn = modal.querySelector('#zoom-in');
const zoomOutBtn = modal.querySelector('#zoom-out');
const rotateBtn = modal.querySelector('#rotate-btn');

let currentRotation = 0;
let currentZoom = 1;
const ZOOM_STEP = 0.25;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 4;
let currentOrigin = { x: 50, y: 50 };
let currentTranslate = { x: 0, y: 0 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };


function updateImageTransform() {
    modalImg.style.transformOrigin = `${currentOrigin.x}% ${currentOrigin.y}%`;
    modalImg.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) rotate(${currentRotation}deg) scale(${currentZoom})`;
}

function resetImageState() {
    currentRotation = 0;
    currentZoom = 1;
    updateImageTransform();
}

zoomInBtn.addEventListener('click', () => {
    currentZoom = Math.min(currentZoom + ZOOM_STEP, ZOOM_MAX);
    updateImageTransform();
});

zoomOutBtn.addEventListener('click', () => {
    currentZoom = Math.max(currentZoom - ZOOM_STEP, ZOOM_MIN);
    updateImageTransform();
});

rotateBtn.addEventListener('click', () => {
    currentRotation = (currentRotation + 90) % 360;
    currentOrigin = { x: 50, y: 50 };
    modalImg.style.transition = 'transform 0.25s ease';
    updateImageTransform();
    setTimeout(() => { modalImg.style.transition = ''; }, 300);
});

function addImageClickHandlers() {
    const postContent = document.getElementById('post-content');
    if (!postContent) return;

    const images = postContent.querySelectorAll('img');
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            resetImageState();
            modal.style.display = 'flex';
            modalImg.alt = img.alt || '';
            modalImg.src = img.src;
            const hires = img.getAttribute('data-hires') || img.dataset.hires;
            if (hires && hires !== img.src) {
                const hi = new Image();
                hi.onload = () => {
                    modalImg.src = hires;
                };
                hi.onerror = () => {
                };
                hi.src = hires;
            }
        });
    });
}

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

function setOriginFromEvent(e) {
    const rect = modalImg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const py = Math.max(0, Math.min(100, (y / rect.height) * 100));
    currentOrigin.x = px;
    currentOrigin.y = py;
    modalImg.style.transformOrigin = `${px}% ${py}%`;
}

modalImg.addEventListener('click', (e) => {
    try { setOriginFromEvent(e); } catch (err) {}
    e.stopPropagation();
});

modalImg.addEventListener('mousedown', (e) => {
    if (currentZoom <= 1) return;
    isDragging = true;
    modalImg.style.cursor = 'grabbing';
    dragStart.x = e.clientX - currentTranslate.x;
    dragStart.y = e.clientY - currentTranslate.y;
    e.preventDefault();
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentTranslate.x = e.clientX - dragStart.x;
    currentTranslate.y = e.clientY - dragStart.y;
    updateImageTransform();
});

window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    modalImg.style.cursor = 'grab';
});

// touch support
modalImg.addEventListener('touchstart', (e) => {
    if (currentZoom <= 1) return;
    if (e.touches.length === 1) {
        isDragging = true;
        const t = e.touches[0];
        dragStart.x = t.clientX - currentTranslate.x;
        dragStart.y = t.clientY - currentTranslate.y;
    }
}, { passive: true });

modalImg.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const t = e.touches[0];
    currentTranslate.x = t.clientX - dragStart.x;
    currentTranslate.y = t.clientY - dragStart.y;
    updateImageTransform();
}, { passive: false });

modalImg.addEventListener('touchend', () => {
    isDragging = false;
});

modalImg.addEventListener('wheel', (e) => {
    if (modal.style.display !== 'flex') return;
    e.preventDefault();
    setOriginFromEvent(e);
    if (e.deltaY > 0) {
        zoomOutBtn.click();
    } else {
        zoomInBtn.click();
    }
}, { passive: false });

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.style.display = 'none';
    }
    if (modal.style.display === 'flex') {
        if (e.key === '+' || e.key === '=' ) {
            zoomInBtn.click();
        } else if (e.key === '-') {
            zoomOutBtn.click();
        } else if (e.key === 'r' || e.key === 'R') {
            rotateBtn.click();
        }
    }
});

window.addEventListener('postLoaded', addImageClickHandlers);

