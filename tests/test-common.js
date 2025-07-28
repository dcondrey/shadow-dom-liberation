// Common test utilities for Shadow DOM Liberation tests

// Console logging with styled output
const testConsole = {
    log: (message) => {
        console.log(`[TEST] ${message}`);
        logToPage(message, 'log');
    },
    
    error: (message) => {
        console.error(`[TEST ERROR] ${message}`);
        logToPage(message, 'error');
    },
    
    success: (message) => {
        console.log(`[TEST SUCCESS] ${message}`);
        logToPage(message, 'success');
    },
    
    info: (message) => {
        console.info(`[TEST INFO] ${message}`);
        logToPage(message, 'info');
    }
};

// Log messages to page console output
function logToPage(message, type = 'log') {
    const consoleOutput = document.getElementById('console-output');
    if (!consoleOutput) {
        // Create console output if it doesn't exist
        const div = document.createElement('div');
        div.id = 'console-output';
        div.className = 'console-output';
        document.body.appendChild(div);
    }
    
    const entry = document.createElement('div');
    entry.className = type;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    document.getElementById('console-output').appendChild(entry);
}

// Check if a restriction has been bypassed
function checkRestrictionBypassed() {
    // This will be called by individual test files
    // They should override this with specific detection logic
    testConsole.info('Checking if restriction is bypassed...');
}

// Common restriction detection functions
const restrictionChecks = {
    // Check if right-click is enabled
    rightClick: () => {
        const testElement = document.getElementById('testContent');
        let rightClickEnabled = true;
        
        const handler = (e) => {
            e.preventDefault();
            rightClickEnabled = false;
        };
        
        // Temporarily add handler to test
        testElement.addEventListener('contextmenu', handler);
        
        // Simulate right-click
        const event = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        
        testElement.dispatchEvent(event);
        
        // Remove test handler
        testElement.removeEventListener('contextmenu', handler);
        
        return rightClickEnabled;
    },
    
    // Check if text selection is enabled
    textSelection: () => {
        const testElement = document.getElementById('testContent');
        const computedStyle = window.getComputedStyle(testElement);
        
        // Check CSS
        if (computedStyle.userSelect === 'none' || 
            computedStyle.webkitUserSelect === 'none' ||
            computedStyle.mozUserSelect === 'none') {
            return false;
        }
        
        // Check if selection works
        try {
            const range = document.createRange();
            range.selectNodeContents(testElement);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            const hasSelection = window.getSelection().toString().length > 0;
            window.getSelection().removeAllRanges();
            return hasSelection;
        } catch (e) {
            return false;
        }
    },
    
    // Check if copy is enabled
    copyEnabled: () => {
        let copyEnabled = true;
        
        const handler = (e) => {
            e.preventDefault();
            copyEnabled = false;
        };
        
        document.addEventListener('copy', handler);
        
        // Try to copy
        try {
            document.execCommand('copy');
        } catch (e) {
            copyEnabled = false;
        }
        
        document.removeEventListener('copy', handler);
        
        return copyEnabled;
    },
    
    // Check if drag is enabled
    dragEnabled: () => {
        const images = document.querySelectorAll('img');
        if (images.length === 0) return true;
        
        const img = images[0];
        return img.draggable !== false;
    }
};

// Update test status on the page
function updateTestStatus(isLiberated, message = '') {
    const statusElement = document.getElementById('status');
    if (!statusElement) return;
    
    statusElement.classList.remove('restricted', 'liberated', 'partial');
    
    if (isLiberated === true) {
        statusElement.classList.add('liberated');
        statusElement.innerHTML = '✅ Restriction Bypassed' + (message ? `<br><small>${message}</small>` : '');
        testConsole.success('Restriction successfully bypassed!');
        notifyTestRunner('pass');
    } else if (isLiberated === false) {
        statusElement.classList.add('restricted');
        statusElement.innerHTML = '❌ Restriction Active' + (message ? `<br><small>${message}</small>` : '');
        testConsole.error('Restriction is still active');
        notifyTestRunner('fail');
    } else {
        statusElement.classList.add('partial');
        statusElement.innerHTML = '⚠️ Partial Bypass' + (message ? `<br><small>${message}</small>` : '');
        testConsole.info('Restriction partially bypassed');
        notifyTestRunner('partial');
    }
    
    // Show result indicator
    showResultIndicator(isLiberated);
}

// Show floating result indicator
function showResultIndicator(status) {
    const indicator = document.createElement('div');
    indicator.className = 'result-indicator';
    
    if (status === true) {
        indicator.classList.add('pass');
        indicator.textContent = 'TEST PASSED';
    } else if (status === false) {
        indicator.classList.add('fail');
        indicator.textContent = 'TEST FAILED';
    } else {
        indicator.style.background = '#f39c12';
        indicator.textContent = 'PARTIAL PASS';
    }
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        indicator.remove();
    }, 3000);
}

// Notify test runner of results
function notifyTestRunner(status) {
    // Get test path from current URL
    const testPath = window.location.pathname.split('/').slice(-2).join('/');
    
    // Send message to parent window if in iframe
    if (window.parent !== window) {
        window.parent.postMessage({
            type: 'test-result',
            testPath: testPath,
            status: status
        }, '*');
    }
    
    // Also send to opener if opened in new window
    if (window.opener) {
        window.opener.postMessage({
            type: 'test-result',
            testPath: testPath,
            status: status
        }, '*');
    }
}

// Wait for userscript to load and take effect
function waitForUserscript(callback, timeout = 5000) {
    const startTime = Date.now();
    
    function check() {
        // Check if userscript has modified the page
        // This is a generic check - specific tests may override
        const elapsed = Date.now() - startTime;
        
        if (elapsed > timeout) {
            testConsole.error('Timeout waiting for userscript');
            callback(false);
            return;
        }
        
        // Look for signs of userscript activity
        if (document.querySelector('[data-sdl-liberated]') || 
            window.shadowDomLiberation) {
            testConsole.success('Userscript detected');
            callback(true);
        } else {
            setTimeout(check, 100);
        }
    }
    
    check();
}

// Initialize test on page load
document.addEventListener('DOMContentLoaded', () => {
    testConsole.info('Test page loaded');
    testConsole.info(`Testing: ${document.title}`);
    
    // Add a small delay to allow userscript to initialize
    setTimeout(() => {
        if (typeof checkRestrictionBypassed === 'function') {
            checkRestrictionBypassed();
        }
    }, 1000);
});

// Utility function to create test content
function createTestContent(html) {
    const testContent = document.getElementById('testContent');
    if (testContent) {
        testContent.innerHTML = html;
    }
}

// Export for use in test files
window.testUtils = {
    console: testConsole,
    checks: restrictionChecks,
    updateStatus: updateTestStatus,
    waitForUserscript: waitForUserscript,
    createTestContent: createTestContent,
    notifyTestRunner: notifyTestRunner
};