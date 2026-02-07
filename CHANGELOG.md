# 📝 Changelog

All notable changes to WhatsBotX will be documented in this file.

## [2.1.0] - February 6, 2026

### ✨ New Features
- ✅ **Bulk Import Numbers Display** - View all imported/added numbers before sending
- ✅ **API Server GUI Control** - Start/stop API server from Settings → Advanced tab
- ✅ **Improved Accent Color** - Color picker with proper initialization and persistence
- ✅ **Enhanced Toggle Buttons** - Better sizing and visual appearance in accessibility tab

### 🎨 UI/UX Improvements
- ✅ Removed theme button from header - theme control now in Settings only
- ✅ Toggle buttons redesigned with better proportions (44x20px)
- ✅ Numbers import list shows up to 50 items with "+X more" indicator
- ✅ Better visual feedback for toggle states
- ✅ Settings tabs now properly scoped to their containers
- ✅ Accent color restores from localStorage on page load

### 🔧 Technical Updates
- ✅ Real IPC handler for API server toggle (`toggle-api-server`)
- ✅ New function `displayImportedNumbers()` for visualizing bulk imports
- ✅ Container-specific tab switching in GUI
- ✅ Proper initialization sequence for theme and accent color
- ✅ Better error handling for API server startup

### 📚 Documentation Updates
- ✅ Updated README.md with new bulk import features
- ✅ Updated USER_MANUAL.md with API server instructions
- ✅ Updated INSTALLATION.md with GUI startup procedures
- ✅ Updated API.md with current port and startup info
- ✅ Updated DEVELOPER_GUIDE.md with GUI and IPC details

### 🐛 Bug Fixes
- ✅ Fixed accent color not applying on page load
- ✅ Fixed toggle buttons not responding properly
- ✅ Fixed API server mocking - now actually starts via IPC
- ✅ Fixed theme button cluttering header
- ✅ Fixed toggle bar being too large

### 📦 Dependencies
- No new dependencies added
- Uses existing: Electron, Express, Whatsapp-web.js, SQLite3

---

<div align="center">

**Made with ❤️ by Rudra Sharma**

[⭐ Star us on GitHub](https://github.com/Rudii-25/WhatsBotX) • [🐛 Report Issues](https://github.com/Rudii-25/WhatsBotX/issues) • [📧 Contact Us](mailto:rudra25trikha@gmail.com)

[🌐 Project Website](https://rudii-25.github.io/WhatsBotX/) • [👤 Rudra Sharma](https://rudrasharma25.com) • [🔗 LinkedIn](https://www.linkedin.com/in/rudra-sharma-714a7b259/)

---

© 2026 Rudra Sharma. All rights reserved.

</div>

## [2.0.0] - January 24, 2026

### ✨ Major Features
- 🎉 Professional Electron GUI with multi-tab interface
- 📨 Advanced bulk messaging system with progress tracking
- 🤖 AI assistant integration
- ✅ Todo list management
- ⏰ Smart reminders and scheduling
- 🎯 41+ built-in commands
- 📊 Real-time analytics dashboard

### 🏗️ Architecture
- Express API server on port 3001
- SQLite database for persistence
- IPC communication between Electron and main process
- Event-driven message processing

---

## [1.0.0] - Initial Release

### ✨ Initial Features
- WhatsApp Web integration via QR code
- Basic command processing
- CLI interface
- Database storage
