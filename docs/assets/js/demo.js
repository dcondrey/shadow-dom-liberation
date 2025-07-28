// Demo Page JavaScript

// Check userscript status on load
document.addEventListener('DOMContentLoaded', () => {
    checkUserscriptStatus();
    initializeDemos();
});

// Check if userscript is active
function checkUserscriptStatus() {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    // Simple check - in real implementation, the userscript would set a flag
    const isActive = typeof window.shadowDomLiberation !== 'undefined';
    
    if (isActive) {
        statusIndicator.classList.add('active');
        statusText.textContent = 'Shadow DOM Liberation is active ✓';
    } else {
        statusIndicator.classList.add('inactive');
        statusText.textContent = 'Shadow DOM Liberation is not installed';
    }
}

// Initialize all demos
function initializeDemos() {
    // Set initial states
    updateProtectionStatus('textSelectionStatus', true);
    updateProtectionStatus('rightClickStatus', true);
    updateProtectionStatus('copyPasteStatus', true);
    updateProtectionStatus('dragStatus', true);
    updateProtectionStatus('devtoolsStatus', true);
    updateProtectionStatus('allProtectionsStatus', true);
    
    // Initialize DevTools detection
    initDevToolsDetection();
    
    // Initialize drag and drop
    initDragAndDrop();
}

// Update protection status display
function updateProtectionStatus(elementId, isOn) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = `Protection: ${isOn ? 'ON' : 'OFF'}`;
        element.className = `protection-status ${isOn ? 'on' : 'off'}`;
    }
}

// 1. Text Selection Demo
let textSelectionEnabled = false;
function toggleTextSelection() {
    const demo = document.getElementById('textSelectionDemo');
    textSelectionEnabled = !textSelectionEnabled;
    
    if (textSelectionEnabled) {
        demo.classList.remove('no-select');
        demo.style.userSelect = 'auto';
        demo.style.webkitUserSelect = 'auto';
        demo.style.mozUserSelect = 'auto';
        demo.classList.add('liberated');
    } else {
        demo.classList.add('no-select');
        demo.style.userSelect = 'none';
        demo.style.webkitUserSelect = 'none';
        demo.style.mozUserSelect = 'none';
        demo.classList.remove('liberated');
    }
    
    updateProtectionStatus('textSelectionStatus', !textSelectionEnabled);
}

// 2. Right-Click Demo
let rightClickEnabled = false;
function toggleRightClick() {
    const demo = document.getElementById('rightClickDemo');
    rightClickEnabled = !rightClickEnabled;
    
    if (rightClickEnabled) {
        demo.oncontextmenu = null;
        demo.removeAttribute('oncontextmenu');
        demo.classList.add('liberated');
    } else {
        demo.oncontextmenu = () => false;
        demo.setAttribute('oncontextmenu', 'return false');
        demo.classList.remove('liberated');
    }
    
    updateProtectionStatus('rightClickStatus', !rightClickEnabled);
}

// 3. Copy/Paste Demo
let copyPasteEnabled = false;
function toggleCopyPaste() {
    const demo = document.getElementById('copyPasteDemo');
    copyPasteEnabled = !copyPasteEnabled;
    
    if (copyPasteEnabled) {
        demo.oncopy = null;
        demo.oncut = null;
        demo.removeAttribute('oncopy');
        demo.removeAttribute('oncut');
        demo.classList.add('liberated');
    } else {
        demo.oncopy = () => false;
        demo.oncut = () => false;
        demo.setAttribute('oncopy', 'return false');
        demo.setAttribute('oncut', 'return false');
        demo.classList.remove('liberated');
    }
    
    updateProtectionStatus('copyPasteStatus', !copyPasteEnabled);
}

// 4. Drag Demo
let dragEnabled = false;
function toggleDrag() {
    const demo = document.getElementById('dragDemo');
    const images = demo.querySelectorAll('img');
    dragEnabled = !dragEnabled;
    
    images.forEach(img => {
        if (dragEnabled) {
            img.draggable = true;
            img.ondragstart = null;
            img.removeAttribute('ondragstart');
            img.classList.remove('protected-image');
        } else {
            img.draggable = false;
            img.ondragstart = () => false;
            img.setAttribute('ondragstart', 'return false');
            img.classList.add('protected-image');
        }
    });
    
    demo.classList.toggle('liberated', dragEnabled);
    updateProtectionStatus('dragStatus', !dragEnabled);
}

// 5. DevTools Detection Demo
let devtoolsDetectionEnabled = true;
let devtoolsOpen = false;

function toggleDevToolsDetection() {
    devtoolsDetectionEnabled = !devtoolsDetectionEnabled;
    updateProtectionStatus('devtoolsStatus', devtoolsDetectionEnabled);
    
    const demo = document.getElementById('devtoolsDemo');
    demo.classList.toggle('liberated', !devtoolsDetectionEnabled);
    
    if (!devtoolsDetectionEnabled && devtoolsOpen) {
        showDevToolsContent();
    }
}

function initDevToolsDetection() {
    // Simple DevTools detection
    const threshold = 160;
    let devtools = { open: false };
    
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                devtoolsOpen = true;
                onDevToolsOpen();
            }
        } else {
            if (devtools.open) {
                devtools.open = false;
                devtoolsOpen = false;
                onDevToolsClose();
            }
        }
    }, 500);
}

function onDevToolsOpen() {
    if (devtoolsDetectionEnabled) {
        document.getElementById('devtoolsContent').classList.add('hidden');
        document.getElementById('devtoolsWarning').style.display = 'block';
    }
}

function onDevToolsClose() {
    showDevToolsContent();
}

function showDevToolsContent() {
    document.getElementById('devtoolsContent').classList.remove('hidden');
    document.getElementById('devtoolsWarning').style.display = 'none';
}

// 6. Combined Protection Demo
let allProtectionsEnabled = false;
function toggleAllProtections() {
    allProtectionsEnabled = !allProtectionsEnabled;
    
    const demo = document.getElementById('combinedDemo');
    const overlay = demo.querySelector('.overlay-protection');
    
    if (allProtectionsEnabled) {
        // Enable all protections
        demo.classList.remove('ultra-protected');
        overlay.style.display = 'none';
        demo.style.pointerEvents = 'auto';
        
        // Remove inline styles
        const allElements = demo.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.pointerEvents = '';
            el.style.userSelect = '';
        });
        
        demo.classList.add('liberated');
    } else {
        // Disable all protections
        demo.classList.add('ultra-protected');
        overlay.style.display = 'block';
        demo.style.pointerEvents = 'none';
        demo.classList.remove('liberated');
    }
    
    updateProtectionStatus('allProtectionsStatus', !allProtectionsEnabled);
}

// Drag and Drop functionality
function initDragAndDrop() {
    const dropZone = document.getElementById('dropZone');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight(e) {
        dropZone.classList.add('dragover');
    }
    
    function unhighlight(e) {
        dropZone.classList.remove('dragover');
    }
    
    dropZone.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            dropZone.textContent = `Dropped ${files.length} file(s)!`;
        } else {
            dropZone.textContent = 'Item dropped successfully!';
        }
        
        setTimeout(() => {
            dropZone.textContent = 'Drop images here to test';
        }, 2000);
    }
}

// Test Runner
function runAllTests() {
    const resultsGrid = document.getElementById('resultsGrid');
    const testResults = document.getElementById('testResults');
    
    testResults.style.display = 'block';
    resultsGrid.innerHTML = '';
    
    const tests = [
        { name: 'Text Selection', id: 'textSelectionTest', check: checkTextSelection },
        { name: 'Right Click', id: 'rightClickTest', check: checkRightClick },
        { name: 'Copy/Paste', id: 'copyPasteTest', check: checkCopyPaste },
        { name: 'Image Drag', id: 'imageDragTest', check: checkImageDrag },
        { name: 'DevTools Detection', id: 'devtoolsTest', check: checkDevToolsDetection },
        { name: 'Pointer Events', id: 'pointerEventsTest', check: checkPointerEvents }
    ];
    
    tests.forEach((test, index) => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'test-result running';
        resultDiv.innerHTML = `
            <span class="test-icon">⏳</span>
            <span>${test.name}</span>
        `;
        resultsGrid.appendChild(resultDiv);
        
        setTimeout(() => {
            const passed = test.check();
            resultDiv.className = `test-result ${passed ? 'pass' : 'fail'}`;
            resultDiv.innerHTML = `
                <span class="test-icon">${passed ? '✅' : '❌'}</span>
                <span>${test.name}</span>
            `;
        }, 500 * (index + 1));
    });
}

// Test Functions
function checkTextSelection() {
    const testEl = document.createElement('div');
    testEl.style.userSelect = 'none';
    document.body.appendChild(testEl);
    const computed = getComputedStyle(testEl);
    const canSelect = computed.userSelect !== 'none';
    document.body.removeChild(testEl);
    return canSelect || textSelectionEnabled;
}

function checkRightClick() {
    return rightClickEnabled || !document.querySelector('[oncontextmenu="return false"]');
}

function checkCopyPaste() {
    return copyPasteEnabled || !document.querySelector('[oncopy="return false"]');
}

function checkImageDrag() {
    const img = document.querySelector('img[draggable="false"]');
    return dragEnabled || !img;
}

function checkDevToolsDetection() {
    return !devtoolsDetectionEnabled;
}

function checkPointerEvents() {
    const testEl = document.createElement('div');
    testEl.style.pointerEvents = 'none';
    document.body.appendChild(testEl);
    const computed = getComputedStyle(testEl);
    const hasPointerEvents = computed.pointerEvents !== 'none';
    document.body.removeChild(testEl);
    return hasPointerEvents || allProtectionsEnabled;
}

// Show notification when protection is toggled
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4f46e5;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}