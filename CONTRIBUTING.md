# Contributing to shadow-dom-liberation

Thank you for your interest in contributing. This document covers how to report issues and submit changes.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you are expected to uphold it.

## How to Contribute

### Reporting Issues

- Describe the site where the restriction occurs (URL, browser, OS).
- Note which restriction is not being removed (right-click, text selection, copy, keyboard shortcuts).
- Use the issue templates for bugs and feature requests.
- Do not report security vulnerabilities in public issues -- see [SECURITY.md](SECURITY.md).

### Development Setup

No build step required. The script is a single self-contained userscript.

1. Install Tampermonkey or Greasemonkey.
2. Load `shadow-dom-liberation.user.js` directly in the extension manager.
3. Test on target sites.

For syntax checking:
```bash
node --check shadow-dom-liberation.user.js
```

### Submitting Changes

1. Fork the repository and create a branch from `main`.
2. Make changes and test them on real sites.
3. Run `node --check shadow-dom-liberation.user.js` to confirm no syntax errors.
4. Open a pull request describing which sites/restrictions your change addresses.

### Commit Style

Use Conventional Commits: `fix:`, `feat:`, `docs:`, `refactor:`, `chore:`. Single-line, imperative, no trailing period.
