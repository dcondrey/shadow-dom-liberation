// ==UserScript==
// @name              Shadow DOM Liberation
// @name:en           Shadow DOM Liberation
// @name:zh-CN        影子DOM解放
// @name:zh-TW        影子DOM解放
// @name:ja           シャドウDOM解放
// @name:ko           쉐도우 DOM 해방
// @namespace         https://github.com/dcondrey/shadow-dom-liberation
// @version           1.0.0
// @description       Transparently removes web restrictions while maintaining complete behavioral fidelity
// @description:en    Transparently removes web restrictions while maintaining complete behavioral fidelity
// @description:zh-CN 透明地移除网页限制，同时保持完整的行为保真度
// @description:zh-TW 透明地移除網頁限制，同時保持完整的行為保真度
// @description:ja    完全な動作忠実性を維持しながら、Web制限を透過的に削除します
// @description:ko    완전한 동작 충실도를 유지하면서 웹 제한을 투명하게 제거합니다
// @author            David Condrey
// @homepage          https://github.com/dcondrey/shadow-dom-liberation
// @homepageURL       https://github.com/dcondrey/shadow-dom-liberation
// @website           https://github.com/dcondrey/shadow-dom-liberation
// @source            https://github.com/dcondrey/shadow-dom-liberation
// @icon              https://raw.githubusercontent.com/dcondrey/shadow-dom-liberation/main/icons/icon.svg
// @iconURL           https://raw.githubusercontent.com/dcondrey/shadow-dom-liberation/main/icons/icon.svg
// @defaulticon       https://raw.githubusercontent.com/dcondrey/shadow-dom-liberation/main/icons/icon.svg
// @icon64            https://raw.githubusercontent.com/dcondrey/shadow-dom-liberation/main/icons/icon64.svg
// @icon64URL         https://raw.githubusercontent.com/dcondrey/shadow-dom-liberation/main/icons/icon64.svg
// @supportURL        https://github.com/dcondrey/shadow-dom-liberation/issues
// @updateURL         https://github.com/dcondrey/shadow-dom-liberation/raw/main/shadow-dom-liberation.user.js
// @downloadURL       https://github.com/dcondrey/shadow-dom-liberation/raw/main/shadow-dom-liberation.user.js
// @match             *://*/*
// @include           *
// @exclude           
// @grant             none
// @run-at            document-start
// @noframes
// @license           MIT
// @compatible        chrome Chrome/Chromium + Tampermonkey/Violentmonkey
// @compatible        firefox Firefox + Greasemonkey/Tampermonkey/Violentmonkey
// @compatible        safari Safari + Tampermonkey/Userscripts
// @compatible        edge Edge + Tampermonkey/Violentmonkey
// @compatible        opera Opera + Tampermonkey/Violentmonkey
// @compatible        brave Brave + Tampermonkey/Violentmonkey
// @antifeature       none
// @injectionMode     default
// @sandbox           JavaScript
// @unwrap
// ==/UserScript==

(function() {
  'use strict';

  // Configuration
  const config = {
    protectedEvents: ['contextmenu', 'selectstart', 'copy', 'cut', 'paste', 'dragstart', 'mousedown'],
    checkInterval: 500,
    stealthMode: true
  };

  // Store original functions before anything can modify them
  const originals = {
    addEventListener: EventTarget.prototype.addEventListener,
    removeEventListener: EventTarget.prototype.removeEventListener,
    preventDefault: Event.prototype.preventDefault,
    stopPropagation: Event.prototype.stopPropagation,
    stopImmediatePropagation: Event.prototype.stopImmediatePropagation,
    defineProperty: Object.defineProperty,
    getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor
  };

  // Hidden storage using symbols - undetectable by iteration
  const secretStorage = Symbol('__stealth_storage__');
  const shadowHandlers = Symbol('__shadow_handlers__');
  const isProtected = Symbol('__is_protected__');

  // Create a hidden property on an object
  function createHiddenProperty(obj, prop, value) {
    originals.defineProperty(obj, prop, {
      value: value,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }

  // Check if a function call is from page script or our code
  function isPageScript() {
    try {
      // This is more reliable than stack inspection
      const stack = new Error().stack;
      return !stack.includes('Stealth') && !stack.includes('userscript');
    } catch(e) {
      return true;
    }
  }

  // Stealth event listener that appears to not exist
  function stealthListener(e) {
    // Allow the event to proceed normally
    e.returnValue = true;
    
    // Restore default behavior
    if (e.preventDefault[isProtected]) {
      e.preventDefault = function() { return false; };
    }
    
    // Process shadow handlers
    const handlers = e.currentTarget[shadowHandlers];
    if (handlers && handlers[e.type]) {
      handlers[e.type].forEach(handler => {
        try {
          handler.call(e.currentTarget, e);
        } catch(err) {}
      });
    }
    
    return true;
  }

  // Override addEventListener with stealth version
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    // Initialize shadow storage
    if (!this[shadowHandlers]) {
      createHiddenProperty(this, shadowHandlers, {});
    }
    
    // For protected events
    if (config.protectedEvents.includes(type)) {
      // Store page handlers in shadow storage instead of adding them
      if (isPageScript()) {
        if (!this[shadowHandlers][type]) {
          this[shadowHandlers][type] = [];
        }
        this[shadowHandlers][type].push(listener);
        
        // Add our stealth listener only once
        if (this[shadowHandlers][type].length === 1) {
          originals.addEventListener.call(this, type, stealthListener, true);
        }
        
        return;
      }
    }
    
    // Normal handling for non-protected events
    return originals.addEventListener.call(this, type, listener, options);
  };

  // Make our override undetectable
  originals.defineProperty(EventTarget.prototype.addEventListener, 'toString', {
    value: originals.addEventListener.toString.bind(originals.addEventListener),
    writable: false,
    enumerable: false,
    configurable: false
  });

  // Override preventDefault to be ineffective for protected events
  Event.prototype.preventDefault = function() {
    if (config.protectedEvents.includes(this.type)) {
      // Mark as protected but don't actually prevent
      this[isProtected] = true;
      return;
    }
    return originals.preventDefault.call(this);
  };

  // CSS injection with stealth
  function injectProtectionCSS() {
    const id = 'stealth-' + Math.random().toString(36).substr(2, 9);
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        user-select: text !important;
        -webkit-touch-callout: default !important;
      }
      
      /* Disable overlays */
      [style*="user-select: none"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        user-select: text !important;
      }
    `;
    
    // Make style element undetectable
    originals.defineProperty(style, 'sheet', {
      get() { return null; },
      configurable: false
    });
    
    // Hide from DOM queries
    const originalQuerySelector = document.querySelector;
    document.querySelector = function(selector) {
      const result = originalQuerySelector.call(this, selector);
      if (result && result.id === id) return null;
      return result;
    };
    
    document.head.appendChild(style);
  }

  // Process DOM elements stealthily
  function processElement(element) {
    if (element[isProtected]) return;
    element[isProtected] = true;
    
    // Remove restrictive handlers
    config.protectedEvents.forEach(event => {
      const prop = 'on' + event;
      
      if (element[prop]) {
        // Store original handler
        element[secretStorage] = element[secretStorage] || {};
        element[secretStorage][prop] = element[prop];
        
        // Replace with our handler
        element[prop] = function(e) {
          e.returnValue = true;
          return true;
        };
      }
    });
    
    // Remove restrictive attributes
    const restrictiveAttrs = ['oncontextmenu', 'onselectstart', 'oncopy', 'oncut', 'onpaste'];
    restrictiveAttrs.forEach(attr => {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
      }
    });
  }

  // Mutation observer with stealth processing
  function observeChanges() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              processElement(node);
              node.querySelectorAll('*').forEach(processElement);
            }
          });
        } else if (mutation.type === 'attributes') {
          if (mutation.attributeName && mutation.attributeName.startsWith('on')) {
            processElement(mutation.target);
          }
        }
      });
    });
    
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['oncontextmenu', 'onselectstart', 'oncopy', 'oncut', 'onpaste']
    });
  }

  // Advanced detection evasion
  function evadeDetection() {
    // Hide our modifications from detection
    const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    Object.getOwnPropertyDescriptor = function(obj, prop) {
      // Return original descriptors for our modified functions
      if (obj === EventTarget.prototype && prop === 'addEventListener') {
        return {
          value: originals.addEventListener,
          writable: true,
          enumerable: true,
          configurable: true
        };
      }
      if (obj === Event.prototype && prop === 'preventDefault') {
        return {
          value: originals.preventDefault,
          writable: true,
          enumerable: true,
          configurable: true
        };
      }
      return originalGetOwnPropertyDescriptor.call(this, obj, prop);
    };

    // Hide from function comparisons
    Function.prototype.toString = new Proxy(Function.prototype.toString, {
      apply(target, thisArg, args) {
        if (thisArg === EventTarget.prototype.addEventListener) {
          return originals.addEventListener.toString();
        }
        if (thisArg === Event.prototype.preventDefault) {
          return originals.preventDefault.toString();
        }
        return target.apply(thisArg, args);
      }
    });

    // Prevent timing attacks
    const originalNow = Date.now;
    const originalPerfNow = performance.now;
    let timeOffset = 0;
    
    Date.now = function() {
      return originalNow() + timeOffset;
    };
    
    performance.now = function() {
      return originalPerfNow() + timeOffset;
    };
    
    // Add random jitter to prevent timing fingerprinting
    setInterval(() => {
      timeOffset += (Math.random() - 0.5) * 2;
    }, 100);
  }

  // Smart overlay buster
  function bustOverlays() {
    // Target common overlay patterns
    const overlaySelectors = [
      '[style*="position: fixed"][style*="z-index"]:not(nav):not(header)',
      '[style*="position: absolute"][style*="width: 100%"][style*="height: 100%"]',
      '[class*="overlay"]:not([class*="video"])',
      '[class*="modal-backdrop"]',
      '[style*="pointer-events: none"]',
      'div[style*="z-index: 999"]'
    ];
    
    overlaySelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        const rect = el.getBoundingClientRect();
        const styles = getComputedStyle(el);
        
        // Check if it's likely a blocking overlay
        if (
          rect.width > window.innerWidth * 0.8 &&
          rect.height > window.innerHeight * 0.8 &&
          parseInt(styles.zIndex) > 999 &&
          !el.querySelector('video, iframe, form, input, button')
        ) {
          el.style.setProperty('pointer-events', 'none', 'important');
          el.style.setProperty('display', 'none', 'important');
        }
      });
    });
  }

  // Initialize protection
  function initialize() {
    // Apply CSS protection
    if (document.head) {
      injectProtectionCSS();
    } else {
      const observer = new MutationObserver((mutations, obs) => {
        if (document.head) {
          injectProtectionCSS();
          obs.disconnect();
        }
      });
      observer.observe(document.documentElement, { childList: true });
    }
    
    // Process existing elements
    document.querySelectorAll('*').forEach(processElement);
    
    // Start observers
    observeChanges();
    
    // Evade detection
    evadeDetection();
    
    // Periodic tasks
    setInterval(() => {
      // Reprocess body in case it was replaced
      if (document.body) {
        processElement(document.body);
      }
      
      // Bust overlays
      bustOverlays();
    }, config.checkInterval);
    
    // Handle dynamic script injection
    const scriptObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.tagName === 'SCRIPT') {
            // Prevent restriction scripts from running
            if (node.textContent.includes('preventDefault') || 
                node.textContent.includes('contextmenu') ||
                node.textContent.includes('selectstart')) {
              node.type = 'text/plain';
            }
          }
        });
      });
    });
    
    if (document.head) {
      scriptObserver.observe(document.head, { childList: true });
    }
    if (document.body) {
      scriptObserver.observe(document.body, { childList: true });
    }
  }

  // Multiple initialization strategies for reliability
  
  // Strategy 1: Immediate execution
  try {
    initialize();
  } catch(e) {}
  
  // Strategy 2: DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  }
  
  // Strategy 3: Load event
  window.addEventListener('load', initialize);
  
  // Strategy 4: Delayed execution
  setTimeout(initialize, 0);
  
  // Strategy 5: RequestAnimationFrame
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(initialize);
  }

  // Anti-anti-debugging
  const checkDebugger = () => {
    const start = performance.now();
    debugger;
    const end = performance.now();
    
    if (end - start > 100) {
      // Debugger was opened, don't reveal ourselves
      return;
    }
  };
  
  // Don't check for debugger (this would make us detectable)
  // checkDebugger();
  
})();
