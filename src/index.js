#!/usr/bin/env node
/**
 * WhatsBotX - Personal Assistant Bot
 * Main entry point for the WhatsApp bot
 */

import { config } from 'dotenv';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import figlet from 'figlet';
import chalk from 'chalk';

// Load environment variables
config();

// ES module compatibility
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import local modules
import Logger from './utils/Logger.js';
import Database from './database/Database.js';
import WhatsAppBot from './bot/WhatsAppBot.js';
import ApiServer from './api/ApiServer.js';
import CommandHandler from './commands/CommandHandler.js';
import ScheduleManager from './services/ScheduleManager.js';

// Initialize logger
const logger = new Logger('MAIN');

class WhatsBotXApp {
    constructor() {
        this.database = null;
        this.bot = null;
        this.apiServer = null;
        this.commandHandler = null;
        this.scheduleManager = null;
        this.isShuttingDown = false;
    }

    async displayBanner() {
        const banner = figlet.textSync('WhatsBotX', {
            font: 'Big',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        });

        console.log(chalk.cyan(banner));
        console.log(chalk.green('\n🤖 Personal AI Assistant for WhatsApp'));
        console.log(chalk.yellow(`📱 Version: ${process.env.npm_package_version || '2.0.0'}`));
        console.log(chalk.magenta(`🚀 Starting in ${process.env.NODE_ENV || 'development'} mode\n`));
    }

    async initialize() {
        try {
            await this.displayBanner();
            logger.info('Initializing WhatsBotX...');

            // Initialize Database
            logger.info('Setting up database...');
            this.database = new Database();
            await this.database.initialize();
            logger.success('Database initialized');

            // Initialize Schedule Manager
            logger.info('Starting schedule manager...');
            this.scheduleManager = new ScheduleManager(this.database);
            await this.scheduleManager.initialize();
            logger.success('Schedule manager started');

            // Initialize Command Handler
            logger.info('Loading command handlers...');
            this.commandHandler = new CommandHandler(this.database);
            await this.commandHandler.initialize();
            logger.success('Command handlers loaded');

            // Initialize WhatsApp Bot
            logger.info('Starting WhatsApp bot...');
            this.bot = new WhatsAppBot(this.database, this.commandHandler);
            await this.bot.initialize();
            logger.success('WhatsApp bot started');

            // Initialize API Server (if enabled)
            if (process.env.API_ENABLED === 'true') {
                logger.info('Starting API server...');
                this.apiServer = new ApiServer(this.database, this.bot);
                await this.apiServer.start();
                logger.success(`API server running on port ${this.apiServer.port}`);
            }

            logger.success('🎉 WhatsBotX is now ready!');
            this.setupGracefulShutdown();

        } catch (error) {
            logger.error('Failed to initialize WhatsBotX:', error);
            process.exit(1);
        }
    }

    setupGracefulShutdown() {
        const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
        
        signals.forEach(signal => {
            process.on(signal, async () => {
                if (this.isShuttingDown) return;
                this.isShuttingDown = true;
                
                console.log(chalk.yellow(`\n🛑 Received ${signal}. Shutting down gracefully...`));
                await this.shutdown();
            });
        });

        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            process.exit(1);
        });

        process.on('unhandledRejection', (reason, promise) => {
            console.error('UNHANDLED REJECTION - Details:', {
                reason: reason,
                promise: promise,
                stack: reason?.stack || 'No stack trace',
                type: typeof reason,
                isError: reason instanceof Error
            });
            
            try {
                logger.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
            } catch (loggerError) {
                console.error('Logger error in unhandled rejection handler:', loggerError);
                console.error('Original rejection reason:', reason);
            }
            process.exit(1);
        });
    }

    async shutdown() {
        logger.info('Shutting down WhatsBotX...');
        
        try {
            // Stop API server
            if (this.apiServer) {
                await this.apiServer.stop();
                logger.info('API server stopped');
            }

            // Stop WhatsApp bot
            if (this.bot) {
                await this.bot.stop();
                logger.info('WhatsApp bot stopped');
            }

            // Stop schedule manager
            if (this.scheduleManager) {
                await this.scheduleManager.stop();
                logger.info('Schedule manager stopped');
            }

            // Close database
            if (this.database) {
                await this.database.close();
                logger.info('Database closed');
            }

            logger.success('✅ WhatsBotX shutdown complete');
            process.exit(0);
        } catch (error) {
            logger.error('Error during shutdown:', error);
            process.exit(1);
        }
    }
}

// Start the application only if not in Electron environment
if (!process.versions.electron) {
    const app = new WhatsBotXApp();
    app.initialize().catch(error => {
        console.error(chalk.red('Failed to start WhatsBotX:'), error);
        process.exit(1);
    });
}

export default WhatsBotXApp;
