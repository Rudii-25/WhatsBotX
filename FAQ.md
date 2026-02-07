# ❓ WhatsBotX FAQ

Welcome to the **WhatsBotX Frequently Asked Questions**! Here you'll find answers to common questions about installation, usage, troubleshooting, and more.

## 📋 Table of Contents

- [General Questions](#-general-questions)
- [Installation & Setup](#-installation--setup)
- [WhatsApp Connection](#-whatsapp-connection)
- [Commands & Features](#-commands--features)
- [Troubleshooting](#-troubleshooting)
- [Security & Privacy](#-security--privacy)
- [Technical Questions](#-technical-questions)
- [Billing & Support](#-billing--support)

---

## 🤔 General Questions

### What is WhatsBotX?

**WhatsBotX** is a comprehensive WhatsApp automation platform that combines AI-powered chat assistance, bulk messaging, task management, and advanced automation features in a user-friendly desktop application.

### Is WhatsBotX free?

WhatsBotX is free and open-source. Some advanced features may require API keys (like OpenAI for AI chat), but the core functionality is completely free.

### What are the system requirements?

**Minimum Requirements:**
- Node.js 18.0.0 or higher
- 4GB RAM
- 500MB free disk space
- Stable internet connection

**Recommended:**
- Node.js 18+
- 8GB RAM
- 1GB free disk space
- High-speed internet

### Which operating systems are supported?

WhatsBotX works on:
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu 18.04+, CentOS 7+, etc.)

### Do I need to keep my phone connected?

No! WhatsBotX uses WhatsApp Web technology, so once connected, your phone can be offline. However, WhatsApp may occasionally require phone verification.

---

## 📦 Installation & Setup

### How do I install WhatsBotX?

1. **Download:**
   ```bash
   git clone https://github.com/Rudii-25/WhatsBotX.git
   cd WhatsBotX
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure (Optional):**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start:**
   ```bash
   npm start
   ```

### I'm getting a "Node.js version" error. What do I do?

1. **Check your Node.js version:**
   ```bash
   node --version
   ```

2. **If outdated, download the latest LTS from [nodejs.org](https://nodejs.org/)**

3. **Or use a version manager:**
   ```bash
   # Using nvm (Linux/macOS)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   ```

### The installation fails with permission errors.

**On Linux/macOS:**
```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

**On Windows:**
Run command prompt as Administrator, or disable UAC temporarily.

### How do I update WhatsBotX?

```bash
cd WhatsBotX
git pull origin main
npm install
npm run build
```

---

## 📱 WhatsApp Connection

### How do I connect WhatsApp to WhatsBotX?

1. **Start WhatsBotX** and click "Start Bot"
2. **Open WhatsApp** on your phone
3. **Go to Settings → Linked Devices → Link a Device**
4. **Scan the QR code** displayed in WhatsBotX
5. **Wait for "Connected" status**

### The QR code doesn't work. What should I do?

**Try these solutions:**

1. **Refresh the QR code** by restarting the bot
2. **Clear WhatsApp Web sessions** from your phone
3. **Check your internet connection**
4. **Update WhatsApp** to the latest version
5. **Try a different browser/device** for scanning

### My connection keeps dropping. Why?

**Common causes:**
- Unstable internet connection
- WhatsApp Web session expired
- Phone battery died or app closed
- WhatsApp server issues

**Solutions:**
- Use a stable WiFi connection
- Keep your phone charged and WhatsApp open
- Restart WhatsBotX periodically
- Check WhatsApp Web status

### Can I use WhatsBotX without my phone?

Yes, but WhatsApp may occasionally require phone verification. Keep your phone nearby for security checks.

---

## 🤖 Commands & Features

### How do I use commands?

All commands start with `/` (configurable). Send commands as messages to your WhatsApp number.

**Examples:**
```
/help - Show all commands
/ping - Test bot response
/status - Check bot status
/ai Hello! - Chat with AI
```

### What commands are available?

**Basic:** `/help`, `/ping`, `/status`, `/about`
**AI:** `/ai`, `/chat`
**Productivity:** `/todo`, `/remind`
**Info:** `/weather`, `/news`, `/wiki`
**Entertainment:** `/joke`, `/quote`, `/fact`
**Utilities:** `/time`, `/currency`, `/translate`

See the [User Manual](USER_MANUAL.md) for complete list.

### AI features aren't working. Why?

AI features require an OpenAI API key:

1. **Get API key** from [OpenAI Platform](https://platform.openai.com)
2. **Add to .env file:**
   ```
   OPENAI_API_KEY=your-api-key-here
   ```
3. **Restart WhatsBotX**

### How do I send bulk messages?

1. **Create a text file** with phone numbers (one per line)
2. **Go to Bulk Messaging tab** in WhatsBotX
3. **Upload the file** and enter your message
4. **Click "Send Bulk Messages"**
5. **Monitor progress** in real-time

### What's the difference between single and bulk messaging?

- **Single Message:** Send to one contact at a time
- **Bulk Messaging:** Send to multiple contacts from a file
- **Contact Management:** Save and organize frequently used numbers

---

## 🔧 Troubleshooting

### WhatsBotX won't start. What do I check?

1. **Check Node.js version:** `node --version`
2. **Check dependencies:** `npm list`
3. **Check logs:** Look for error messages
4. **Try clean install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Commands aren't responding.

**Check these:**
- Bot is running and connected (green status)
- Command starts with correct prefix (`/`)
- Command is spelled correctly
- Rate limiting isn't active (wait a few minutes)

### Messages are failing to send.

**Common issues:**
- Invalid phone number format (use +country code)
- WhatsApp rate limits (wait between sends)
- Network connectivity issues
- Recipient blocked the number

### The interface is slow or unresponsive.

**Performance fixes:**
- Close other applications
- Restart WhatsBotX
- Check system resources (RAM, CPU)
- Clear browser cache (Ctrl+Shift+R)
- Update to latest version

### I'm getting "Module not found" errors.

**Fix:**
```bash
npm install
# or
npm install --force
```

### Database errors occurring.

**Recovery steps:**
1. **Backup data folder**
2. **Stop WhatsBotX**
3. **Delete whatsbotx.db**
4. **Restart (creates new database)**
5. **Restore from backup if needed**

---

## 🔒 Security & Privacy

### Is my data secure?

**Security measures:**
- All data stored locally on your device
- No data sent to external servers (except API calls you configure)
- WhatsApp Web encryption standards
- Local API key storage

### Are messages encrypted?

Yes! WhatsBotX uses WhatsApp's end-to-end encryption. Messages are encrypted between your device and recipients.

### Can others access my WhatsApp?

Only through your WhatsApp Web session. Keep your QR code and session secure.

### What data does WhatsBotX collect?

**Local data only:**
- Message logs (for your reference)
- Contact lists (you create)
- Settings and preferences
- Usage analytics (optional)

**External data:**
- Only when you configure APIs (OpenAI, weather, etc.)

### How do I secure my API keys?

- Store in `.env` file (not in code)
- Don't commit `.env` to version control
- Rotate keys regularly
- Use strong, unique keys

---

## 💻 Technical Questions

### How does WhatsBotX work?

WhatsBotX uses:
- **whatsapp-web.js** for WhatsApp integration
- **Electron** for the desktop application
- **Express.js** for the API server
- **SQLite** for data storage
- **Node.js** runtime environment

### Can I run WhatsBotX on a server?

Yes! WhatsBotX can run headless on servers:

```bash
# Set environment variables
export WHATSAPP_HEADLESS=true
export WHATSAPP_QR_TERMINAL=true

# Start
npm start
```

### How do I backup my data?

**Backup these folders:**
- `data/` - Database and sessions
- `config/` - Configuration files
- `logs/` - Activity logs

**Automated backup:**
```bash
# Create backup script
tar -czf backup_$(date +%Y%m%d).tar.gz data/ config/ logs/
```

### Can I customize the interface?

Yes! The interface is built with HTML/CSS/JavaScript. Modify files in `src/electron/renderer/`.

### How do I add custom commands?

**Method 1: Plugins**
Create a plugin file and load it through the Plugin Manager.

**Method 2: Code modification**
Edit `src/commands/CommandHandler.js` to add new commands.

### What's the API rate limit?

**Default limits:**
- 100 requests per 15 minutes for messaging
- 50 requests per 15 minutes for analytics
- 20 requests per 15 minutes for file operations

### Can I integrate with other services?

Yes! Use the REST API or create plugins for:
- CRM systems
- Email services
- Social media platforms
- Custom business logic

---

## 💰 Billing & Support

### Is there a premium version?

Currently, WhatsBotX is completely free and open-source. Future premium features may include:
- Advanced analytics
- Priority support
- Custom integrations
- Enterprise features

### How do I get support?

**Support channels:**
- 📖 **Documentation:** [Full Docs](https://docs.whatsbotx.com)
- 💬 **Community:** [Discord Server](https://discord.gg/whatsbotx)
- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/Rudii-25/WhatsBotX/issues)
- 📧 **Email:** support@whatsbotx.com

### What's the response time for support?

- **Community (Discord):** Usually within hours
- **GitHub Issues:** Within 24-48 hours
- **Email:** Within 24-72 hours

### Can I contribute to WhatsBotX?

Absolutely! We welcome contributions:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

See our [Contributing Guide](CONTRIBUTING.md) for details.

### How do I report a bug?

**Include these details:**
- WhatsBotX version
- Operating system and version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Error messages/logs

**Use the bug report template** on GitHub Issues.

---

## 🚀 Advanced Questions

### Can I run multiple instances?

Yes, but each needs:
- Separate data directory
- Different port numbers
- Separate WhatsApp accounts

### How do I automate WhatsBotX?

**Options:**
- **Cron jobs** for scheduled tasks
- **API calls** from other applications
- **Plugins** for custom automation
- **Webhooks** for real-time integration

### What's the maximum message length?

WhatsApp limit: 4096 characters per message.

### Can I send media files?

Yes! Use the file upload features or provide URLs for:
- Images
- Videos
- Documents
- Audio files

### How do I handle large contact lists?

**Best practices:**
- Split into smaller batches (100-500 contacts)
- Add delays between batches (5-10 seconds)
- Monitor success rates
- Use contact management features

### Can I export chat history?

Yes, through the Analytics dashboard or API:
- JSON format for all data
- CSV format for contacts/messages
- Filtered exports by date/user

---

<div align="center">

**❓ WhatsBotX FAQ**

*Have a question not answered here?*

**📧 [Contact Support](mailto:rudra25trikha@gmail.com) • 💬 [Join Discord](https://discord.gg/whatsbotx) • 🐛 [Report Issues](https://github.com/Rudii-25/WhatsBotX/issues)**

---

**📚 Related Documentation:**
- [User Manual](USER_MANUAL.md)
- [API Reference](API.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)
- [Installation Guide](INSTALLATION.md)

*Last updated: January 24, 2024*

---

<div align="center">

**Made with ❤️ by Rudra Sharma**

[⭐ Star us on GitHub](https://github.com/Rudii-25/WhatsBotX) • [🐛 Report Issues](https://github.com/Rudii-25/WhatsBotX/issues) • [📧 Contact Us](mailto:rudra25trikha@gmail.com)

[🌐 Project Website](https://rudii-25.github.io/WhatsBotX/) • [👤 Rudra Sharma](https://rudrasharma25.com) • [🔗 LinkedIn](https://www.linkedin.com/in/rudra-sharma-714a7b259/)

---

© 2026 Rudra Sharma. All rights reserved.

</div>
