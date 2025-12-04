# Deployment Guide for ONLINE HUB

## Quick Start (Local Development)

```bash
# Clone repository
git clone https://github.com/ADH36/Onlinehub.git
cd Onlinehub

# Install dependencies
npm install

# Start server
npm start

# Access the application
# Main Website: http://localhost:3000
# Admin Panel: http://localhost:3000/admin
# Admin Login: admin / admin123
```

## Production Deployment

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create onlinehub-app
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set ADMIN_USERNAME=your_secure_username
   heroku config:set ADMIN_PASSWORD=your_secure_password
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Open Application**
   ```bash
   heroku open
   ```

### Option 2: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add `ADMIN_USERNAME` and `ADMIN_PASSWORD`

### Option 3: Deploy to DigitalOcean / AWS / VPS

1. **SSH into your server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone and setup**
   ```bash
   git clone https://github.com/ADH36/Onlinehub.git
   cd Onlinehub
   npm install
   ```

4. **Setup environment variables**
   ```bash
   nano .env
   # Add:
   # ADMIN_USERNAME=your_username
   # ADMIN_PASSWORD=your_password
   # PORT=3000
   ```

5. **Install PM2 for process management**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name onlinehub
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx as reverse proxy**
   ```bash
   sudo apt-get install nginx
   sudo nano /etc/nginx/sites-available/onlinehub
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable and restart:
   ```bash
   sudo ln -s /etc/nginx/sites-available/onlinehub /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Admin Credentials (Change these!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here

# Optional: Database Configuration (for future upgrade)
# DATABASE_URL=mongodb://localhost:27017/onlinehub
# or
# DATABASE_URL=postgresql://user:password@localhost:5432/onlinehub

# Optional: Email Configuration (for future feature)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-app-password

# Optional: JWT Secret (for future enhancement)
# JWT_SECRET=your-random-secret-key-here
```

## Post-Deployment Checklist

- [ ] Update admin credentials from defaults
- [ ] Test all website functionality
- [ ] Test admin panel login
- [ ] Verify all CRUD operations work
- [ ] Test booking submission
- [ ] Test contact form
- [ ] Verify data persistence
- [ ] Setup SSL/HTTPS
- [ ] Configure domain name
- [ ] Setup monitoring (Uptime Robot, New Relic)
- [ ] Configure backups for data directory
- [ ] Setup error logging
- [ ] Test mobile responsiveness
- [ ] Update contact information in the website

## Monitoring & Maintenance

### Check Server Status (PM2)
```bash
pm2 status
pm2 logs onlinehub
pm2 restart onlinehub
```

### Backup Data
```bash
# Backup data directory
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# Or setup automated backups
crontab -e
# Add: 0 2 * * * cd /path/to/Onlinehub && tar -czf ~/backups/backup-$(date +\%Y\%m\%d).tar.gz data/
```

### View Logs
```bash
# Application logs
pm2 logs onlinehub

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Update Application
```bash
cd /path/to/Onlinehub
git pull
npm install
pm2 restart onlinehub
```

## Scaling Considerations

When you need to scale:

1. **Upgrade to Database**
   - Migrate from JSON files to MongoDB or PostgreSQL
   - Implement connection pooling
   - Setup database backups

2. **Add Load Balancing**
   - Setup multiple server instances
   - Use PM2 cluster mode or Docker containers
   - Configure Nginx load balancing

3. **Implement Caching**
   - Use Redis for session storage
   - Add CDN for static assets
   - Implement API response caching

4. **Add Message Queue**
   - Use Bull or RabbitMQ for background jobs
   - Implement email notifications asynchronously

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
sudo lsof -i :3000
# Kill the process
kill -9 <PID>
```

### Server Won't Start
```bash
# Check Node.js version (should be 14+)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for errors
npm start
```

### Data Not Persisting
```bash
# Check data directory permissions
ls -la data/
# Fix permissions if needed
chmod 755 data/
chmod 644 data/*.json
```

## Support

For deployment issues or questions:
- Check README.md for general setup
- Review SECURITY.md for security best practices
- Create an issue on GitHub
- Contact: info@onlinehub.co.in

---

**Last Updated:** November 2024  
**Version:** 1.0.0
