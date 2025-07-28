// Shadow DOM Liberation - Main JavaScript

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }

    lastScroll = currentScroll;
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all feature cards and demo cards
document.querySelectorAll('.feature-card, .demo-card, .step').forEach(el => {
    observer.observe(el);
});

// Demo functionality for the homepage demos
document.addEventListener('DOMContentLoaded', () => {
    // Check if userscript is installed
    const isUserscriptActive = typeof window.shadowDomLiberation !== 'undefined';

    if (isUserscriptActive) {
        // Add indicator that userscript is active
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            font-weight: 600;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        indicator.textContent = '✓ Shadow DOM Liberation Active';
        document.body.appendChild(indicator);

        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 300);
        }, 3000);
    }

    // Demo: Text selection
    const noSelectDemo = document.querySelector('.demo-content.no-select');
    if (noSelectDemo && !isUserscriptActive) {
        // Show visual feedback when trying to select
        noSelectDemo.addEventListener('mousedown', () => {
            noSelectDemo.style.background = '#fee';
            setTimeout(() => {
                noSelectDemo.style.background = '';
            }, 500);
        });
    }

    // Demo: Right-click
    const rightClickDemos = document.querySelectorAll('[oncontextmenu="return false"]');
    rightClickDemos.forEach(demo => {
        if (!isUserscriptActive) {
            demo.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                // Show toast notification
                showToast('Right-click is disabled! Install Shadow DOM Liberation to enable it.');
            });
        }
    });

    // Demo: Copy protection
    const copyDemos = document.querySelectorAll('[oncopy="return false"]');
    copyDemos.forEach(demo => {
        if (!isUserscriptActive) {
            demo.addEventListener('copy', (e) => {
                e.preventDefault();
                showToast('Copying is disabled! Install Shadow DOM Liberation to enable it.');
            });
        }
    });
});

// Toast notification function
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ef4444;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideUp 0.3s ease-out;
        max-width: 90%;
        text-align: center;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            transform: translate(-50%, 100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }

    @keyframes slideDown {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, 100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Mobile menu toggle (if needed)
function createMobileMenu() {
    const navbar = document.querySelector('.navbar .container');
    const navMenu = document.querySelector('.nav-menu');

    if (window.innerWidth <= 768 && navMenu) {
        // Create hamburger menu button
        const menuButton = document.createElement('button');
        menuButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;
        menuButton.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            color: var(--text-color);
        `;

        menuButton.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-menu-open');
        });

        // Add mobile menu styles
        const mobileStyle = document.createElement('style');
        mobileStyle.textContent = `
            @media (max-width: 768px) {
                .nav-menu {
                    position: fixed;
                    top: 60px;
                    right: -100%;
                    width: 250px;
                    height: 100vh;
                    background: white;
                    flex-direction: column;
                    padding: 2rem;
                    box-shadow: -4px 0 6px rgba(0, 0, 0, 0.1);
                    transition: right 0.3s ease;
                    display: flex !important;
                }

                .nav-menu.mobile-menu-open {
                    right: 0;
                }
            }
        `;
        document.head.appendChild(mobileStyle);

        navbar.appendChild(menuButton);
    }
}

// Initialize mobile menu on load and resize
window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', createMobileMenu);

// Copy installation link to clipboard
function copyInstallLink() {
    const installUrl = 'https://raw.githubusercontent.com/dcondrey/shadow-dom-liberation/main/shadow-dom-liberation.user.js';
    navigator.clipboard.writeText(installUrl).then(() => {
        showToast('Installation link copied to clipboard!');
    }).catch(() => {
        showToast('Failed to copy link. Please copy manually.');
    });
}

// Add copy functionality to install button if needed
document.addEventListener('DOMContentLoaded', () => {
    const installButton = document.querySelector('a[href*=".user.js"]');
    if (installButton) {
        installButton.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            copyInstallLink();
        });
    }
});