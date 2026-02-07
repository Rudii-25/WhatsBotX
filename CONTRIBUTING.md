# 🤝 Contributing to WhatsBotX

Welcome to the **WhatsBotX Contributing Guide**! We're thrilled that you're interested in contributing to our WhatsApp automation platform. This guide will help you get started with contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Contributing Guidelines](#-contributing-guidelines)
- [Submitting Changes](#-submitting-changes)
- [Reporting Issues](#-reporting-issues)
- [Community](#-community)

---

## 📜 Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. By participating, you agree to:

- **Be respectful** - Treat all contributors with respect and kindness
- **Be inclusive** - Welcome contributors from all backgrounds and skill levels
- **Be collaborative** - Work together to improve the project
- **Be patient** - Understand that everyone has different experience levels
- **Be constructive** - Provide helpful feedback and suggestions

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- 🟢 **Node.js 18+** - [Download here](https://nodejs.org/)
- 📱 **WhatsApp Account** - For testing WhatsApp features
- 💻 **Git** - Version control system
- 📝 **VS Code** (recommended) - With ESLint and Prettier extensions

### Quick Start

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/Rudii-25/WhatsBotX.git
cd WhatsBotX

# 3. Install dependencies
npm install

# 4. Create a feature branch
git checkout -b feature/your-feature-name

# 5. Start development
npm run dev

# 6. Make your changes and test thoroughly
```

---

## 🛠️ Development Setup

### Environment Configuration

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your environment:**
   ```env
   # Required
   BOT_PREFIX=/
   API_PORT=3000

   # Optional (for enhanced features)
   OPENAI_API_KEY=your-openai-key
   WEATHER_API_KEY=your-weather-key
   NEWS_API_KEY=your-news-key
   ```

### Development Scripts

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

### Project Structure

```
WhatsBotX/
├── 📁 src/
│   ├── 📁 electron/           # GUI application
│   │   ├── main.cjs          # Electron main process
│   │   └── 📁 renderer/      # GUI frontend
│   ├── 📁 bot/               # WhatsApp core
│   ├── 📁 commands/          # Command handlers
│   ├── 📁 database/          # SQLite database
│   ├── 📁 api/               # REST API
│   └── 📁 utils/            # Utilities
├── 📁 tests/                 # Test files
├── 📁 docs/                  # Documentation
└── 📁 scripts/               # Build scripts
```

---

## 📝 Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

#### 🐛 Bug Fixes
- Fix reported bugs and issues
- Improve error handling and stability
- Add missing validation

#### ✨ New Features
- Implement new commands and features
- Enhance existing functionality
- Add new integrations

#### 📚 Documentation
- Improve existing documentation
- Add missing documentation
- Create tutorials and guides

#### 🧪 Testing
- Add unit tests and integration tests
- Improve test coverage
- Test edge cases and error scenarios

#### 🎨 UI/UX Improvements
- Enhance user interface design
- Improve user experience
- Add accessibility features

### Code Standards

#### JavaScript Standards

**ES6+ Features:**
```javascript
// ✅ Use arrow functions
const processMessage = async (message) => {
  // implementation
};

// ✅ Use async/await
const result = await database.query(sql);

// ✅ Use destructuring
const { id, name } = user;

// ✅ Use template literals
const message = `Hello ${name}!`;
```

**Error Handling:**
```javascript
// ✅ Proper error handling
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  logger.error('Operation failed:', error);
  throw new Error('Operation failed');
}
```

#### Naming Conventions

**Files and Classes:**
```javascript
// PascalCase for classes
class WhatsAppBot { }

// camelCase for files
// whatsAppBot.js

// kebab-case for directories
// command-handler/
```

**Variables and Functions:**
```javascript
// camelCase for variables and functions
const userId = 123;
function processMessage() { }

// UPPER_CASE for constants
const MAX_RETRIES = 3;
const API_BASE_URL = 'http://localhost:3000';
```

#### Commit Message Format

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Testing
- `chore`: Maintenance

**Examples:**
```
feat(auth): add user authentication system
fix(api): handle null response in weather endpoint
docs(readme): update installation instructions
test(commands): add unit tests for todo commands
```

---

## 🔄 Submitting Changes

### Pull Request Process

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write clear, concise code
   - Add tests for new functionality
   - Update documentation if needed
   - Ensure all tests pass

3. **Test your changes:**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request:**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your feature branch
   - Fill out the PR template
   - Submit for review

### Pull Request Template

Please use this template when creating PRs:

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed
- [ ] All tests pass

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
```

---

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

**Essential Information:**
- WhatsBotX version
- Node.js version
- Operating system
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error messages/logs

**Bug Report Template:**
```markdown
**Bug Description**
A clear and concise description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain the problem.

**Environment:**
- OS: [e.g., Windows 10]
- Node.js Version: [e.g., 18.15.0]
- WhatsBotX Version: [e.g., 2.0.0]

**Additional Context**
Add any other context about the problem here.
```

### Feature Requests

For feature requests, please include:

- **Feature Description:** What feature would you like to see?
- **Use Case:** How would this feature be used?
- **Benefits:** What problems would this solve?
- **Alternatives:** Have you considered any alternatives?

---

## 🌟 Community

### Communication Channels

- 💬 **Discord:** [Join our community](https://discord.gg/whatsbotx)
- 🐛 **GitHub Issues:** [Report bugs and request features](https://github.com/Rudii-25/WhatsBotX/issues)
- 📧 **Email:** support@whatsbotx.com

### Getting Help

If you need help:

1. **Check the documentation** - Most answers are in our docs
2. **Search existing issues** - Your question might already be answered
3. **Ask the community** - Use Discord for quick questions
4. **Create an issue** - For bugs or feature requests

### Recognition

Contributors are recognized in several ways:

- **Contributors List:** Added to the main README
- **Changelog:** Features and fixes credited in releases
- **Community Recognition:** Special mentions in Discord
- **Maintainer Status:** Active contributors may become maintainers

---

## 🎯 Development Roadmap

### Current Priorities

- [ ] Multi-device support
- [ ] Advanced analytics dashboard
- [ ] Plugin marketplace
- [ ] Mobile app companion
- [ ] Group management features

### Future Goals

- [ ] AI-powered automation
- [ ] Integration with other messaging platforms
- [ ] Advanced scheduling system
- [ ] Custom command builder
- [ ] API rate limiting improvements

---

## 📞 Support

### For Contributors

If you have questions about contributing:

- 📖 **Documentation:** [Developer Guide](DEVELOPER_GUIDE.md)
- 💬 **Community:** [Discord Server](https://discord.gg/whatsbotx)
- 📧 **Maintainers:** Contact via GitHub issues

### For Users

If you're having issues with WhatsBotX:

- 📖 **User Manual:** [User Guide](USER_MANUAL.md)
- 🔧 **Troubleshooting:** [Troubleshooting Guide](TROUBLESHOOTING.md)
- ❓ **FAQ:** [Frequently Asked Questions](FAQ.md)

---

<div align="center">

**Thank you for contributing to WhatsBotX! 🎉**

Your contributions help make WhatsApp automation better for everyone.

---

*Contributing Guide v2.1.0 - Last updated: January 24, 2024*

---

<div align="center">

**Made with ❤️ by Rudra Sharma**

[⭐ Star us on GitHub](https://github.com/Rudii-25/WhatsBotX) • [🐛 Report Issues](https://github.com/Rudii-25/WhatsBotX/issues) • [📧 Contact Us](mailto:rudra25trikha@gmail.com)

[🌐 Project Website](https://rudii-25.github.io/WhatsBotX/) • [👤 Rudra Sharma](https://rudrasharma25.com) • [🔗 LinkedIn](https://www.linkedin.com/in/rudra-sharma-714a7b259/)

---

© 2026 Rudra Sharma. All rights reserved.

</div>
