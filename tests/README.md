<!-- repo-header:start -->
<img src="https://github.com/dcondrey.png?size=160" alt="Shadow DOM Liberation Test Suite logo" width="120" align="left">

<h1>Shadow DOM Liberation Test Suite</h1>

<p><strong>Documentation for Shadow DOM Liberation Test Suite in Shadow Dom Liberation.</strong></p>

<br clear="left">

[![CI](https://img.shields.io/github/actions/workflow/status/dcondrey/shadow-dom-liberation/ci.yml?style=flat-square&labelColor=20232a&branch=main&label=CI)](https://github.com/dcondrey/shadow-dom-liberation/actions/workflows/ci.yml) [![Best Practices Evidence](https://img.shields.io/badge/best%20practices-evidence%20reviewed-6a4c93?style=flat-square&labelColor=20232a)](../.bestpractices.json) [![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-Contributor%20Covenant%202.1-6a4c93?style=flat-square&labelColor=20232a)](https://github.com/dcondrey/shadow-dom-liberation/blob/main/CODE_OF_CONDUCT.md) [![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-Sponsor-EA4AAA?style=flat-square&labelColor=20232a)](https://github.com/sponsors/dcondrey)
<!-- repo-header:end -->

This comprehensive test suite helps verify that the Shadow DOM Liberation userscript successfully bypasses various content restriction techniques.

## Quick Start

1. **Install the userscript** in your browser (Tampermonkey/Greasemonkey)
2. **Open `test-runner.html`** to see all available tests
3. **Click individual tests** to verify functionality
4. **Check real-world sites** listed in `real-world-sites.md`

## Test Categories

### Manual Tests (`/manual/`)
Basic restriction techniques commonly found on websites:
- **right-click-disabled.html** - Context menu prevention
- **text-selection-blocked.html** - Text selection prevention
- **copy-paste-disabled.html** - Copy/paste restrictions
- **drag-disabled.html** - Drag operation blocking
- **devtools-detection.html** - Developer tools detection
- **overlay-protection.html** - Overlay-based content blocking
- **iframe-restrictions.html** - Iframe-based protections
- **shadow-dom-protection.html** - Shadow DOM isolation techniques
- **combined-restrictions.html** - Multiple techniques combined

### Advanced Tests (`/advanced/`)
Sophisticated protection mechanisms:
- **mutation-observer-guard.html** - MutationObserver-based protection
- **event-capture-trap.html** - Event capture phase blocking
- **css-pointer-events.html** - CSS-based interaction blocking
- **javascript-vm-isolation.html** - VM-based content protection
- **timing-attack-detection.html** - Timing-based script detection
- **fingerprint-detection.html** - Userscript detection attempts

### Automated Tests (`/automated/`)
- **test-suite.js** - Automated test runner
- **assertions.js** - Test assertion library

## How to Run Tests

### Manual Testing
1. Open `test-runner.html` in your browser
2. Ensure the Shadow DOM Liberation userscript is active
3. Click on individual test links
4. Verify that restrictions are bypassed (green status indicator)

### Automated Testing
```bash
# Run all automated tests
open test-runner.html
# Click "Run All Tests" button

# Or use headless browser testing
node automated/test-suite.js
```

## Understanding Test Results

### Visual Indicators
- 🔴 **Red Background** - Restriction is active (script not working)
- 🟢 **Green Background** - Restriction bypassed (script working)
- 🟡 **Yellow Background** - Partial bypass or warning

### Console Output
Each test logs detailed information to the browser console:
- Restriction detection status
- Bypass attempt details
- Any errors or warnings

## Adding New Tests

### Creating a Manual Test
1. Copy the template from any existing test file
2. Modify the restriction implementation
3. Update the detection logic
4. Add to `test-runner.html`

### Test File Template
```html
<!DOCTYPE html>
<html>
<head>
    <title>Test: [Your Restriction Type]</title>
    <link rel="stylesheet" href="../test-common.css">
</head>
<body>
    <h1>Test: [Your Restriction Type]</h1>
    <div class="status restricted" id="status">
        ❌ Restriction Active
    </div>
    
    <div class="test-content" id="testContent">
        <!-- Your test content -->
    </div>
    
    <script src="../test-common.js"></script>
    <script>
        // Your restriction code
        
        // Detection logic
        checkRestrictionBypassed();
    </script>
</body>
</html>
```

## Real-World Testing

See `real-world-sites.md` for a curated list of websites with various content restrictions. Test the userscript on these sites to ensure real-world compatibility.

## Test Coverage

Current test suite covers:
- ✅ Basic event handler overrides
- ✅ CSS-based restrictions
- ✅ JavaScript event listeners
- ✅ Shadow DOM isolation
- ✅ Iframe restrictions
- ✅ Advanced detection evasion
- ✅ Multiple restriction combinations

## Browser Compatibility

Tests verified on:
- Chrome/Chromium 90+
- Firefox 85+
- Safari 14+
- Edge 90+
- Opera 75+

## Known Limitations

1. Some restrictions may require page reload after script injection
2. Certain WASM-based protections may need special handling
3. Cross-origin iframes have inherent browser security limitations

## Contributing

To contribute new test cases:
1. Create a test file following the template
2. Document the restriction technique
3. Add clear success/failure indicators
4. Update this README
5. Submit a pull request

## Maintenance

- Test suite should be updated when new restriction techniques emerge
- Real-world sites list requires periodic verification
- Automated tests should run on each userscript update
