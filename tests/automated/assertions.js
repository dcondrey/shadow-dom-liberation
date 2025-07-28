/**
 * Shadow DOM Liberation - Test Assertions Library
 * Provides assertion helpers for automated testing
 */

class TestAssertions {
    constructor(page) {
        this.page = page;
        this.errors = [];
    }
    
    /**
     * Assert that an element exists
     */
    async assertElementExists(selector, message = '') {
        const exists = await this.page.evaluate((sel) => {
            return document.querySelector(sel) !== null;
        }, selector);
        
        if (!exists) {
            this.errors.push(message || `Element not found: ${selector}`);
        }
        return exists;
    }
    
    /**
     * Assert that text can be selected
     */
    async assertTextSelectable(selector = '#testContent') {
        const result = await this.page.evaluate((sel) => {
            const element = document.querySelector(sel);
            if (!element) return { success: false, error: 'Element not found' };
            
            // Check CSS
            const computed = window.getComputedStyle(element);
            if (computed.userSelect === 'none') {
                return { success: false, error: 'CSS user-select is none' };
            }
            
            // Try to select text
            try {
                const range = document.createRange();
                const textNode = element.querySelector('p') || element;
                range.selectNodeContents(textNode);
                
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                
                const selected = window.getSelection().toString();
                window.getSelection().removeAllRanges();
                
                return {
                    success: selected.length > 0,
                    error: selected.length === 0 ? 'Could not select text' : null
                };
            } catch (e) {
                return { success: false, error: e.message };
            }
        }, selector);
        
        if (!result.success) {
            this.errors.push(`Text selection failed: ${result.error}`);
        }
        return result.success;
    }
    
    /**
     * Assert that right-click works
     */
    async assertRightClickEnabled(selector = '#testContent') {
        const result = await this.page.evaluate((sel) => {
            const element = document.querySelector(sel);
            if (!element) return { success: false, error: 'Element not found' };
            
            let defaultPrevented = false;
            
            const handler = (e) => {
                if (e.defaultPrevented) {
                    defaultPrevented = true;
                }
            };
            
            element.addEventListener('contextmenu', handler, { once: true });
            
            const event = new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            
            element.dispatchEvent(event);
            
            return {
                success: !defaultPrevented,
                error: defaultPrevented ? 'Context menu prevented' : null
            };
        }, selector);
        
        if (!result.success) {
            this.errors.push(`Right-click failed: ${result.error}`);
        }
        return result.success;
    }
    
    /**
     * Assert that copy works
     */
    async assertCopyEnabled() {
        const result = await this.page.evaluate(() => {
            let defaultPrevented = false;
            
            const handler = (e) => {
                if (e.defaultPrevented) {
                    defaultPrevented = true;
                }
            };
            
            document.addEventListener('copy', handler, { once: true });
            
            try {
                const success = document.execCommand('copy');
                return {
                    success: success && !defaultPrevented,
                    error: !success ? 'execCommand failed' : 
                           defaultPrevented ? 'Copy event prevented' : null
                };
            } catch (e) {
                return { success: false, error: e.message };
            }
        });
        
        if (!result.success) {
            this.errors.push(`Copy failed: ${result.error}`);
        }
        return result.success;
    }
    
    /**
     * Assert that drag operations work
     */
    async assertDragEnabled(selector = 'img') {
        const result = await this.page.evaluate((sel) => {
            const element = document.querySelector(sel);
            if (!element) return { success: false, error: 'Element not found' };
            
            // Check draggable attribute
            if (element.draggable === false) {
                return { success: false, error: 'Element draggable is false' };
            }
            
            // Check CSS
            const computed = window.getComputedStyle(element);
            if (computed.webkitUserDrag === 'none') {
                return { success: false, error: 'CSS user-drag is none' };
            }
            
            // Test dragstart event
            let dragStartFired = false;
            let defaultPrevented = false;
            
            const handler = (e) => {
                dragStartFired = true;
                if (e.defaultPrevented) {
                    defaultPrevented = true;
                }
            };
            
            element.addEventListener('dragstart', handler, { once: true });
            
            const event = new DragEvent('dragstart', {
                bubbles: true,
                cancelable: true
            });
            
            element.dispatchEvent(event);
            
            return {
                success: dragStartFired && !defaultPrevented,
                error: !dragStartFired ? 'Dragstart did not fire' :
                       defaultPrevented ? 'Dragstart prevented' : null
            };
        }, selector);
        
        if (!result.success) {
            this.errors.push(`Drag failed: ${result.error}`);
        }
        return result.success;
    }
    
    /**
     * Assert that an element has specific CSS property
     */
    async assertCSSProperty(selector, property, expectedValue) {
        const result = await this.page.evaluate((sel, prop, expected) => {
            const element = document.querySelector(sel);
            if (!element) return { success: false, actual: null };
            
            const computed = window.getComputedStyle(element);
            const actual = computed[prop];
            
            return {
                success: actual === expected,
                actual: actual
            };
        }, selector, property, expectedValue);
        
        if (!result.success) {
            this.errors.push(
                `CSS property mismatch on ${selector}: ` +
                `${property} is "${result.actual}", expected "${expectedValue}"`
            );
        }
        return result.success;
    }
    
    /**
     * Assert that an attribute exists or has specific value
     */
    async assertAttribute(selector, attribute, expectedValue = null) {
        const result = await this.page.evaluate((sel, attr, expected) => {
            const element = document.querySelector(sel);
            if (!element) return { success: false, actual: null };
            
            const hasAttr = element.hasAttribute(attr);
            const actual = element.getAttribute(attr);
            
            if (expected === null) {
                return { success: hasAttr, actual };
            } else {
                return { success: actual === expected, actual };
            }
        }, selector, attribute, expectedValue);
        
        if (!result.success) {
            if (expectedValue === null) {
                this.errors.push(`Attribute "${attribute}" not found on ${selector}`);
            } else {
                this.errors.push(
                    `Attribute mismatch on ${selector}: ` +
                    `${attribute}="${result.actual}", expected "${expectedValue}"`
                );
            }
        }
        return result.success;
    }
    
    /**
     * Assert that element is interactive (not blocked by pointer-events)
     */
    async assertInteractive(selector) {
        const result = await this.page.evaluate((sel) => {
            const element = document.querySelector(sel);
            if (!element) return { success: false, error: 'Element not found' };
            
            const computed = window.getComputedStyle(element);
            if (computed.pointerEvents === 'none') {
                return { success: false, error: 'pointer-events is none' };
            }
            
            // Check if element can receive click
            let clicked = false;
            element.addEventListener('click', () => { clicked = true; }, { once: true });
            
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            
            element.dispatchEvent(event);
            
            return {
                success: clicked,
                error: !clicked ? 'Click event did not fire' : null
            };
        }, selector);
        
        if (!result.success) {
            this.errors.push(`Element not interactive: ${result.error}`);
        }
        return result.success;
    }
    
    /**
     * Assert that Shadow DOM content is accessible
     */
    async assertShadowDOMAccessible(hostSelector) {
        const result = await this.page.evaluate((sel) => {
            const host = document.querySelector(sel);
            if (!host) return { success: false, error: 'Host element not found' };
            
            const shadowRoot = host.shadowRoot;
            if (!shadowRoot) {
                return { success: false, error: 'No shadow root found' };
            }
            
            // Try to query content in shadow root
            try {
                const content = shadowRoot.querySelector('*');
                return {
                    success: content !== null,
                    error: content === null ? 'No content in shadow root' : null
                };
            } catch (e) {
                return { success: false, error: e.message };
            }
        }, hostSelector);
        
        if (!result.success) {
            this.errors.push(`Shadow DOM not accessible: ${result.error}`);
        }
        return result.success;
    }
    
    /**
     * Assert no console errors
     */
    async assertNoConsoleErrors() {
        const errors = await this.page.evaluate(() => {
            return window.consoleErrors || [];
        });
        
        if (errors.length > 0) {
            this.errors.push(`Console errors: ${errors.join(', ')}`);
            return false;
        }
        return true;
    }
    
    /**
     * Get all collected errors
     */
    getErrors() {
        return this.errors;
    }
    
    /**
     * Clear errors
     */
    clearErrors() {
        this.errors = [];
    }
    
    /**
     * Run all basic assertions
     */
    async runBasicAssertions() {
        await this.assertTextSelectable();
        await this.assertRightClickEnabled();
        await this.assertCopyEnabled();
        await this.assertDragEnabled();
        await this.assertNoConsoleErrors();
        
        return this.errors.length === 0;
    }
}

// Helper function to inject console error tracking
async function injectErrorTracking(page) {
    await page.evaluateOnNewDocument(() => {
        window.consoleErrors = [];
        const originalError = console.error;
        console.error = function(...args) {
            window.consoleErrors.push(args.join(' '));
            originalError.apply(console, args);
        };
    });
}

// Export for use in tests
module.exports = {
    TestAssertions,
    injectErrorTracking
};