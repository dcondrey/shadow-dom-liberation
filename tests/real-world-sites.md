# Real-World Sites with Content Restrictions

This document lists real websites known to implement various content restriction techniques. Use these to test the Shadow DOM Liberation userscript in real-world scenarios.

**Note:** Website implementations may change over time. Last verified: January 2025

## News & Media Sites

### Major News Outlets
- **Medium.com**
  - Restrictions: Text selection disabled on some articles
  - Techniques: CSS user-select, JavaScript event blocking
  - Test URL: Any Medium article

- **Wall Street Journal (wsj.com)**
  - Restrictions: Copy protection on premium content
  - Techniques: Overlay protection, JavaScript event handlers
  - Test URL: Premium articles

- **Financial Times (ft.com)**
  - Restrictions: Text selection and copy disabled
  - Techniques: CSS restrictions, event capture
  - Test URL: Article pages

- **Bloomberg.com**
  - Restrictions: Copy restrictions on terminal content
  - Techniques: Multiple layers of protection
  - Test URL: Bloomberg Terminal web interface

### Regional News Sites
- **Many local newspaper websites**
  - Common restrictions: Right-click disabled, copy protection
  - Techniques: Basic JavaScript event blocking

## Academic & Educational

### Online Textbooks
- **Chegg.com**
  - Restrictions: Copy/paste disabled, right-click blocked
  - Techniques: Complex JavaScript protection, overlay elements
  - Test URL: Textbook solution pages

- **Course Hero**
  - Restrictions: Content behind blur, selection disabled
  - Techniques: CSS blur, pointer-events blocking
  - Test URL: Study documents

- **Scribd.com**
  - Restrictions: Download protection, copy disabled
  - Techniques: Canvas rendering, JavaScript protection
  - Test URL: Document viewer

### Academic Publishers
- **JSTOR.org**
  - Restrictions: Copy limitations on some content
  - Techniques: PDF viewer restrictions
  - Test URL: Article PDF viewer

- **ScienceDirect**
  - Restrictions: Text selection limits
  - Techniques: JavaScript-based protection
  - Test URL: Research article pages

## Technical Documentation

### Programming Resources
- **Some O'Reilly Online Learning pages**
  - Restrictions: Copy protection on book content
  - Techniques: Custom viewer with restrictions
  - Test URL: Online book reader

- **Safari Books Online**
  - Restrictions: Selection and copy limitations
  - Techniques: JavaScript event interception
  - Test URL: Technical book viewer

### API Documentation
- **Some enterprise API docs**
  - Restrictions: Code copying disabled
  - Techniques: CSS and JavaScript protection
  - Test examples: IBM, Oracle documentation

## Image & Photography Sites

### Stock Photo Platforms
- **Shutterstock.com**
  - Restrictions: Right-click disabled on images
  - Techniques: Overlay protection, event blocking
  - Test URL: Image search results

- **Getty Images**
  - Restrictions: Image protection, no right-click
  - Techniques: Transparent overlay, JavaScript
  - Test URL: Image galleries

- **Adobe Stock**
  - Restrictions: Download protection
  - Techniques: Multiple protection layers
  - Test URL: Image preview pages

### Photography Portfolios
- **Many photographer portfolio sites**
  - Common restrictions: Right-click disabled, drag protection
  - Techniques: JavaScript event handlers, CSS

## E-commerce Sites

### Product Catalogs
- **Some luxury brand websites**
  - Restrictions: Image protection
  - Techniques: Overlay elements, event blocking
  - Examples: High-end fashion brands

- **Art marketplace sites**
  - Restrictions: Artwork image protection
  - Techniques: Watermarks, right-click blocking
  - Examples: Saatchi Art, Artsy

## Forums & Communities

### Question-Answer Sites
- **Some Stack Overflow clones**
  - Restrictions: Copy protection on answers
  - Techniques: CSS user-select, JavaScript
  - Test: Enterprise Q&A platforms

- **Quora (certain answers)**
  - Restrictions: Login wall, copy restrictions
  - Techniques: Blur overlay, event blocking
  - Test URL: Popular answer pages

## Legal & Professional

### Legal Databases
- **Westlaw**
  - Restrictions: Copy limitations
  - Techniques: Complex JavaScript protection
  - Test URL: Case law documents

- **LexisNexis**
  - Restrictions: Print and copy protection
  - Techniques: Multiple protection layers
  - Test URL: Legal research documents

## Testing Methodology

### How to Test These Sites

1. **Install the userscript** in your browser
2. **Navigate to the site** and find restricted content
3. **Attempt the following operations:**
   - Right-click on text/images
   - Select and copy text
   - Drag images
   - Use keyboard shortcuts (Ctrl+C, etc.)
   - Save images via context menu

4. **Document results:**
   - Which restrictions were bypassed
   - Which restrictions remain
   - Any errors in console
   - Performance impact

### Quick Test Checklist

- [ ] Text selection works
- [ ] Right-click context menu appears
- [ ] Copy/paste functions normally
- [ ] Images can be saved
- [ ] Drag operations work
- [ ] Keyboard shortcuts function
- [ ] No console errors
- [ ] Page performance acceptable

## Ethical Considerations

**Important:** Only test on content you have legal access to. Respect copyright and terms of service. This tool is for accessibility and fair use purposes only.

## Reporting New Sites

Found a site with restrictions? Please report it with:
1. Site URL
2. Type of restrictions
3. Page where restrictions appear
4. Suspected protection technique

## Known Limitations

Some sites may use:
- Server-side rendering (canvas/images)
- WASM-based protection
- Continuous obfuscation updates
- Legal DMCA protection

These advanced techniques may require specific handling.