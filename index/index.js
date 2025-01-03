// DNS data
const dnsData = {
    fr: {
        ipv4: ["185.94.189.0/24", "185.104.185.0/24", "146.70.68.0/24", "89.40.183.0/24", "62.115.249.0/29"],
        ipv6: ["2001:ac8:25::/48", "2001:ac8:4d::/48", "2001:ac8:7b::/48", "2001:ac8:7a::/48"]
    },
    nl: {
        ipv4: ["51.15.0.0/17", "51.158.128.0/17", "188.191.48.0/22", "188.200.0.0/13"],
        ipv6: ["2001:67c:7c::/48", "2001:67c:b0::/48", "2001:67c:1e8::/48"]
    },
    uk: {
        ipv4: ["89.238.128.0/18", "217.64.112.0/20", "45.146.144.0/22", "185.189.114.0/23"],
        ipv6: ["2a01:300::/29", "2a02:40::/32", "2a04:9dc0:2::/48", "2a0d:5600:20::/48"]
    }
};

// Convert IP to number
function ipToLong(ip) {
    return ip.split('.')
        .reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}

// Convert number to IP
function longToIP(long) {
    return [
        (long >>> 24) & 0xFF,
        (long >>> 16) & 0xFF,
        (long >>> 8) & 0xFF,
        long & 0xFF
    ].join('.');
}

// Generate random IP from CIDR
function generateRandomIPFromCIDR(cidr) {
    const [ip, bits] = cidr.split('/');
    const ipLong = ipToLong(ip);
    const mask = ~((1 << (32 - bits)) - 1);
    const networkAddr = ipLong & mask;
    const broadcastAddr = networkAddr | ~mask;
    const randomLong = networkAddr + Math.floor(Math.random() * (broadcastAddr - networkAddr));
    return longToIP(randomLong);
}

// Generate random IPv6 from CIDR
function generateRandomIPv6FromCIDR(cidr) {
    const [prefix, bits] = cidr.split('/');
    const prefixSegments = prefix.split(':');
    const segmentCount = Math.ceil(bits / 16);
    let result = prefixSegments.slice(0, segmentCount);

    // Fill the rest of the segments with random values within the range of CIDR
    while (result.length < 8) {
        result.push(Math.floor(Math.random() * 65536).toString(16));
    }

    return result.join(':');
}

// Theme toggle functionality
const themeSwitch = document.getElementById('theme-switch');
const body = document.body;

themeSwitch.addEventListener('change', () => {
    const theme = themeSwitch.checked ? 'dark' : 'light';
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeColors();
});

// Update theme colors
function updateThemeColors() {
    const backgroundColor = themeSwitch.checked ? 'rgba(90, 24, 154, 0.1)' : 'rgba(90, 24, 154, 0.05)';
    document.querySelectorAll('.card, .dns-section').forEach(el => {
        el.style.backgroundColor = backgroundColor;
    });
}

// Load saved theme
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
        ipv4Fields.forEach(field => field.value = '');
        ipv6Fields.forEach(field => field.value = '');
    }
});

// Copy functionality with animation
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    navigator.clipboard.writeText(element.value).then(() => {
        const button = element.nextElementSibling;
        button.classList.add('animate__animated', 'animate__bounce');
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';

        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.classList.remove('animate__animated', 'animate__bounce');
        }, 1000);
    });
}

// Handle DNS Generator Button
document.getElementById("generate-dns").addEventListener("click", () => {
    const country = countrySelect.value;
    if (country && dnsData[country]) {
        const randomIPv4Ranges = dnsData[country].ipv4.sort(() => Math.random() - 0.5).slice(0, 2);
        const randomIPv6Ranges = dnsData[country].ipv6.sort(() => Math.random() - 0.5).slice(0, 2);

        ipv4Fields[0].value = generateRandomIPFromCIDR(randomIPv4Ranges[0]);
        ipv4Fields[1].value = generateRandomIPFromCIDR(randomIPv4Ranges[1]);
        ipv6Fields[0].value = generateRandomIPv6FromCIDR(randomIPv6Ranges[0]);
        ipv6Fields[1].value = generateRandomIPv6FromCIDR(randomIPv6Ranges[1]);
    }
});

// Hide loading screen after page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
});

// Prevent opening DevTools (optional)
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
