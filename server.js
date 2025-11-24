const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const PRICING_FILE = path.join(DATA_DIR, 'pricing.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const QUERIES_FILE = path.join(DATA_DIR, 'queries.json');

// Admin credentials (in production, use environment variables and hashed passwords)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Initialize data files
async function initializeDataFiles() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        // Initialize services
        try {
            await fs.access(SERVICES_FILE);
        } catch {
            const defaultServices = [
                {
                    id: '1',
                    name: 'Website Development',
                    description: 'Professional website development tailored for army-related organizations and defense contractors. Modern, secure, and responsive websites.',
                    icon: '💻'
                },
                {
                    id: '2',
                    name: 'Mobile App Development',
                    description: 'Custom mobile applications for iOS and Android platforms. Specialized in secure communication and operational efficiency apps.',
                    icon: '📱'
                },
                {
                    id: '3',
                    name: 'Army Consultancy',
                    description: 'Expert consultancy services for army-related projects, strategic planning, and technology integration for defense operations.',
                    icon: '🎖️'
                },
                {
                    id: '4',
                    name: 'System Integration',
                    description: 'Seamless integration of various systems and platforms for improved operational efficiency and data management.',
                    icon: '⚙️'
                },
                {
                    id: '5',
                    name: 'Training & Support',
                    description: 'Comprehensive training programs and ongoing technical support for all our solutions.',
                    icon: '📚'
                },
                {
                    id: '6',
                    name: 'Security Solutions',
                    description: 'Advanced security solutions including cybersecurity consulting, secure communications, and data protection.',
                    icon: '🔒'
                }
            ];
            await fs.writeFile(SERVICES_FILE, JSON.stringify(defaultServices, null, 2));
        }
        
        // Initialize pricing
        try {
            await fs.access(PRICING_FILE);
        } catch {
            const defaultPricing = [
                {
                    id: '1',
                    name: 'Basic Package',
                    price: 2500,
                    period: '/project',
                    features: [
                        'Basic Website (5 pages)',
                        'Responsive Design',
                        'Contact Form',
                        '3 Months Support',
                        'Basic SEO'
                    ],
                    featured: false
                },
                {
                    id: '2',
                    name: 'Professional Package',
                    price: 5500,
                    period: '/project',
                    features: [
                        'Advanced Website (10+ pages)',
                        'Custom Design',
                        'Content Management System',
                        'E-commerce Integration',
                        '6 Months Support',
                        'Advanced SEO',
                        'Mobile App (Basic)'
                    ],
                    featured: true
                },
                {
                    id: '3',
                    name: 'Enterprise Package',
                    price: 12000,
                    period: '/project',
                    features: [
                        'Full-scale Web Platform',
                        'Custom Mobile Apps (iOS & Android)',
                        'Admin Panel & Dashboard',
                        'API Development',
                        '12 Months Support',
                        'Complete SEO Package',
                        'Security Audit',
                        'Training Sessions',
                        'Dedicated Account Manager'
                    ],
                    featured: false
                },
                {
                    id: '4',
                    name: 'Consultancy Retainer',
                    price: 3000,
                    period: '/month',
                    features: [
                        '20 Hours Monthly Consultation',
                        'Strategic Planning',
                        'Technical Advisory',
                        'Project Management',
                        'Priority Support'
                    ],
                    featured: false
                }
            ];
            await fs.writeFile(PRICING_FILE, JSON.stringify(defaultPricing, null, 2));
        }
        
        // Initialize bookings
        try {
            await fs.access(BOOKINGS_FILE);
        } catch {
            await fs.writeFile(BOOKINGS_FILE, JSON.stringify([], null, 2));
        }
        
        // Initialize queries
        try {
            await fs.access(QUERIES_FILE);
        } catch {
            await fs.writeFile(QUERIES_FILE, JSON.stringify([], null, 2));
        }
        
        console.log('Data files initialized successfully');
    } catch (error) {
        console.error('Error initializing data files:', error);
    }
}

// Helper functions for reading/writing JSON files
async function readJSONFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}

async function writeJSONFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing file:', error);
        return false;
    }
}

// API Routes

// Admin Login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

// Services Routes
app.get('/api/services', async (req, res) => {
    const services = await readJSONFile(SERVICES_FILE);
    res.json(services);
});

app.post('/api/services', async (req, res) => {
    const services = await readJSONFile(SERVICES_FILE);
    const newService = {
        id: Date.now().toString(),
        ...req.body
    };
    services.push(newService);
    await writeJSONFile(SERVICES_FILE, services);
    res.json(newService);
});

app.put('/api/services/:id', async (req, res) => {
    const services = await readJSONFile(SERVICES_FILE);
    const index = services.findIndex(s => s.id === req.params.id);
    
    if (index !== -1) {
        services[index] = { ...services[index], ...req.body };
        await writeJSONFile(SERVICES_FILE, services);
        res.json(services[index]);
    } else {
        res.status(404).json({ error: 'Service not found' });
    }
});

app.delete('/api/services/:id', async (req, res) => {
    const services = await readJSONFile(SERVICES_FILE);
    const filtered = services.filter(s => s.id !== req.params.id);
    await writeJSONFile(SERVICES_FILE, filtered);
    res.json({ success: true });
});

// Pricing Routes
app.get('/api/pricing', async (req, res) => {
    const pricing = await readJSONFile(PRICING_FILE);
    res.json(pricing);
});

app.post('/api/pricing', async (req, res) => {
    const pricing = await readJSONFile(PRICING_FILE);
    const newPlan = {
        id: Date.now().toString(),
        ...req.body
    };
    pricing.push(newPlan);
    await writeJSONFile(PRICING_FILE, pricing);
    res.json(newPlan);
});

app.put('/api/pricing/:id', async (req, res) => {
    const pricing = await readJSONFile(PRICING_FILE);
    const index = pricing.findIndex(p => p.id === req.params.id);
    
    if (index !== -1) {
        pricing[index] = { ...pricing[index], ...req.body };
        await writeJSONFile(PRICING_FILE, pricing);
        res.json(pricing[index]);
    } else {
        res.status(404).json({ error: 'Pricing plan not found' });
    }
});

app.delete('/api/pricing/:id', async (req, res) => {
    const pricing = await readJSONFile(PRICING_FILE);
    const filtered = pricing.filter(p => p.id !== req.params.id);
    await writeJSONFile(PRICING_FILE, filtered);
    res.json({ success: true });
});

// Bookings Routes
app.get('/api/bookings', async (req, res) => {
    const bookings = await readJSONFile(BOOKINGS_FILE);
    res.json(bookings);
});

app.post('/api/bookings', async (req, res) => {
    const bookings = await readJSONFile(BOOKINGS_FILE);
    const newBooking = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    await writeJSONFile(BOOKINGS_FILE, bookings);
    res.json(newBooking);
});

app.put('/api/bookings/:id', async (req, res) => {
    const bookings = await readJSONFile(BOOKINGS_FILE);
    const index = bookings.findIndex(b => b.id === req.params.id);
    
    if (index !== -1) {
        bookings[index] = { ...bookings[index], ...req.body };
        await writeJSONFile(BOOKINGS_FILE, bookings);
        res.json(bookings[index]);
    } else {
        res.status(404).json({ error: 'Booking not found' });
    }
});

app.delete('/api/bookings/:id', async (req, res) => {
    const bookings = await readJSONFile(BOOKINGS_FILE);
    const filtered = bookings.filter(b => b.id !== req.params.id);
    await writeJSONFile(BOOKINGS_FILE, filtered);
    res.json({ success: true });
});

// Queries Routes
app.get('/api/queries', async (req, res) => {
    const queries = await readJSONFile(QUERIES_FILE);
    res.json(queries);
});

app.post('/api/queries', async (req, res) => {
    const queries = await readJSONFile(QUERIES_FILE);
    const newQuery = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    queries.push(newQuery);
    await writeJSONFile(QUERIES_FILE, queries);
    res.json(newQuery);
});

app.put('/api/queries/:id', async (req, res) => {
    const queries = await readJSONFile(QUERIES_FILE);
    const index = queries.findIndex(q => q.id === req.params.id);
    
    if (index !== -1) {
        queries[index] = { ...queries[index], ...req.body };
        await writeJSONFile(QUERIES_FILE, queries);
        res.json(queries[index]);
    } else {
        res.status(404).json({ error: 'Query not found' });
    }
});

app.delete('/api/queries/:id', async (req, res) => {
    const queries = await readJSONFile(QUERIES_FILE);
    const filtered = queries.filter(q => q.id !== req.params.id);
    await writeJSONFile(QUERIES_FILE, filtered);
    res.json({ success: true });
});

// Start server
async function startServer() {
    await initializeDataFiles();
    
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════════════════════════════╗
║                        ONLINE HUB                              ║
║           Army Consultancy & Development Company               ║
╠════════════════════════════════════════════════════════════════╣
║  Server running on port ${PORT}                                    ║
║                                                                ║
║  Main Website:    http://localhost:${PORT}                         ║
║  Admin Panel:     http://localhost:${PORT}/admin                   ║
║                                                                ║
║  Admin Credentials:                                            ║
║  Username: admin                                               ║
║  Password: admin123                                            ║
╚════════════════════════════════════════════════════════════════╝
        `);
    });
}

startServer();
