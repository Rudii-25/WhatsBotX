import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import fs from 'fs';
import path from 'path';
import qrcode from 'qrcode-terminal';
import { EventEmitter } from 'events';
import Logger from '../utils/Logger.js';

const logger = new Logger('WHATSAPP');

class WhatsAppBot extends EventEmitter {
    constructor(database, commandHandler) {
        super();
        this.database = database;
        this.commandHandler = commandHandler;
        this.client = null;
        this.isConnected = false;
        this.lastHealthCheck = 0;
        this.healthCheckInterval = 2000; // Health check every 2 seconds
        this.currentQRCode = null; // Store current QR code for later retrieval
        this._browserProcess = null; // track puppeteer browser child process
        this._lastBrowserFile = path.join(process.cwd(), 'data', 'last_browser.json');
    }

    async _persistBrowserRecord(record) {
        try {
            const dir = path.dirname(this._lastBrowserFile);
            try { fs.mkdirSync(dir, { recursive: true }); } catch (e) { /* ignore */ }
            fs.writeFileSync(this._lastBrowserFile, JSON.stringify(record, null, 2), { encoding: 'utf8' });
            logger.info('Persisted browser record', record);
        } catch (err) {
            logger.debug('Failed to persist browser record:', err?.message || err);
        }
    }

    /**
     * Get current QR code (may be null if not yet generated)
     */
    getCurrentQRCode() {
        return this.currentQRCode;
    }

    /**
     * Check if client is in a healthy state
     */
    isClientHealthy() {
        if (!this.client) return false;
        if (!this.client.info) return false;
        if (!this.client.info.wid) return false;
        // Check if critical methods exist
        if (typeof this.client.sendMessage !== 'function') return false;
        return true;
    }

    /**
     * Get current status for API/GUI
     */
    getStatus() {
        return {
            isConnected: this.isConnected,
            isHealthy: this.isClientHealthy(),
            clientWid: this.client?.info?.wid?.user || null,
            timestamp: new Date().toISOString()
        };
    }

    async initialize() {
        try {
            // Cleanup existing client if present to prevent memory leaks or zombie processes
            if (this.client) {
                logger.debug('Cleaning up existing client instance...');
                try {
                    await this.client.destroy();
                } catch (e) {
                    logger.warn('Failed to destroy existing client:', e.message);
                }
                this.client = null;
            }

            logger.info('Initializing WhatsApp bot using whatsapp-web.js...');

            // Create client with local authentication (stores session locally)
            // Ensure a stable data path for LocalAuth sessions so QR scans persist
            const sessionsPath = path.join(process.cwd(), 'data', 'sessions', 'whatsbotx');
            try { fs.mkdirSync(sessionsPath, { recursive: true }); } catch (e) { /* ignore */ }

            this.client = new Client({
                authStrategy: new LocalAuth({ clientId: 'whatsbotx', dataPath: sessionsPath }),
                puppeteer: {
                    headless: true,
                    // Enable dumpio when debugging Puppeteer/Chromium (set WHATSAPP_PUPPETEER_DEBUG=true)
                    dumpio: process.env.WHATSAPP_PUPPETEER_DEBUG === 'true',
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--disable-gpu',
                        '--disable-extensions',
                        '--disable-component-extensions-with-background-pages',
                        '--disable-default-apps',
                        '--mute-audio',
                        '--no-default-browser-check',
                        '--autoplay-policy=user-gesture-required',
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-notifications',
                        '--disable-background-networking',
                        '--disable-breakpad',
                        '--disable-component-update',
                        // Prevent some cross-origin/site isolation features that can block
                        // flows.whatsapp.net resources in embedded contexts.
                        '--disable-features=OutOfBlinkCors,CrossSiteDocumentBlockingIfIsolating'
                    ]
                }
            });

            // Handle QR code
            this.client.on('qr', (qr) => {
                // Store current QR so it can be retrieved later even if event was missed
                this.currentQRCode = qr;
                
                logger.info('\n📱 QR Code Generated - Scan this with WhatsApp!\n');
                console.log('='.repeat(60));
                console.log('QR CODE:');
                console.log('='.repeat(60));
                
                // Always display the raw QR string first (helpful if terminal display is garbled)
                console.log('QR Data String (copy to online generator if terminal display is garbled):');
                console.log(qr);
                console.log('-'.repeat(60));
                
                // Try to generate and display QR in terminal
                try {
                    qrcode.generate(qr, { small: true });
                } catch (e) {
                    logger.debug('Error generating QR in terminal:', e.message);
                }
                
                console.log('='.repeat(60));
                console.log('Steps to connect:');
                console.log('1. Open WhatsApp on your phone');
                console.log('2. Go to Settings → Linked Devices');
                console.log('3. Tap "Link a Device"');
                console.log('4. Scan this QR code with your phone camera');
                console.log('='.repeat(60) + '\n');
                
                // Emit QR code event for GUI
                logger.debug('Emitting QR code to GUI...');
                this.emit('qr', qr);
            });

            // Handle authentication
            this.client.on('authenticated', () => {
                logger.success('WhatsApp authenticated successfully!');

                // Wait for the client to be fully ready. Some client properties (client.info, client.info.wid)
                // may not be populated immediately after the 'authenticated' event. Wait for either the
                // 'ready' event or for a longer health check timeout before emitting 'authenticated'.
                (async () => {
                    const maxAttempts = 40; // ~40 * 250ms = 10s max wait
                    const delayMs = 250;

                    const readyPromise = new Promise((resolve) => {
                        const onReady = () => {
                            this.client.removeListener('ready', onReady);
                            resolve({ reason: 'ready' });
                        };
                        this.client.on('ready', onReady);
                    });

                    const healthPromise = (async () => {
                        let attempt = 0;
                        while (attempt < maxAttempts) {
                            attempt += 1;
                            if (this.isClientHealthy()) {
                                return { reason: 'healthy', attempt };
                            }
                            await new Promise((r) => setTimeout(r, delayMs));
                        }
                        return { reason: 'timeout' };
                    })();

                    // Race readiness paths: ready event or health loop
                    const result = await Promise.race([readyPromise, healthPromise]);

                    if (result && result.reason && (result.reason === 'ready' || result.reason === 'healthy')) {
                        logger.debug('Client fully initialized after authentication:', result);
                        this.emit('authenticated');
                        return;
                    }

                    // If we reach here the client did not become healthy in time
                    logger.warn('Client not fully ready after authentication - may need reconnect');
                    this.emit('authenticated');
                })();
            });

            // Handle ready state
            this.client.on('ready', () => {
                logger.success('WhatsApp client is ready!');
                this.isConnected = true;
                
                // Verify client is actually functional before marking ready
                if (!this.client || !this.client.info) {
                    logger.error('Client ready fired but client.info is missing - client may be corrupted');
                    this.isConnected = false;
                    return;
                }
                
                this.emit('connectionStatus', 'connected');
                this.emit('qr', null); // Clear QR code
                logger.info(`Bot is online and ready to receive messages. Authenticated as: ${this.client.info.wid.user}`);
            });

            // Handle disconnection
            this.client.on('disconnected', (reason) => {
                logger.warn('WhatsApp client disconnected:', reason);
                this.isConnected = false;
                this.emit('connectionStatus', 'disconnected');
                
                // Attempt reconnection
                logger.info('Attempting to reconnect in 5 seconds...');
                setTimeout(() => {
                    if (!this.isConnected) {
                        this.initialize().catch(err => {
                            logger.error('Reconnection failed:', err);
                        });
                    }
                }, 5000);
            });

            // Handle incoming messages
            this.client.on('message', async (msg) => {
                try {
                    await this.handleMessage(msg);
                } catch (error) {
                    logger.error('Error handling message:', error);
                }
            });

            // Handle errors
            this.client.on('error', (error) => {
                logger.error('WhatsApp client error:', error.message || error);
                this.isConnected = false;
                this.emit('connectionStatus', 'disconnected');
                
                // If it's a DOM/client corruption error, note it for recovery
                if (error.message && error.message.includes('Cannot read properties')) {
                    logger.warn('Detected client DOM corruption - reconnection will be needed');
                }
            });

            // Start the client
            logger.info('Starting WhatsApp client...');
            this.emit('connectionStatus', 'connecting');
            await this.client.initialize();
            // Log previous persisted browser record if any
            try {
                if (fs.existsSync(this._lastBrowserFile)) {
                    const prev = JSON.parse(fs.readFileSync(this._lastBrowserFile, 'utf8'));
                    logger.info('Previous browser record found', prev);
                }
            } catch (e) {
                logger.debug('Failed to read previous browser record:', e?.message || e);
            }
            // After initialize, try to locate the underlying puppeteer browser process
            try {
                const pupBrowser = this.client.pupBrowser || this.client.browser || this.client.puppeteerBrowser || null;
                let bp = null;
                if (pupBrowser && typeof pupBrowser.process === 'function') {
                    bp = pupBrowser.process();
                } else if (this.client.page && this.client.page.browser && typeof this.client.page.browser().process === 'function') {
                    // defensive: some wrappers expose page.browser()
                    bp = this.client.page.browser().process();
                }

                if (bp) {
                    this._browserProcess = bp;
                    try {
                        logger.info(`Detected Puppeteer browser PID: ${bp.pid}`);
                    } catch (e) { /* ignore logging issues */ }

                    // persist starting record
                    this._persistBrowserRecord({ pid: bp.pid, startedAt: new Date().toISOString(), status: 'running' });

                    bp.on('exit', (code, signal) => {
                        logger.warn(`Puppeteer browser process exited. code=${code} signal=${signal}`);
                        // persist exit
                        this._persistBrowserRecord({ pid: bp.pid, exitCode: code, signal: signal, endedAt: new Date().toISOString(), status: 'exited' });
                        // mark client as disconnected so reconnection logic can run
                        this.isConnected = false;
                        this.emit('connectionStatus', 'disconnected');
                    });

                    bp.on('close', (code, signal) => {
                        logger.warn(`Puppeteer browser process closed. code=${code} signal=${signal}`);
                        this._persistBrowserRecord({ pid: bp.pid, exitCode: code, signal: signal, endedAt: new Date().toISOString(), status: 'closed' });
                        this.isConnected = false;
                        this.emit('connectionStatus', 'disconnected');
                    });
                } else {
                    logger.debug('Puppeteer browser process not directly accessible from client');
                }
            } catch (err) {
                logger.debug('Error while attaching to puppeteer browser process:', err?.message || err);
            }
            logger.info('WhatsApp bot initialized');

        } catch (error) {
            logger.error('Failed to initialize WhatsApp bot:', error);
            this.isConnected = false;
            throw error;
        }
    }

    async handleMessage(msg) {
        try {
            // Ignore messages from bot itself
            if (msg.from === msg.to) {
                return;
            }

            const messageText = msg.body;
            if (!messageText || messageText.trim().length === 0) {
                logger.debug('Ignoring empty message');
                return;
            }

            const phoneNumber = msg.from.replace('@c.us', '');
            const contact = await msg.getContact();
            const pushName = contact.name || contact.pushname || 'Unknown';

            logger.info(`📩 Message from ${pushName} (${phoneNumber}): ${messageText}`);

            // Ensure user exists in database
            try {
                await this.database.createUser(phoneNumber, pushName);
                const user = await this.database.getUserByPhone(phoneNumber);
                logger.debug(`User found/created: ${user.id}`);

                // Send typing indicator
                await this.client.sendPresenceUpdate('typing', msg.from);

                let response;

                // Check if it's a command
                if (messageText.startsWith(process.env.BOT_PREFIX || '/')) {
                    logger.info(`🔧 Processing command: ${messageText}`);
                    response = await this.commandHandler.processMessage(messageText, user);
                } else {
                    // Check for auto-reply first
                    const autoReply = await this.commandHandler.checkAutoReply(user);
                    if (autoReply) {
                        logger.info(`🤖 Sending auto-reply to ${pushName}`);
                        response = autoReply;
                    } else {
                        // For non-commands, send a comprehensive welcome message
                        logger.info(`💬 Non-command message, sending welcome`);
                        response = `👋 Hi ${pushName}! I'm WhatsBotX, your personal AI assistant.\n\n🎆 *Key Features:*\n• 📋 Todo management\n• ⏰ Smart reminders\n• 🤖 AI chat assistant\n• 🌦️ Weather updates\n• 📄 File conversion\n• 🌍 Multi-language support\n• 🔄 Auto-reply system\n\n🚀 *Quick Start:*\n• /help - See all commands\n• /ping - Test responsiveness\n• /ai Hello - Chat with AI\n• /joke - Get a joke\n• /todo add Buy groceries\n\nTry any command to get started! 🚀`;
                    }
                }

                // Stop typing
                await this.client.sendPresenceUpdate('paused', msg.from);

                if (response) {
                    const sent = await msg.reply(response);
                    if (sent) {
                        logger.info(`✅ Response sent to ${phoneNumber}`);
                    } else {
                        logger.error(`❌ Failed to send response to ${phoneNumber}`);
                    }
                } else {
                    logger.warn(`⚠️ No response generated for message: ${messageText}`);
                }

            } catch (dbError) {
                logger.error('Database error:', dbError);
                await msg.reply('❌ Database error occurred. Please try again.');
            }

        } catch (error) {
            logger.error('Error in message handler:', error);
            try {
                await msg.reply('❌ Sorry, I encountered an error processing your message. Please try again later.');
            } catch (sendError) {
                logger.error('Error sending error message:', sendError);
            }
        }
    }

    async sendMessage(jid, text) {
        try {
            if (!this.isConnected) {
                logger.warn('Bot not connected. Message not sent.');
                return false;
            }
            
            // Validate client is ready and not corrupted
            if (!this.client || !this.client.info || !this.client.sendMessage) {
                logger.error('Client is not properly initialized for sending messages');
                this.isConnected = false;
                return false;
            }

            const chatId = jid.includes('@g.us') ? jid : `${jid}@c.us`;
            await this.client.sendMessage(chatId, text);
            logger.debug(`Message sent to ${jid}`);
            return true;
        } catch (error) {
            logger.error('Error sending message:', error.message || error);
            // If we get a client DOM error, mark as disconnected to trigger reconnect
            if (error.message && error.message.includes('Cannot read properties')) {
                logger.warn('Client DOM corrupted (markedUnread error) - marking as disconnected for recovery');
                this.isConnected = false;
            }
            return false;
        }
    }

    async logout() {
        try {
            logger.info('Logging out and clearing session...');
            
            if (this.client) {
                // detach browser process listeners if present
                if (this._browserProcess) {
                    try {
                        // persist that browser was forcefully detached/stopped
                        try { this._persistBrowserRecord({ pid: this._browserProcess.pid, endedAt: new Date().toISOString(), status: 'detached' }); } catch (e) { /* ignore */ }
                        this._browserProcess.removeAllListeners('exit');
                        this._browserProcess.removeAllListeners('close');
                    } catch (e) { /* ignore */ }
                    this._browserProcess = null;
                }
                // Try to logout from WhatsApp Web first
                try { await this.client.logout(); } catch (e) { /* ignore */ }
                try { await this.client.destroy(); } catch (e) { /* ignore */ }
                this.client = null;
            }

            // Force delete the session directory
            const authPath = path.join(process.cwd(), '.wwebjs_auth');
            if (fs.existsSync(authPath)) {
                fs.rmSync(authPath, { recursive: true, force: true });
                logger.success('Session files cleared successfully');
            }

            this.isConnected = false;
            this.emit('connectionStatus', 'disconnected');
        } catch (error) {
            logger.error('Error during logout:', error);
            throw error;
        }
    }

    async stop() {
        if (this.client) {
            try {
                logger.info('Stopping WhatsApp client...');
                // detach browser process listeners if present
                if (this._browserProcess) {
                    try {
                        this._browserProcess.removeAllListeners('exit');
                        this._browserProcess.removeAllListeners('close');
                    } catch (e) { /* ignore */ }
                    this._browserProcess = null;
                }
                await this.client.destroy();
                this.isConnected = false;
                logger.info('WhatsApp bot stopped');
            } catch (error) {
                logger.error('Error stopping WhatsApp bot:', error);
            }
        }
    }
}

export default WhatsAppBot;
