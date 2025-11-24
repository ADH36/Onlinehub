# ONLINE HUB - Army Consultancy & Development Company

A professional website for ONLINE HUB, a consultancy and development company specializing in army-related services, website development, mobile applications, and more.

## Features

### Frontend Website
- **Responsive Design**: Mobile-friendly and works on all devices
- **Services Showcase**: Display all available services with descriptions and icons
- **Pricing Plans**: Transparent pricing with multiple packages
- **Online Booking System**: Book consultations or request online services
- **Contact Form**: Easy way for clients to reach out with queries
- **Smooth Navigation**: User-friendly interface with smooth scrolling

### Admin Panel
- **Secure Login**: Protected admin area (default credentials: admin/admin123)
- **Service Management**: Add, edit, and delete services
- **Pricing Management**: Manage pricing plans and featured packages
- **Booking Management**: View and manage customer bookings
- **Query Management**: Handle customer inquiries and messages
- **Status Tracking**: Mark bookings and queries as completed

### Backend API
- RESTful API endpoints for all operations
- JSON file-based data storage (easily upgradeable to database)
- CORS enabled for flexible deployment
- Express.js server with organized routes

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/ADH36/Onlinehub.git
   cd Onlinehub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the website**
   - Main Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## Project Structure

```
Onlinehub/
├── server.js                 # Express.js backend server
├── package.json             # Project dependencies
├── public/                  # Frontend files
│   ├── index.html          # Main website page
│   ├── admin/              # Admin panel
│   │   └── index.html      # Admin panel page
│   ├── css/                # Stylesheets
│   │   ├── styles.css      # Main website styles
│   │   └── admin.css       # Admin panel styles
│   └── js/                 # JavaScript files
│       ├── main.js         # Main website logic
│       └── admin.js        # Admin panel logic
├── data/                   # Data storage (JSON files)
│   ├── services.json       # Services data
│   ├── pricing.json        # Pricing plans
│   ├── bookings.json       # Customer bookings
│   └── queries.json        # Customer queries
└── README.md               # This file
```

## API Endpoints

### Public Endpoints

#### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

#### Pricing
- `GET /api/pricing` - Get all pricing plans
- `POST /api/pricing` - Create new pricing plan
- `PUT /api/pricing/:id` - Update pricing plan
- `DELETE /api/pricing/:id` - Delete pricing plan

#### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

#### Queries
- `GET /api/queries` - Get all queries
- `POST /api/queries` - Create new query
- `PUT /api/queries/:id` - Update query status
- `DELETE /api/queries/:id` - Delete query

### Admin Endpoints
- `POST /api/admin/login` - Admin authentication

## Configuration

### Environment Variables
You can customize the following via environment variables:

```bash
PORT=3000                    # Server port (default: 3000)
ADMIN_USERNAME=admin         # Admin username (default: admin)
ADMIN_PASSWORD=admin123      # Admin password (default: admin123)
```

### Customization

#### Changing Admin Credentials
Edit the environment variables or modify `server.js`:
```javascript
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'your_username';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your_password';
```

#### Adding New Services
Use the Admin Panel or directly edit `data/services.json`

#### Customizing Colors
Edit CSS variables in `public/css/styles.css` and `public/css/admin.css`:
```css
:root {
    --primary-color: #1e3a5f;
    --secondary-color: #4a90e2;
    --accent-color: #f39c12;
}
```

## Usage Guide

### For Customers

1. **Browse Services**: Visit the homepage to see all available services
2. **Check Pricing**: Review pricing plans and features
3. **Book a Service**: Fill out the booking form with your details
4. **Contact Us**: Use the contact form for general inquiries

### For Administrators

1. **Login**: Access `/admin` and login with credentials
2. **Manage Services**: Add, edit, or remove services
3. **Manage Pricing**: Update pricing plans and mark featured plans
4. **Handle Bookings**: Review bookings and mark as completed
5. **Respond to Queries**: Check and manage customer inquiries

## Deployment

### Deploying to Production

1. **Update Admin Credentials**
   ```bash
   export ADMIN_USERNAME=your_secure_username
   export ADMIN_PASSWORD=your_secure_password
   ```

2. **Set Production Port**
   ```bash
   export PORT=80
   ```

3. **Start Server**
   ```bash
   npm start
   ```

### Deploy to Cloud Platforms

#### Heroku
```bash
heroku create your-app-name
git push heroku main
heroku config:set ADMIN_USERNAME=your_username
heroku config:set ADMIN_PASSWORD=your_password
```

#### Vercel/Netlify
- Configure as a Node.js application
- Set environment variables in platform settings

## Security Notes

⚠️ **Important Security Considerations:**

1. **Change Default Credentials**: Always change the default admin credentials in production
2. **Use HTTPS**: Deploy with SSL/TLS certificates
3. **Environment Variables**: Store sensitive data in environment variables
4. **Database**: Consider upgrading from JSON files to a proper database for production
5. **Password Hashing**: Implement proper password hashing (bcrypt) for production
6. **Input Validation**: Add server-side validation for all inputs
7. **Rate Limiting**: Implement rate limiting to prevent abuse

## Support & Maintenance

### Backing Up Data
The `data/` directory contains all bookings, queries, services, and pricing. Regularly backup this directory:
```bash
cp -r data/ data_backup_$(date +%Y%m%d)
```

### Monitoring
Monitor the server logs for errors and issues:
```bash
npm start > server.log 2>&1
```

## Future Enhancements

- [ ] Email notifications for new bookings/queries
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication with JWT
- [ ] File upload for service inquiries
- [ ] Calendar integration for scheduling
- [ ] Payment gateway integration
- [ ] Analytics dashboard
- [ ] Multi-language support

## License

© 2024 ONLINE HUB. All rights reserved.

## Contact

For support or inquiries:
- Email: info@onlinehub.com
- Phone: +1 (555) 123-4567

---

**Built with ❤️ for ONLINE HUB - Professional Army Consultancy & Development Services**