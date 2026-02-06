# 🔌 WhatsBotX API Reference

Welcome to the **WhatsBotX API Reference**! This comprehensive guide covers all REST API endpoints, authentication, and integration details for WhatsBotX.

## 📋 Table of Contents

- [Overview](#-overview)
- [Authentication](#-authentication)
- [Base URL](#-base-url)
- [Rate Limiting](#-rate-limiting)
- [Endpoints](#-endpoints)
- [Error Handling](#-error-handling)
- [SDKs & Libraries](#-sdks--libraries)
- [Examples](#-examples)

---

## 📖 Overview

The WhatsBotX REST API allows you to programmatically interact with WhatsApp automation features, including sending messages, managing contacts, and accessing analytics data.

### Key Features

- ✅ **Message Sending** - Send individual and bulk messages
- ✅ **Contact Management** - Add, update, and manage contacts
- ✅ **Analytics Access** - Retrieve usage statistics and reports
- ✅ **Bot Control** - Start, stop, and monitor bot status
- ✅ **File Operations** - Upload and download files
- ✅ **Real-time Updates** - WebSocket support for live data

### API Versioning

- **Current Version:** v1
- **Base Path:** `/api/v1`
- **Version Header:** `X-API-Version: 1`

---

## 🔐 Authentication

All API requests require authentication using API keys.

### API Key Authentication

Include your API key in the request header:

```http
Authorization: Bearer YOUR_API_KEY
```

### Getting Your API Key

1. **Start WhatsBotX**
2. **Open Settings** → **API Configuration**
3. **Generate API Key** or view existing keys
4. **Copy the key** for use in requests

### API Key Security

- 🔒 **Keep keys secure** - Never expose in client-side code
- 🔄 **Rotate regularly** - Change keys periodically
- 🚫 **No sharing** - Don't share keys in public repositories
- 🗑️ **Revoke if compromised** - Immediately revoke leaked keys

---

## 🌐 Base URL

```
http://localhost:3001/api
```

**Configuration:**
- Default Port: `3001` (configurable in Settings → Advanced)
- Protocol: HTTP (when running locally)
- Host: `localhost` or your server IP

### Starting the API Server

The API server can be started from the WhatsBotX GUI:

1. **Open WhatsBotX Application**
2. **Go to:** Settings → Advanced tab
3. **Click:** "Start API Server" button
4. **Confirm:** Status shows "Active" when running
5. **Port:** Check API Dashboard for actual port if changed

**Requirements:**
- WhatsApp bot must be running first
- API server only accessible when bot is active
- Check logs if connection fails

---

## ⏱️ Rate Limiting

API requests are rate limited to prevent abuse.

### Limits

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Message Sending | 100 requests | 15 minutes |
| Analytics | 50 requests | 15 minutes |
| File Operations | 20 requests | 15 minutes |
| General | 200 requests | 15 minutes |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
X-RateLimit-Retry-After: 60
```

### Handling Rate Limits

```javascript
// Check remaining requests
const remaining = response.headers['x-ratelimit-remaining'];

if (remaining === '0') {
  const resetTime = response.headers['x-ratelimit-reset'];
  const waitTime = resetTime - Date.now() / 1000;
  console.log(`Rate limited. Wait ${waitTime} seconds.`);
}
```

---

## 📡 Endpoints

### 🤖 Bot Management

#### Get Bot Status
```http
GET /api/v1/bot/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isRunning": true,
    "uptime": 3600,
    "version": "2.0.0",
    "connected": true
  }
}
```

#### Start Bot
```http
POST /api/v1/bot/start
```

**Response:**
```json
{
  "success": true,
  "message": "Bot started successfully"
}
```

#### Stop Bot
```http
POST /api/v1/bot/stop
```

**Response:**
```json
{
  "success": true,
  "message": "Bot stopped successfully"
}
```

### 💬 Message Operations

#### Send Single Message
```http
POST /api/v1/messages/send
```

**Request Body:**
```json
{
  "number": "+1234567890",
  "message": "Hello from WhatsBotX API!",
  "options": {
    "quoted": false,
    "mentions": []
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "msg_123456",
    "number": "+1234567890",
    "timestamp": "2024-01-24T10:30:00Z",
    "status": "sent"
  }
}
```

#### Send Bulk Messages
```http
POST /api/v1/messages/bulk
```

**Request Body:**
```json
{
  "numbers": [
    "+1234567890",
    "+0987654321"
  ],
  "message": "Bulk message content",
  "options": {
    "delay": 1000,
    "batchSize": 10
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 2,
    "sent": 2,
    "failed": 0,
    "results": [
      {
        "number": "+1234567890",
        "success": true,
        "id": "msg_123456"
      },
      {
        "number": "+0987654321",
        "success": true,
        "id": "msg_123457"
      }
    ]
  }
}
```

#### Get Message History
```http
GET /api/v1/messages/history
```

**Query Parameters:**
- `limit` (optional): Number of messages to retrieve (default: 50, max: 1000)
- `offset` (optional): Offset for pagination (default: 0)
- `number` (optional): Filter by phone number

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_123456",
        "number": "+1234567890",
        "message": "Hello!",
        "direction": "outbound",
        "timestamp": "2024-01-24T10:30:00Z",
        "status": "delivered"
      }
    ],
    "total": 1,
    "limit": 50,
    "offset": 0
  }
}
```

### 👥 Contact Management

#### Get Contacts
```http
GET /api/v1/contacts
```

**Query Parameters:**
- `limit` (optional): Number of contacts (default: 50)
- `offset` (optional): Offset for pagination (default: 0)
- `search` (optional): Search by name or number

**Response:**
```json
{
  "success": true,
  "data": {
    "contacts": [
      {
        "id": "contact_123",
        "name": "John Doe",
        "number": "+1234567890",
        "addedAt": "2024-01-24T10:00:00Z",
        "lastContacted": "2024-01-24T10:30:00Z"
      }
    ],
    "total": 1
  }
}
```

#### Add Contact
```http
POST /api/v1/contacts
```

**Request Body:**
```json
{
  "name": "John Doe",
  "number": "+1234567890",
  "tags": ["customer", "vip"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "contact_123",
    "name": "John Doe",
    "number": "+1234567890",
    "tags": ["customer", "vip"],
    "addedAt": "2024-01-24T10:00:00Z"
  }
}
```

#### Update Contact
```http
PUT /api/v1/contacts/{contactId}
```

**Request Body:**
```json
{
  "name": "John Smith",
  "tags": ["customer", "vip", "updated"]
}
```

#### Delete Contact
```http
DELETE /api/v1/contacts/{contactId}
```

### 📊 Analytics

#### Get Dashboard Data
```http
GET /api/v1/analytics/dashboard
```

**Query Parameters:**
- `period` (optional): "day", "week", "month" (default: "week")

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "week",
    "metrics": {
      "totalMessages": 1250,
      "totalCommands": 340,
      "activeUsers": 25,
      "successRate": 98.5
    },
    "charts": {
      "messagesOverTime": [
        {"date": "2024-01-18", "count": 180},
        {"date": "2024-01-19", "count": 220}
      ],
      "commandUsage": [
        {"command": "/help", "count": 45},
        {"command": "/status", "count": 38}
      ]
    }
  }
}
```

#### Get Performance Metrics
```http
GET /api/v1/analytics/performance
```

**Response:**
```json
{
  "success": true,
  "data": {
    "averageResponseTime": 245,
    "memoryUsage": {
      "used": 85.5,
      "total": 100,
      "unit": "MB"
    },
    "cacheHitRate": 87.3,
    "uptime": 345600
  }
}
```

#### Export Analytics
```http
GET /api/v1/analytics/export
```

**Query Parameters:**
- `format` (optional): "json", "csv" (default: "json")
- `period` (optional): Time period to export

**Response:** File download with analytics data.

### 📁 File Operations

#### Upload File
```http
POST /api/v1/files/upload
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: The file to upload
- `category` (optional): "document", "image", "media"

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "file_123",
    "filename": "document.pdf",
    "size": 2048576,
    "type": "application/pdf",
    "url": "/api/v1/files/file_123",
    "uploadedAt": "2024-01-24T10:30:00Z"
  }
}
```

#### Download File
```http
GET /api/v1/files/{fileId}
```

**Response:** File download

#### List Files
```http
GET /api/v1/files
```

**Query Parameters:**
- `category` (optional): Filter by category
- `limit` (optional): Number of files (default: 50)

### 🔧 System Management

#### Get System Info
```http
GET /api/v1/system/info
```

**Response:**
```json
{
  "success": true,
  "data": {
    "version": "2.0.0",
    "nodeVersion": "18.15.0",
    "platform": "linux",
    "uptime": 345600,
    "memory": {
      "used": 85.5,
      "total": 100,
      "unit": "MB"
    }
  }
}
```

#### Health Check
```http
GET /api/v1/health
```

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-24T10:30:00Z",
  "checks": {
    "database": "ok",
    "whatsapp": "connected",
    "api": "ok"
  }
}
```

---

## 🚨 Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid API key |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid phone number format",
    "details": {
      "field": "number",
      "value": "invalid-number",
      "expected": "+1234567890"
    }
  }
}
```

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| `VALIDATION_ERROR` | Invalid request parameters |
| `AUTHENTICATION_ERROR` | Invalid or missing API key |
| `PERMISSION_DENIED` | Insufficient permissions |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist |
| `WHATSAPP_DISCONNECTED` | WhatsApp bot is not connected |
| `FILE_TOO_LARGE` | Uploaded file exceeds size limit |
| `UNSUPPORTED_FORMAT` | File format not supported |

---

## 📚 SDKs & Libraries

### JavaScript SDK

```javascript
import { WhatsBotX } from 'whatsbotx-sdk';

const client = new WhatsBotX({
  apiKey: 'your-api-key',
  baseURL: 'https://your-server.com/api/v1'
});

// Send a message
await client.messages.send({
  number: '+1234567890',
  message: 'Hello from SDK!'
});

// Get analytics
const analytics = await client.analytics.dashboard();
```

### Python SDK

```python
from whatsbotx import WhatsBotX

client = WhatsBotX(
    api_key='your-api-key',
    base_url='https://your-server.com/api/v1'
)

# Send bulk messages
result = client.messages.send_bulk([
    '+1234567890',
    '+0987654321'
], 'Bulk message content')

# Get contacts
contacts = client.contacts.list(limit=100)
```

### cURL Examples

#### Send Message
```bash
curl -X POST "https://localhost:3000/api/v1/messages/send" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "+1234567890",
    "message": "Hello from cURL!"
  }'
```

#### Get Bot Status
```bash
curl -X GET "https://localhost:3000/api/v1/bot/status" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Upload File
```bash
curl -X POST "https://localhost:3000/api/v1/files/upload" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@document.pdf"
```

---

## 💡 Examples

### Complete Integration Example

```javascript
class WhatsBotXIntegration {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://localhost:3000/api/v1';
  }

  async sendWelcomeMessage(number, name) {
    try {
      const response = await fetch(`${this.baseURL}/messages/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          number: number,
          message: `Welcome ${name}! Thanks for using WhatsBotX.`
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log(`Message sent to ${number}`);
        return result.data;
      } else {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async getAnalytics() {
    try {
      const response = await fetch(`${this.baseURL}/analytics/dashboard`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Failed to get analytics:', error);
      throw error;
    }
  }

  async addContact(name, number) {
    try {
      const response = await fetch(`${this.baseURL}/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          number: number
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log(`Contact ${name} added successfully`);
        return result.data;
      } else {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Failed to add contact:', error);
      throw error;
    }
  }
}

// Usage
const whatsBotX = new WhatsBotXIntegration('your-api-key');

// Send welcome message
await whatsBotX.sendWelcomeMessage('+1234567890', 'John');

// Get analytics
const analytics = await whatsBotX.getAnalytics();
console.log('Total messages:', analytics.metrics.totalMessages);

// Add contact
await whatsBotX.addContact('Jane Doe', '+0987654321');
```

---

## 🔗 Webhooks

### Webhook Configuration

Configure webhooks to receive real-time notifications:

```http
POST /api/v1/webhooks
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["message.received", "message.sent", "contact.added"],
  "secret": "your-webhook-secret"
}
```

### Supported Events

| Event | Description | Payload |
|-------|-------------|---------|
| `message.received` | New message received | Message object |
| `message.sent` | Message sent successfully | Message object |
| `message.failed` | Message sending failed | Message object + error |
| `contact.added` | New contact added | Contact object |
| `bot.started` | Bot started | Bot status |
| `bot.stopped` | Bot stopped | Bot status |

### Webhook Payload Example

```json
{
  "event": "message.received",
  "timestamp": "2024-01-24T10:30:00Z",
  "data": {
    "id": "msg_123456",
    "number": "+1234567890",
    "message": "Hello!",
    "timestamp": "2024-01-24T10:29:45Z"
  }
}
```

---

## 📞 Support

### Getting Help

- 📖 **Documentation:** [Full API Docs](https://docs.whatsbotx.com/api)
- 💬 **Community:** [Discord Server](https://discord.gg/whatsbotx)
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/WhatsBotX/issues)
- 📧 **Email:** api-support@whatsbotx.com

### API Status

Check API status: [https://status.whatsbotx.com](https://status.whatsbotx.com)

---

<div align="center">

**🔌 WhatsBotX API v1.0**

*Last updated: January 24, 2024*

---

*Need help? Check our [troubleshooting guide](TROUBLESHOOTING.md) or [contact support](mailto:api-support@whatsbotx.com).*

</div>
