// API Base URL
const API_URL = window.location.origin;

// Authentication state
let isAuthenticated = false;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    setupLoginHandler();
    setupTabNavigation();
    setupModalHandlers();
    setupLogoutHandler();
});

// Login Handler
function setupLoginHandler() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(`${API_URL}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const result = await response.json();
            const messageDiv = document.getElementById('login-message');
            
            if (response.ok) {
                isAuthenticated = true;
                sessionStorage.setItem('adminAuth', 'true');
                showDashboard();
            } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = result.error || 'Invalid credentials';
            }
        } catch (error) {
            console.error('Login error:', error);
            const messageDiv = document.getElementById('login-message');
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Login failed. Please try again.';
        }
    });
}

// Show Dashboard
function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    loadAllData();
}

// Logout Handler
function setupLogoutHandler() {
    document.getElementById('logout-btn').addEventListener('click', () => {
        isAuthenticated = false;
        sessionStorage.removeItem('adminAuth');
        document.getElementById('admin-dashboard').style.display = 'none';
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('login-form').reset();
    });
}

// Tab Navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Modal Handlers
function setupModalHandlers() {
    // Service modal
    document.getElementById('add-service-btn').addEventListener('click', () => {
        openServiceModal();
    });
    
    document.getElementById('service-form').addEventListener('submit', handleServiceSubmit);
    
    // Pricing modal
    document.getElementById('add-pricing-btn').addEventListener('click', () => {
        openPricingModal();
    });
    
    document.getElementById('pricing-form').addEventListener('submit', handlePricingSubmit);
    
    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

// Load all data
async function loadAllData() {
    await loadServices();
    await loadPricing();
    await loadBookings();
    await loadQueries();
}

// Load Services
async function loadServices() {
    try {
        const response = await fetch(`${API_URL}/api/services`);
        const services = await response.json();
        
        const servicesList = document.getElementById('services-list');
        servicesList.innerHTML = '';
        
        services.forEach(service => {
            const item = document.createElement('div');
            item.className = 'data-item';
            item.innerHTML = `
                <div class="data-item-header">
                    <div>
                        <div class="data-item-title">${service.icon || '🎯'} ${service.name}</div>
                    </div>
                    <div class="data-item-actions">
                        <button class="btn btn-small btn-primary" onclick="editService('${service.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="deleteService('${service.id}')">Delete</button>
                    </div>
                </div>
                <div class="data-item-content">
                    <p>${service.description}</p>
                </div>
            `;
            servicesList.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// Load Pricing
async function loadPricing() {
    try {
        const response = await fetch(`${API_URL}/api/pricing`);
        const pricing = await response.json();
        
        const pricingList = document.getElementById('pricing-list');
        pricingList.innerHTML = '';
        
        pricing.forEach(plan => {
            const item = document.createElement('div');
            item.className = 'data-item';
            const features = plan.features.join(', ');
            const featuredBadge = plan.featured ? '<span class="status-badge completed">Featured</span>' : '';
            
            item.innerHTML = `
                <div class="data-item-header">
                    <div>
                        <div class="data-item-title">${plan.name} ${featuredBadge}</div>
                    </div>
                    <div class="data-item-actions">
                        <button class="btn btn-small btn-primary" onclick="editPricing('${plan.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="deletePricing('${plan.id}')">Delete</button>
                    </div>
                </div>
                <div class="data-item-content">
                    <p><strong>Price:</strong> $${plan.price} ${plan.period || '/project'}</p>
                    <p><strong>Features:</strong> ${features}</p>
                </div>
            `;
            pricingList.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading pricing:', error);
    }
}

// Load Bookings
async function loadBookings() {
    try {
        const response = await fetch(`${API_URL}/api/bookings`);
        const bookings = await response.json();
        
        const bookingsList = document.getElementById('bookings-list');
        bookingsList.innerHTML = '';
        
        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p>No bookings yet.</p>';
            return;
        }
        
        bookings.forEach(booking => {
            const item = document.createElement('div');
            item.className = 'data-item';
            item.innerHTML = `
                <div class="data-item-header">
                    <div>
                        <div class="data-item-title">${booking.name} - ${booking.service}</div>
                        <span class="status-badge ${booking.status}">${booking.status}</span>
                    </div>
                    <div class="data-item-actions">
                        <button class="btn btn-small btn-success" onclick="updateBookingStatus('${booking.id}', 'completed')">Complete</button>
                        <button class="btn btn-small btn-danger" onclick="deleteBooking('${booking.id}')">Delete</button>
                    </div>
                </div>
                <div class="data-item-content">
                    <p><strong>Email:</strong> ${booking.email}</p>
                    <p><strong>Phone:</strong> ${booking.phone}</p>
                    <p><strong>Type:</strong> ${booking.bookingType}</p>
                    <p><strong>Date:</strong> ${booking.preferredDate || 'Not specified'}</p>
                    <p><strong>Message:</strong> ${booking.message || 'No message'}</p>
                    <p><strong>Created:</strong> ${new Date(booking.createdAt).toLocaleString()}</p>
                </div>
            `;
            bookingsList.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

// Load Queries
async function loadQueries() {
    try {
        const response = await fetch(`${API_URL}/api/queries`);
        const queries = await response.json();
        
        const queriesList = document.getElementById('queries-list');
        queriesList.innerHTML = '';
        
        if (queries.length === 0) {
            queriesList.innerHTML = '<p>No queries yet.</p>';
            return;
        }
        
        queries.forEach(query => {
            const item = document.createElement('div');
            item.className = 'data-item';
            item.innerHTML = `
                <div class="data-item-header">
                    <div>
                        <div class="data-item-title">${query.name} - ${query.subject}</div>
                        <span class="status-badge ${query.status}">${query.status}</span>
                    </div>
                    <div class="data-item-actions">
                        <button class="btn btn-small btn-success" onclick="updateQueryStatus('${query.id}', 'completed')">Complete</button>
                        <button class="btn btn-small btn-danger" onclick="deleteQuery('${query.id}')">Delete</button>
                    </div>
                </div>
                <div class="data-item-content">
                    <p><strong>Email:</strong> ${query.email}</p>
                    <p><strong>Message:</strong> ${query.message}</p>
                    <p><strong>Created:</strong> ${new Date(query.createdAt).toLocaleString()}</p>
                </div>
            `;
            queriesList.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading queries:', error);
    }
}

// Service Modal Functions
function openServiceModal(service = null) {
    const modal = document.getElementById('service-modal');
    const form = document.getElementById('service-form');
    
    if (service) {
        document.getElementById('service-modal-title').textContent = 'Edit Service';
        document.getElementById('service-id').value = service.id;
        document.getElementById('service-name').value = service.name;
        document.getElementById('service-description').value = service.description;
        document.getElementById('service-icon').value = service.icon || '';
    } else {
        document.getElementById('service-modal-title').textContent = 'Add Service';
        form.reset();
        document.getElementById('service-id').value = '';
    }
    
    modal.classList.add('active');
}

async function editService(id) {
    const response = await fetch(`${API_URL}/api/services`);
    const services = await response.json();
    const service = services.find(s => s.id === id);
    if (service) {
        openServiceModal(service);
    }
}

async function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/services/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadServices();
        }
    } catch (error) {
        console.error('Error deleting service:', error);
    }
}

async function handleServiceSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const serviceData = {
        id: formData.get('id') || Date.now().toString(),
        name: formData.get('name'),
        description: formData.get('description'),
        icon: formData.get('icon') || '🎯'
    };
    
    try {
        const url = serviceData.id && formData.get('id') ? 
            `${API_URL}/api/services/${serviceData.id}` : 
            `${API_URL}/api/services`;
        
        const method = serviceData.id && formData.get('id') ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serviceData)
        });
        
        if (response.ok) {
            closeAllModals();
            await loadServices();
        }
    } catch (error) {
        console.error('Error saving service:', error);
    }
}

// Pricing Modal Functions
function openPricingModal(plan = null) {
    const modal = document.getElementById('pricing-modal');
    const form = document.getElementById('pricing-form');
    
    if (plan) {
        document.getElementById('pricing-modal-title').textContent = 'Edit Pricing Plan';
        document.getElementById('pricing-id').value = plan.id;
        document.getElementById('pricing-name').value = plan.name;
        document.getElementById('pricing-price').value = plan.price;
        document.getElementById('pricing-period').value = plan.period || '';
        document.getElementById('pricing-features').value = plan.features.join('\n');
        document.getElementById('pricing-featured').checked = plan.featured || false;
    } else {
        document.getElementById('pricing-modal-title').textContent = 'Add Pricing Plan';
        form.reset();
        document.getElementById('pricing-id').value = '';
    }
    
    modal.classList.add('active');
}

async function editPricing(id) {
    const response = await fetch(`${API_URL}/api/pricing`);
    const pricing = await response.json();
    const plan = pricing.find(p => p.id === id);
    if (plan) {
        openPricingModal(plan);
    }
}

async function deletePricing(id) {
    if (!confirm('Are you sure you want to delete this pricing plan?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/pricing/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadPricing();
        }
    } catch (error) {
        console.error('Error deleting pricing:', error);
    }
}

async function handlePricingSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const features = formData.get('features').split('\n').filter(f => f.trim());
    
    const pricingData = {
        id: formData.get('id') || Date.now().toString(),
        name: formData.get('name'),
        price: parseFloat(formData.get('price')),
        period: formData.get('period') || '/project',
        features: features,
        featured: document.getElementById('pricing-featured').checked
    };
    
    try {
        const url = pricingData.id && formData.get('id') ? 
            `${API_URL}/api/pricing/${pricingData.id}` : 
            `${API_URL}/api/pricing`;
        
        const method = pricingData.id && formData.get('id') ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pricingData)
        });
        
        if (response.ok) {
            closeAllModals();
            await loadPricing();
        }
    } catch (error) {
        console.error('Error saving pricing:', error);
    }
}

// Update Booking Status
async function updateBookingStatus(id, status) {
    try {
        const response = await fetch(`${API_URL}/api/bookings/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            await loadBookings();
        }
    } catch (error) {
        console.error('Error updating booking:', error);
    }
}

// Delete Booking
async function deleteBooking(id) {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/bookings/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadBookings();
        }
    } catch (error) {
        console.error('Error deleting booking:', error);
    }
}

// Update Query Status
async function updateQueryStatus(id, status) {
    try {
        const response = await fetch(`${API_URL}/api/queries/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            await loadQueries();
        }
    } catch (error) {
        console.error('Error updating query:', error);
    }
}

// Delete Query
async function deleteQuery(id) {
    if (!confirm('Are you sure you want to delete this query?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/queries/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadQueries();
        }
    } catch (error) {
        console.error('Error deleting query:', error);
    }
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}
