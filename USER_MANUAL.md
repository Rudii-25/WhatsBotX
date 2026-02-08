# 📖 WhatsBotX User Manual

Welcome to the **WhatsBotX User Manual**! This comprehensive guide will help you get the most out of your WhatsApp automation platform.

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Installation & Setup](#-installation--setup)
- [First Time Setup](#-first-time-setup)
- [Using the Interface](#-using-the-interface)
- [Commands Guide](#-commands-guide)
- [Advanced Features](#-advanced-features)
- [Troubleshooting](#-troubleshooting)
- [Best Practices](#-best-practices)

---

## 🚀 Getting Started

### What is WhatsBotX?

WhatsBotX is a powerful WhatsApp automation platform that combines:

- 🤖 **AI-Powered Chat Assistant** - Intelligent conversations and responses
- 📨 **Bulk Messaging System** - Send messages to multiple contacts efficiently
- ✅ **Task Management** - Organize and track your todos
- 📊 **Analytics Dashboard** - Monitor usage and performance
- 🔧 **Extensible Plugin System** - Customize with additional features

### System Requirements

**Minimum Requirements:**
- 🖥️ **Operating System:** Windows 10+, macOS 10.15+, Ubuntu 18.04+
- 💾 **RAM:** 4GB minimum, 8GB recommended
- 💽 **Storage:** 500MB free space
- 🌐 **Internet:** Stable broadband connection

**Recommended:**
- 🖥️ **Operating System:** Windows 11, macOS 12+, Ubuntu 20.04+
- 💾 **RAM:** 8GB or more
- 💽 **Storage:** 1GB free space
- 📱 **WhatsApp Account:** Active WhatsApp account for testing

---

## 📦 Installation & Setup

### Download & Installation

1. **Download WhatsBotX:**
   - Visit the [official website](https://whatsbotx.com)
   - Download the latest version for your operating system
   - Or clone from GitHub: `git clone https://github.com/Rudii-25/WhatsBotX.git`

2. **Install Dependencies:**
   ```bash
   cd WhatsBotX
   npm install
   ```

3. **Start the Application:**
   ```bash
   npm start
   ```

### Configuration

1. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   BOT_PREFIX=/
   API_PORT=3000
   OPENAI_API_KEY=your-openai-key  # Optional
   ```

2. **API Keys (Optional):**
   - OpenAI API Key for AI features
   - Weather API Key for weather commands
   - News API Key for news features

---

## 🎯 First Time Setup

### Step 1: Launch WhatsBotX

1. **Start the Application:**
   - Double-click the WhatsBotX icon
   - Or run `npm start` from the command line

2. **Initial Loading:**
   - The application will load and show the main interface
   - You'll see tabs for different features

### Step 2: Connect WhatsApp

1. **Navigate to Dashboard:**
   - The main dashboard shows connection status
   - Click "Start Bot" to begin setup

2. **QR Code Scanning:**
   - A QR code will appear on screen
   - Open WhatsApp on your phone
   - Go to **Settings → Linked Devices → Link a Device**
   - Scan the QR code with your phone's camera

3. **Connection Confirmation:**
   - Wait for "Connected" status to appear
   - Your WhatsApp is now linked to WhatsBotX

### Step 3: Test Basic Functionality

1. **Send a Test Message:**
   - In WhatsApp, send `/help` to your own number
   - WhatsBotX should respond with available commands

2. **Try Basic Commands:**
   - `/ping` - Test responsiveness
   - `/status` - Check bot status
   - `/time` - Get current time

---

## 🖥️ Using the Interface

### Main Dashboard

The dashboard provides an overview of your bot's activity:

- **📊 Statistics Cards:** Messages processed, active chats, uptime
- **🔄 Connection Status:** WhatsApp connection state
- **🎛️ Quick Controls:** Start/stop bot, restart, settings
- **📝 Recent Activity:** Latest bot actions and logs

### Navigation Tabs

#### 🤖 AI Chat
- Interactive AI conversation interface
- Context-aware responses
- Multiple AI model support (when configured)

#### 📨 Bulk Messaging
- **Single Message:** Send to individual contacts
- **Bulk Upload:** Import numbers from CSV/TXT files
- **Contact Management:** Add, edit, delete contacts
- **Progress Tracking:** Real-time sending progress

#### ✅ Productivity
- **Todo List:** Create and manage tasks
- **Reminders:** Set time-based notifications
- **Quick Actions:** Jokes, quotes, weather, news

#### 🛠️ Tools
- **Entertainment:** Jokes, quotes, memes, riddles
- **Information:** Weather, news, Wikipedia search
- **Utilities:** QR codes, translations, currency conversion

#### ⚙️ Settings
- **General:** Language, theme, notifications
- **WhatsApp:** Auto-reply, session management
- **API:** REST API configuration
- **Advanced:** Logging, debugging, performance

#### 📊 Logs
- **Real-time Monitoring:** Live activity feed
- **Filtering:** Search and filter log entries
- **Export:** Save logs to file

---

## 🤖 Commands Guide

### Basic Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/help` | Show all available commands | `/help` |
| `/ping` | Test bot responsiveness | `/ping` |
| `/status` | Show bot status and statistics | `/status` |
| `/about` | Information about WhatsBotX | `/about` |

### AI & Chat Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/ai <message>` | Chat with AI assistant | `/ai What's the weather?` |
| `/chat <message>` | Alternative AI chat command | `/chat Tell me a joke` |

### Productivity Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/todo add <task>` | Add a new todo item | `/todo add Buy groceries` |
| `/todo list` | Show all todo items | `/todo list` |
| `/todo complete <id>` | Mark todo as completed | `/todo complete 1` |
| `/remind <time> <message>` | Set a reminder | `/remind 7pm Gym time` |

### Information Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/weather <city>` | Get weather information | `/weather London` |
| `/news` | Get latest news headlines | `/news` |
| `/news tech` | Get technology news | `/news tech` |
| `/wiki <topic>` | Search Wikipedia | `/wiki Artificial Intelligence` |

### Entertainment Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/joke` | Get a random joke | `/joke` |
| `/quote` | Get an inspirational quote | `/quote` |
| `/fact` | Get interesting facts | `/fact` |
| `/riddle` | Get brain teasers | `/riddle` |

### Utility Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/time` | Show current time and date | `/time` |
| `/currency <amount> <from> <to>` | Convert currency | `/currency 100 USD INR` |
| `/translate <text> to <lang>` | Translate text | `/translate Hello to hindi` |
| `/qr <text>` | Generate QR code | `/qr https://example.com` |

### Auto-Reply Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/autoreply on` | Enable auto-reply | `/autoreply on` |
| `/autoreply off` | Disable auto-reply | `/autoreply off` |
| `/busy <message>` | Set busy mode with custom message | `/busy I'm busy right now` |

### Advanced Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/schedule birthday <name> <date> <msg>` | Schedule birthday reminder | `/schedule birthday John 25-12 Happy Birthday!` |
| `/poll <question> \| <option1> \| <option2>` | Create polls | `/poll Lunch? \| Pizza \| Burger \| Salad` |
| `/download <URL>` | Download media (YouTube, Instagram) | `/download https://youtube.com/watch?v=...` |

---

## ⚡ Advanced Features

### Bulk Messaging System

#### Preparing Contact Lists

1. **Create a Text File:**
   ```
   +1234567890
   +1987654321
   +1555123456
   ```

2. **Upload the File:**
   - Go to Bulk Messaging tab → Bulk Import
   - Click "Upload Numbers (.txt file)" and select your .txt file
   - Numbers are automatically validated and loaded
   - **✨ NEW:** All imported numbers display in a list below the upload area
   - You can see exactly which numbers will be used before sending

3. **View Imported Numbers:**
   - After uploading, a "Imported Numbers:" section appears
   - Shows all valid numbers in a grid layout
   - First 50 numbers visible, "+X more" indicator if more exist
   - Hover over numbers to see full details
   - Helps verify all numbers before sending

4. **Send Bulk Messages:**
   - Enter your message in the text area
   - Click "Send to All"
   - Monitor progress in real-time with live statistics

#### Contact Management

- **Add Contacts:** Manually add names and numbers in Contacts tab
- **Import/Export:** Export contact lists or import from previous exports
- **Tags:** Organize contacts with custom tags
- **Search:** Quickly find contacts by name or number

### API Dashboard & Server

#### Starting the API Server

1. **Enable API Server:**
   - Go to Settings → Advanced tab
   - Click "Start API Server" button
   - Wait for confirmation message
   - API server starts on port 3001

2. **API Status:**
   - Dashboard shows "Active" or "Inactive" status
   - Real-time indicator shows server state
   - Check logs if connection fails

3. **Using the API:**
   - Once running, send requests to `http://localhost:3001`
   - Use endpoints for bulk messaging, status checks
   - **Note:** Bot must be running to start API server

### AI Chat Integration

#### Setting Up AI Features

1. **Get OpenAI API Key:**
   - Visit [OpenAI Platform](https://platform.openai.com)
   - Create an account and get your API key

2. **Configure in WhatsBotX:**
   - Go to Settings → API Configuration
   - Enter your OpenAI API key
   - Select your preferred AI model

3. **Using AI Chat:**
   - Use `/ai` command for intelligent responses
   - Ask questions, get help, or have conversations
   - AI remembers context within conversations

### Analytics & Reporting

#### Dashboard Metrics

- **Message Statistics:** Total sent/received messages
- **Command Usage:** Most popular commands
- **User Engagement:** Active user tracking
- **Performance Metrics:** Response times and success rates

#### Exporting Data

1. **Go to Analytics Tab**
2. **Select Time Period**
3. **Choose Export Format** (JSON/CSV)
4. **Click Export** to download reports

### Plugin System

#### Installing Plugins

1. **Download Plugin File:**
   - Get .js plugin files from the community
   - Or create your own plugins

2. **Load Plugin:**
   - Go to Settings → Plugin Manager
   - Click "Load Plugin" and select the .js file
   - Plugin appears in the plugin list

3. **Manage Plugins:**
   - Enable/disable individual plugins
   - View plugin information and version
   - Remove unwanted plugins

---

## 🔧 Troubleshooting

### Common Issues

#### WhatsApp Won't Connect

**Problem:** QR code doesn't work or connection fails

**Solutions:**
1. **Check Internet Connection:** Ensure stable internet
2. **Update WhatsApp:** Make sure WhatsApp is updated on your phone
3. **Clear Session:** Try "Reset Session" in the dashboard
4. **Restart Application:** Close and reopen WhatsBotX

#### Commands Not Working

**Problem:** Bot doesn't respond to commands

**Solutions:**
1. **Check Bot Status:** Ensure bot is running and connected
2. **Verify Command Format:** Use correct prefix (usually `/`)
3. **Check Spelling:** Commands are case-sensitive
4. **Restart Bot:** Try restarting the bot

#### Messages Not Sending

**Problem:** Bulk messages fail to send

**Solutions:**
1. **Validate Numbers:** Ensure phone numbers are in correct format
2. **Check Rate Limits:** WhatsApp has sending limits
3. **Verify Connection:** Make sure WhatsApp is connected
4. **Check Number Format:** Use international format (+country code)

#### Performance Issues

**Problem:** Application is slow or unresponsive

**Solutions:**
1. **Close Other Applications:** Free up system resources
2. **Restart Application:** Fresh start may resolve issues
3. **Check System Requirements:** Ensure minimum specs are met
4. **Clear Cache:** Use Settings → Advanced → Clear Cache

### Getting Help

#### Support Resources

- 📖 **Documentation:** [Full Documentation](https://docs.whatsbotx.com)
- 💬 **Community Forum:** [Discord Server](https://discord.gg/whatsbotx)
- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/Rudii-25/WhatsBotX/issues)
- 📧 **Email Support:** support@whatsbotx.com

#### Debug Information

When reporting issues, include:

- **WhatsBotX Version:** Check Settings → About
- **Operating System:** Windows/macOS/Linux version
- **Node.js Version:** Run `node --version`
- **Error Messages:** Copy exact error messages
- **Steps to Reproduce:** Detailed steps to recreate the issue

---

## 💡 Best Practices

### Message Sending

#### Rate Limiting
- **WhatsApp Limits:** Respect WhatsApp's sending limits
- **Batch Sizes:** Send in reasonable batches (10-50 messages)
- **Delays:** Add delays between messages (1-5 seconds)
- **Time Windows:** Avoid sending during restricted hours

#### Content Guidelines
- **Personalization:** Customize messages when possible
- **Clear Intent:** Be clear about why you're messaging
- **Opt-out Options:** Provide easy unsubscribe methods
- **Compliance:** Follow local regulations and laws

### Bot Management

#### Regular Maintenance
- **Daily Checks:** Monitor bot status daily
- **Log Review:** Check logs for errors or issues
- **Updates:** Keep WhatsBotX updated
- **Backups:** Backup important data regularly

#### Security Practices
- **API Keys:** Keep API keys secure and rotate regularly
- **Access Control:** Limit who has access to the bot
- **Session Management:** Regularly refresh WhatsApp sessions
- **Monitoring:** Monitor for unusual activity

### Performance Optimization

#### System Resources
- **Memory Management:** Close unused applications
- **Storage Space:** Keep adequate free space
- **Network:** Use stable, fast internet connection
- **Updates:** Keep system and dependencies updated

#### Bot Configuration
- **Command Limits:** Set reasonable rate limits
- **Cache Settings:** Configure appropriate cache sizes
- **Logging Levels:** Adjust logging based on needs
- **Auto-cleanup:** Enable automatic cleanup features

---

## 🎯 Advanced Usage

### API Integration

#### REST API Access

1. **Enable API:**
   - Go to Settings → API Configuration
   - Enable REST API
   - Set port (default: 3000)

2. **Get API Key:**
   - Generate or copy existing API key
   - Use for authentication in API calls

3. **API Endpoints:**
   - `POST /api/v1/messages/send` - Send messages
   - `GET /api/v1/analytics/dashboard` - Get analytics
   - `POST /api/v1/contacts` - Manage contacts

#### Webhook Integration

Configure webhooks for real-time notifications:

```javascript
// Example webhook handler
app.post('/whatsbotx-webhook', (req, res) => {
  const { event, data } = req.body;

  switch(event) {
    case 'message.received':
      console.log('New message:', data.message);
      break;
    case 'message.sent':
      console.log('Message sent:', data.id);
      break;
  }

  res.sendStatus(200);
});
```

### Custom Commands

#### Creating Custom Responses

1. **Use Auto-Reply:** Set up automatic responses
2. **Custom Messages:** Configure personalized replies
3. **Conditional Logic:** Set up rules-based responses

#### Plugin Development

1. **Plugin Structure:**
   ```javascript
   const myPlugin = {
     name: 'My Plugin',
     version: '1.0.0',
     init() {
       // Initialize plugin
     },
     commands: {
       '/mycommand': {
         handler: (args, user) => 'Custom response!'
       }
     }
   };
   ```

2. **Load Plugin:**
   - Save as .js file
   - Load through Plugin Manager
   - Enable and use custom commands

---

## 📊 Monitoring & Analytics

### Dashboard Overview

- **Real-time Metrics:** Live statistics and counters
- **Performance Charts:** Response times and success rates
- **Usage Patterns:** Command usage and user activity
- **System Health:** Memory usage and uptime tracking

### Custom Reports

#### Creating Reports

1. **Select Time Period:** Day, week, or month
2. **Choose Metrics:** Messages, commands, users
3. **Apply Filters:** By command type or user
4. **Export Format:** JSON or CSV download

#### Automated Reporting

Set up automated reports:

- **Daily Summaries:** End-of-day statistics
- **Weekly Reports:** Comprehensive weekly analysis
- **Monthly Insights:** Long-term trends and patterns
- **Custom Schedules:** Define your own reporting schedule

---

## 🔒 Security & Privacy

### Data Protection

- **Local Storage:** All data stored locally on your device
- **Encryption:** Sensitive data is encrypted
- **Access Control:** User authentication and permissions
- **Session Security:** Secure WhatsApp Web sessions

### Privacy Settings

- **Data Retention:** Configure how long to keep data
- **Analytics Opt-out:** Disable usage analytics if desired
- **Contact Privacy:** Control contact data sharing
- **API Security:** Secure API key management

---

## 🚀 Updates & Maintenance

### Keeping Updated

1. **Check for Updates:**
   - Go to Settings → About → Check Updates
   - Or visit the GitHub repository

2. **Backup Data:**
   - Export important data before updating
   - Backup configuration files

3. **Update Process:**
   - Download latest version
   - Follow update instructions
   - Test functionality after update

### Maintenance Tasks

#### Weekly Tasks
- [ ] Review logs for errors
- [ ] Check analytics for unusual activity
- [ ] Update contact lists
- [ ] Test key functionality

#### Monthly Tasks
- [ ] Full system backup
- [ ] Performance optimization
- [ ] Plugin updates
- [ ] Security review

---

<div align="center">

**📖 WhatsBotX User Manual**

*Version 2.0.0 - Last updated: January 24, 2024*
</div>

---

**Need help?** Check our [FAQ](FAQ.md) or [contact support](mailto:support@whatsbotx.com).

**📚 Related Documentation:**
- [Installation Guide](INSTALLATION.md)
- [API Reference](API.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)
- [Developer Guide](DEVELOPER_GUIDE.md)

---

<div align="center">

**Made with ❤️ by Rudra Sharma**

[⭐ Star us on GitHub](https://github.com/Rudii-25/WhatsBotX) • [🐛 Report Issues](https://github.com/Rudii-25/WhatsBotX/issues) • [📧 Contact Us](mailto:rudra25trikha@gmail.com)

[🌐 Project Website](https://rudii-25.github.io/WhatsBotX/) • [👤 Rudra Sharma](https://rudrasharma25.com) • [🔗 LinkedIn](https://www.linkedin.com/in/rudra-sharma-714a7b259/)

---

© 2026 Rudra Sharma. All rights reserved.

</div>
