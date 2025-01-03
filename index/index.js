// DNS data
const dnsData = {
    fr: {
        ipv4: ["185.94.189.0/24",
            "185.104.185.0/24",
            "185.156.173.0/24",
            "185.128.25.0/24",
            "37.120.136.0/24",
            "37.120.158.0/24",
            "93.177.75.0/24",
            "139.28.219.0/24",
            "45.83.90.0/24",
            "45.89.174.0/24",
            "45.152.181.0/24",
            "37.120.204.0/24",
            "217.138.207.0/24",
            "84.247.51.0/24",
            "146.70.18.0/24",
            "193.29.104.0/24",
            "188.241.83.0/24",
            "146.70.68.0/24",
            "89.40.183.0/24",
            "62.115.249.0/29"],
        ipv6: ["2001:ac8:25::/48",
            "2001:ac8:4d::/48",
            "2001:ac8:7b::/48",
            "2001:ac8:7a::/48"]
    },
    nl: {
        ipv4: [
            "51.15.0.0/17",
            "51.158.128.0/17",
            "188.72.192.0/18",
            "188.88.0.0/14",
            "188.92.56.0/21",
            "188.92.152.0/21",
            "188.93.68.0/22",
            "188.93.116.0/24",
            "188.94.184.0/22",
            "188.95.48.0/21",
            "188.95.96.0/21",
            "188.95.136.0/21",
            "188.95.168.0/21",
            "188.116.45.0/24",
            "188.120.32.0/20",
            "188.122.64.0/19",
            "188.126.96.0/19",
            "188.142.0.0/17",
            "188.164.248.0/21",
            "188.190.112.0/24",
            "188.190.113.0/24",
            "188.190.114.0/23",
            "188.191.48.0/22",
            "188.200.0.0/13"
        ],
        ipv6: [
            "2001:67c:7c::/48",
            "2001:67c:b0::/48",
            "2001:67c:e0::/48",
            "2001:67c:f0::/48",
            "2001:67c:10c::/48",
            "2001:67c:114::/48",
            "2001:67c:144::/48",
            "2001:67c:1a4::/48",
            "2001:67c:1a8::/48",
            "2001:67c:1d4::/48",
            "2001:67c:1e8::/48"
        ]
    },
    UK: {
        ipv4: ["89.238.128.0/18",
            "217.64.112.0/20",
            "77.243.176.0/20",
            "89.249.64.0/20",
            "217.151.96.0/20",
            "83.143.240.0/21",
            "176.10.80.0/21",
            "84.39.112.0/21",
            "185.94.184.0/21",
            "91.102.64.0/21",
            "194.187.248.0/22",
            "195.242.212.0/22",
            "194.79.28.0/22",
            "195.12.48.0/22",
            "185.93.180.0/22",
            "185.9.16.0/22",
            "185.104.184.0/22",
            "81.92.200.0/22",
            "81.92.204.0/22",
            "45.146.144.0/22",
            "185.189.114.0/23"],
        ipv6: ["2a01:300::/29",
            "2a02:40::/32",
            "2001:ac8::/32",
            "2a03:34c0::/32",
            "2a01:300:999::/48",
            "2001:978:2305::/48",
            "2001:ac8:31::/48",
            "2001:ac8:21::/48",
            "2001:ac8:48::/48",
            "2001:ac8:49::/48",
            "2001:ac8:8a::/48",
            "2a04:9dc0:2::/48",
            "2a0d:5600:20::/48"]
    }
};

// تابع تبدیل IP به عدد
function ipToLong(ip) {
    return ip.split('.')
        .reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}

// تابع تبدیل عدد به IP
function longToIP(long) {
    return [
        (long >>> 24) & 0xFF,
        (long >>> 16) & 0xFF,
        (long >>> 8) & 0xFF,
        long & 0xFF
    ].join('.');
}

// تابع تولید IP تصادفی از CIDR
function generateRandomIPFromCIDR(cidr) {
    const [ip, bits] = cidr.split('/');
    const ipLong = ipToLong(ip);
    const mask = ~((1 << (32 - bits)) - 1);
    const networkAddr = ipLong & mask;
    const broadcastAddr = networkAddr | ~mask;
    const randomLong = networkAddr + Math.floor(Math.random() * (broadcastAddr - networkAddr));
    return longToIP(randomLong);
}

// تابع تولید IPv6 تصادفی از CIDR
function generateRandomIPv6FromCIDR(cidr) {
    const [prefix, bits] = cidr.split('/');
    const segments = prefix.split(':');
    let result = [];
    
    for (let i = 0; i < 8; i++) {
        if (i < segments.length && segments[i]) {
            result.push(segments[i]);
        } else {
            result.push(Math.floor(Math.random() * 65536).toString(16).padStart(4, '0'));
        }
    }
    
    return result.join(':');
}

// Theme toggle functionality
const themeSwitch = document.getElementById('theme-switch');
const body = document.body;

themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
    updateThemeColors();
});

// تابع به‌روزرسانی رنگ‌ها بر اساس تم
function updateThemeColors() {
    const backgroundColor = themeSwitch.checked ? 'rgba(90, 24, 154, 0.1)' : 'rgba(90, 24, 154, 0.05)';
    document.querySelectorAll('.card, .dns-section').forEach(el => {
        el.style.backgroundColor = backgroundColor;
    });
}

// بارگذاری تم ذخیره شده
const savedTheme = localStorage.getItem('theme') || 'dark';
themeSwitch.checked = savedTheme === 'dark';
body.setAttribute('data-theme', savedTheme);
updateThemeColors();

// DNS functionality
const countrySelect = document.getElementById('country-select');
const ipv4Fields = [document.getElementById('ipv4-1'), document.getElementById('ipv4-2')];
const ipv6Fields = [document.getElementById('ipv6-1'), document.getElementById('ipv6-2')];

countrySelect.addEventListener('change', () => {
    const country = countrySelect.value;
    if (country && dnsData[country]) {
        const dnsResults = document.getElementById('dns-results');
        dnsResults.classList.add('animate__animated', 'animate__fadeIn');
        
        if (country === 'de') {
            const randomIPv4Ranges = dnsData.de.ipv4
                .sort(() => Math.random() - 0.5)
                .slice(0, 2);
            const randomIPv6Ranges = dnsData.de.ipv6
                .sort(() => Math.random() - 0.5)
                .slice(0, 2);

            ipv4Fields[0].value = generateRandomIPFromCIDR(randomIPv4Ranges[0]);
            ipv4Fields[1].value = generateRandomIPFromCIDR(randomIPv4Ranges[1]);
            ipv6Fields[0].value = generateRandomIPv6FromCIDR(randomIPv6Ranges[0]);
            ipv6Fields[1].value = generateRandomIPv6FromCIDR(randomIPv6Ranges[1]);
        } else {
            ipv4Fields[0].value = dnsData[country].ipv4[0];
            ipv4Fields[1].value = dnsData[country].ipv4[1];
            ipv6Fields[0].value = dnsData[country].ipv6[0];
            ipv6Fields[1].value = dnsData[country].ipv6[1];
        }
        
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

// تابع تشخیص IP
async function detectIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error detecting IP:', error);
        return 'Unknown';
    }
}

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

// Hide loading screen
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
});

// جلوگیری از باز کردن DevTools (نمایشی)
(function() {
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });

    document.onkeydown = function(event) {
        if (event.keyCode === 123 || (event.ctrlKey && event.shiftKey && event.keyCode === 73)) {
            event.preventDefault();
        }
    };
})();
