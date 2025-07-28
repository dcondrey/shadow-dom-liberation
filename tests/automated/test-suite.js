/**
 * Shadow DOM Liberation - Automated Test Suite
 * This script can be run in a headless browser to automatically test all test cases
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

// Test configuration
const config = {
    baseUrl: 'file://' + path.resolve(__dirname, '..'),
    timeout: 30000,
    headless: true,
    userscriptPath: path.resolve(__dirname, '../../shadow-dom-liberation.user.js')
};

// Test cases to run
const testCases = [
    // Manual tests
    { path: '/manual/right-click-disabled.html', name: 'Right-Click Disabled' },
    { path: '/manual/text-selection-blocked.html', name: 'Text Selection Blocked' },
    { path: '/manual/copy-paste-disabled.html', name: 'Copy/Paste Disabled' },
    { path: '/manual/drag-disabled.html', name: 'Drag Operations Disabled' },
    { path: '/manual/devtools-detection.html', name: 'DevTools Detection' },
    { path: '/manual/overlay-protection.html', name: 'Overlay Protection' },
    { path: '/manual/iframe-restrictions.html', name: 'Iframe Restrictions' },
    { path: '/manual/shadow-dom-protection.html', name: 'Shadow DOM Protection' },
    { path: '/manual/combined-restrictions.html', name: 'Combined Restrictions' },
    
    // Advanced tests
    { path: '/advanced/mutation-observer-guard.html', name: 'MutationObserver Guard' },
    { path: '/advanced/event-capture-trap.html', name: 'Event Capture Trap' },
    { path: '/advanced/css-pointer-events.html', name: 'CSS Pointer Events' },
    { path: '/advanced/javascript-vm-isolation.html', name: 'JavaScript VM Isolation' },
    { path: '/advanced/timing-attack-detection.html', name: 'Timing Attack Detection' },
    { path: '/advanced/fingerprint-detection.html', name: 'Fingerprint Detection' }
];

// Test result collector
class TestResults {
    constructor() {
        this.results = [];
        this.startTime = Date.now();
    }
    
    addResult(testName, passed, details = {}) {
        this.results.push({
            name: testName,
            passed,
            duration: details.duration || 0,
            errors: details.errors || [],
            timestamp: new Date().toISOString()
        });
    }
    
    getSummary() {
        const total = this.results.length;
        const passed = this.results.filter(r => r.passed).length;
        const failed = total - passed;
        const duration = Date.now() - this.startTime;
        
        return {
            total,
            passed,
            failed,
            passRate: total > 0 ? (passed / total * 100).toFixed(2) + '%' : '0%',
            duration: duration + 'ms',
            results: this.results
        };
    }
    
    async saveToFile(filename = 'test-results.json') {
        const summary = this.getSummary();
        await fs.writeFile(
            path.join(__dirname, '..', filename),
            JSON.stringify(summary, null, 2)
        );
    }
}

// Test runner
class TestRunner {
    constructor(config) {
        this.config = config;
        this.browser = null;
        this.results = new TestResults();
    }
    
    async initialize() {
        console.log('🚀 Initializing test browser...');
        
        this.browser = await puppeteer.launch({
            headless: this.config.headless,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled'
            ]
        });
        
        // Load userscript
        this.userscript = await fs.readFile(this.config.userscriptPath, 'utf8');
    }
    
    async runTest(testCase) {
        const startTime = Date.now();
        const page = await this.browser.newPage();
        
        try {
            console.log(`\n📋 Testing: ${testCase.name}`);
            
            // Set viewport
            await page.setViewport({ width: 1280, height: 720 });
            
            // Inject userscript before navigation
            await page.evaluateOnNewDocument(this.userscript);
            
            // Navigate to test page
            const url = this.config.baseUrl + testCase.path;
            await page.goto(url, { waitUntil: 'networkidle0', timeout: this.config.timeout });
            
            // Wait for initial page setup
            await page.waitForTimeout(2000);
            
            // Run test validations based on test type
            const testResult = await this.validateTest(page, testCase);
            
            const duration = Date.now() - startTime;
            
            if (testResult.passed) {
                console.log(`✅ PASSED (${duration}ms)`);
            } else {
                console.log(`❌ FAILED (${duration}ms)`);
                testResult.errors.forEach(err => console.log(`   - ${err}`));
            }
            
            this.results.addResult(testCase.name, testResult.passed, {
                duration,
                errors: testResult.errors
            });
            
        } catch (error) {
            console.log(`❌ ERROR: ${error.message}`);
            this.results.addResult(testCase.name, false, {
                duration: Date.now() - startTime,
                errors: [error.message]
            });
        } finally {
            await page.close();
        }
    }
    
    async validateTest(page, testCase) {
        const errors = [];
        
        // Get the test status from the page
        const status = await page.evaluate(() => {
            const statusEl = document.getElementById('status');
            if (!statusEl) return null;
            
            return {
                text: statusEl.textContent,
                classes: statusEl.className
            };
        });
        
        // Check if status indicates success
        const isPassed = status && status.classes.includes('liberated');
        
        // Run specific validations based on test name
        if (testCase.name.includes('Right-Click')) {
            const canRightClick = await this.testRightClick(page);
            if (!canRightClick) errors.push('Right-click still blocked');
        }
        
        if (testCase.name.includes('Text Selection')) {
            const canSelect = await this.testTextSelection(page);
            if (!canSelect) errors.push('Text selection still blocked');
        }
        
        if (testCase.name.includes('Copy')) {
            const canCopy = await this.testCopyPaste(page);
            if (!canCopy) errors.push('Copy/paste still blocked');
        }
        
        // Check console for errors
        const consoleErrors = await page.evaluate(() => {
            return window.consoleErrors || [];
        });
        
        if (consoleErrors.length > 0) {
            errors.push(...consoleErrors.map(e => `Console: ${e}`));
        }
        
        return {
            passed: isPassed && errors.length === 0,
            errors
        };
    }
    
    async testRightClick(page) {
        return await page.evaluate(() => {
            const testEl = document.getElementById('testContent');
            if (!testEl) return false;
            
            let rightClickAllowed = true;
            
            const handler = (e) => {
                if (e.defaultPrevented) {
                    rightClickAllowed = false;
                }
            };
            
            testEl.addEventListener('contextmenu', handler, { once: true });
            
            const event = new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true
            });
            
            testEl.dispatchEvent(event);
            
            return rightClickAllowed;
        });
    }
    
    async testTextSelection(page) {
        return await page.evaluate(() => {
            const testEl = document.getElementById('testContent');
            if (!testEl) return false;
            
            // Check CSS
            const computed = window.getComputedStyle(testEl);
            if (computed.userSelect === 'none') return false;
            
            // Try to select text
            const range = document.createRange();
            const textNode = testEl.querySelector('p');
            if (!textNode) return false;
            
            range.selectNodeContents(textNode);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            
            const hasSelection = window.getSelection().toString().length > 0;
            window.getSelection().removeAllRanges();
            
            return hasSelection;
        });
    }
    
    async testCopyPaste(page) {
        return await page.evaluate(() => {
            let copyAllowed = true;
            
            const handler = (e) => {
                if (e.defaultPrevented) {
                    copyAllowed = false;
                }
            };
            
            document.addEventListener('copy', handler, { once: true });
            
            try {
                document.execCommand('copy');
            } catch (e) {
                copyAllowed = false;
            }
            
            return copyAllowed;
        });
    }
    
    async runAll() {
        await this.initialize();
        
        console.log(`\n🧪 Running ${testCases.length} tests...\n`);
        
        for (const testCase of testCases) {
            await this.runTest(testCase);
        }
        
        await this.cleanup();
        
        const summary = this.results.getSummary();
        console.log('\n📊 Test Summary:');
        console.log(`   Total: ${summary.total}`);
        console.log(`   Passed: ${summary.passed} ✅`);
        console.log(`   Failed: ${summary.failed} ❌`);
        console.log(`   Pass Rate: ${summary.passRate}`);
        console.log(`   Duration: ${summary.duration}`);
        
        await this.results.saveToFile();
        console.log('\n💾 Results saved to test-results.json');
        
        return summary;
    }
    
    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    
    // Parse arguments
    if (args.includes('--headed')) {
        config.headless = false;
    }
    
    if (args.includes('--help')) {
        console.log(`
Shadow DOM Liberation - Automated Test Suite

Usage: node test-suite.js [options]

Options:
  --headed     Run tests in headed mode (show browser)
  --help       Show this help message

Example:
  node test-suite.js --headed
        `);
        return;
    }
    
    const runner = new TestRunner(config);
    
    try {
        const results = await runner.runAll();
        
        // Exit with appropriate code
        process.exit(results.failed > 0 ? 1 : 0);
    } catch (error) {
        console.error('Test suite failed:', error);
        process.exit(1);
    }
}

// Export for use as module
module.exports = { TestRunner, TestResults };

// Run if called directly
if (require.main === module) {
    main();
}