# 📦 Installation Guide

Welcome to the **WhatsBotX Installation Guide**. This document will walk you through setting up WhatsBotX on your system.

## 📋 Prerequisites

Before installing WhatsBotX, ensure your system meets these requirements:

### 🖥️ System Requirements
- **Operating System:** Windows 10/11, macOS 10.15+, Ubuntu 18.04+ (64-bit)
- **RAM:** Minimum 4GB, Recommended 8GB+
- **Storage:** 500MB free space
- **Network:** Stable internet connection

### 🔧 Software Requirements
- **Node.js:** Version 18.0.0 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm:** Comes with Node.js (version 8.0.0+)
  - Verify installation: `npm --version`
- **Git:** Version control system
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`
- **WhatsApp Account:** Active WhatsApp account for bot connection

### 📱 WhatsApp Setup
1. **Active WhatsApp Account** - Personal or Business account
2. **Mobile Device** - For QR code scanning
3. **Stable Connection** - Reliable internet for WhatsApp Web

---

## 🚀 Quick Installation

### Method 1: Git Clone (Recommended)

```bash
# 📥 Clone the repository
git clone https://github.com/yourusername/WhatsBotX.git
cd WhatsBotX

# 📦 Install dependencies
npm install

# ⚙️ Configure environment (optional)
cp .env.example .env
# Edit .env with your settings

# 🚀 Start the application
npm start
```

### Method 2: Direct Download

1. **Download ZIP** from [GitHub Releases](https://github.com/yourusername/WhatsBotX/releases)
2. **Extract** the ZIP file to your desired location
3. **Open Terminal/Command Prompt** in the extracted folder
4. **Install Dependencies:**
   ```bash
   npm install
   ```
5. **Start Application:**
   ```bash
   npm start
   ```

---

## 🔧 Detailed Setup

### Step 1: Install Node.js

#### Windows
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer
4. Follow the installation wizard
5. Restart your terminal/command prompt

#### macOS
```bash
# Using Homebrew (recommended)
brew install node

# Or download from nodejs.org
# Download and install the .pkg file
```

#### Linux (Ubuntu/Debian)
```bash
# Update package list
sudo apt update

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 2: Install Git

#### Windows
1. Download from [git-scm.com](https://git-scm.com/)
2. Run the installer with default settings

#### macOS
```bash
# Using Homebrew
brew install git

# Or Xcode Command Line Tools
xcode-select --install
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt install git

# CentOS/RHEL
sudo yum install git
```

### Step 3: Clone Repository

```bash
# Navigate to your projects directory
cd ~/Projects  # or any directory you prefer

# Clone the repository
git clone https://github.com/yourusername/WhatsBotX.git

# Enter the project directory
cd WhatsBotX

# Verify contents
ls -la
```

### Step 4: Install Dependencies

```bash
# Install all required packages
npm install

# This will install:
# - whatsapp-web.js (WhatsApp integration)
# - electron (Desktop GUI)
# - express (API server)
# - sqlite3 (Database)
# - And many other dependencies
```

> **Note:** Installation may take 2-5 minutes depending on your internet speed.

### Step 5: Environment Configuration

Create a `.env` file for custom settings:

```bash
# Copy example environment file
cp .env.example .env

# Edit with your preferred settings
nano .env  # or use any text editor
```

**Common Environment Variables:**
```env
# Bot Configuration
BOT_PREFIX=/
BOT_NAME=WhatsBotX

# API Configuration
API_PORT=3000
API_HOST=localhost

# Database Configuration
DB_PATH=./data/whatsbotx.db

# OpenAI Configuration (optional)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=./logs/whatsbotx.log

# WhatsApp Configuration
SESSION_PATH=./data/sessions
```

### Step 6: Build Application (Optional)

For production deployment:

```bash
# Build for production
npm run build

# Create executable packages
npm run dist
```

---

## 📱 First Run Setup

### Starting the Application

```bash
# Start in development mode
npm run dev

# Or start production version
npm start
```

### WhatsApp Connection

1. **Launch Application**
   - The Electron GUI will open automatically
   - Or visit `http://localhost:3000` for web interface

2. **QR Code Display**
   - A QR code will appear in the application
   - The QR code is also logged in the console

3. **Scan QR Code**
   - Open WhatsApp on your mobile device
   - Go to **Settings → Linked Devices**
   - Tap **"Link a Device"**
   - Scan the QR code displayed in the application

4. **Connection Confirmation**
   - Wait for "Connected" status in the application
   - The bot is now ready to receive messages

### Testing Connection

Send a test message to your WhatsApp number:

```
/ping
```

Expected response: `🏓 Pong! Response time: Xms`

---

## 🔧 Advanced Configuration

### Custom Port Configuration

To run on a different port:

```bash
# Set environment variable
export PORT=8080

# Or edit .env file
echo "PORT=8080" >> .env

# Start application
npm start
```

### Database Configuration

WhatsBotX uses SQLite by default. To use a different database:

```env
# SQLite (default)
DB_TYPE=sqlite
DB_PATH=./data/whatsbotx.db

# MySQL (advanced)
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=whatsbotx
DB_USER=your_username
DB_PASS=your_password
```

### SSL/HTTPS Setup

For production with SSL:

```bash
# Install SSL certificate
# Configure reverse proxy (nginx/apache)
# Set environment variables
export HTTPS=true
export SSL_KEY_PATH=/path/to/private.key
export SSL_CERT_PATH=/path/to/certificate.crt
```

---

## 🐛 Troubleshooting

### Common Installation Issues

#### "npm install" fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Node.js version issues
```bash
# Check current version
node --version

# Update Node.js if needed
# Visit nodejs.org for latest LTS
```

#### Permission errors
```bash
# On Linux/macOS, fix permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### WhatsApp Connection Issues

#### QR Code not displaying
- Check console logs for errors
- Ensure port 3000 is not blocked
- Try refreshing the application

#### QR Code expired
- Restart the application
- Clear browser cache
- Check internet connection

#### Connection keeps dropping
- Check WhatsApp Web status
- Ensure stable internet connection
- Update whatsapp-web.js if needed

### Database Issues

#### Database file corrupted
```bash
# Backup existing database
cp data/whatsbotx.db data/whatsbotx.db.backup

# Remove corrupted database
rm data/whatsbotx.db

# Restart application (will create new database)
npm start
```

#### Permission denied
```bash
# Fix database directory permissions
chmod 755 data/
chmod 644 data/whatsbotx.db
```

---

## 📊 System Monitoring

### Health Checks

```bash
# Check if application is running
curl http://localhost:3000/health

# Check API status
curl http://localhost:3000/api/v1/status
```

### Log Monitoring

```bash
# View application logs
tail -f logs/whatsbotx.log

# View error logs only
grep "ERROR" logs/whatsbotx.log
```

### Performance Monitoring

```bash
# Check system resources
top  # Linux/macOS
taskmgr  # Windows

# Monitor Node.js process
ps aux | grep node
```

---

## 🔄 Updates and Maintenance

### Updating WhatsBotX

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Restart application
npm restart
```

### Backup Important Data

```bash
# Backup database
cp data/whatsbotx.db backups/whatsbotx_$(date +%Y%m%d).db

# Backup sessions
cp -r data/sessions backups/sessions_$(date +%Y%m%d)/

# Backup configuration
cp .env backups/.env_$(date +%Y%m%d)
```

---

## 🌐 Production Deployment

### Using PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up auto-restart
pm2 startup
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t whatsbotx .
docker run -p 3000:3000 whatsbotx
```

### Cloud Deployment

#### Heroku
```bash
# Create Heroku app
heroku create your-whatsbotx-app

# Deploy
git push heroku main
```

#### Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

---

## 📞 Support

### Getting Help

- 📖 **Documentation:** [Full Docs](https://docs.whatsbotx.com)
- 💬 **Discord:** [Community Support](https://discord.gg/whatsbotx)
- 🐛 **GitHub Issues:** [Report Bugs](https://github.com/yourusername/WhatsBotX/issues)
- 📧 **Email:** support@whatsbotx.com

### Debug Information

When reporting issues, include:

```bash
# System information
node --version
npm --version
uname -a  # Linux/macOS

# Application logs
tail -50 logs/whatsbotx.log

# Package versions
npm list --depth=0
```

---

## 🎉 Next Steps

Once installed and connected:

1. **Explore Commands** - Send `/help` to see all available commands
2. **Configure Settings** - Customize bot behavior in the GUI
3. **Set Up Reminders** - Try `/remind 1h Meeting time`
4. **Test AI Features** - Send `/ai Hello!`
5. **Bulk Messaging** - Use the GUI for mass messaging

---

<div align="center">

**📖 [Back to README](README.md) • 🔧 [Developer Guide](DEVELOPER_GUIDE.md) • 🧪 [Testing](TESTING.md)**

---

*Installation Guide v2.1.0 - Last updated: January 24, 2024*

</div>
