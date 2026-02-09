const { contextBridge, ipcRenderer } = require('electron');

// Consolidated bridge: expose the specific helpers the renderer expects,
// plus a generic invoker `invokeMain` and `electronInvoke` for compatibility.
const electronAPI = {
    // Bot control methods
    startBot: () => ipcRenderer.invoke('start-bot'),
    stopBot: () => ipcRenderer.invoke('stop-bot'),
    getBotStatus: () => ipcRenderer.invoke('get-bot-status'),
    getLogs: () => ipcRenderer.invoke('get-logs'),
    logout: () => ipcRenderer.invoke('logout'),

    // Messaging methods
    sendMessage: (number, message) => ipcRenderer.invoke('send-message', { number, message }),

    // QR code and connection methods
    getQRCode: () => ipcRenderer.invoke('get-qr-code'),
    getConnectionStatus: () => ipcRenderer.invoke('get-connection-status'),

    // Open WhatsApp Web fallback
    openWhatsAppWeb: () => ipcRenderer.invoke('open-whatsapp-web'),

    // API server control
    toggleApiServer: (shouldStart) => ipcRenderer.invoke('toggle-api-server', shouldStart),

    // Event listeners (named helpers for existing renderer code)
    onStartBot: (cb) => ipcRenderer.on('start-bot', (e, data) => cb(e, data)),
    onStopBot: (cb) => ipcRenderer.on('stop-bot', (e, data) => cb(e, data)),
    onRestartBot: (cb) => ipcRenderer.on('restart-bot', (e, data) => cb(e, data)),
    onOpenSettings: (cb) => ipcRenderer.on('open-settings', (e, data) => cb(e, data)),
    onBotError: (cb) => ipcRenderer.on('bot-error', (e, data) => cb(e, data)),
    onQRCodeUpdate: (cb) => ipcRenderer.on('qr-code-update', (e, data) => cb(e, data)),
    onConnectionStatusUpdate: (cb) => ipcRenderer.on('connection-status-update', (e, data) => cb(e, data)),
    onAuthenticated: (cb) => ipcRenderer.on('authenticated', (e, data) => cb(e, data)),
    onLogoutComplete: (cb) => ipcRenderer.on('logout-complete', (e, data) => cb(e, data)),

    // Generic subscription and utility
    on: (channel, cb) => ipcRenderer.on(channel, (e, data) => cb(e, data)),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

    // Utility properties
    platform: process.platform,
    version: process.versions.electron,

    // Generic invoker used by renderer code
    invokeMain: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Backwards-compatible separate invoker if code expects `electronInvoke`.
contextBridge.exposeInMainWorld('electronInvoke', {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
});

// Debug log to confirm preload loaded and methods available in renderer console
try {
    console.log('preload: electronAPI exposed', Object.keys(electronAPI));
} catch (err) {
    // ignore
}
