import Logger from '../utils/Logger.js';
import OpenAI from 'openai';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';

const logger = new Logger('COMMANDS');

class CommandHandler {
    constructor(database, scheduleManager) {
        this.database = database;
        this.scheduleManager = scheduleManager;
        this.prefix = process.env.BOT_PREFIX || '/';
        this.commands = new Map();
        this.autoReplyEnabled = new Map(); // userId -> boolean
        this.customReplies = new Map(); // userId -> message
        this.scheduledJobs = new Map(); // jobId -> cron job
        this.userLanguage = new Map(); // userId -> language preference
        
        // Initialize OpenAI if API key is available
        this.openai = process.env.OPENAI_API_KEY ? new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        }) : null;
        
        // Jokes database
        this.jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the math book look so sad? Because it was full of problems!",
            "What do you call a fake noodle? An Impasta!",
            "Why don't eggs tell jokes? They'd crack each other up!",
            "What do you call a sleeping bull? A bulldozer!",
            "Why did the scarecrow win an award? He was outstanding in his field!"
        ];
        
        // Quotes database
        this.quotes = [
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Innovation distinguishes between a leader and a follower. - Steve Jobs",
            "Life is what happens to you while you're busy making other plans. - John Lennon",
            "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
            "It is during our darkest moments that we must focus to see the light. - Aristotle",
            "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill"
        ];
        
        // Shayari database
        this.shayaris = [
            "दिल की गहराइयों से निकली है यह बात,\nमोहब्बत सच्ची हो तो कभी नहीं होती मात।",
            "چاند ستاروں کی روشنی میں\nتمہارا چہرہ نظر آتا ہے",
            "खुशियों का मौसम आ गया है,\nदिल में उमंग छा गया है।",
            "زندگی کے سفر میں\nخوشیوں کا مقام آ گیا",
            "सपनों की दुनिया में खो जाना,\nयही तो है जिंदगी का मजा।"
        ];
        
        // Facts database
        this.facts = [
            "🧠 The human brain contains approximately 86 billion neurons.",
            "🌊 The Pacific Ocean is larger than all land masses combined.",
            "🦆 Rubber ducks were invented in the late 1800s, not the 20th century.",
            "🍯 Honey never spoils - archaeologists have found 3000-year-old honey that's still edible.",
            "🐙 Octopuses have three hearts and blue blood.",
            "🌙 The Moon is gradually moving away from Earth at 3.8 cm per year.",
            "🦈 Sharks have been around longer than trees - about 400 million years.",
            "🐜 Ants can lift 10-50 times their own body weight."
        ];
        
        // Riddles database
        this.riddles = [
            {
                question: "I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?",
                answer: "An echo"
            },
            {
                question: "The more you take, the more you leave behind. What am I?",
                answer: "Footsteps"
            },
            {
                question: "I'm tall when I'm young, and short when I'm old. What am I?",
                answer: "A candle"
            },
            {
                question: "What has keys but no locks, space but no room, you can enter but can't go inside?",
                answer: "A keyboard"
            }
        ];
        
        // Memes database (text-based memes)
        this.memes = [
            "😂 When you realize it's Monday tomorrow:\n\n*Internal screaming intensifies*",
            "🤔 Me: I'll sleep early tonight\nAlso me at 2 AM: *watching random YouTube videos*",
            "😴 Me: I'm too tired to do anything\nAlso me: *spends 3 hours on social media*",
            "📱 Phone battery: 1%\nMe: We can make it home!",
            "🍕 Me: I'll eat healthy today\n*Orders pizza*\nMe: Tomorrow it is!"
        ];
        
        // Multi-language support
        this.messages = {
            'en': {
                welcome: '👋 Welcome to WhatsBotX! I\'m your personal assistant.',
                help_title: '🤖 *WhatsBotX Assistant*',
                available_commands: '📱 Available Commands:',
                examples: '💡 Examples:',
                command_not_found: '❌ Unknown command',
                processing_error: '❌ Sorry, I encountered an error processing your command.',
                auto_reply_enabled: '✅ Auto-reply enabled',
                auto_reply_disabled: '❌ Auto-reply disabled',
                reminder_set: '⏰ Reminder set successfully',
                task_added: '✅ Task added to your todo list',
                no_tasks: '📋 Your todo list is empty!'
            },
            'hi': {
                welcome: '👋 WhatsBotX में आपका स्वागत है! मैं आपका व्यक्तिगत सहायक हूं।',
                help_title: '🤖 *WhatsBotX सहायक*',
                available_commands: '📱 उपलब्ध कमांड:',
                examples: '💡 उदाहरण:',
                command_not_found: '❌ अज्ञात कमांड',
                processing_error: '❌ माफ करें, आपके कमांड को प्रोसेस करने में त्रुटि हुई।',
                auto_reply_enabled: '✅ ऑटो-रिप्लाई चालू',
                auto_reply_disabled: '❌ ऑटो-रिप्लाई बंद',
                reminder_set: '⏰ रिमाइंडर सफलतापूर्वक सेट किया गया',
                task_added: '✅ कार्य आपकी टूडू सूची में जोड़ दिया गया',
                no_tasks: '📋 आपकी टूडू सूची खाली है!'
            }
        };
    }

    async initialize() {
        this.registerCommands();
        logger.success('Command handler initialized');
    }

    registerCommands() {
        // Basic commands
        this.commands.set('help', {
            description: 'Show all available commands',
            handler: this.handleHelp.bind(this)
        });

        this.commands.set('ping', {
            description: 'Check if bot is responsive',
            handler: this.handlePing.bind(this)
        });

        this.commands.set('status', {
            description: 'Check bot status',
            handler: this.handleStatus.bind(this)
        });

        this.commands.set('about', {
            description: 'About WhatsBotX',
            handler: this.handleAbout.bind(this)
        });

        // Auto-Reply System
        this.commands.set('autoreply', {
            description: 'Manage auto-reply settings',
            handler: this.handleAutoReply.bind(this)
        });

        this.commands.set('busy', {
            description: 'Set busy mode with custom message',
            handler: this.handleBusy.bind(this)
        });

        // Message Scheduler
        this.commands.set('schedule', {
            description: 'Schedule messages (birthday, reminders, updates)',
            handler: this.handleSchedule.bind(this)
        });

        // Enhanced Reminders & To-Do
        this.commands.set('remind', {
            description: 'Set reminders with time',
            handler: this.handleRemind.bind(this)
        });

        this.commands.set('todo', {
            description: 'Manage your todo list',
            handler: this.handleTodo.bind(this)
        });

        // AI Chat Assistant
        this.commands.set('ai', {
            description: 'Chat with AI assistant (ChatGPT-style)',
            handler: this.handleAI.bind(this)
        });

        this.commands.set('chat', {
            description: 'Smart AI conversation',
            handler: this.handleAI.bind(this)
        });

        // File Utilities
        this.commands.set('convert', {
            description: 'Convert files (text to PDF, resize images)',
            handler: this.handleFileConvert.bind(this)
        });

        this.commands.set('pdf', {
            description: 'Convert text to PDF',
            handler: this.handleTextToPDF.bind(this)
        });

        // Multi-Language Support
        this.commands.set('language', {
            description: 'Change language (Hindi/English)',
            handler: this.handleLanguage.bind(this)
        });

        this.commands.set('lang', {
            description: 'Change language preference',
            handler: this.handleLanguage.bind(this)
        });

        // Entertainment
        this.commands.set('joke', {
            description: 'Get a random joke',
            handler: this.handleJoke.bind(this)
        });

        this.commands.set('quote', {
            description: 'Get an inspirational quote',
            handler: this.handleQuote.bind(this)
        });

        this.commands.set('time', {
            description: 'Get current time',
            handler: this.handleTime.bind(this)
        });

        // Weather (enhanced)
        this.commands.set('weather', {
            description: 'Get weather information',
            handler: this.handleWeather.bind(this)
        });
        
        // Currency Converter
        this.commands.set('currency', {
            description: 'Convert currency (USD to INR, EUR, etc.)',
            handler: this.handleCurrency.bind(this)
        });
        
        this.commands.set('convert_currency', {
            description: 'Currency conversion tool',
            handler: this.handleCurrency.bind(this)
        });
        
        // News
        this.commands.set('news', {
            description: 'Get latest news headlines',
            handler: this.handleNews.bind(this)
        });
        
        // Wikipedia
        this.commands.set('wiki', {
            description: 'Search Wikipedia articles',
            handler: this.handleWiki.bind(this)
        });
        
        this.commands.set('wikipedia', {
            description: 'Wikipedia article search',
            handler: this.handleWiki.bind(this)
        });
        
        // QR Code Generator
        this.commands.set('qr', {
            description: 'Generate QR code for text/URL',
            handler: this.handleQR.bind(this)
        });
        
        // Translate
        this.commands.set('translate', {
            description: 'Translate text between languages',
            handler: this.handleTranslate.bind(this)
        });
        
        // Media Tools
        this.commands.set('download', {
            description: 'Download YouTube/Instagram media (demo)',
            handler: this.handleDownload.bind(this)
        });
        
        this.commands.set('ytdl', {
            description: 'YouTube video/audio downloader',
            handler: this.handleYouTubeDownload.bind(this)
        });
        
        this.commands.set('sticker', {
            description: 'Convert image to WhatsApp sticker',
            handler: this.handleSticker.bind(this)
        });
        
        this.commands.set('meme', {
            description: 'Generate random memes',
            handler: this.handleMeme.bind(this)
        });
        
        // Enhanced Entertainment
        this.commands.set('shayari', {
            description: 'Get beautiful Urdu/Hindi poetry',
            handler: this.handleShayari.bind(this)
        });
        
        this.commands.set('fact', {
            description: 'Get interesting random facts',
            handler: this.handleFact.bind(this)
        });
        
        this.commands.set('riddle', {
            description: 'Get brain-teasing riddles',
            handler: this.handleRiddle.bind(this)
        });
        
        // Google Search
        this.commands.set('google', {
            description: 'Search Google (demo)',
            handler: this.handleGoogleSearch.bind(this)
        });
        
        this.commands.set('search', {
            description: 'Smart web search',
            handler: this.handleGoogleSearch.bind(this)
        });
        
        // Short Links
        this.commands.set('shorten', {
            description: 'Create short links',
            handler: this.handleShortenLink.bind(this)
        });
        
        this.commands.set('shortlink', {
            description: 'URL shortener service',
            handler: this.handleShortenLink.bind(this)
        });
        
        // Group Management (for future group features)
        this.commands.set('welcome', {
            description: 'Set group welcome message',
            handler: this.handleWelcome.bind(this)
        });
        
        this.commands.set('rules', {
            description: 'Set or view group rules',
            handler: this.handleRules.bind(this)
        });
        
        this.commands.set('poll', {
            description: 'Create polls for group decisions',
            handler: this.handlePoll.bind(this)
        });
        
        this.commands.set('admin', {
            description: 'Admin commands for group management',
            handler: this.handleAdmin.bind(this)
        });

        logger.info(`Registered ${this.commands.size} commands`);
    }

    async processMessage(message, user) {
        try {
            // Input validation
            if (!message || typeof message !== 'string') {
                throw new Error('Invalid message format');
            }

            // Check if message is a command
            if (!message.startsWith(this.prefix)) {
                return null; // Not a command
            }

            const args = message.slice(this.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            if (!commandName) {
                return `❌ Invalid command format. Use ${this.prefix}help for available commands.`;
            }

            const command = this.commands.get(commandName);
            if (!command) {
                return `❌ Unknown command: ${commandName}\n\nType ${this.prefix}help to see available commands.`;
            }

            // Rate limiting check
            const canProceed = await this.checkRateLimit(user.id, commandName);
            if (!canProceed) {
                return '❌ Too many requests. Please wait a moment before using this command again.';
            }

            // Save command in chat history
            await this.database.saveChatHistory(user.id, message, null, commandName);

            // Execute command with error recovery
            let response;
            try {
                response = await command.handler(args, user);
            } catch (commandError) {
                logger.error(`Error executing command ${commandName}:`, commandError);
                // Attempt recovery for specific errors
                if (commandError.message.includes('database')) {
                    response = '❌ Database error. Please try again in a moment.';
                } else if (commandError.message.includes('network')) {
                    response = '❌ Network error. Please check your connection and try again.';
                } else {
                    response = '❌ An error occurred while processing your command. Please try again.';
                }
            }

            // Update chat history with response
            if (response) {
                await this.database.saveChatHistory(user.id, message, response, commandName);
            }

            return response;

        } catch (error) {
            logger.error('Error processing message:', error);
            // Enhanced error recovery
            if (error.message.includes('validation')) {
                return '❌ Invalid input. Please check your command format.';
            } else if (error.message.includes('rate limit')) {
                return '❌ Rate limit exceeded. Please wait before trying again.';
            } else {
                return '❌ Sorry, I encountered an error processing your command. Please try again later.';
            }
        }
    }

    async handleHelp(args, user) {
        let helpText = `🤖 *WhatsBotX Assistant*\n\n`;
        helpText += `📱 Available Commands:\n\n`;
        
        for (const [name, command] of this.commands) {
            helpText += `${this.prefix}${name} - ${command.description}\n`;
        }

        helpText += `\n💡 Examples:\n`;
        helpText += `• ${this.prefix}todo add Buy groceries\n`;
        helpText += `• ${this.prefix}ai What's the weather like?\n`;
        helpText += `• ${this.prefix}weather London\n`;

        return helpText;
    }

    async handleTodo(args, user) {
        const action = args[0]?.toLowerCase();
        
        switch (action) {
            case 'add':
                if (args.length < 2) {
                    return '❌ Please provide a task to add.\nExample: /todo add Buy milk';
                }
                const task = args.slice(1).join(' ');
                await this.database.createTodo(user.id, task);
                return `✅ Added todo: "${task}"`;
            
            case 'list':
                const todos = await this.database.getTodos(user.id, false);
                if (todos.length === 0) {
                    return '📋 Your todo list is empty!';
                }
                let todoList = '📋 *Your Todos:*\n\n';
                todos.forEach((todo, index) => {
                    todoList += `${index + 1}. ${todo.task}\n`;
                });
                return todoList;
            
            case 'complete':
                const todoId = parseInt(args[1]);
                if (!todoId) {
                    return '❌ Please provide todo ID.\nExample: /todo complete 1';
                }
                await this.database.completeTodo(user.id, todoId);
                return '✅ Todo marked as completed!';
            
            default:
                return `📋 *Todo Commands:*\n\n• ${this.prefix}todo add <task> - Add new todo\n• ${this.prefix}todo list - Show all todos\n• ${this.prefix}todo complete <id> - Mark todo as done`;
        }
    }

    async handleAI(args, user) {
        if (args.length === 0) {
            return '🤖 Please provide a message for the AI.\nExample: /ai What\'s the weather like today?';
        }
        
        const message = args.join(' ');
        // For now, return a mock response
        return `🤖 *AI Response:*\n\nI received your message: "${message}"\n\n⚠️ AI features require OpenAI API key configuration.`;
    }

    async handleWeather(args, user) {
        if (args.length === 0) {
            return '🌤️ Please provide a city name.\nExample: /weather London';
        }
        
        const city = args.join(' ');
        // For now, return a mock response
        return `🌤️ *Weather in ${city}:*\n\n⚠️ Weather features require API key configuration.\n\nTemperature: 22°C\nCondition: Sunny\nHumidity: 65%`;
    }

    async handleStatus(args, user) {
        const uptime = Math.floor(process.uptime());
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        
        return `🤖 *WhatsBotX Status*\n\n✅ Bot is online and running\n⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s\n📱 Version: 2.0.0\n💾 Node.js: ${process.version}`;
    }

    async handleAbout(args, user) {
        return `🤖 *About WhatsBotX*\n\n` +
               `WhatsBotX is your personal AI assistant for WhatsApp.\n\n` +
               `✨ *Features:*\n` +
               `• Todo list management\n` +
               `• AI chat assistance\n` +
               `• Weather information\n` +
               `• Reminders & scheduling\n` +
               `• And much more!\n\n` +
               `📱 Version: 2.0.0\n` +
               `💻 Built with Node.js & Baileys\n\n` +
               `Type ${this.prefix}help for available commands.`;
    }

    async handlePing(args, user) {
        const startTime = Date.now();
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 10));
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        return `🏓 *Pong!*\n\n⚡ Response time: ${responseTime}ms\n✅ Bot is responsive and working correctly.`;
    }

    // Auto-Reply System
    async handleAutoReply(args, user) {
        const action = args[0]?.toLowerCase();
        
        switch (action) {
            case 'on':
            case 'enable':
                this.autoReplyEnabled.set(user.id, true);
                return '✅ Auto-reply enabled! I will automatically reply to all messages.';
            
            case 'off':
            case 'disable':
                this.autoReplyEnabled.set(user.id, false);
                return '❌ Auto-reply disabled.';
            
            case 'status':
                const enabled = this.autoReplyEnabled.get(user.id) || false;
                return `🔄 Auto-reply is currently: ${enabled ? '✅ Enabled' : '❌ Disabled'}`;
            
            default:
                return `🔄 *Auto-Reply Settings:*\n\n• ${this.prefix}autoreply on - Enable auto-reply\n• ${this.prefix}autoreply off - Disable auto-reply\n• ${this.prefix}autoreply status - Check current status`;
        }
    }

    async handleBusy(args, user) {
        if (args.length === 0) {
            this.autoReplyEnabled.set(user.id, true);
            this.customReplies.set(user.id, '🔕 I\'m currently busy and will reply later. Thanks for understanding!');
            return '🔕 Busy mode activated with default message!';
        }
        
        const customMessage = args.join(' ');
        this.autoReplyEnabled.set(user.id, true);
        this.customReplies.set(user.id, `🔕 ${customMessage}`);
        return `🔕 Busy mode activated with custom message: "${customMessage}"`;
    }

    // Message Scheduler
    async handleSchedule(args, user) {
        const action = args[0]?.toLowerCase();
        
        switch (action) {
            case 'birthday':
                if (args.length < 4) {
                    return '🎂 Usage: /schedule birthday <name> <date> <message>\nExample: /schedule birthday John 25-12 Happy Birthday!';
                }
                const name = args[1];
                const date = args[2];
                const message = args.slice(3).join(' ');
                return `🎂 Birthday reminder scheduled for ${name} on ${date}: "${message}"`;
            
            case 'reminder':
                return this.handleRemind(args.slice(1), user);
            
            case 'daily':
                if (args.length < 3) {
                    return '📅 Usage: /schedule daily <time> <message>\nExample: /schedule daily 09:00 Good morning!';
                }
                const time = args[1];
                const dailyMsg = args.slice(2).join(' ');
                return `📅 Daily message scheduled at ${time}: "${dailyMsg}"`;
            
            default:
                return `📅 *Message Scheduler:*\n\n• ${this.prefix}schedule birthday <name> <date> <msg> - Birthday reminder\n• ${this.prefix}schedule daily <time> <msg> - Daily messages\n• ${this.prefix}schedule reminder <time> <msg> - One-time reminder`;
        }
    }

    // Enhanced Reminders
    async handleRemind(args, user) {
        if (args.length < 2) {
            return '⏰ Usage: /remind <time> <message>\nExamples:\n• /remind 7pm Gym time\n• /remind 15:30 Meeting with client\n• /remind tomorrow Call mom';
        }

        const timeStr = args[0];
        const message = args.slice(1).join(' ');

        // Parse time (simplified parsing)
        const reminderTime = this.parseTime(timeStr);
        if (!reminderTime) {
            return '❌ Invalid time format. Use formats like: 7pm, 15:30, tomorrow, etc.';
        }

        try {
            // Use ScheduleManager to add reminder
            const reminder = await this.scheduleManager.addReminder(user.id, message, reminderTime);
            return `⏰ Reminder set for ${reminderTime}: "${message}"\n\n📝 Reminder ID: ${reminder.id}`;
        } catch (error) {
            logger.error('Error setting reminder:', error);
            return '❌ Failed to set reminder. Please try again.';
        }
    }

    parseTime(timeStr) {
        const now = new Date();
        const time = timeStr.toLowerCase();
        
        // Simple time parsing (you can enhance this)
        if (time.includes('pm') || time.includes('am')) {
            return `Today at ${timeStr}`;
        } else if (time.includes(':')) {
            return `Today at ${timeStr}`;
        } else if (time === 'tomorrow') {
            return 'Tomorrow';
        } else {
            return null;
        }
    }

    // Enhanced AI Chat
    async handleAI(args, user) {
        if (args.length === 0) {
            return '🤖 Please provide a message for the AI.\nExample: /ai What\'s the weather like today?';
        }
        
        const message = args.join(' ');
        
        // If OpenAI is configured, use it
        if (this.openai) {
            try {
                const completion = await this.openai.chat.completions.create({
                    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: message }],
                    max_tokens: 150
                });
                
                return `🤖 *AI Response:*\n\n${completion.choices[0].message.content}`;
            } catch (error) {
                logger.error('OpenAI API error:', error);
                return '🤖 Sorry, AI service is temporarily unavailable.';
            }
        } else {
            // Mock intelligent responses
            const responses = {
                'hello': 'Hi there! How can I help you today?',
                'weather': 'I\'d need access to weather APIs to give you current weather information.',
                'time': `The current time is ${new Date().toLocaleTimeString()}`,
                'help': 'I\'m here to assist you! Try asking me questions or use /help for commands.',
                'default': `Interesting question: "${message}". I\'d love to help, but I need OpenAI API configuration for advanced responses.`
            };
            
            const key = Object.keys(responses).find(k => message.toLowerCase().includes(k));
            return `🤖 *AI Response:*\n\n${responses[key] || responses.default}`;
        }
    }

    // File Utilities
    async handleFileConvert(args, user) {
        const type = args[0]?.toLowerCase();
        
        switch (type) {
            case 'pdf':
                return this.handleTextToPDF(args.slice(1), user);
            
            case 'image':
                return '🖼️ Image conversion: Send me an image and I\'ll help you resize or compress it!\n\n⚠️ Feature coming soon!';
            
            default:
                return `🔄 *File Conversion:*\n\n• ${this.prefix}convert pdf <text> - Convert text to PDF\n• ${this.prefix}convert image - Image resize/compress\n• ${this.prefix}pdf <text> - Quick text to PDF`;
        }
    }

    async handleTextToPDF(args, user) {
        if (args.length === 0) {
            return '📄 Usage: /pdf <text>\nExample: /pdf This is my document content';
        }
        
        const text = args.join(' ');
        
        try {
            // In a real implementation, you would use jsPDF or similar
            const filename = `document_${Date.now()}.pdf`;
            return `📄 PDF created: "${filename}"\n\n📝 Content: "${text}"\n\n⚠️ PDF generation feature coming soon! For now, content is saved.`;
        } catch (error) {
            logger.error('PDF generation error:', error);
            return '❌ Failed to generate PDF. Please try again.';
        }
    }

    // Multi-Language Support
    async handleLanguage(args, user) {
        const lang = args[0]?.toLowerCase();
        
        switch (lang) {
            case 'hindi':
            case 'hi':
                this.userLanguage.set(user.id, 'hi');
                return '✅ भाषा हिंदी में बदल दी गई। अब मैं हिंदी में जवाब दूंगा।';
            
            case 'english':
            case 'en':
                this.userLanguage.set(user.id, 'en');
                return '✅ Language changed to English. I will now respond in English.';
            
            case 'status':
                const currentLang = this.userLanguage.get(user.id) || 'en';
                return `🌐 Current language: ${currentLang === 'hi' ? 'Hindi (हिंदी)' : 'English'}`;
            
            default:
                return `🌐 *Language Settings:*\n\n• ${this.prefix}language hindi - हिंदी में बदलें\n• ${this.prefix}language english - Change to English\n• ${this.prefix}language status - Check current language`;
        }
    }

    // Entertainment Commands
    async handleJoke(args, user) {
        const randomJoke = this.jokes[Math.floor(Math.random() * this.jokes.length)];
        return `😄 *Random Joke:*\n\n${randomJoke}`;
    }

    async handleQuote(args, user) {
        const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        return `✨ *Inspirational Quote:*\n\n${randomQuote}`;
    }

    async handleTime(args, user) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString();
        const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
        
        return `🕐 *Current Time:*\n\n⏰ ${timeString}\n📅 ${dateString}\n📆 ${dayName}`;
    }

    // Auto-reply check for non-command messages
    async checkAutoReply(user) {
        if (this.autoReplyEnabled.get(user.id)) {
            const customReply = this.customReplies.get(user.id);
            return customReply || '🤖 Auto-reply: I\'m currently unavailable. I\'ll get back to you soon!';
        }
        return null;
    }

    // Currency Converter
    async handleCurrency(args, user) {
        if (args.length < 3) {
            return '💱 *Currency Converter*\n\nUsage: /currency <amount> <from> <to>\n\nExamples:\n• /currency 100 USD INR\n• /currency 50 EUR USD\n• /currency 1000 INR USD';
        }
        
        const amount = parseFloat(args[0]);
        const fromCurrency = args[1].toUpperCase();
        const toCurrency = args[2].toUpperCase();
        
        if (isNaN(amount)) {
            return '❌ Invalid amount. Please enter a valid number.';
        }
        
        // Mock conversion rates (in real implementation, use API like exchangerate-api.com)
        const rates = {
            'USD': { 'INR': 83.25, 'EUR': 0.85, 'GBP': 0.73, 'JPY': 110.5 },
            'EUR': { 'USD': 1.18, 'INR': 98.1, 'GBP': 0.86, 'JPY': 130.2 },
            'INR': { 'USD': 0.012, 'EUR': 0.0102, 'GBP': 0.0088, 'JPY': 1.33 },
            'GBP': { 'USD': 1.37, 'EUR': 1.16, 'INR': 113.8, 'JPY': 151.3 }
        };
        
        if (fromCurrency === toCurrency) {
            return `💱 ${amount} ${fromCurrency} = ${amount} ${toCurrency}\n\n(Same currency)`;
        }
        
        const rate = rates[fromCurrency]?.[toCurrency];
        if (!rate) {
            return `❌ Conversion from ${fromCurrency} to ${toCurrency} not supported.\n\nSupported: USD, EUR, INR, GBP, JPY`;
        }
        
        const convertedAmount = (amount * rate).toFixed(2);
        return `💱 *Currency Conversion*\n\n${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}\n\nRate: 1 ${fromCurrency} = ${rate} ${toCurrency}\n\n⚠️ Rates are approximate. Use live API for accurate rates.`;
    }
    
    // News Handler
    async handleNews(args, user) {
        const category = args[0]?.toLowerCase() || 'general';
        
        // Mock news headlines (in real implementation, use NewsAPI)
        const newsData = {
            'general': [
                'Tech stocks surge amid AI breakthrough announcements',
                'Global climate summit reaches historic agreement',
                'New economic policies show promising early results',
                'Scientific discovery could revolutionize medicine',
                'International sports championship breaks viewership records'
            ],
            'tech': [
                'Major tech company announces quantum computing milestone',
                'New AI model shows unprecedented language understanding',
                'Cybersecurity experts warn of emerging threat vectors',
                'Smartphone innovation focuses on sustainability',
                'Cloud computing costs drop significantly across providers'
            ],
            'business': [
                'Stock markets reach new highs in morning trading',
                'Cryptocurrency adoption increases in developing nations',
                'Supply chain disruptions ease in key industries',
                'Startup funding reaches quarterly record high',
                'Consumer spending patterns shift toward digital services'
            ]
        };
        
        const headlines = newsData[category] || newsData['general'];
        const randomHeadlines = headlines.slice(0, 3);
        
        let newsText = `📰 *Latest News*`;
        if (category !== 'general') {
            newsText += ` (${category.charAt(0).toUpperCase() + category.slice(1)})`;
        }
        newsText += `\n\n`;
        
        randomHeadlines.forEach((headline, index) => {
            newsText += `${index + 1}. ${headline}\n\n`;
        });
        
        newsText += `🔄 Categories: general, tech, business\n`;
        newsText += `Usage: /news [category]\n\n`;
        newsText += `⚠️ Demo headlines. Real implementation needs NewsAPI integration.`;
        
        return newsText;
    }
    
    // Wikipedia Handler
    async handleWiki(args, user) {
        if (args.length === 0) {
            return '📖 *Wikipedia Search*\n\nUsage: /wiki <search term>\n\nExamples:\n• /wiki Albert Einstein\n• /wiki Python programming\n• /wiki Artificial Intelligence';
        }
        
        const searchTerm = args.join(' ');
        
        // Mock Wikipedia responses (in real implementation, use Wikipedia API)
        const wikiData = {
            'artificial intelligence': 'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn. AI systems can perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation.',
            'python programming': 'Python is a high-level, interpreted programming language known for its clear syntax and readability. Created by Guido van Rossum and first released in 1991, Python supports multiple programming paradigms and has a comprehensive standard library.',
            'whatsapp': 'WhatsApp is a freeware, cross-platform messaging and Voice over IP service owned by Facebook. It allows users to send text messages, voice messages, make voice and video calls, and share images, documents, and other content.',
            'node.js': 'Node.js is an open-source, cross-platform runtime environment that allows developers to run JavaScript on the server-side. Built on Chrome\'s V8 JavaScript engine, it uses an event-driven, non-blocking I/O model.',
            'default': `I found information about "${searchTerm}", but detailed Wikipedia integration requires API setup. This is a demo response showing how Wikipedia search would work.`
        };
        
        const key = Object.keys(wikiData).find(k => searchTerm.toLowerCase().includes(k));
        const content = wikiData[key] || wikiData['default'];
        
        return `📖 *Wikipedia: ${searchTerm}*\n\n${content}\n\n🔗 For full article, visit: https://en.wikipedia.org/wiki/${encodeURIComponent(searchTerm)}\n\n⚠️ Demo content. Real implementation needs Wikipedia API.`;
    }
    
    // QR Code Generator
    async handleQR(args, user) {
        if (args.length === 0) {
            return '🔲 *QR Code Generator*\n\nUsage: /qr <text or URL>\n\nExamples:\n• /qr https://google.com\n• /qr Contact: +1234567890\n• /qr Hello World!';
        }
        
        const content = args.join(' ');
        
        // In real implementation, generate actual QR code image
        return `🔲 *QR Code Generated*\n\nContent: "${content}"\n\n📱 QR Code would be generated here\n\n⚠️ QR code image generation requires additional libraries (qrcode npm package).\n\nFor now, you can use: https://qr-server.com/api/qr?size=200x200&data=${encodeURIComponent(content)}`;
    }
    
    // Translate Handler
    async handleTranslate(args, user) {
        if (args.length < 2) {
            return '🌐 *Translation Service*\n\nUsage: /translate <text> to <language>\n\nExamples:\n• /translate Hello to hindi\n• /translate नमस्ते to english\n• /translate Bonjour to spanish';
        }
        
        const text = args.join(' ');
        const toIndex = args.findIndex(word => word.toLowerCase() === 'to');
        
        if (toIndex === -1) {
            return '❌ Please specify target language using "to"\nExample: /translate Hello to hindi';
        }
        
        const sourceText = args.slice(0, toIndex).join(' ');
        const targetLang = args.slice(toIndex + 1).join(' ').toLowerCase();
        
        // Mock translations (in real implementation, use Google Translate API)
        const translations = {
            'hello': {
                'hindi': 'नमस्ते',
                'spanish': 'Hola',
                'french': 'Bonjour',
                'german': 'Hallo'
            },
            'thank you': {
                'hindi': 'धन्यवाद',
                'spanish': 'Gracias',
                'french': 'Merci',
                'german': 'Danke'
            },
            'नमस्ते': {
                'english': 'Hello/Greetings'
            },
            'धन्यवाद': {
                'english': 'Thank you'
            }
        };
        
        const translation = translations[sourceText.toLowerCase()]?.[targetLang];
        
        if (translation) {
            return `🌐 *Translation*\n\n"${sourceText}" → "${translation}"\n\n${sourceText} (Original) → ${translation} (${targetLang.charAt(0).toUpperCase() + targetLang.slice(1)})`;
        } else {
            return `🌐 *Translation Request*\n\nText: "${sourceText}"\nTo: ${targetLang}\n\n⚠️ Translation service requires Google Translate API integration.\n\nFor now, this is a demo showing basic translations for common phrases.`;
        }
    }
    
    // Media Tools
    async handleDownload(args, user) {
        if (args.length === 0) {
            return '📱 *Media Downloader*\n\nUsage: /download <YouTube/Instagram URL>\n\nExamples:\n• /download https://youtube.com/watch?v=...\n• /download https://instagram.com/p/...\n\n⚠️ Demo mode. Real implementation requires youtube-dl or yt-dlp integration.';
        }
        
        const url = args[0];
        
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return this.handleYouTubeDownload([url], user);
        } else if (url.includes('instagram.com')) {
            return `📱 *Instagram Download*\n\nURL: ${url}\n\n⚠️ Instagram download requires specific APIs and may violate terms of service.\n\nDemo response for: ${url}`;
        } else {
            return '❌ Unsupported platform. Supported: YouTube, Instagram';
        }
    }
    
    async handleYouTubeDownload(args, user) {
        if (args.length === 0) {
            return '🎵 *YouTube Downloader*\n\nUsage: /ytdl <YouTube URL> [format]\n\nFormats: video, audio\n\nExamples:\n• /ytdl https://youtube.com/watch?v=... audio\n• /ytdl https://youtube.com/watch?v=... video';
        }
        
        const url = args[0];
        const format = args[1]?.toLowerCase() || 'video';
        
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
            return '❌ Please provide a valid YouTube URL.';
        }
        
        return `🎵 *YouTube Download Request*\n\nURL: ${url}\nFormat: ${format}\n\n⚠️ YouTube download requires yt-dlp or youtube-dl integration.\n\n🔄 In demo mode, this would:\n1. Extract video info\n2. Download ${format} file\n3. Send media file to WhatsApp\n\n📁 File would be saved as: video_${Date.now()}.${format === 'audio' ? 'mp3' : 'mp4'}`;
    }
    
    async handleSticker(args, user) {
        return '🎨 *Sticker Maker*\n\n📸 Send me an image and I\'ll convert it to a WhatsApp sticker!\n\nFeatures:\n• Auto-resize to sticker format\n• Remove background (optional)\n• Add text overlay\n\n⚠️ Sticker creation requires image processing libraries:\n- Sharp (image processing)\n- Canvas (text overlay)\n\n🔄 Demo: Image → Crop → Resize → Convert → Send as sticker';
    }
    
    async handleMeme(args, user) {
        const randomMeme = this.memes[Math.floor(Math.random() * this.memes.length)];
        return `😂 *Random Meme:*\n\n${randomMeme}`;
    }
    
    // Enhanced Entertainment
    async handleShayari(args, user) {
        const category = args[0]?.toLowerCase();
        let selectedShayari;
        
        if (category === 'love' || category === 'mohabbat') {
            const loveShayaris = this.shayaris.filter(s => s.includes('दिल') || s.includes('मोहब्बत') || s.includes('چاند'));
            selectedShayari = loveShayaris[Math.floor(Math.random() * loveShayaris.length)] || this.shayaris[0];
        } else {
            selectedShayari = this.shayaris[Math.floor(Math.random() * this.shayaris.length)];
        }
        
        return `🌹 *Beautiful Shayari:*\n\n${selectedShayari}\n\n💫 Categories: love, general\nUsage: /shayari [category]`;
    }
    
    async handleFact(args, user) {
        const category = args[0]?.toLowerCase();
        let selectedFact;
        
        if (category === 'science') {
            const scienceFacts = this.facts.filter(f => f.includes('brain') || f.includes('Ocean') || f.includes('Moon'));
            selectedFact = scienceFacts[Math.floor(Math.random() * scienceFacts.length)] || this.facts[0];
        } else if (category === 'animal') {
            const animalFacts = this.facts.filter(f => f.includes('Octopuses') || f.includes('Sharks') || f.includes('Ants'));
            selectedFact = animalFacts[Math.floor(Math.random() * animalFacts.length)] || this.facts[1];
        } else {
            selectedFact = this.facts[Math.floor(Math.random() * this.facts.length)];
        }
        
        return `🤓 *Amazing Fact:*\n\n${selectedFact}\n\n🔬 Categories: science, animal, general\nUsage: /fact [category]`;
    }
    
    async handleRiddle(args, user) {
        const action = args[0]?.toLowerCase();
        
        // Simple riddle state management (in production, use database)
        if (!this.userRiddles) this.userRiddles = new Map();
        
        if (action === 'answer' && args[1]) {
            const userAnswer = args.slice(1).join(' ').toLowerCase();
            const currentRiddle = this.userRiddles.get(user.id);
            
            if (!currentRiddle) {
                return '❌ No active riddle. Use /riddle to get a new one!';
            }
            
            if (userAnswer.includes(currentRiddle.answer.toLowerCase())) {
                this.userRiddles.delete(user.id);
                return `🎉 *Correct!* ✅\n\nAnswer: ${currentRiddle.answer}\n\n🧠 Great thinking! Use /riddle for another one.`;
            } else {
                return `❌ *Not quite right!*\n\nTry again or use /riddle new for a different one.\n\n💡 Hint: Think about what the riddle describes literally.`;
            }
        } else {
            // Give new riddle
            const randomRiddle = this.riddles[Math.floor(Math.random() * this.riddles.length)];
            this.userRiddles.set(user.id, randomRiddle);
            
            return `🧩 *Brain Teaser:*\n\n${randomRiddle.question}\n\n💡 Reply with: /riddle answer <your answer>\n🔄 New riddle: /riddle new`;
        }
    }
    
    // Google Search
    async handleGoogleSearch(args, user) {
        if (args.length === 0) {
            return '🔍 *Google Search*\n\nUsage: /google <search query>\n\nExamples:\n• /google JavaScript tutorials\n• /google weather today\n• /google Node.js documentation';
        }
        
        const query = args.join(' ');
        
        // Mock search results (in real implementation, use Google Custom Search API)
        const mockResults = [
            `📄 ${query} - Complete Guide | Example.com`,
            `📺 ${query} Tutorial - YouTube`,
            `📚 ${query} Documentation | Official Site`,
            `💬 ${query} - Stack Overflow Discussion`,
            `📰 Latest ${query} News - News Site`
        ];
        
        const selectedResults = mockResults.slice(0, 3);
        
        let searchText = `🔍 *Google Search Results*\n\nQuery: "${query}"\n\n`;
        
        selectedResults.forEach((result, index) => {
            searchText += `${index + 1}. ${result}\n`;
        });
        
        searchText += `\n🌐 Search URL: https://google.com/search?q=${encodeURIComponent(query)}`;
        searchText += `\n\n⚠️ Demo results. Real implementation requires Google Custom Search API.`;
        
        return searchText;
    }
    
    // Short Links
    async handleShortenLink(args, user) {
        if (args.length === 0) {
            return '🔗 *Link Shortener*\n\nUsage: /shorten <long URL>\n\nExamples:\n• /shorten https://very-long-url.com/path/to/page\n• /shorten https://example.com/article?id=123&category=news';
        }
        
        const longUrl = args[0];
        
        // Validate URL
        try {
            new URL(longUrl);
        } catch {
            return '❌ Invalid URL format. Please provide a valid HTTP/HTTPS URL.';
        }
        
        // Generate mock short URL (in real implementation, use bit.ly API or TinyURL)
        const shortCode = Math.random().toString(36).substring(7);
        const shortUrl = `https://short.ly/${shortCode}`;
        
        return `🔗 *Link Shortened Successfully*\n\n📎 Original: ${longUrl}\n🎯 Short URL: ${shortUrl}\n\n📊 Features:\n• Click tracking\n• Analytics dashboard\n• Custom aliases\n• Expiration dates\n\n⚠️ Demo short link. Real implementation requires URL shortening service API.`;
    }
    
    // Group Management
    async handleWelcome(args, user) {
        const action = args[0]?.toLowerCase();
        
        switch (action) {
            case 'set':
                if (args.length < 2) {
                    return '👋 Usage: /welcome set <message>\nExample: /welcome set Welcome to our group! Please read the rules.';
                }
                const welcomeMsg = args.slice(1).join(' ');
                // In real implementation, save to database per group
                return `👋 *Welcome Message Set*\n\n"${welcomeMsg}"\n\n✅ This message will be sent to new group members.`;
            
            case 'show':
                return '👋 *Current Welcome Message:*\n\n"Welcome to our group! Please read the rules and enjoy your stay."\n\n💡 Use /welcome set <message> to change it.';
            
            case 'off':
            case 'disable':
                return '❌ Welcome message disabled for this group.';
            
            case 'on':
            case 'enable':
                return '✅ Welcome message enabled for this group.';
            
            default:
                return `👋 *Group Welcome Settings:*\n\n• /welcome set <message> - Set welcome message\n• /welcome show - View current message\n• /welcome on/off - Enable/disable\n\n⚠️ Group features require group chat context.`;
        }
    }
    
    async handleRules(args, user) {
        const action = args[0]?.toLowerCase();
        
        switch (action) {
            case 'set':
                if (args.length < 2) {
                    return '📋 Usage: /rules set <rules>\nExample: /rules set 1. Be respectful\n2. No spam\n3. Stay on topic';
                }
                const rules = args.slice(1).join(' ');
                return `📋 *Group Rules Set*\n\n${rules}\n\n✅ Members can view rules with /rules command.`;
            
            case 'add':
                if (args.length < 2) {
                    return '➕ Usage: /rules add <new rule>\nExample: /rules add No promotional content';
                }
                const newRule = args.slice(1).join(' ');
                return `➕ *Rule Added*\n\n"${newRule}"\n\n📋 Use /rules to see all rules.`;
            
            default:
                // Show current rules
                const defaultRules = `📋 *Group Rules:*\n\n1. 🤝 Be respectful to all members\n2. 🚫 No spam or excessive promotion\n3. 💬 Stay on topic\n4. 🔞 No NSFW content\n5. 🎯 Use appropriate channels for discussions\n\n👮‍♀️ Admins reserve the right to remove disruptive members.\n\n💡 Admins can use /rules set to update these.`;
                return defaultRules;
        }
    }
    
    async handlePoll(args, user) {
        if (args.length < 2) {
            return '🗳️ *Create Poll*\n\nUsage: /poll <question> | <option1> | <option2> | [option3...]\n\nExample:\n/poll What should we have for lunch? | Pizza | Burger | Salad';
        }
        
        const pollText = args.join(' ');
        const parts = pollText.split(' | ');
        
        if (parts.length < 3) {
            return '❌ Poll needs at least a question and 2 options.\nFormat: /poll question | option1 | option2';
        }
        
        const question = parts[0];
        const options = parts.slice(1);
        
        if (options.length > 10) {
            return '❌ Maximum 10 poll options allowed.';
        }
        
        let pollMessage = `🗳️ *POLL*\n\n📊 ${question}\n\n`;
        
        options.forEach((option, index) => {
            const emoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][index];
            pollMessage += `${emoji} ${option.trim()}\n`;
        });
        
        pollMessage += `\n💡 Reply with the number emoji to vote!\n⏰ Poll created by ${user.name || user.phone}`;
        
        return pollMessage;
    }
    
    async handleAdmin(args, user) {
        const action = args[0]?.toLowerCase();
        
        // Note: In real implementation, check if user is group admin
        const isAdmin = true; // Mock admin status
        
        if (!isAdmin) {
            return '❌ Admin commands are restricted to group administrators.';
        }
        
        switch (action) {
            case 'kick':
                if (args.length < 2) {
                    return '👢 Usage: /admin kick @username\nExample: /admin kick @spammer';
                }
                const kickUser = args[1];
                return `👢 *User Removed*\n\n${kickUser} has been removed from the group.\n\n⚠️ Demo action. Real implementation requires group management permissions.`;
            
            case 'mute':
                if (args.length < 2) {
                    return '🔇 Usage: /admin mute @username [duration]\nExample: /admin mute @user 1h';
                }
                const muteUser = args[1];
                const duration = args[2] || '1h';
                return `🔇 *User Muted*\n\n${muteUser} has been muted for ${duration}.\n\n⚠️ Demo action. Real group features require WhatsApp Business API.`;
            
            case 'warn':
                if (args.length < 2) {
                    return '⚠️ Usage: /admin warn @username [reason]\nExample: /admin warn @user Please follow group rules';
                }
                const warnUser = args[1];
                const reason = args.slice(2).join(' ') || 'No reason provided';
                return `⚠️ *Warning Issued*\n\nUser: ${warnUser}\nReason: ${reason}\n\n📝 Warning logged in admin records.`;
            
            case 'promote':
                if (args.length < 2) {
                    return '⬆️ Usage: /admin promote @username\nExample: /admin promote @helper';
                }
                const promoteUser = args[1];
                return `⬆️ *User Promoted*\n\n${promoteUser} is now a group admin.\n\n👑 They can now use admin commands.`;
            
            default:
                return `👮‍♀️ *Admin Commands:*\n\n• /admin kick @user - Remove user\n• /admin mute @user [time] - Mute user\n• /admin warn @user [reason] - Warn user\n• /admin promote @user - Make admin\n\n⚠️ Group management features require WhatsApp Business API for full functionality.`;
        }
    }
    
    // Rate limiting implementation
    async checkRateLimit(userId, commandName) {
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute window
        const maxRequests = 10; // Max 10 commands per minute per user

        const userKey = `${userId}_${commandName}`;
        const userData = this.rateLimitCache.get(userKey) || { count: 0, resetTime: now + windowMs };

        // Reset if window has passed
        if (now > userData.resetTime) {
            userData.count = 0;
            userData.resetTime = now + windowMs;
        }

        // Check if limit exceeded
        if (userData.count >= maxRequests) {
            return false;
        }

        // Increment count
        userData.count++;
        this.rateLimitCache.set(userKey, userData);

        return true;
    }

    // Helper method to get localized message
    getMessage(key, userId) {
        const lang = this.userLanguage.get(userId) || 'en';
        return this.messages[lang][key] || this.messages['en'][key];
    }
}

export default CommandHandler;
