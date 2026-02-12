import cron from 'node-cron';
import Logger from '../utils/Logger.js';

const logger = new Logger('SCHEDULER');

class ScheduleManager {
    constructor(database, bot) {
        this.database = database;
        this.bot = bot;
        this.jobs = new Map();
        this.reminderCache = new Map(); // Cache for active reminders
    }

    async initialize() {
        logger.info('Initializing schedule manager...');

        // Start reminder processing cron job (every minute)
        const reminderJob = cron.schedule('* * * * *', async () => {
            await this.processReminders();
        }, {
            scheduled: false // Don't start immediately
        });

        this.jobs.set('reminders', reminderJob);
        reminderJob.start();

        // Load existing reminders from database
        await this.loadExistingReminders();

        logger.success('Schedule manager initialized with reminder processing');
    }

    async loadExistingReminders() {
        try {
            // Load active reminders and schedule them
            const activeReminders = await this.database.getActiveReminders();
            for (const reminder of activeReminders) {
                await this.scheduleReminder(reminder);
            }
            logger.info(`Loaded ${activeReminders.length} existing reminders`);
        } catch (error) {
            logger.error('Error loading existing reminders:', error);
        }
    }

    async processReminders() {
        try {
            const pendingReminders = await this.database.getPendingReminders();

            for (const reminder of pendingReminders) {
                try {
                    logger.info(`Processing reminder: ${reminder.message}`);

                    // Send reminder via WhatsApp bot
                    if (this.bot && this.bot.isConnected) {
                        const jid = `${reminder.phone_number}@s.whatsapp.net`;
                        const success = await this.bot.sendMessage(jid, `⏰ *Reminder*\n\n${reminder.message}`);

                        if (success) {
                            await this.database.markReminderSent(reminder.id);
                            logger.success(`Reminder sent to ${reminder.phone_number}`);
                        } else {
                            logger.warn(`Failed to send reminder to ${reminder.phone_number}`);
                        }
                    } else {
                        logger.warn('Bot not connected, skipping reminder delivery');
                    }
                } catch (error) {
                    logger.error(`Error processing reminder ${reminder.id}:`, error);
                }
            }
        } catch (error) {
            logger.error('Error processing reminders:', error);
        }
    }

    async scheduleReminder(reminder) {
        try {
            const reminderTime = new Date(reminder.remind_at);
            const now = new Date();

            // If reminder time is in the past, mark as sent
            if (reminderTime <= now) {
                await this.database.markReminderSent(reminder.id);
                return;
            }

            // Calculate delay in milliseconds
            const delay = reminderTime.getTime() - now.getTime();

            // Schedule the reminder
            const timeoutId = setTimeout(async () => {
                try {
                    if (this.bot && this.bot.isConnected) {
                        const jid = `${reminder.phone_number}@s.whatsapp.net`;
                        const success = await this.bot.sendMessage(jid, `⏰ *Reminder*\n\n${reminder.message}`);

                        if (success) {
                            await this.database.markReminderSent(reminder.id);
                            logger.success(`Scheduled reminder sent to ${reminder.phone_number}`);
                        }
                    }

                    // Remove from cache
                    this.reminderCache.delete(reminder.id);
                } catch (error) {
                    logger.error(`Error sending scheduled reminder ${reminder.id}:`, error);
                }
            }, delay);

            // Cache the timeout
            this.reminderCache.set(reminder.id, {
                timeoutId,
                reminder
            });

            logger.info(`Scheduled reminder ${reminder.id} for ${reminderTime.toISOString()}`);

        } catch (error) {
            logger.error(`Error scheduling reminder ${reminder.id}:`, error);
        }
    }

    async addReminder(userId, message, remindAt) {
        try {
            const reminder = await this.database.createReminder(userId, message, remindAt);
            await this.scheduleReminder(reminder);
            return reminder;
        } catch (error) {
            logger.error('Error adding reminder:', error);
            throw error;
        }
    }

    async cancelReminder(reminderId) {
        try {
            // Clear timeout if exists
            const cached = this.reminderCache.get(reminderId);
            if (cached && cached.timeoutId) {
                clearTimeout(cached.timeoutId);
                this.reminderCache.delete(reminderId);
            }

            // Mark as sent in database (effectively canceling)
            await this.database.markReminderSent(reminderId);
            logger.info(`Cancelled reminder ${reminderId}`);
        } catch (error) {
            logger.error(`Error cancelling reminder ${reminderId}:`, error);
            throw error;
        }
    }

    async getUserReminders(userId) {
        try {
            return await this.database.getUserReminders(userId);
        } catch (error) {
            logger.error('Error getting user reminders:', error);
            throw error;
        }
    }

    async stop() {
        // Stop all cron jobs
        for (const [name, job] of this.jobs) {
            if (job) {
                job.stop();
                logger.info(`Stopped cron job: ${name}`);
            }
        }

        // Clear all scheduled timeouts
        for (const [id, cached] of this.reminderCache) {
            if (cached.timeoutId) {
                clearTimeout(cached.timeoutId);
            }
        }

        this.jobs.clear();
        this.reminderCache.clear();
        logger.info('Schedule manager stopped');
    }
}

export default ScheduleManager;
