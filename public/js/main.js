// API Base URL
const API_URL = window.location.origin;

// Load services on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadServices();
    await loadPricing();
    setupFormHandlers();
});

// Load and display services
async function loadServices() {
    try {
        const response = await fetch(`${API_URL}/api/services`);
        const services = await response.json();
        
        const servicesGrid = document.getElementById('services-grid');
        const serviceSelect = document.getElementById('service');
        
        servicesGrid.innerHTML = '';
        serviceSelect.innerHTML = '<option value="">Select a service</option>';
        
        services.forEach(service => {
            // Create service card
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <div class="service-icon">${service.icon || '🎯'}</div>
                <h3>${service.name}</h3>
                <p>${service.description}</p>
            `;
            servicesGrid.appendChild(card);
            
            // Add to select dropdown
            const option = document.createElement('option');
            option.value = service.name;
            option.textContent = service.name;
            serviceSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading services:', error);
        document.getElementById('services-grid').innerHTML = 
            '<p>Unable to load services. Please try again later.</p>';
    }
}

// Load and display pricing
async function loadPricing() {
    try {
        const response = await fetch(`${API_URL}/api/pricing`);
        const pricingPlans = await response.json();
        
        const pricingGrid = document.getElementById('pricing-grid');
        pricingGrid.innerHTML = '';
        
        pricingPlans.forEach(plan => {
            const card = document.createElement('div');
            card.className = `pricing-card ${plan.featured ? 'featured' : ''}`;
            
            const features = plan.features.map(f => `<li>✓ ${f}</li>`).join('');
            
            card.innerHTML = `
                <h3>${plan.name}</h3>
                <div class="price">
                    $${plan.price}
                    <span class="price-period">${plan.period || '/project'}</span>
                </div>
                <ul class="pricing-features">
                    ${features}
                </ul>
                <a href="#booking" class="btn btn-primary">Get Started</a>
            `;
            pricingGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading pricing:', error);
        document.getElementById('pricing-grid').innerHTML = 
            '<p>Unable to load pricing. Please try again later.</p>';
    }
}

// Setup form handlers
function setupFormHandlers() {
    // Booking form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// Handle booking form submission
async function handleBookingSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
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
        
        const messageDiv = document.getElementById('booking-message');
        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = 'Booking submitted successfully! We will contact you soon.';
            e.target.reset();
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = result.error || 'Failed to submit booking. Please try again.';
        }
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    } catch (error) {
        console.error('Error submitting booking:', error);
        const messageDiv = document.getElementById('booking-message');
        messageDiv.className = 'message error';
        messageDiv.textContent = 'An error occurred. Please try again later.';
    }
}

// Handle contact form submission
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
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
        
        const messageDiv = document.getElementById('contact-message');
        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = 'Message sent successfully! We will get back to you soon.';
            e.target.reset();
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = result.error || 'Failed to send message. Please try again.';
        }
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    } catch (error) {
        console.error('Error submitting query:', error);
        const messageDiv = document.getElementById('contact-message');
        messageDiv.className = 'message error';
        messageDiv.textContent = 'An error occurred. Please try again later.';
    }
}

// Smooth scrolling for navigation links
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
