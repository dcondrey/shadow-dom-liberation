# Shadow DOM Liberation

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Userscript](https://img.shields.io/badge/Userscript-Install-green.svg)](https://github.com/dcondrey/shadow-dom-liberation/raw/main/shadow-dom-liberation.user.js)
[![GitHub issues](https://img.shields.io/github/issues/dcondrey/shadow-dom-liberation)](https://github.com/dcondrey/shadow-dom-liberation/issues)
[![GitHub stars](https://img.shields.io/github/stars/dcondrey/shadow-dom-liberation)](https://github.com/dcondrey/shadow-dom-liberation/stargazers)

A sophisticated userscript that transparently removes web restrictions while maintaining complete behavioral fidelity to the original page.

## 🚀 Quick Install

1. **Install a userscript manager:**
   - [Tampermonkey](https://www.tampermonkey.net/) - Chrome, Firefox, Safari, Edge (Recommended)
   - [Violentmonkey](https://violentmonkey.github.io/) - Chrome, Firefox, Edge
   - [Greasemonkey](https://www.greasespot.net/) - Firefox
   - [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) - Safari

2. **[Click here to install Shadow DOM Liberation](https://github.com/dcondrey/shadow-dom-liberation/raw/main/shadow-dom-liberation.user.js)**

## 🎯 What It Does

Shadow DOM Liberation restores standard browser functionality on websites that restrict:
- ✂️ **Text Selection** - Select and highlight any text
- 📋 **Copy & Paste** - Copy content without restrictions
- 🖱️ **Right-Click Menus** - Access full context menu options
- 🖼️ **Image Saving** - Save images normally
- 📝 **Content Interaction** - Interact with page elements freely

## 🛡️ How It's Different

Unlike traditional restriction-bypass scripts that aggressively override page behavior, Shadow DOM Liberation uses a novel **"shadow handler"** architecture:

### Traditional Approach ❌
```javascript
// Obvious and detectable
document.oncontextmenu = null;
element.addEventListener = function() { /* blocked */ };
```

### Shadow DOM Liberation ✅
```javascript
// Invisible relocation - restrictions still exist but don't affect users
element[Symbol('shadow')] = restrictiveHandler;
element.oncontextmenu = transparentProxy;
```

**Result:** Websites see their restrictions working normally while users experience complete freedom.

## 🔬 Key Technologies

### Shadow Handler System
- Restrictive event handlers are relocated to a shadow storage layer
- Page scripts continue functioning normally, unaware of the bypass
- Events flow through original chains maintaining timing signatures

### Stealth Technology
- **Zero Prototype Pollution** - Uses Symbol-based hidden properties
- **Function Signature Preservation** - toString() returns original code
- **Timing Attack Prevention** - Adds natural variance to operations
- **Property Descriptor Masking** - Modifications invisible to inspection

### Intelligent Protection
- **Multi-Stage Initialization** - Ensures reliability across different page architectures
- **Dynamic Script Handling** - Neutralizes restrictions added after page load
- **Smart Overlay Detection** - Removes blocking overlays without breaking legitimate UI
- **Selective Event Interception** - Only modifies restrictive events

## 📊 Performance

- **Minimal Overhead** - Selective interception only on restricted events
- **Efficient DOM Processing** - Deduplication prevents redundant operations
- **Smart Observers** - Only processes relevant mutations
- **Batched Operations** - Prevents layout thrashing

## 🔧 Configuration

The script includes built-in configuration options:

```javascript
const config = {
  protectedEvents: ['contextmenu', 'selectstart', 'copy', 'cut', 'paste'],
  checkInterval: 500,    // Overlay detection frequency (ms)
  stealthMode: true      // Maximum detection evasion
};
```

## 🧪 Testing

Test the script on these types of sites:
- News websites that prevent text copying
- Academic sites with protected content
- Image galleries that disable right-click
- Forums that restrict text selection
- Documentation sites with copy protection

## 🤝 Use Cases

### ✅ Legitimate Uses
- **Research & Education** - Extract quotes and citations from academic content
- **Accessibility** - Restore browser features for users with disabilities
- **Web Development** - Debug sites that disable developer tools
- **Personal Archives** - Save content you have legal access to
- **Translation** - Copy text for translation services

### ❌ Do NOT Use For
- Bypassing paywalls or authentication
- Circumventing exam or assessment software
- Violating copyright or terms of service
- Accessing unauthorized content
- Commercial content theft

## 🛠️ Technical Details

### Browser Compatibility
- ✅ **Chrome/Chromium** 80+ with Tampermonkey/Violentmonkey
- ✅ **Firefox** 78+ with Greasemonkey/Tampermonkey
- ✅ **Safari** 14+ with Tampermonkey/Userscripts
- ✅ **Edge** 88+ with Tampermonkey/Violentmonkey
- ✅ **Brave** Latest with Tampermonkey
- ✅ **Opera** Latest with Tampermonkey

### How It Works
1. **Early Injection** - Script runs at `document-start` before page scripts
2. **API Interception** - Wraps addEventListener with shadow handler logic
3. **Event Transparency** - Maintains original event flow while neutralizing restrictions
4. **Continuous Protection** - Monitors for dynamically added restrictions
5. **Stealth Operations** - All modifications hidden from detection

## 🐛 Troubleshooting

### Script Not Working?
1. **Check Installation** - Ensure userscript manager is enabled
2. **Verify Permissions** - Script needs to run on the target site
3. **Disable Conflicting Extensions** - Some ad blockers may interfere
4. **Update Manager** - Ensure your userscript manager is up-to-date

### Site Still Restricted?
Some sites use advanced techniques that may require updates:
1. Open an [issue](https://github.com/dcondrey/shadow-dom-liberation/issues) with the site URL
2. Include what restrictions you're experiencing
3. We'll investigate and update the script if needed

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Legal & Ethical Notice

This tool is provided for legitimate purposes only. Users are responsible for:
- Complying with all applicable laws
- Respecting website terms of service
- Using the tool ethically and responsibly
- Not violating copyright or intellectual property rights

**Remember:** Just because you *can* bypass restrictions doesn't mean you *should*. Always respect content creators and website owners.

## 🙏 Acknowledgments

- Inspired by the need for web accessibility and user freedom
- Built upon research into browser security models and event systems
- Thanks to the userscript community for testing and feedback

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/dcondrey/shadow-dom-liberation/issues)
- **Discussions:** [GitHub Discussions](https://github.com/dcondrey/shadow-dom-liberation/discussions)
- **Updates:** Watch this repository for updates

---

**[⬆ back to top](#shadow-dom-liberation)**

<p align="center">Made with ❤️ by <a href="https://github.com/dcondrey">David Condrey</a></p>
