import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the WhatsBotX application
let WhatsBotXApp;
let botProcess = null;
let mainWindow = null;
let appInstance = null;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.cjs')
        },
        icon: path.join(__dirname, '../../assets/icon.png'), // You can add an icon later
        titleBarStyle: 'default',
        show: false
    });

    // Load the app
    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        
        if (isDev) {
            mainWindow.webContents.openDevTools();
        }
    });

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Create menu
    createMenu();
}

function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Settings',
                    click: () => {
                        // Open settings window
                        mainWindow.webContents.send('open-settings');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Bot',
            submenu: [
                {
                    label: 'Start Bot',
                    click: () => {
                        mainWindow.webContents.send('start-bot');
                    }
                },
                {
                    label: 'Open WhatsApp Web',
                    click: () => {
                        openWhatsAppWebWindow();
                    }
                },
                {
                    label: 'Stop Bot',
                    click: () => {
                        mainWindow.webContents.send('stop-bot');
                    }
                },
                {
                    label: 'Restart Bot',
                    click: () => {
                        mainWindow.webContents.send('restart-bot');
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About WhatsBotX',
                            message: 'WhatsBotX GUI',
                            detail: 'Personal AI Assistant for WhatsApp\nVersion: 2.0.0'
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// Fallback: open a dedicated BrowserWindow to load web.whatsapp.com
function openWhatsAppWebWindow() {
    try {
        const waWin = new BrowserWindow({
            width: 1100,
            height: 850,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.cjs'),
                partition: 'persist:waweb'
            }
        });

        // Use the official web URL; the separate partition persists the session
        waWin.loadURL('https://web.whatsapp.com/');

        waWin.once('ready-to-show', () => waWin.show());
        waWin.on('closed', () => {});
    } catch (err) {
        console.error('Failed to open WhatsApp Web window:', err);
        if (mainWindow && mainWindow.webContents) mainWindow.webContents.send('bot-error', 'Failed to open WhatsApp Web window');
    }
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', async () => {
    // Stop bot before closing
    if (appInstance) {
        try {
            await appInstance.shutdown();
        } catch (error) {
            console.error('Error shutting down bot:', error);
        }
    }
    
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC handlers for bot control
ipcMain.handle('start-bot', async () => {
    try {
        if (appInstance) {
            return { success: false, message: 'Bot is already running' };
        }

        // Dynamically import the ES module. On Windows, convert absolute path to file:// URL
        const resolvedPath = path.resolve(__dirname, '../index.js');
        const moduleUrl = pathToFileURL(resolvedPath).href;
        console.log('Resolved bot path for import:', resolvedPath);
        console.log('Importing bot module via URL:', moduleUrl);
        const { default: WhatsBotXAppClass } = await import(moduleUrl);
        appInstance = new WhatsBotXAppClass();
        
        // Override the displayBanner method to prevent console output
        appInstance.displayBanner = async () => {};
        
        // Initialize the bot - this will create bot instance
        await appInstance.initialize();
        
        // IMPORTANT: Set up event listeners immediately after bot is created
        // The bot may start emitting events, so we need to listen ASAP
        if (appInstance.bot) {
            // Listen for QR code events from the bot
            appInstance.bot.on('qr', (qr) => {
                console.log('QR Code received in main process:', qr ? `QR Data Available (${qr.length} chars)` : 'QR Cleared');
                if (qr) {
                    sendQRCodeToRenderer(qr);
                }
            });
            
            // Listen for connection status events from the bot
            appInstance.bot.on('connectionStatus', (status) => {
                console.log('Connection status update:', status);
                sendConnectionStatusToRenderer(status);
            });
            
            // Forward authenticated event to renderer for UI feedback
            appInstance.bot.on('authenticated', () => {
                console.log('WhatsApp authenticated in main process');
                if (mainWindow && mainWindow.webContents) mainWindow.webContents.send('authenticated');
            });
        }
        
        return { success: true, message: 'Bot started successfully' };
    } catch (error) {
        console.error('Failed to start bot:', error);
        appInstance = null;
        return { success: false, message: `Failed to start bot: ${error.message}` };
    }
});

ipcMain.handle('stop-bot', async () => {
    try {
        if (!appInstance) {
            return { success: false, message: 'Bot is not running' };
        }

        await appInstance.shutdown();
        appInstance = null;
        
        return { success: true, message: 'Bot stopped successfully' };
    } catch (error) {
        console.error('Failed to stop bot:', error);
        return { success: false, message: `Failed to stop bot: ${error.message}` };
    }
});

ipcMain.handle('get-bot-status', async () => {
    if (!appInstance || !appInstance.bot) {
        return {
            isRunning: false,
            status: 'stopped',
            isHealthy: false,
            clientWid: null
        };
    }
    
    // Return detailed status including health check
    const botStatus = appInstance.bot.getStatus();
    return {
        isRunning: appInstance !== null,
        status: appInstance.bot.isConnected ? 'connected' : 'disconnected',
        isHealthy: botStatus.isHealthy,
        clientWid: botStatus.clientWid,
        timestamp: botStatus.timestamp
    };
});

ipcMain.handle('get-logs', async () => {
    // Return recent logs - you can implement log reading here
    return {
        logs: [
            { timestamp: new Date(), level: 'info', message: 'GUI application started', module: 'GUI' }
        ]
    };
});

// Global variable to store QR code
let currentQRCode = null;
let connectionStatus = 'disconnected';

// Handle QR code updates
ipcMain.handle('get-qr-code', async () => {
    // First check if we have a cached QR
    if (currentQRCode) {
        return currentQRCode;
    }
    
    // If not cached, try to get from bot
    if (appInstance && appInstance.bot) {
        const qr = appInstance.bot.getCurrentQRCode();
        if (qr) {
            currentQRCode = qr;
            return qr;
        }
    }
    
    return null;
});

// Handle connection status
ipcMain.handle('get-connection-status', async () => {
    return connectionStatus;
});

// IPC to open WhatsApp Web fallback from renderer
ipcMain.handle('open-whatsapp-web', async () => {
    try {
        openWhatsAppWebWindow();
        return { success: true };
    } catch (err) {
        console.error('Error opening WhatsApp Web window via IPC:', err);
        return { success: false, message: err.message };
    }
});

// Send message via WhatsApp
ipcMain.handle('send-message', async (event, { number, message }) => {
    try {
        if (!appInstance || !appInstance.bot) {
            return { success: false, error: 'Bot is not running' };
        }
        
        if (!appInstance.bot.isConnected) {
            return { success: false, error: 'WhatsApp is not connected' };
        }
        
        // Format number for WhatsApp (add @c.us suffix)
        const chatId = number.includes('@c.us') ? number : `${number.replace(/[^0-9]/g, '')}@c.us`;
        
        // Send message using the bot's client
        await appInstance.bot.client.sendMessage(chatId, message);
        
        console.log(`Message sent to ${number}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to send message:', error);
        return { success: false, error: error.message };
    }
});

// Logout from WhatsApp
ipcMain.handle('logout', async () => {
    try {
        if (!appInstance || !appInstance.bot || !appInstance.bot.client) {
            return { success: false, message: 'Bot is not running' };
        }
        
        await appInstance.bot.client.logout();
        
        // Notify renderer
        if (mainWindow && mainWindow.webContents) {
            mainWindow.webContents.send('logout-complete');
        }
        
        return { success: true, message: 'Logged out successfully' };
    } catch (error) {
        console.error('Failed to logout:', error);
        return { success: false, message: error.message };
    }
});

// API Server control
let apiServerInstance = null;

ipcMain.handle('toggle-api-server', async (event, shouldStart) => {
    try {
        if (shouldStart && !apiServerInstance) {
            // Try to start API server
            const { default: ApiServer } = await import(pathToFileURL(path.resolve(__dirname, '../api/ApiServer.js')).href);
            
            // Create API server instance with bot and database
            if (appInstance && appInstance.database && appInstance.bot) {
                apiServerInstance = new ApiServer(appInstance.database, appInstance.bot);
                await apiServerInstance.start();
                console.log(`API server started on port ${apiServerInstance.port}`);
                return { success: true, message: `API server started on port ${apiServerInstance.port}`, port: apiServerInstance.port };
            } else {
                return { success: false, message: 'Bot not running - cannot start API server. Start bot first.' };
            }
        } else if (!shouldStart && apiServerInstance) {
            // Stop API server
            if (apiServerInstance.server) {
                apiServerInstance.server.close();
                apiServerInstance = null;
                console.log('API server stopped');
                return { success: true, message: 'API server stopped' };
            }
        }
        
        return { success: false, message: 'Invalid API server state' };
    } catch (error) {
        console.error('Failed to toggle API server:', error);
        apiServerInstance = null;
        return { success: false, message: `Failed to toggle API server: ${error.message}` };
    }
});

// Function to send QR code to renderer
function sendQRCodeToRenderer(qr) {
    currentQRCode = qr;
    if (mainWindow && mainWindow.webContents) {
        console.log('Sending QR to renderer window...');
        mainWindow.webContents.send('qr-code-update', qr);
        console.log('QR sent to renderer successfully');
    } else {
        console.warn('Main window or webContents not available - cannot send QR to renderer');
    }
}

// Function to send connection status to renderer
function sendConnectionStatusToRenderer(status) {
    connectionStatus = status;
    if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('connection-status-update', status);
    }
}

// Handle app errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    if (mainWindow) {
        mainWindow.webContents.send('bot-error', error.message);
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    if (mainWindow) {
        mainWindow.webContents.send('bot-error', `Unhandled rejection: ${reason}`);
    }
});
