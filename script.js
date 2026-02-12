// Currency Conversion Calculator
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const amountInput = document.getElementById('amount');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const swapBtn = document.getElementById('swap-currencies');
    const calculateBtn = document.getElementById('calculate-btn');
    const exchangeRateDisplay = document.getElementById('exchange-rate-display');
    const resultContainer = document.getElementById('result-container');
    const resultValue = document.getElementById('result-value');
    const conversionFee = document.getElementById('conversion-fee');
    const contactForm = document.getElementById('contact-form');
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Exchange rates (simulated - in production, fetch from API)
    const exchangeRates = {
        'USD_KES': 128.50,
        'KES_USD': 0.00778
    };

    const conversionFeePercent = 2;

    // Initialize
    updateExchangeRate();

    // Event Listeners
    calculateBtn.addEventListener('click', calculateConversion);
    swapBtn.addEventListener('click', swapCurrencies);
    amountInput.addEventListener('input', clearResult);
    
    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });

    // Functions
    function updateExchangeRate() {
        const from = fromCurrency.value;
        const to = toCurrency.value;
        const rateKey = `${from}_${to}`;
        const rate = exchangeRates[rateKey] || 1;
        exchangeRateDisplay.textContent = `1 ${from} = ${rate.toFixed(2)} ${to}`;
    }

    function calculateConversion() {
        const amount = parseFloat(amountInput.value);
        
        if (isNaN(amount) || amount <= 0) {
            showError('Please enter a valid amount');
            return;
        }

        const from = fromCurrency.value;
        const to = toCurrency.value;
        const rateKey = `${from}_${to}`;
        const rate = exchangeRates[rateKey] || 1;

        const convertedAmount = amount * rate;
        const fee = (convertedAmount * conversionFeePercent) / 100;
        const finalAmount = convertedAmount - fee;

        displayResult(finalAmount, fee);
    }

    function displayResult(amount, fee) {
        const from = fromCurrency.value;
        const to = toCurrency.value;
        
        resultValue.textContent = `${formatNumber(amount.toFixed(2))} ${to}`;
        conversionFee.textContent = `Fee: ${formatNumber(fee.toFixed(2))} ${to}`;
        
        resultContainer.classList.add('show');
    }

    function clearResult() {
        resultContainer.classList.remove('show');
    }

    function swapCurrencies() {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
        
        updateExchangeRate();
        clearResult();
        
        // Animate swap
        swapBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            swapBtn.style.transform = 'rotate(0)';
        }, 300);
    }

    function showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #FF4E6A;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(255, 78, 106, 0.3);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                errorDiv.remove();
            }, 300);
        }, 3000);
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Message sent successfully! We\'ll get back to you soon.');
            e.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #10B981;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '10px 0';
        } else {
            navbar.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
            navbar.style.padding = '15px 0';
        }
    }

    function toggleMobileMenu() {
        navLinks.classList.toggle('mobile-open');
        mobileMenuBtn.textContent = navLinks.classList.contains('mobile-open') ? '✕' : '☰';
    }

    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu if open
        if (navLinks.classList.contains('mobile-open')) {
            navLinks.classList.remove('mobile-open');
            mobileMenuBtn.textContent = '☰';
        }
    }

    function formatNumber(num) {
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and steps
    document.querySelectorAll('.feature-card, .step, .bank-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100px);
                opacity: 0;
            }
        }
        
        .nav-links.mobile-open {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            gap: 20px;
        }
        
        @media (min-width: 769px) {
            .nav-links.mobile-open {
                display: flex;
            }
        }
    `;
    document.head.appendChild(style);

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const hasPlus = text.includes('+');
                const hasPercent = text.includes('%');
                const hasSlash = text.includes('/');
                
                let finalValue;
                if (hasPlus) {
                    finalValue = parseInt(text.replace(/[^0-9]/g, ''));
                    animateCounter(target, 0, finalValue, 2000, '', '+');
                } else if (hasPercent) {
                    finalValue = parseFloat(text.replace(/[^0-9.]/g, ''));
                    animateCounter(target, 0, finalValue, 2000, '', '%');
                } else if (hasSlash) {
                    finalValue = text;
                    // Skip animation for 24/7
                }
                
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    function animateCounter(element, start, end, duration, prefix = '', suffix = '') {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);
            
            element.textContent = prefix + current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = prefix + end + suffix;
            }
        }
        
        requestAnimationFrame(update);
    }
});
