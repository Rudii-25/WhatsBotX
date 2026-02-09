import sqlite3 from 'sqlite3';
import { promises as fs } from 'fs';
import path from 'path';
import Logger from '../utils/Logger.js';

const logger = new Logger('DATABASE');

class Database {
    constructor() {
        this.db = null;
        this.dbPath = process.env.DATABASE_PATH || './data/whatsbotx.db';
    }

    async initialize() {
        try {
            // Ensure data directory exists
            const dbDir = path.dirname(this.dbPath);
            await fs.mkdir(dbDir, { recursive: true });

            // Open database connection
            this.db = new sqlite3.Database(this.dbPath);
            
            // Enable foreign keys
            await this.run('PRAGMA foreign_keys = ON');
            
            // Create tables
            await this.createTables();
            
            logger.success('Database initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize database:', error);
            throw error;
        }
    }

    async createTables() {
        const tables = [
            // Users table
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phone_number TEXT UNIQUE NOT NULL,
                name TEXT,
                timezone TEXT DEFAULT 'UTC',
                language TEXT DEFAULT 'en',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            // Todos table
            `CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                task TEXT NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                priority TEXT DEFAULT 'medium',
                due_date DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                completed_at DATETIME,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,

            // Reminders table
            `CREATE TABLE IF NOT EXISTS reminders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                message TEXT NOT NULL,
                remind_at DATETIME NOT NULL,
                sent BOOLEAN DEFAULT FALSE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                sent_at DATETIME,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,

            // Notes table
            `CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT,
                content TEXT NOT NULL,
                tags TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,

            // Chat history table
            `CREATE TABLE IF NOT EXISTS chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                message TEXT NOT NULL,
                response TEXT,
                command TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,

            // Settings table
            `CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                key TEXT NOT NULL,
                value TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                UNIQUE(user_id, key)
            )`
        ];

        for (const table of tables) {
            await this.run(table);
        }

        logger.info('Database tables created/verified');
    }

    // Promisify database operations
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // User management
    async createUser(phoneNumber, name = null) {
        const result = await this.run(
            'INSERT OR IGNORE INTO users (phone_number, name) VALUES (?, ?)',
            [phoneNumber, name]
        );
        return this.getUserByPhone(phoneNumber);
    }

    async getUserByPhone(phoneNumber) {
        return this.get('SELECT * FROM users WHERE phone_number = ?', [phoneNumber]);
    }

    async updateUser(userId, updates) {
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        values.push(userId);
        
        return this.run(
            `UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            values
        );
    }

    // Todo management
    async createTodo(userId, task, priority = 'medium', dueDate = null) {
        return this.run(
            'INSERT INTO todos (user_id, task, priority, due_date) VALUES (?, ?, ?, ?)',
            [userId, task, priority, dueDate]
        );
    }

    async getTodos(userId, completed = false) {
        return this.all(
            'SELECT * FROM todos WHERE user_id = ? AND completed = ? ORDER BY created_at DESC',
            [userId, completed]
        );
    }

    async completeTodo(userId, todoId) {
        return this.run(
            'UPDATE todos SET completed = TRUE, completed_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
            [todoId, userId]
        );
    }

    async deleteTodo(userId, todoId) {
        return this.run(
            'DELETE FROM todos WHERE id = ? AND user_id = ?',
            [todoId, userId]
        );
    }

    // Reminder management
    async createReminder(userId, message, remindAt) {
        return this.run(
            'INSERT INTO reminders (user_id, message, remind_at) VALUES (?, ?, ?)',
            [userId, message, remindAt]
        );
    }

    async getPendingReminders() {
        return this.all(
            'SELECT r.*, u.phone_number FROM reminders r JOIN users u ON r.user_id = u.id WHERE r.sent = FALSE AND r.remind_at <= CURRENT_TIMESTAMP'
        );
    }

    async getActiveReminders() {
        return this.all(
            'SELECT r.*, u.phone_number FROM reminders r JOIN users u ON r.user_id = u.id WHERE r.sent = FALSE AND r.remind_at > CURRENT_TIMESTAMP ORDER BY r.remind_at ASC'
        );
    }

    async getUserReminders(userId) {
        return this.all(
            'SELECT * FROM reminders WHERE user_id = ? ORDER BY remind_at DESC',
            [userId]
        );
    }

    async markReminderSent(reminderId) {
        return this.run(
            'UPDATE reminders SET sent = TRUE, sent_at = CURRENT_TIMESTAMP WHERE id = ?',
            [reminderId]
        );
    }

    // Chat history
    async saveChatHistory(userId, message, response = null, command = null) {
        return this.run(
            'INSERT INTO chat_history (user_id, message, response, command) VALUES (?, ?, ?, ?)',
            [userId, message, response, command]
        );
    }

    async getChatHistory(userId, limit = 10) {
        return this.all(
            'SELECT * FROM chat_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
            [userId, limit]
        );
    }

    // Settings management
    async setSetting(userId, key, value) {
        return this.run(
            'INSERT OR REPLACE INTO settings (user_id, key, value, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
            [userId, key, value]
        );
    }

    async getSetting(userId, key, defaultValue = null) {
        const result = await this.get(
            'SELECT value FROM settings WHERE user_id = ? AND key = ?',
            [userId, key]
        );
        return result ? result.value : defaultValue;
    }

    async close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) reject(err);
                    else {
                        logger.info('Database connection closed');
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
}

export default Database;
