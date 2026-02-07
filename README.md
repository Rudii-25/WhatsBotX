<div align="center">

# 🚀 WhatsBotX - Complete WhatsApp Automation Solution

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Electron](https://img.shields.io/badge/Electron-38.0.0-blue)](https://electronjs.org/)
[![WhatsApp Web](https://img.shields.io/badge/WhatsApp-Web-green)](https://web.whatsapp.com/)

**🤖 Personal AI Assistant with Professional GUI & Bulk Messaging**

> The ultimate WhatsApp automation platform featuring a modern Electron GUI, comprehensive bulk messaging system, AI assistant, and 41+ built-in commands. Ready for business and personal use.

[📖 Documentation](#-documentation) • [🚀 Quick Start](#-quick-start) • [📱 Features](#-features) • [🔧 API](#-api-reference) • [🤝 Contributing](#-contributing)

---

## ✨ **Screenshots**

<table>
  <tr>
    <td><img src="docs/screenshots/dashboard.png" alt="Dashboard" width="400"/></td>
    <td><img src="docs/screenshots/bulk-messaging.png" alt="Bulk Messaging" width="400"/></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/ai-chat.png" alt="AI Chat" width="400"/></td>
    <td><img src="docs/screenshots/settings.png" alt="Settings" width="400"/></td>
  </tr>
</table>

---

## 🎯 **Core Features**

### 🤖 **WhatsApp Bot Features**
- ✅ **WhatsApp Web Integration** - QR code connection with auto-reconnect
- ✅ **41+ Built-in Commands** - Comprehensive command system
- ✅ **Multi-User Support** - Database-backed user management
- ✅ **Smart Auto-Reply** - Customizable automatic responses
- ✅ **Real-time Message Processing** - Instant command recognition

### 🖥️ **Professional Electron GUI**
- ✅ **Modern Desktop Interface** - Cross-platform Electron application
- ✅ **Real-time QR Code Display** - Easy WhatsApp connection
- ✅ **Live Activity Dashboard** - Status monitoring, logs, statistics
- ✅ **Multi-tab Navigation** - Organized feature access
- ✅ **Theme Support** - Light/Dark mode switching

### 📨 **Advanced Bulk Messaging System**
- ✅ **Single Message Sending** - Individual message dispatch with validation
- ✅ **Bulk File Upload** - Import phone numbers from .txt files
- ✅ **Contact Management** - Add, edit, delete contact lists
- ✅ **Real-time Progress Tracking** - Live bulk send progress with statistics
- ✅ **Error Handling & Reporting** - Individual success/failure tracking
- ✅ **Phone Number Validation** - International format verification
- ✅ **Rate Limiting Protection** - Anti-spam delays to prevent blocking
- ✅ **Imported Numbers Visualization** - View all imported/added numbers before sending
- ✅ **Export Functionality** - Save contact lists for future use

### 🧠 **AI & Productivity Tools**
- ✅ **Interactive AI Chat** - Built-in AI assistant for conversations
- ✅ **Todo Management** - Full task management with GUI
- ✅ **Smart Reminders** - Time-based reminder system with scheduling
- ✅ **Quick Actions** - Jokes, quotes, time, weather, news, Wikipedia
- ✅ **Multi-language Support** - English/Hindi interface

### ⚙️ **Advanced Technical Features**
- ✅ **SQLite Database** - Persistent user and message storage
- ✅ **Express API Server** - RESTful endpoints for bulk messaging
- ✅ **Real-time Logging** - Comprehensive activity monitoring
- ✅ **Schedule Management** - Automated task scheduling with cron
- ✅ **Configuration Panel** - Easy settings management
- ✅ **Error Recovery** - Automatic reconnection and error handling

---

## 🚀 **Quick Start**

### 📋 **Prerequisites**
- 🟢 **Node.js 18+** - [Download here](https://nodejs.org/)
- 📱 **WhatsApp Account** - Active WhatsApp account required
- 💾 **Git** - Version control system

### ⚡ **Installation & Launch**

```bash
# 📥 Clone the repository
git clone https://github.com/Rudii-25/WhatsBotX.git
cd WhatsBotX

# 📦 Install dependencies
npm install

# 🚀 Start the complete application
npm start
```

**That's it!** The application will automatically:
1. ✅ Launch the Electron GUI
2. ✅ Start the WhatsApp bot with QR code
3. ✅ Initialize the API server for bulk messaging
4. ✅ Set up the database and all services

### 🔗 **Quick Connection**
1. **📱 Scan QR Code** - Use WhatsApp mobile to scan the displayed QR code
2. **⏳ Wait for Connection** - See "Connected" status in GUI
3. **🎉 Start Using** - Access all features through GUI or WhatsApp commands

### 📦 **Building Standalone Executables**

Build distributable applications for Windows, macOS, and Linux:

```bash
# 🪟 Build for Windows (.exe installer)
npm run build-win

# 🍎 Build for macOS (.dmg)
npm run build-mac

# 🐧 Build for Linux (AppImage)
npm run build-linux

# 🌍 Build for all platforms
npm run build-all
```

Output packages are in the `dist/` directory. See [BUILD.md](BUILD.md) for detailed build instructions.

---

## 📱 **Usage Guide**

### 💬 **WhatsApp Commands**
```
/help - 📋 List all available commands
/ai Hello! - 🤖 Chat with AI assistant
/joke - 😄 Get random joke
/todo add Buy groceries - ✅ Add task to todo list
/remind 7pm Gym time - ⏰ Set smart reminders
/weather Mumbai - 🌤️ Get weather information
/translate Hello to Hindi - 🌐 Translate text
/qr https://example.com - 🔲 Generate QR code
/autoreply on - 🔄 Enable auto-replies
/status - 📊 Bot statistics
```

### 🖥️ **GUI Features**

#### **🏠 Dashboard**
- Real-time connection status
- Message statistics
- Quick action buttons
- System uptime display

#### **💬 Bulk Messaging**
- **Single Message**: Send individual messages with validation
- **Bulk Upload**: Import phone numbers from .txt files
- **Contact Management**: Add, edit, delete contact lists
- **Progress Tracking**: Real-time bulk send progress

#### **🤖 AI Assistant**
- Interactive AI chat interface
- Context-aware conversations
- Multiple AI model support

#### **✅ Productivity**
- Todo list management
- Smart reminder scheduling
- Task completion tracking

#### **🛠️ Tools**
- Entertainment: Jokes, quotes, memes
- Information: Weather, news, Wikipedia
- Utilities: QR codes, translations, currency conversion

#### **⚙️ Settings**
- Theme switching (Light/Dark)
- Language preferences
- Auto-reply configuration

#### **📊 Logs**
- Real-time activity monitoring
- Error tracking and debugging
- System performance metrics

---

## 🏗️ **Technical Architecture**

### **🏛️ System Design**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Electron GUI  │    │  WhatsApp Bot   │    │   API Server    │
│   (Renderer)    │◄──►│  (whatsapp-web) │◄──►│   (Express)     │
│                 │    │                 │    │                 │
│ • User Interface│    │ • Message Proc. │    │ • REST Endpoints│
│ • Real-time UI  │    │ • Command Hand. │    │ • Bulk Messaging│
│ • Settings Mgmt │    │ • Auto Replies  │    │ • Health Checks │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  SQLite Database│
                    │                 │
                    │ • Users         │
                    │ • Messages      │
                    │ • Todos         │
                    │ • Reminders     │
                    │ • Settings      │
                    └─────────────────┘
```

### **📁 Project Structure**
```
WhatsBotX/
├── 📁 src/
│   ├── 📁 electron/           # GUI application
│   │   ├── main.cjs          # Electron main process
│   │   └── 📁 renderer/      # GUI frontend
│   │       ├── index.html    # Main interface
│   │       ├── styles.css    # Modern styling
│   │       └── app.js        # Frontend logic
│   ├── 📁 bot/               # WhatsApp core
│   │   └── WhatsAppBot.js    # whatsapp-web.js integration
│   ├── 📁 api/               # REST API
│   │   └── ApiServer.js      # Express server
│   ├── 📁 commands/          # Command handlers
│   │   └── CommandHandler.js # 41+ command implementations
│   ├── 📁 database/          # SQLite database
│   │   └── Database.js       # Database operations
│   ├── 📁 services/          # Business logic
│   │   ├── ScheduleManager.js # Reminder scheduling
│   │   └── Logger.js         # Logging utilities
│   └── 📁 utils/            # Utilities
├── 📁 data/                  # Database & sessions
├── 📁 docs/                  # Documentation
├── 📁 scripts/               # Build scripts
├── sample_numbers.txt        # Demo phone numbers
├── package.json              # Dependencies & scripts
├── LICENSE                   # MIT License
└── README.md                 # This file
```

---

## 🔧 **API Reference**

### **📡 Endpoints**

#### **Send Single Message**
```http
POST /send-message
Content-Type: application/json

{
  "number": "+919876543210",
  "message": "Hello from WhatsBotX!"
}
```

#### **Send Bulk Messages**
```http
POST /send-bulk
Content-Type: application/json

{
  "numbers": ["+919876543210", "+919876543211"],
  "message": "Bulk message content"
}
```

#### **Bot Status**
```http
GET /status
```

#### **Health Check**
```http
GET /health
```

### **📊 Response Examples**

**Success Response:**
```json
{
  "success": true,
  "number": "+919876543210",
  "timestamp": "2024-01-24T16:28:02.589Z"
}
```

**Bulk Response:**
```json
{
  "success": true,
  "results": [
    {
      "number": "+919876543210",
      "success": true
    },
    {
      "number": "+919876543211",
      "success": false,
      "error": "Invalid number"
    }
  ]
}
```

---

## 📊 **Database Schema**

| Table | Description | Key Fields |
|-------|-------------|------------|
| **users** | User profiles and preferences | id, phone_number, name, language, timezone |
| **todos** | Task management | id, user_id, task, completed, priority, due_date |
| **reminders** | Scheduled reminders | id, user_id, message, remind_at, sent |
| **chat_history** | Message history | id, user_id, message, response, command |
| **settings** | User settings | id, user_id, key, value |

---

## 🎯 **Use Cases**

### **🏢 Business Applications**
- 📢 **Marketing Campaigns** - Bulk messaging for promotions
- 🏪 **Customer Support** - Automated responses and notifications
- 📊 **Lead Management** - Follow-up messaging and reminders
- 📅 **Appointment Reminders** - Automated scheduling notifications
- 🛒 **Order Updates** - Status notifications and tracking

### **👤 Personal Use**
- 🤖 **AI Assistant** - Personal AI conversations and help
- ✅ **Task Management** - Todo lists and reminders
- 👨‍👩‍👧‍👦 **Family Coordination** - Group management and updates
- 🎮 **Entertainment** - Jokes, quotes, and fun interactions
- 📱 **Automation** - Custom commands and workflows

---

## 📈 **Performance Metrics**

| Metric | Value | Description |
|--------|-------|-------------|
| **Startup Time** | ~3-5 seconds | Application initialization |
| **Message Processing** | <100ms | Per message processing time |
| **Bulk Messaging** | 1 msg/sec | Rate limited for safety |
| **Memory Usage** | ~50-100MB | Typical application usage |
| **Database** | SQLite | Optimized queries |
| **GUI Response** | Real-time | Instant UI updates |

---

## 🔒 **Security & Privacy**

### **🛡️ Security Features**
- **Input Validation** - All user inputs validated and sanitized
- **Rate Limiting** - Prevents spam and abuse
- **Session Management** - Secure WhatsApp Web sessions
- **Error Handling** - Comprehensive error recovery
- **Logging** - Activity monitoring without sensitive data

### **🔐 Privacy Protection**
- **Local Storage** - All data stored locally on device
- **No Data Collection** - No user data sent to external servers
- **Session Encryption** - WhatsApp Web encryption standards
- **Access Control** - User-specific data isolation

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **📋 Development Setup**
```bash
# Fork and clone
git clone https://github.com/Rudii-25/WhatsBotX.git
cd WhatsBotX

# Install dependencies
npm install

# Start development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### **🐛 Bug Reports & Feature Requests**
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Rudii-25/WhatsBotX/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/Rudii-25/WhatsBotX/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/Rudii-25/WhatsBotX/wiki)

---

## 📄 **Documentation**

### **📚 Available Documentation**
- [📖 **Installation Guide**](docs/INSTALLATION.md) - Detailed setup instructions
- [🎮 **User Manual**](docs/USER_MANUAL.md) - Complete usage guide
- [🔧 **API Documentation**](docs/API_REFERENCE.md) - Technical API reference
- [🛠️ **Developer Guide**](docs/DEVELOPER_GUIDE.md) - Development and contribution guide
- [🚀 **Deployment Guide**](docs/DEPLOYMENT.md) - Production deployment instructions
- [❓ **FAQ**](docs/FAQ.md) - Frequently asked questions
- [🔧 **Troubleshooting Guide**](docs/TROUBLESHOOTING.md) - Common issues and solutions
- [📸 **Screenshots & Media**](docs/photos.md) - Visual gallery and media content
- [🔄 **Changelog**](docs/CHANGELOG.md) - Version history and updates

---

## 📞 **Support**

### **🆘 Getting Help**
- 📧 **Email**: support@whatsbotx.com
- 💬 **Discord**: [Join our community](https://discord.gg/whatsbotx)
- 📖 **Documentation**: [Read the docs](docs/)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Rudii-25/WhatsBotX/issues)

### **🔍 Troubleshooting**
- Check the [FAQ](docs/FAQ.md) first
- Review [logs](docs/LOGGING.md) for error details
- Ensure Node.js version compatibility
- Verify WhatsApp Web connectivity

---

## 📜 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Credits & Acknowledgments**

### **🏆 Core Team**
- **Rudra Sharma** - Lead Developer & Project Founder
- **WhatsBotX Community** - Contributors and testers

### **📚 Libraries & Dependencies**
- **whatsapp-web.js** - WhatsApp Web API integration
- **Electron** - Cross-platform desktop app framework
- **Express.js** - REST API server
- **SQLite3** - Database engine
- **OpenAI** - AI chat capabilities

### **🎨 Icons & Assets**
- **Font Awesome** - UI icons and symbols
- **Google Fonts** - Typography
- **Unsplash** - Documentation images

---

## 🎉 **What's Next?**

### **🚀 Upcoming Features**
- [ ] **Group Management** - Advanced group chat features
- [ ] **Plugin System** - Extensible command architecture
- [ ] **Multi-Device Support** - Multiple WhatsApp accounts
- [ ] **Advanced Analytics** - Detailed usage statistics
- [ ] **Mobile App** - React Native companion app

### **🔮 Vision**
WhatsBotX aims to be the most comprehensive WhatsApp automation platform, combining AI capabilities with enterprise-grade features for both personal and business use.

---

<div align="center">

**Made with ❤️ by Rudra Sharma**

[⭐ Star us on GitHub](https://github.com/Rudii-25/WhatsBotX) • [🐛 Report Issues](https://github.com/Rudii-25/WhatsBotX/issues) • [📧 Contact Us](mailto:rudra25trikha@gmail.com)

[🌐 Project Website](https://rudii-25.github.io/WhatsBotX/) • [👤 Rudra Sharma](https://rudrasharma25.com) • [🔗 LinkedIn](https://www.linkedin.com/in/rudra-sharma-714a7b259/)

---

© 2026 Rudra Sharma. All rights reserved.

*If this project helped you, please give it a star! ⭐*

</div>
