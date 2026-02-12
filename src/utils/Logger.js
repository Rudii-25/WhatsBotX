import winston from 'winston';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Logger {
    constructor(module = 'APP') {
        this.module = module;
        this.winston = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
            transports: [
                new winston.transports.File({ 
                    filename: process.env.LOG_FILE || './logs/whatsbotx.log' 
                })
            ]
        });

        // Add console transport for development
        if (process.env.NODE_ENV !== 'production') {
            this.winston.add(new winston.transports.Console({
                format: winston.format.simple()
            }));
        }
    }

    formatMessage(message, ...args) {
        const timestamp = new Date().toLocaleTimeString();
        const moduleTag = chalk.blue(`[${this.module}]`);
        const timeTag = chalk.gray(`[${timestamp}]`);
        return `${timeTag} ${moduleTag} ${message} ${args.join(' ')}`;
    }

    info(message, ...args) {
        console.log(chalk.cyan('ℹ️ '), this.formatMessage(message, ...args));
        this.winston.info(message, { module: this.module, args });
    }

    success(message, ...args) {
        console.log(chalk.green('✅'), this.formatMessage(message, ...args));
        this.winston.info(message, { module: this.module, args, type: 'success' });
    }

    warn(message, ...args) {
        console.log(chalk.yellow('⚠️ '), this.formatMessage(message, ...args));
        this.winston.warn(message, { module: this.module, args });
    }

    error(message, ...args) {
        console.log(chalk.red('❌'), this.formatMessage(message, ...args));
        this.winston.error(message, { module: this.module, args });
    }

    debug(message, ...args) {
        if (process.env.NODE_ENV === 'development') {
            console.log(chalk.magenta('🔍'), this.formatMessage(message, ...args));
        }
        this.winston.debug(message, { module: this.module, args });
    }
}

export default Logger;
