import express from 'express';
import Logger from '../utils/Logger.js';

const logger = new Logger('API');

class ApiServer {
    constructor(database, bot) {
        this.database = database;
        this.bot = bot;
        this.app = express();
        this.server = null;
        this.port = parseInt(process.env.PORT) || 3001;
    }

    async start() {
        // Check if server is already running
        if (this.server && this.server.listening) {
            logger.warn(`API server is already running on port ${this.port}`);
            return Promise.resolve();
        }

        this.setupMiddleware();
        this.setupRoutes();
        
        return this.startWithRetry();
    }

    async startWithRetry(maxRetries = 10) {
        return new Promise((resolve, reject) => {
            const tryPort = (currentPort, retryCount = 0) => {
                let server;

                try {
                    server = this.app.listen(currentPort);
                } catch (syncErr) {
                    // Rare case: synchronous throw from listen
                    if (syncErr && syncErr.code === 'EADDRINUSE' && retryCount < maxRetries) {
                        logger.warn(`Port ${currentPort} in use (sync), trying ${currentPort + 1}`);
                        return tryPort(currentPort + 1, retryCount + 1);
                    }
                    return reject(syncErr);
                }

                const onListening = () => {
                    cleanup();
                    this.server = server;
                    this.port = currentPort;
                    logger.success(`API server running on port ${this.port}`);
                    resolve();
                };

                const onError = (err) => {
                    cleanup();
                    // Only retry on EADDRINUSE
                    if (err && err.code === 'EADDRINUSE' && retryCount < maxRetries) {
                        logger.warn(`Port ${currentPort} in use, trying ${currentPort + 1}`);
                        // Ensure server is closed if partially bound
                        try {
                            server.close(() => {});
                        } catch (e) {
                            // ignore
                        }
                        return tryPort(currentPort + 1, retryCount + 1);
                    }
                    reject(err);
                };

                const cleanup = () => {
                    server.removeListener('listening', onListening);
                    server.removeListener('error', onError);
                };

                server.once('listening', onListening);
                server.once('error', onError);
            };

            tryPort(this.port);
        });
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ status: 'OK', timestamp: new Date().toISOString() });
        });

        // Bot status
        this.app.get('/status', (req, res) => {
            res.json({
                connected: this.bot.isConnected,
                uptime: process.uptime(),
                version: '2.0.0'
            });
        });

        // Bulk messaging endpoints
        this.app.post('/send-message', async (req, res) => {
            try {
                const { number, message } = req.body;
                
                if (!number || !message) {
                    return res.status(400).json({ error: 'Number and message are required' });
                }
                
                if (!this.bot.isConnected) {
                    return res.status(503).json({ error: 'Bot is not connected to WhatsApp' });
                }
                
                // Format number for WhatsApp
                const formattedNumber = this.formatPhoneNumber(number);
                
                // Send message via bot
                await this.bot.sendMessage(formattedNumber, message);
                
                logger.info(`Message sent to ${formattedNumber}`);
                res.json({ success: true, number: formattedNumber });
                
            } catch (error) {
                logger.error('Error sending message:', error.message);
                res.status(500).json({ error: error.message });
            }
        });
        
        this.app.post('/send-bulk', async (req, res) => {
            try {
                const { numbers, message } = req.body;
                
                if (!numbers || !Array.isArray(numbers) || !message) {
                    return res.status(400).json({ error: 'Numbers array and message are required' });
                }
                
                if (!this.bot.isConnected) {
                    return res.status(503).json({ error: 'Bot is not connected to WhatsApp' });
                }
                
                const results = [];
                
                for (const number of numbers) {
                    try {
                        const formattedNumber = this.formatPhoneNumber(number);
                        await this.bot.sendMessage(formattedNumber, message);
                        results.push({ number: formattedNumber, success: true });
                        logger.info(`Bulk message sent to ${formattedNumber}`);
                        
                        // Add delay between messages to avoid rate limiting
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                    } catch (error) {
                        logger.error(`Error sending bulk message to ${number}:`, error.message);
                        results.push({ number, success: false, error: error.message });
                    }
                }
                
                res.json({ success: true, results });
                
            } catch (error) {
                logger.error('Error sending bulk messages:', error.message);
                res.status(500).json({ error: error.message });
            }
        });
        
        // GUI interface (placeholder)
        this.app.get('/', (req, res) => {
            res.send(`
                <h1>🤖 WhatsBotX Control Panel</h1>
                <p>Status: ${this.bot.isConnected ? '✅ Connected' : '❌ Disconnected'}</p>
                <p>Uptime: ${Math.floor(process.uptime())} seconds</p>
                <p><a href="/health">Health Check</a></p>
            `);
        });
    }

    formatPhoneNumber(number) {
        // Remove all non-numeric characters except +
        let cleaned = number.replace(/[^\d+]/g, '');
        
        // If number doesn't start with +, assume it needs country code
        if (!cleaned.startsWith('+')) {
            // Add default country code if not present (assuming India +91)
            if (cleaned.length === 10) {
                cleaned = '91' + cleaned;
            } else if (cleaned.length > 10 && !cleaned.startsWith('91')) {
                cleaned = cleaned;
            }
        } else {
            // Remove the + from the beginning
            cleaned = cleaned.substring(1);
        }
        
        // Return WhatsApp JID format
        return cleaned + '@s.whatsapp.net';
    }
    
    async stop() {
        return new Promise((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    logger.info('API server stopped');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

export default ApiServer;
