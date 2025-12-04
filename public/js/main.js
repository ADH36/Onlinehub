// ============================================
// ONLINE HUB - Main JavaScript
// ============================================

// API Base URL
const API_URL = window.location.origin;

// ============================================
// Preloader
// ============================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500);
    }
});

// ============================================
// DOM Content Loaded
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCounterAnimation();
    await loadServices();
    await loadPricing();
    setupFormHandlers();
    initSmoothScroll();
});

// ============================================
// Navbar Scroll Effect
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================
// Mobile Menu
// ============================================
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve to allow re-animation if needed
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in, .stagger-animation');
    animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// Counter Animation
// ============================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, stepTime);
}

// ============================================
// Smooth Scrolling
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Load Services
// ============================================
async function loadServices() {
    try {
        const response = await fetch(`${API_URL}/api/services`);
        const services = await response.json();
        
        const servicesGrid = document.getElementById('services-grid');
        const serviceSelect = document.getElementById('service');
        
        if (servicesGrid) {
            servicesGrid.innerHTML = '';
            services.forEach(service => {
                const card = document.createElement('div');
                card.className = 'service-card';
                card.innerHTML = `
                    <div class="service-icon">${service.icon || '🎯'}</div>
                    <h3>${service.name}</h3>
                    <p>${service.description}</p>
                    <a href="#booking" class="service-link">Get Started →</a>
                `;
                servicesGrid.appendChild(card);
            });
        }
        
        if (serviceSelect) {
            serviceSelect.innerHTML = '<option value="">Select a service</option>';
            services.forEach(service => {
                const option = document.createElement('option');
                option.value = service.name;
                option.textContent = service.name;
                serviceSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading services:', error);
        const servicesGrid = document.getElementById('services-grid');
        if (servicesGrid) {
            servicesGrid.innerHTML = '<p class="error-message">Unable to load services. Please try again later.</p>';
        }
    }
}

// ============================================
// Load Pricing
// ============================================
async function loadPricing() {
    try {
        const response = await fetch(`${API_URL}/api/pricing`);
        const pricingPlans = await response.json();
        
        const pricingGrid = document.getElementById('pricing-grid');
        if (!pricingGrid) return;

        pricingGrid.innerHTML = '';
        
        pricingPlans.forEach(plan => {
            const card = document.createElement('div');
            card.className = `pricing-card ${plan.featured ? 'featured' : ''}`;
            
            const features = plan.features.map(f => `<li>${f}</li>`).join('');
            
            card.innerHTML = `
                ${plan.featured ? '<div class="pricing-badge">Popular</div>' : ''}
                <h3>${plan.name}</h3>
                <p class="pricing-description">${plan.description || ''}</p>
                <div class="price">
                    <span class="price-currency">₹</span>
                    ${plan.price.toLocaleString('en-IN')}
                    <span class="price-period">${plan.period || '/project'}</span>
                </div>
                <ul class="pricing-features">
                    ${features}
                </ul>
                <button class="btn btn-primary btn-block" onclick="initiatePayment('${plan.id}', '${plan.name}', ${plan.price})">
                    Get Started
                </button>
            `;
            pricingGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading pricing:', error);
        const pricingGrid = document.getElementById('pricing-grid');
        if (pricingGrid) {
            pricingGrid.innerHTML = '<p class="error-message">Unable to load pricing. Please try again later.</p>';
        }
    }
}

// ============================================
// Razorpay Payment Integration
// ============================================
async function initiatePayment(planId, planName, amount) {
    try {
        // Create order on server
        const response = await fetch(`${API_URL}/api/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                planId,
                planName,
                amount: amount * 100 // Convert to paise
            })
        });

        const orderData = await response.json();

        if (!response.ok) {
            throw new Error(orderData.error || 'Failed to create order');
        }

        // Configure Razorpay options
        const options = {
            key: orderData.key_id,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'ONLINE HUB',
            description: `Payment for ${planName}`,
            order_id: orderData.order_id,
            handler: async function(response) {
                // Verify payment on server
                try {
                    const verifyResponse = await fetch(`${API_URL}/api/verify-payment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId,
                            planName,
                            amount
                        })
                    });

                    const verifyData = await verifyResponse.json();

                    if (verifyData.success) {
                        showToast('success', 'Payment Successful', 'Thank you for your payment. We will contact you shortly.');
                    } else {
                        showToast('error', 'Payment Verification Failed', 'Please contact support if amount was deducted.');
                    }
                } catch (error) {
                    console.error('Payment verification error:', error);
                    showToast('error', 'Error', 'Payment verification failed. Please contact support.');
                }
            },
            prefill: {
                name: '',
                email: '',
                contact: ''
            },
            theme: {
                color: '#1e3a5f'
            },
            modal: {
                ondismiss: function() {
                    showToast('info', 'Payment Cancelled', 'You cancelled the payment.');
                }
            }
        };

        const razorpay = new Razorpay(options);
        razorpay.open();

    } catch (error) {
        console.error('Payment initiation error:', error);
        showToast('error', 'Payment Error', error.message || 'Unable to initiate payment. Please try again.');
    }
}

// ============================================
// Toast Notifications
// ============================================
function showToast(type, title, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || 'ℹ'}</span>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// ============================================
// Form Handlers
// ============================================
function setupFormHandlers() {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// ============================================
// Booking Form Submission
// ============================================
async function handleBookingSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const bookingData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        bookingType: formData.get('bookingType'),
        preferredDate: formData.get('preferredDate'),
        message: formData.get('message'),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_URL}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showToast('success', 'Booking Submitted', 'We will contact you soon to confirm your booking.');
            form.reset();
        } else {
            showToast('error', 'Submission Failed', result.error || 'Failed to submit booking. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting booking:', error);
        showToast('error', 'Error', 'An error occurred. Please try again later.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// ============================================
// Contact Form Submission
// ============================================
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_URL}/api/queries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showToast('success', 'Message Sent', 'We will get back to you soon!');
            form.reset();
        } else {
            showToast('error', 'Send Failed', result.error || 'Failed to send message. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting query:', error);
        showToast('error', 'Error', 'An error occurred. Please try again later.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// ============================================
// Add CSS for toast slide out animation
// ============================================
// Add CSS for toast slide out animation
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes toastSlideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
