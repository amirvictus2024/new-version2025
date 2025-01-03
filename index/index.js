// DNS data
const dnsData = {
    ir: {
        ipv4: ['1.1.1.1', '8.8.8.8'],
        ipv6: ['2001:4860:4860::8888', '2001:4860:4860::8844']
    },
    tr: {
        ipv4: ['208.67.222.222', '208.67.220.220'],
        ipv6: ['2620:119:35::35', '2620:119:53::53']
    },
    de: {
        ipv4: ['9.9.9.9', '149.112.112.112'],
        ipv6: ['2620:fe::fe', '2620:fe::9']
    }
};

// Theme toggle functionality
const themeSwitch = document.getElementById('theme-switch');
const body = document.body;

themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        document.querySelectorAll('.card, .dns-section').forEach(el => {
            el.style.backgroundColor = 'rgba(90, 24, 154, 0.1)';
        });
    } else {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        document.querySelectorAll('.card, .dns-section').forEach(el => {
            el.style.backgroundColor = 'rgba(90, 24, 154, 0.05)';
        });
    }
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
themeSwitch.checked = savedTheme === 'dark';
body.setAttribute('data-theme', savedTheme);

// DNS functionality
const countrySelect = document.getElementById('country-select');
const ipv4Fields = [document.getElementById('ipv4-1'), document.getElementById('ipv4-2')];
const ipv6Fields = [document.getElementById('ipv6-1'), document.getElementById('ipv6-2')];

countrySelect.addEventListener('change', () => {
    const country = countrySelect.value;
    if (country && dnsData[country]) {
        // Add animation class to DNS results
        const dnsResults = document.getElementById('dns-results');
        dnsResults.classList.add('animate__animated', 'animate__fadeIn');
        
        // Update DNS values
        ipv4Fields[0].value = dnsData[country].ipv4[0];
        ipv4Fields[1].value = dnsData[country].ipv4[1];
        ipv6Fields[0].value = dnsData[country].ipv6[0];
        ipv6Fields[1].value = dnsData[country].ipv6[1];
        
        // Remove animation class after animation completes
        setTimeout(() => {
            dnsResults.classList.remove('animate__animated', 'animate__fadeIn');
        }, 1000);
    } else {
        ipv4Fields.forEach(field => field.value = '');
        ipv6Fields.forEach(field => field.value = '');
    }
});

// Copy functionality with animation
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    document.execCommand('copy');
    
    // Visual feedback with animation
    const button = element.nextElementSibling;
    button.classList.add('animate__animated', 'animate__bounce');
    const originalIcon = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    
    setTimeout(() => {
        button.innerHTML = originalIcon;
        button.classList.remove('animate__animated', 'animate__bounce');
    }, 1000);
}

// Initialize IP detection on page load
document.addEventListener('DOMContentLoaded', async () => {
    const ipLink = document.querySelector('a[href="#"].nav-link');
    if (ipLink) {
        const ip = await detectIP();
        ipLink.textContent = `IP: ${ip}`;
    }
});

// Add hover animations for cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.classList.add('animate__animated', 'animate__pulse');
    });
    
    card.addEventListener('mouseleave', () => {
        card.classList.remove('animate__animated', 'animate__pulse');
    });
});

// Add smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and DNS section
document.querySelectorAll('.card, .dns-section').forEach(el => {
    observer.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
});

// جلوگیری از باز کردن DevTools
(function() {
    var preventDevTools = function() {
        Object.defineProperty(window, 'devtools', {
            get: function() { return true; },
            set: function() { return true; }
        });
    };

    preventDevTools();

    // جلوگیری از راست کلیک
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });

    // جلوگیری از استفاده از F12 و Ctrl+Shift+I
    document.onkeydown = function(event) {
        if (event.keyCode === 123 || (event.ctrlKey && event.shiftKey && event.keyCode === 73)) {
            event.preventDefault();
        }
    };
})();
