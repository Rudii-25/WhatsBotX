# 🐛 Troubleshooting Guide

Welcome to the **WhatsBotX Troubleshooting Guide**. This comprehensive guide helps you resolve common issues and get WhatsBotX running smoothly.

## 📋 Table of Contents

- [Quick Diagnosis](#-quick-diagnosis)
- [Installation Issues](#-installation-issues)
- [Connection Problems](#-connection-problems)
- [Command Issues](#-command-issues)
- [Performance Issues](#-performance-issues)
- [Database Issues](#-database-issues)
- [API Issues](#-api-issues)
- [Security Issues](#-security-issues)
- [Advanced Troubleshooting](#-advanced-troubleshooting)

---

## 🔍 Quick Diagnosis

### System Health Check

Run these commands to check your WhatsBotX installation:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check system resources
# Windows
systeminfo | findstr /C:"Total Physical Memory" /C:"Available Physical Memory"

# Linux/macOS
free -h
df -h

# Check network connectivity
ping -c 4 google.com

# Check WhatsBotX status
curl http://localhost:3000/health 2>/dev/null || echo "WhatsBotX not running"
```

### Log Analysis

Check the logs for error patterns:

```bash
# View recent logs
tail -50 logs/whatsbotx.log

# Search for errors
grep "ERROR" logs/whatsbotx.log | tail -10

# Check for specific error types
grep "connection" logs/whatsbotx.log | tail -5
```

---

## 📦 Installation Issues

### "npm install" fails

**Symptoms:**
- Installation hangs or fails
- Permission errors
- Network timeouts

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Fix permissions (Linux/macOS):**
   ```bash
   sudo chown -R $(whoami) ~/.npm
   sudo chown -R $(whoami) /usr/local/lib/node_modules
   ```

4. **Use different registry:**
   ```bash
   npm config set registry https://registry.npmjs.org/
   npm install
   ```

5. **Install behind proxy:**
   ```bash
   npm config set proxy http://proxy.company.com:8080
   npm config set https-proxy http://proxy.company.com:8080
   ```

### Node.js version issues

**Error:** `Node.js version 18.0.0 or higher required`

**Solutions:**

1. **Check current version:**
   ```bash
   node --version
   ```

2. **Update Node.js:**
   - Download latest LTS from [nodejs.org](https://nodejs.org/)
   - Or use version manager:
   ```bash
   # Using nvm (Linux/macOS)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   ```

### Git clone fails

**Symptoms:**
- Clone hangs or fails
- Authentication errors
- Permission denied

**Solutions:**

1. **Check Git installation:**
   ```bash
   git --version
   ```

2. **Use HTTPS instead of SSH:**
   ```bash
   git clone https://github.com/yourusername/WhatsBotX.git
   ```

3. **Configure Git credentials:**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

---

## 📱 Connection Problems

### QR Code not displaying

**Symptoms:**
- No QR code appears in GUI
- Blank screen or loading forever
- Console shows errors

**Solutions:**

1. **Check console logs:**
   ```bash
   # In WhatsBotX directory
   npm run dev 2>&1 | tee console.log
   ```

2. **Clear browser cache:**
   - Close WhatsBotX
   - Clear browser data
   - Restart application

3. **Check port availability:**
   ```bash
   # Windows
   netstat -ano | findstr :3000

   # Linux/macOS
   lsof -i :3000
   ```

4. **Try different port:**
   ```bash
   PORT=3001 npm start
   ```

5. **Disable firewall temporarily:**
   - Windows: Windows Defender Firewall
   - Linux: `sudo ufw disable`
   - macOS: System Preferences → Security & Privacy

### QR Code expired/invalid

**Symptoms:**
- QR code shows but doesn't work
- WhatsApp says "QR code expired"

**Solutions:**

1. **Restart WhatsBotX:**
   ```bash
   # Stop application (Ctrl+C)
   # Clear session data
   rm -rf .wwebjs_auth/
   # Restart
   npm start
   ```

2. **Check WhatsApp app:**
   - Ensure WhatsApp is updated
   - Try logging out and back in
   - Check if WhatsApp Web is blocked

3. **Network issues:**
   - Try different network
   - Disable VPN if active
   - Check firewall settings

### Connection drops frequently

**Symptoms:**
- Bot connects but disconnects randomly
- "Connection lost" messages
- Requires frequent reconnection

**Solutions:**

1. **Check internet stability:**
   ```bash
   ping -t google.com  # Windows
   ping google.com     # Linux/macOS
   ```

2. **Update whatsapp-web.js:**
   ```bash
   npm update whatsapp-web.js
   ```

3. **Increase reconnection delay:**
   ```javascript
   // In .env file
   RECONNECT_DELAY=10000  # 10 seconds
   ```

4. **Check WhatsApp Web status:**
   - WhatsApp may have API changes
   - Monitor [WhatsApp Web status](https://web.whatsapp.com/)

---

## 🤖 Command Issues

### Commands not responding

**Symptoms:**
- Bot receives messages but doesn't reply
- Commands work sometimes but not others

**Solutions:**

1. **Check bot status:**
   ```bash
   curl http://localhost:3000/api/v1/status
   ```

2. **Verify command syntax:**
   - Use `/help` to see available commands
   - Check command format in documentation

3. **Check rate limiting:**
   - Commands may be rate limited
   - Wait a few minutes and try again

4. **Restart command handler:**
   ```javascript
   // In console
   process.restart()  // If using PM2
   ```

### Unknown command errors

**Symptoms:**
- "Unknown command" responses
- Commands that should work don't

**Solutions:**

1. **Check command prefix:**
   - Default prefix is `/`
   - Verify in `.env` file: `BOT_PREFIX=/`

2. **Update to latest version:**
   ```bash
   git pull origin main
   npm install
   npm restart
   ```

3. **Check for typos:**
   - Commands are case-sensitive
   - Ensure correct spelling

### Auto-reply not working

**Symptoms:**
- Auto-reply commands don't respond
- Manual replies work but auto doesn't

**Solutions:**

1. **Check auto-reply settings:**
   ```
   /autoreply status
   ```

2. **Enable auto-reply:**
   ```
   /autoreply on
   ```

3. **Set custom message:**
   ```
   /busy I'm busy right now
   ```

4. **Check user permissions:**
   - Auto-reply is per-user setting
   - Ensure correct user context

---

## ⚡ Performance Issues

### High CPU usage

**Symptoms:**
- System becomes slow
- High CPU usage in task manager
- Application unresponsive

**Solutions:**

1. **Check system resources:**
   ```bash
   # Windows
   taskmgr

   # Linux
   top

   # macOS
   Activity Monitor
   ```

2. **Limit concurrent operations:**
   ```javascript
   // In .env
   MAX_CONCURRENT_OPERATIONS=5
   ```

3. **Optimize database queries:**
   ```bash
   # Check slow queries
   sqlite3 data/whatsbotx.db ".timer on" "SELECT * FROM messages LIMIT 1000;"
   ```

4. **Update dependencies:**
   ```bash
   npm audit fix
   npm update
   ```

### High memory usage

**Symptoms:**
- Memory usage keeps increasing
- Out of memory errors
- Application crashes

**Solutions:**

1. **Monitor memory usage:**
   ```bash
   # Linux/macOS
   ps aux | grep node

   # Windows PowerShell
   Get-Process node | Select-Object Name, CPU, Memory
   ```

2. **Enable garbage collection:**
   ```bash
   node --expose-gc --max-old-space-size=4096 src/index.js
   ```

3. **Check for memory leaks:**
   ```javascript
   // Add to code for debugging
   if (global.gc) {
     global.gc();
     console.log('GC completed');
   }
   ```

4. **Restart periodically:**
   ```bash
   # Using PM2
   pm2 restart whatsbotx
   ```

### Slow response times

**Symptoms:**
- Commands take long to respond
- GUI is sluggish
- API calls are slow

**Solutions:**

1. **Check network latency:**
   ```bash
   ping -c 5 google.com
   ```

2. **Optimize database:**
   ```bash
   sqlite3 data/whatsbotx.db "VACUUM;"
   sqlite3 data/whatsbotx.db "REINDEX;"
   ```

3. **Enable caching:**
   ```javascript
   // In .env
   ENABLE_CACHING=true
   CACHE_TTL=300000  # 5 minutes
   ```

4. **Profile performance:**
   ```bash
   npm install -g clinic
   clinic doctor -- node src/index.js
   ```

---

## 💾 Database Issues

### Database corrupted

**Symptoms:**
- "Database disk image is malformed" errors
- Application crashes on startup
- Data appears corrupted

**Solutions:**

1. **Backup existing database:**
   ```bash
   cp data/whatsbotx.db data/whatsbotx.db.backup
   ```

2. **Repair database:**
   ```bash
   sqlite3 data/whatsbotx.db ".recover" | sqlite3 data/whatsbotx_repaired.db
   mv data/whatsbotx_repaired.db data/whatsbotx.db
   ```

3. **Recreate database:**
   ```bash
   rm data/whatsbotx.db
   npm run migrate  # If migration script exists
   ```

### Permission denied

**Symptoms:**
- "Permission denied" when accessing database
- SQLite errors about file permissions

**Solutions:**

1. **Fix file permissions:**
   ```bash
   # Linux/macOS
   chmod 755 data/
   chmod 644 data/whatsbotx.db

   # Windows
   # Right-click folder → Properties → Security → Edit permissions
   ```

2. **Change database location:**
   ```javascript
   // In .env
   DB_PATH=/tmp/whatsbotx.db
   ```

### Database locked

**Symptoms:**
- "Database is locked" errors
- Multiple processes trying to access database

**Solutions:**

1. **Check for multiple instances:**
   ```bash
   ps aux | grep whatsbotx
   kill -9 <PID>  # Kill duplicate processes
   ```

2. **Use WAL mode:**
   ```bash
   sqlite3 data/whatsbotx.db "PRAGMA journal_mode=WAL;"
   ```

3. **Increase timeout:**
   ```javascript
   // In database config
   const db = new sqlite3.Database('./data/whatsbotx.db', {
     timeout: 10000  // 10 seconds
   });
   ```

---

## 🔌 API Issues

### API Server Not Starting from GUI

**Symptoms:**
- "Failed to toggle API" error message
- API Dashboard shows "Inactive"
- localhost:3001 refusing to connect

**Solutions:**

1. **Check if bot is running:**
   - API server requires bot to be started first
   - Click "Start Bot" in Control Panel
   - Wait for "Connected" status

2. **Start API server from Settings:**
   - Go to Settings → Advanced tab
   - Click "Start API Server" button
   - Check for success notification

3. **View API server logs:**
   - Open DevTools (F12 in GUI)
   - Go to Console tab
   - Look for API server startup messages
   - Check for error messages

4. **Verify port availability:**
   ```bash
   # Windows
   netstat -ano | findstr :3001
   
   # Linux/macOS
   lsof -i :3001
   ```

5. **Check API Dashboard:**
   - Navigate to "API Dashboard & Endpoints"
   - Click "Status" tab
   - Verify server status display

### API localhost:3001 Refusing Connection

**Symptoms:**
- "Connection refused" error
- Unable to connect to localhost:3001
- Port 3001 already in use

**Solutions:**

1. **Change API port in Settings:**
   - Go to Settings → Advanced tab
   - Modify "API Port" field
   - Save and restart bot
   - Start API server again

2. **Free up port 3001:**
   ```bash
   # Kill process using port 3001
   # Windows
   taskkill /PID [PID] /F
   
   # Linux/macOS
   kill -9 [PID]
   ```

3. **Check firewall settings:**
   - Allow WhatsBotX through firewall
   - Ensure port 3001 is not blocked
   - Check antivirus port restrictions

### API not responding

**Symptoms:**
- API endpoints return 500 errors
- API server appears started but unresponsive
- No response from API calls

**Solutions:**

1. **Verify bot is still connected:**
   - Check Control Panel status
   - If disconnected, reconnect with QR code
   - API server stops if bot disconnects

2. **Check API logs:**
   - Open DevTools (F12)
   - Check console for error messages
   - Look for "API" related warnings

3. **Restart everything:**
   - Stop Bot (button in Control Panel)
   - Stop API Server (button in Settings)
   - Wait 2 seconds
   - Start Bot again
   - Start API Server again

### Authentication failures

**Symptoms:**
- 401 Unauthorized errors
- API key rejected

**Solutions:**

1. **Generate new API key:**
   - Go to Settings → Advanced tab
   - API Dashboard → API Keys tab
   - Click "Generate New Key"
   - Copy and use new key

2. **Check API key format:**
   ```bash
   # Should be in Authorization header
   curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:3001/api/messages
   ```

3. **View existing keys:**
   - Settings → Advanced
   - API Dashboard → API Keys tab
   - Lists all available API keys

### Rate limiting issues

**Symptoms:**
- 429 Too Many Requests errors
- Requests being blocked

**Solutions:**

1. **Check rate limits:**
   ```bash
   # View rate limit headers
   curl -v http://localhost:3001/api/status
   # Look for X-RateLimit-* headers
   ```

2. **Implement backoff:
   ```javascript
   // Client-side retry with exponential backoff
   async function apiCall(retryCount = 0) {
     try {
       const response = await fetch('/api/v1/send-message', options);
       if (response.status === 429) {
         const delay = Math.pow(2, retryCount) * 1000;
         await new Promise(resolve => setTimeout(resolve, delay));
         return apiCall(retryCount + 1);
       }
       return response;
     } catch (error) {
       throw error;
     }
   }
   ```

---

## 🔒 Security Issues

### Suspicious activity

**Symptoms:**
- Unexpected log entries
- Unknown API calls
- Unusual resource usage

**Solutions:**

1. **Monitor logs:**
   ```bash
   tail -f logs/whatsbotx.log | grep -E "(ERROR|WARN|auth)"
   ```

2. **Check active connections:**
   ```bash
   netstat -tlnp | grep :3000
   ```

3. **Audit API keys:**
   ```bash
   # Rotate API keys
   # Update .env with new keys
   # Restart application
   ```

4. **Enable security logging:**
   ```javascript
   // In .env
   LOG_LEVEL=debug
   SECURITY_LOGGING=true
   ```

### Data exposure concerns

**Symptoms:**
- Sensitive data in logs
- Database files accessible

**Solutions:**

1. **Secure database files:**
   ```bash
   chmod 600 data/whatsbotx.db
   ```

2. **Filter sensitive data from logs:**
   ```javascript
   // In logger
   const cleanMessage = message.replace(/password=\w+/g, 'password=***');
   ```

3. **Use environment variables:**
   ```bash
   # Instead of hardcoding
   API_KEY=$API_KEY
   ```

---

## 🔧 Advanced Troubleshooting

### Debug Mode

Enable detailed logging for troubleshooting:

```bash
# Set debug logging
export DEBUG=whatsbotx:*
export LOG_LEVEL=debug

# Restart application
npm restart
```

### Core Dump Analysis

For crashes and segmentation faults:

```bash
# Enable core dumps
ulimit -c unlimited

# Run with core dump
node --abort-on-uncaught-exception src/index.js

# Analyze core dump
gdb node core
```

### Memory Profiling

Identify memory leaks:

```bash
# Install heapdump
npm install heapdump

# Add to code
const heapdump = require('heapdump');
setInterval(() => {
  heapdump.writeSnapshot();
}, 60000);  // Every minute

# Analyze snapshots with Chrome DevTools
```

### Network Debugging

Debug network issues:

```bash
# Enable network logging
export NODE_DEBUG=http,https
npm start 2>&1 | tee network.log

# Use Wireshark for packet analysis
# Filter: tcp port 3000 or host web.whatsapp.com
```

### WhatsApp Web Debugging

Debug WhatsApp Web integration:

```javascript
// Enable puppeteer debugging
const browser = await puppeteer.launch({
  headless: false,  // Show browser window
  devtools: true,   // Open DevTools
  slowMo: 100       // Slow down operations
});
```

### Database Query Analysis

Analyze slow database queries:

```bash
# Enable SQLite tracing
sqlite3 data/whatsbotx.db ".trace stdout" ".read schema.sql"

# Use EXPLAIN QUERY PLAN
sqlite3 data/whatsbotx.db "EXPLAIN QUERY PLAN SELECT * FROM messages WHERE user_id = 1;"
```

---

## 📞 Getting Help

### When to seek help

**Contact support if:**
- All troubleshooting steps fail
- You suspect a bug in WhatsBotX
- Security concerns
- Data loss incidents

### Information to provide

**Essential information:**
- WhatsBotX version (`npm list whatsbotx`)
- Node.js version (`node --version`)
- Operating system and version
- Complete error logs
- Steps to reproduce the issue
- System resource usage (CPU, memory, disk)

### Support channels

- 📧 **Email:** support@whatsbotx.com
- 💬 **Discord:** [WhatsBotX Community](https://discord.gg/whatsbotx)
- 🐛 **GitHub Issues:** [Report Bugs](https://github.com/yourusername/WhatsBotX/issues)
- 📖 **Documentation:** [Full Docs](https://docs.whatsbotx.com)

---

## 🛠️ Recovery Procedures

### Complete System Reset

**Last resort - will lose all data:**

```bash
# Stop application
pm2 stop whatsbotx

# Backup important data (if possible)
cp -r data/ backup_$(date +%Y%m%d)/

# Clean installation
rm -rf node_modules/
rm -rf data/
rm -rf logs/
rm -rf .wwebjs_auth/

# Reinstall
npm install

# Restart
npm start
```

### Emergency Shutdown

**If system is unresponsive:**

```bash
# Find process
ps aux | grep node

# Force kill
kill -9 <PID>

# Or using PM2
pm2 kill
```

---

<div align="center">

**📖 [Back to README](README.md) • ❓ [FAQ](FAQ.md) • 📦 [Installation](INSTALLATION.md)**

---

*Troubleshooting Guide v2.1.0 - Last updated: January 24, 2024*

</div>
