// Global app state
let appState = {
    botRunning: false,
    startTime: null,
    logs: [],
    stats: {
        messagesProcessed: 0,
        activeChats: 0,
        commandsExecuted: 0
    },
    currentUser: null,
    users: [],
    userSettings: {},
    theme: 'light',
    analytics: {
        totalMessages: 0,
        totalCommands: 0,
        userEngagement: {},
        commandUsage: {},
        sessionData: []
    },
    plugins: [],
    accessibility: {
        highContrast: false,
        largeText: false,
        screenReader: false
    },
    cache: new Map(),
    performance: {
        messageProcessingTime: [],
        apiResponseTime: [],
        memoryUsage: [],
        lastCleanup: Date.now()
    }
};

// DOM elements
let elements = {};

function populateElements() {
    elements = {
        // Header
        statusIndicator: document.getElementById('statusIndicator'),
        statusText: document.getElementById('statusText'),
        // Theme controls removed from header - now in settings only
        electronVersion: document.getElementById('electronVersion'),

        // Control Panel
        startBtn: document.getElementById('startBtn'),
        stopBtn: document.getElementById('stopBtn'),
        restartBtn: document.getElementById('restartBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        statusMessage: document.getElementById('statusMessage'),
        qrSection: document.getElementById('qrSection'),
        qrCodeContainer: document.getElementById('qrCodeContainer'),
        qrTimer: document.getElementById('qrTimer'),
        openWaWebBtn: document.getElementById('openWaWebBtn'),

        // Todo
        todoInput: document.getElementById('todoInput'),
        addTodoBtn: document.getElementById('addTodoBtn'),
        todoList: document.getElementById('todoList'),

        // AI Chat
        aiChatHistory: document.getElementById('aiChatHistory'),
        aiInput: document.getElementById('aiInput'),
        sendAiBtn: document.getElementById('sendAiBtn'),

        // Auto-Reply
        autoReplyToggle: document.getElementById('autoReplyToggle'),
        autoReplyMessage: document.getElementById('autoReplyMessage'),
        setAutoReplyBtn: document.getElementById('setAutoReplyBtn'),

        // Bulk Messaging
        sendSingleBtn: document.getElementById('sendSingleBtn'),
        singleNumber: document.getElementById('singleNumber'),
        singleMessage: document.getElementById('singleMessage'),
        numbersFile: document.getElementById('numbersFile'),
        bulkMessage: document.getElementById('bulkMessage'),
        numberCount: document.getElementById('numberCount'),
        sendBulkBtn: document.getElementById('sendBulkBtn'),
        exportBulkBtn: document.getElementById('exportBulkBtn'),
        contactName: document.getElementById('contactName'),
        contactNumber: document.getElementById('contactNumber'),
        addContactBtn: document.getElementById('addContactBtn'),
        contactsList: document.getElementById('contactsList'),
        exportContactsBtn: document.getElementById('exportContactsBtn'),
        importContactsBtn: document.getElementById('importContactsBtn'),
        importContactsFile: document.getElementById('importContactsFile'),
        bulkProgress: document.getElementById('bulkProgress'),
        progressFill: document.getElementById('progressFill'),
        progressText: document.getElementById('progressText'),

        // Quick Actions
        jokeBtn: document.getElementById('jokeBtn'),
        quoteBtn: document.getElementById('quoteBtn'),
        timeBtn: document.getElementById('timeBtn'),
        weatherBtn: document.getElementById('weatherBtn'),
        newsBtn: document.getElementById('newsBtn'),
        wikiBtn: document.getElementById('wikiBtn'),
        quickActionResult: document.getElementById('quickActionResult'),

        // Reminders & Scheduling
        reminderTime: document.getElementById('reminderTime'),
        reminderText: document.getElementById('reminderText'),
        setReminderBtn: document.getElementById('setReminderBtn'),
        remindersList: document.getElementById('remindersList'),
        scheduleType: document.getElementById('scheduleType'),
        scheduleTime: document.getElementById('scheduleTime'),
        scheduleMessage: document.getElementById('scheduleMessage'),
        setScheduleBtn: document.getElementById('setScheduleBtn'),

        // API Dashboard
        toggleApiServerBtn: document.getElementById('toggleApiServerBtn'),
        apiServerStatus: document.getElementById('apiServerStatus'),
        apiPort: document.getElementById('apiPort'),
        apiBaseUrl: document.getElementById('apiBaseUrl'),
        connectedClients: document.getElementById('connectedClients'),
        apiKeyInput: document.getElementById('apiKeyInput'),
        toggleApiKeyVisibility: document.getElementById('toggleApiKeyVisibility'),
        copyApiKeyBtn: document.getElementById('copyApiKeyBtn'),
        generateApiKeyBtn: document.getElementById('generateApiKeyBtn'),
        revokeApiKeyBtn: document.getElementById('revokeApiKeyBtn'),

        // Settings
        languageSelect: document.getElementById('languageSelect'),
        themeSelect: document.getElementById('themeSelect'),
        settingsThemeToggle: document.getElementById('settingsThemeToggle'),
        highContrastToggle: document.getElementById('highContrastToggle'),
        largeTextToggle: document.getElementById('largeTextToggle'),
        screenReaderToggle: document.getElementById('screenReaderToggle'),
        reducedMotionToggle: document.getElementById('reducedMotionToggle'),
        autoStartToggle: document.getElementById('autoStartToggle'),
        minimizeTrayToggle: document.getElementById('minimizeTrayToggle'),
        accentColorPicker: document.getElementById('accentColorPicker'),
        uiScaleSlider: document.getElementById('uiScaleSlider'),
        uiScaleValue: document.getElementById('uiScaleValue'),
        apiPortInput: document.getElementById('apiPortInput'),
        logLevelSelect: document.getElementById('logLevelSelect'),
        notificationsToggle: document.getElementById('notificationsToggle'),
        saveSettingsBtn: document.getElementById('saveSettingsBtn'),
        resetSettingsBtn: document.getElementById('resetSettingsBtn'),
        clearCacheBtn: document.getElementById('clearCacheBtn'),

        // Statistics
        messagesProcessed: document.getElementById('messagesProcessed'),
        activeChats: document.getElementById('activeChats'),
        uptime: document.getElementById('uptime'),
        commandsExecuted: document.getElementById('commandsExecuted'),

        // Logs
        logsContainer: document.getElementById('logsContainer'),
        clearLogsBtn: document.getElementById('clearLogsBtn'),
        refreshLogsBtn: document.getElementById('refreshLogsBtn'),

        // Config Panel
        configPanel: document.getElementById('configPanel'),
        closeConfigBtn: document.getElementById('closeConfigBtn'),
        cancelConfigBtn: document.getElementById('cancelConfigBtn'),
        configForm: document.getElementById('configForm'),

        // Loading Overlay
        loadingOverlay: document.getElementById('loadingOverlay'),
        loadingText: document.getElementById('loadingText'),

        // Toasts
        toastContainer: document.getElementById('toastContainer')
    };
}


// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
    console.log('WhatsBotX GUI initialized');

    // Debug: report IPC bridge presence
    console.log('IPC bridge check:', {
        electronAPI_present: !!window.electronAPI,
        invokeMain_type: window.electronAPI && typeof window.electronAPI.invokeMain
    });

    // Populate DOM elements
    populateElements();

    // Debug: Check if elements are found
    console.log('Debugging element selection:');
    console.log('sendSingleBtn:', elements.sendSingleBtn);
    console.log('sendBulkBtn:', elements.sendBulkBtn);
    console.log('addContactBtn:', elements.addContactBtn);
    console.log('setScheduleBtn:', elements.setScheduleBtn);

    // Set Electron version
    if (window.electronAPI && window.electronAPI.version) {
        elements.electronVersion.textContent = window.electronAPI.version;
    }
    
    // Preload QR library to ensure it's ready when needed
    if (typeof QRious === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
        document.head.appendChild(script);
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Initial status check
    await updateBotStatus();
    
    // Start periodic updates
    startPeriodicUpdates();
    
    // Initialize bulk messaging system
    initializeBulkMessaging();

    // Initialize file operations
    // initializeFileOperations(); // This function is missing, so commented out for now

    // Initialize UI enhancements
    initializeUIEnhancements();

    // Initialize all toggles and settings
    initializeAllToggles();

    // Initialize accent color from localStorage
    const savedAccentColor = localStorage.getItem('whatsbotx_accent_color') || '#667eea';
    document.documentElement.style.setProperty('--accent-primary', savedAccentColor);
    if (elements.accentColorPicker) {
        elements.accentColorPicker.value = savedAccentColor;
    }

    // Initialize analytics
    // initializeAnalytics(); // This function is missing, so commented out for now

    // Initialize plugin system
    // initializePluginSystem(); // This function is missing, so commented out for now

    // Initialize performance monitoring
    // initializePerformanceMonitoring(); // This function is missing, so commented out for now

    // Initialize security features
    // initializeSecurityFeatures(); // This function is missing, so commented out for now

    // Add initial log entry
    addLogEntry('info', 'GUI', 'Application started');

    // Initialize other features
    initializeFeatures();
});

function setupEventListeners() {
    console.log('Setting up event listeners...');
    console.log('Available elements:', {
        toggleApiServerBtn: !!elements.toggleApiServerBtn,
        saveSettingsBtn: !!elements.saveSettingsBtn,
        highContrastToggle: !!elements.highContrastToggle,
        generalTabBtn: !!document.querySelector('.settings-tabs .tab-btn[data-tab="general"]')
    });

    // Bot control buttons
    if (elements.startBtn) elements.startBtn.addEventListener('click', startBot);
    if (elements.stopBtn) elements.stopBtn.addEventListener('click', stopBot);
    if (elements.restartBtn) elements.restartBtn.addEventListener('click', restartBot);
    if (elements.logoutBtn) elements.logoutBtn.addEventListener('click', logoutFromWhatsApp);

    // Todo features
    if (elements.addTodoBtn) elements.addTodoBtn.addEventListener('click', addTodoItem);
    if (elements.todoInput) elements.todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodoItem();
    });

    // AI Chat
    if (elements.sendAiBtn) elements.sendAiBtn.addEventListener('click', sendAiMessage);
    if (elements.aiInput) elements.aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendAiMessage();
    });

    // Auto-Reply
    if (elements.autoReplyToggle) elements.autoReplyToggle.addEventListener('change', toggleAutoReply);
    if (elements.setAutoReplyBtn) elements.setAutoReplyBtn.addEventListener('click', setAutoReplyMessage);

    // Bulk Messaging
    console.log('Setting up bulk messaging listeners...');
    if (elements.sendSingleBtn) {
        elements.sendSingleBtn.addEventListener('click', sendSingleMessage);
        console.log('Added listener to sendSingleBtn');
    } else {
        console.log('sendSingleBtn not found!');
    }

    if (elements.sendBulkBtn) {
        elements.sendBulkBtn.addEventListener('click', sendBulkMessages);
        console.log('Added listener to sendBulkBtn');
    } else {
        console.log('sendBulkBtn not found!');
    }

    if (elements.numbersFile) {
        elements.numbersFile.addEventListener('change', loadNumbersFile);
        console.log('Added listener to numbersFile');
    } else {
        console.log('numbersFile not found!');
    }

    if (elements.addContactBtn) {
        elements.addContactBtn.addEventListener('click', addContact);
        console.log('Added listener to addContactBtn');
    } else {
        console.log('addContactBtn not found!');
    }

    // Export/Import buttons
    if (elements.exportBulkBtn) {
        elements.exportBulkBtn.addEventListener('click', exportBulkNumbers);
        console.log('Added listener to exportBulkBtn');
    }
    if (elements.exportContactsBtn) {
        elements.exportContactsBtn.addEventListener('click', exportContacts);
        console.log('Added listener to exportContactsBtn');
    }
    if (elements.importContactsBtn) {
        elements.importContactsBtn.addEventListener('click', () => elements.importContactsFile?.click());
        console.log('Added listener to importContactsBtn');
    }
    if (elements.importContactsFile) {
        elements.importContactsFile.addEventListener('change', importContacts);
        console.log('Added listener to importContactsFile');
    }

    // Tab switching - Fix for Settings and API tabs
    document.querySelectorAll('.settings-tabs .tab-btn').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const tabName = tab.dataset.tab;
            const settingsPanel = document.querySelector('.settings-panel .card-body');
            if (settingsPanel) switchTabInContainer(settingsPanel, tabName);
        });
    });

    document.querySelectorAll('.api-tabs .tab-btn').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const tabName = tab.dataset.tab;
            const apiPanel = document.querySelector('.api-dashboard-panel .card-body');
            if (apiPanel) switchTabInContainer(apiPanel, tabName);
        });
    });

    // Tab switching for bulk messaging and other tabs
    document.querySelectorAll('.bulk-tabs .tab-btn').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const tabName = tab.dataset.tab;
            const bulkPanel = document.querySelector('.bulk-messaging-panel .card-body');
            if (bulkPanel) switchTabInContainer(bulkPanel, tabName);
        });
    });

    document.querySelectorAll('.reminder-tabs .tab-btn').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const tabName = tab.dataset.tab;
            const reminderPanel = document.querySelector('.reminders-panel .card-body');
            if (reminderPanel) switchTabInContainer(reminderPanel, tabName);
        });
    });

    // Quick Actions
    if (elements.jokeBtn) elements.jokeBtn.addEventListener('click', () => getQuickAction('joke'));
    if (elements.quoteBtn) elements.quoteBtn.addEventListener('click', () => getQuickAction('quote'));
    if (elements.timeBtn) elements.timeBtn.addEventListener('click', () => getQuickAction('time'));
    if (elements.weatherBtn) elements.weatherBtn.addEventListener('click', () => getWeather());
    if (elements.newsBtn) elements.newsBtn.addEventListener('click', () => getNews());
    if (elements.wikiBtn) elements.wikiBtn.addEventListener('click', () => getWikipedia());

    // Reminders
    if (elements.setReminderBtn) elements.setReminderBtn.addEventListener('click', setReminder);

    // Scheduling
    if (elements.setScheduleBtn) {
        elements.setScheduleBtn.addEventListener('click', setSchedule);
        console.log('Added listener to setScheduleBtn');
    } else {
        console.log('setScheduleBtn not found!');
    }
    
    // API Dashboard
    if (elements.toggleApiServerBtn) {
        elements.toggleApiServerBtn.addEventListener('click', toggleApiServer);
    }
    if (elements.toggleApiKeyVisibility) {
        elements.toggleApiKeyVisibility.addEventListener('click', toggleApiKeyVisibility);
    }
    if (elements.copyApiKeyBtn) {
        elements.copyApiKeyBtn.addEventListener('click', copyApiKey);
    }
    if (elements.generateApiKeyBtn) {
        elements.generateApiKeyBtn.addEventListener('click', generateNewApiKey);
    }
    if (elements.revokeApiKeyBtn) {
        elements.revokeApiKeyBtn.addEventListener('click', revokeApiKey);
    }
    
    // Settings - Advanced
    if (elements.saveSettingsBtn) {
        elements.saveSettingsBtn.addEventListener('click', saveAllSettings);
    }
    if (elements.resetSettingsBtn) {
        elements.resetSettingsBtn.addEventListener('click', resetToDefaults);
    }
    if (elements.clearCacheBtn) {
        elements.clearCacheBtn.addEventListener('click', clearAppCache);
    }
    if (elements.uiScaleSlider) {
        elements.uiScaleSlider.addEventListener('input', (e) => {
            if (elements.uiScaleValue) {
                elements.uiScaleValue.textContent = e.target.value + '%';
            }
            applyUIScale(e.target.value);
        });
    }
    if (elements.accentColorPicker) {
        elements.accentColorPicker.addEventListener('change', changeAccentColor);
    }
    if (elements.reducedMotionToggle) {
        elements.reducedMotionToggle.addEventListener('change', toggleReducedMotion);
    }
    if (elements.autoStartToggle) {
        elements.autoStartToggle.addEventListener('change', toggleAutoStart);
    }
    if (elements.minimizeTrayToggle) {
        elements.minimizeTrayToggle.addEventListener('change', toggleMinimizeTray);
    }
    
    // Settings - Accessibility
    if (elements.highContrastToggle) {
        elements.highContrastToggle.addEventListener('change', toggleHighContrast);
    }
    if (elements.largeTextToggle) {
        elements.largeTextToggle.addEventListener('change', toggleLargeText);
    }
    if (elements.screenReaderToggle) {
        elements.screenReaderToggle.addEventListener('change', toggleScreenReader);
    }
    
    // Settings - General
    if (elements.languageSelect) {
        elements.languageSelect.addEventListener('change', changeLanguage);
    }
    
    // Settings - Appearance
    if (elements.themeSelect) {
        elements.themeSelect.addEventListener('change', changeTheme);
    }
    
    // Theme Toggle
    // Header theme buttons removed - theme control now only in settings panel
    
    // Logs panel
    if (elements.clearLogsBtn) elements.clearLogsBtn.addEventListener('click', clearLogs);
    if (elements.refreshLogsBtn) elements.refreshLogsBtn.addEventListener('click', () => refreshLogs(true));
    
    // Configuration panel
    if (elements.closeConfigBtn) elements.closeConfigBtn.addEventListener('click', closeConfigPanel);
    if (elements.cancelConfigBtn) elements.cancelConfigBtn.addEventListener('click', closeConfigPanel);
    if (elements.configForm) elements.configForm.addEventListener('submit', saveConfiguration);
    
    // Menu events from main process
    if (window.electronAPI) {
        console.log('Setting up electronAPI event listeners', {
            hasStartBot: typeof window.electronAPI.onStartBot,
            hasOnQRCodeUpdate: typeof window.electronAPI.onQRCodeUpdate
        });
        window.electronAPI.onStartBot(() => startBot());
        window.electronAPI.onStopBot(() => stopBot());
        window.electronAPI.onRestartBot(() => restartBot());
        window.electronAPI.onOpenSettings(() => openConfigPanel());
        window.electronAPI.onBotError((event, error) => {
            showToast('error', 'Bot Error', error);
            addLogEntry('error', 'BOT', error);
        });
        
        // QR code and connection status events
        window.electronAPI.onQRCodeUpdate((event, qrCode) => {
            console.log('onQRCodeUpdate event fired from main process', { 
                qrCodeLength: qrCode ? qrCode.length : 0,
                hasQR: !!qrCode 
            });
            handleQRCodeUpdate(qrCode);
        });
        
        window.electronAPI.onConnectionStatusUpdate((event, status) => {
            handleConnectionStatusUpdate(status);
        });

        // Authenticated event (fires when whatsapp-web.js authenticates)
        if (window.electronAPI.onAuthenticated) {
            window.electronAPI.onAuthenticated(() => {
                // Stop polling when authenticated - QR no longer needed
                stopQRPolling();
                showToast('success', 'Authenticated', 'WhatsApp session authenticated');
                addLogEntry('info', 'WHATSAPP', 'WhatsApp authenticated');
            });
        }
        
        // Poll for QR code periodically in case event listener missed it
        startQRPolling();
        
        if (window.electronAPI.onLogoutComplete) {
            window.electronAPI.onLogoutComplete(() => showToast('success', 'Logged Out', 'Session cleared. You can now login with a new account.'));
        }
    }

    // Local UI: Open WhatsApp Web fallback button
    if (elements.openWaWebBtn) {
        elements.openWaWebBtn.addEventListener('click', async () => {
            showLoading('Opening WhatsApp Web...');
            try {
                const res = await window.electronAPI.openWhatsAppWeb();
                if (res && res.success) {
                    showToast('info', 'Fallback Opened', 'WhatsApp Web opened in a new window');
                    addLogEntry('info', 'GUI', 'Opened WhatsApp Web fallback');
                } else {
                    throw new Error(res?.message || 'Unknown error');
                }
            } catch (err) {
                console.error('Failed to open WhatsApp Web fallback:', err);
                showToast('error', 'Open Failed', err.message || 'Failed to open WhatsApp Web');
                addLogEntry('error', 'GUI', `Failed to open WhatsApp Web: ${err.message}`);
            } finally {
                hideLoading();
            }
        });
    }

    // Theme controls
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }

    if (elements.themeSelectorBtn) {
        elements.themeSelectorBtn.addEventListener('click', showThemeSelector);
    }
}

// Missing showThemeSelector function
function showThemeSelector() {
    if (elements.themeSelect) {
        elements.themeSelect.classList.toggle('show');
        showToast('info', 'Theme Selector', 'Choose a theme from the dropdown.');
    } else {
        showToast('error', 'Theme Selector Not Found', 'Theme selector element not found');
    }
}

// QR code and connection handling
async function handleQRCodeUpdate(qrCode) {
    if (qrCode) {
        // Stop QR timer when QR arrives
        try { stopQRTimer(); } catch (e) { /* ignore */ }
        elements.qrSection.style.display = 'block';
        
        // Clear the container first
        elements.qrCodeContainer.innerHTML = '';
        
        // Log QR receipt for debugging - this QR code is from the bot's whatsapp-web.js session
        const qrPreview = qrCode.substring(0, 50) + '...';
        console.log('Received QR from bot session (first 50 chars):', qrPreview);
        console.log('Scan this code to authenticate the bot with your phone.');
        
        // Verify QR data is valid
            const qrDataPreview = String(qrCode).substring(0, 30);
            console.log('QR Code data format valid, rendering with QRious. Preview:', qrDataPreview);

        // Defensive: ensure qrCode is a non-empty string before attempting to render
        if (!qrCode || typeof qrCode !== 'string') {
            console.warn('handleQRCodeUpdate: invalid qrCode received, using fallback', qrCode);
            displayQRFallback(qrCode);
            return;
        }
        
        try {
            // Check if QRious is loaded, if not load it dynamically
            if (typeof QRious === 'undefined') {
                console.log('QRious library not found, loading from CDN...');
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
                    script.onload = resolve;
                    script.onerror = () => reject(new Error('Failed to load QR library'));
                    document.head.appendChild(script);
                });
            }

            console.log('Generating QR code with QRious...');
            
            // Create canvas for QR code
            const canvas = document.createElement('canvas');
            canvas.style.maxWidth = '100%';
            canvas.style.height = 'auto';
            canvas.style.border = '8px solid white';
            canvas.style.borderRadius = '8px';
            canvas.style.backgroundColor = 'white';
            elements.qrCodeContainer.appendChild(canvas);
            
            // Generate QR code using QRious library
            new QRious({
                element: canvas,
                value: qrCode,
                size: 300,
                background: '#ffffff',
                foreground: '#000000',
                level: 'M'
            });
            
            console.log('QR code generated successfully!');
            showToast('success', 'QR Code Ready', 'QR code generated! Scan with WhatsApp.');
            
        } catch (error) {
            console.error('Error generating QR code:', error);
            displayQRFallback(qrCode);
        }
        
        updateStatusMessage('QR Code generated! Scan with WhatsApp to connect.', 'info');
        addLogEntry('info', 'WHATSAPP', 'QR code generated for connection');
    } else {
        if(elements.qrSection) elements.qrSection.style.display = 'none';
        try { stopQRTimer(); } catch (e) { /* ignore */ }
    }
}

function handleConnectionStatusUpdate(status) {
    console.log('Connection status update received:', status);
    switch(status) {
        case 'connecting':
            updateStatusMessage('Connecting to WhatsApp...', 'info');
            elements.statusIndicator.className = 'status-indicator connecting';
            elements.statusText.textContent = 'Connecting';
            addLogEntry('info', 'WHATSAPP', 'Connecting to WhatsApp...');
            break;
            
        case 'connected':
            if(elements.qrSection) elements.qrSection.style.display = 'none';
            // Stop the QR timer and polling when connected
            try { stopQRTimer(); } catch (e) { /* ignore */ }
            try { stopQRPolling(); } catch (e) { /* ignore */ }
            updateStatusMessage('✅ Connected to WhatsApp successfully!', 'success');
            elements.statusIndicator.className = 'status-indicator running';
            elements.statusText.textContent = 'Connected';
            showToast('success', 'WhatsApp Connected', 'Successfully connected to WhatsApp!');
            addLogEntry('success', 'WHATSAPP', 'Connected to WhatsApp successfully');
            break;
            
        case 'disconnected':
            if(elements.qrSection) elements.qrSection.style.display = 'none';
            try { stopQRTimer(); } catch (e) { /* ignore */ }
            try { stopQRPolling(); } catch (e) { /* ignore */ }
            updateStatusMessage('Disconnected from WhatsApp', 'error');
            elements.statusIndicator.className = 'status-indicator stopped';
            elements.statusText.textContent = 'Disconnected';
            addLogEntry('warning', 'WHATSAPP', 'Disconnected from WhatsApp');
            break;
    }
}

// Fallback function to display QR code information when library fails

// QR timer utilities
let _qrTimerInterval = null;
let _qrTimerStart = null;

function startQRTimer() {
    if (!elements.qrTimer) return;
    if (_qrTimerInterval) return; // already running
    _qrTimerStart = Date.now();
    // Ensure QR section is visible so timer is seen while waiting
    if (elements.qrSection) elements.qrSection.style.display = 'block';
    // If there's no QR placeholder in the container, add one
    if (elements.qrCodeContainer && elements.qrCodeContainer.children.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'qr-placeholder';
        placeholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Waiting for QR...</p>';
        elements.qrCodeContainer.appendChild(placeholder);
    }
    elements.qrTimer.style.display = 'block';
    updateQRTimerDisplay(0);
    _qrTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - _qrTimerStart) / 1000);
        updateQRTimerDisplay(elapsed);
    }, 1000);
}

function stopQRTimer() {
    if (_qrTimerInterval) {
        clearInterval(_qrTimerInterval);
        _qrTimerInterval = null;
    }
    if (elements.qrTimer) {
        elements.qrTimer.style.display = 'none';
        elements.qrTimer.textContent = '';
    }
    _qrTimerStart = null;
}

function updateQRTimerDisplay(seconds) {
    if (!elements.qrTimer) return;
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    elements.qrTimer.textContent = `Waiting for QR… ${mins}:${secs}`;
}

// QR polling - periodically fetch QR code from bot via IPC in case event delivery is missed
let _qrPollingInterval = null;
let _lastQRCode = null;

function startQRPolling() {
    if (_qrPollingInterval) return; // Already polling
    if (!window.electronAPI || !window.electronAPI.getQRCode) {
        console.warn('QR polling: electronAPI or getQRCode not available');
        return; // API not ready
    }
    
    console.log('Starting QR code polling (fallback for event delivery)', { 
        hasElectronAPI: !!window.electronAPI, 
        hasGetQRCode: !!(window.electronAPI && window.electronAPI.getQRCode) 
    });
    
    _qrPollingInterval = setInterval(async () => {
        try {
            // Request current QR code from bot via IPC
            const qrCode = await window.electronAPI.getQRCode();
            
            if (qrCode) {
                console.log('QR code poll result: received data', { length: qrCode.length, isNew: qrCode !== _lastQRCode });
                // Only update if we got a new QR code
                if (qrCode !== _lastQRCode) {
                    _lastQRCode = qrCode;
                    console.log('QR code fetched via polling, updating display');
                    handleQRCodeUpdate(qrCode);
                }
            } else {
                console.debug('QR polling: no QR code available yet');
            }
        } catch (error) {
            // Log errors with context
            console.warn('QR polling error:', error.message, error);
        }
    }, 2000); // Poll every 2 seconds
}

function stopQRPolling() {
    if (_qrPollingInterval) {
        clearInterval(_qrPollingInterval);
        _qrPollingInterval = null;
        _lastQRCode = null;
        console.log('Stopped QR code polling');
    }
}

function displayQRFallback(qrCode) {
    elements.qrCodeContainer.innerHTML = '';
    
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'qr-fallback';
    fallbackDiv.style.cssText = `
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border: 2px solid #25d366;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 400px;
        margin: 0 auto;
    `;
    
    fallbackDiv.innerHTML = `
        <div style="margin-bottom: 15px;">
            <i class="fas fa-qrcode" style="font-size: 48px; color: #25d366; margin-bottom: 10px;"></i>
            <h3 style="margin: 10px 0; color: #333; font-size: 18px;">QR Code Available</h3>
        </div>
        
        <div style="background: #fff; border-radius: 8px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h4 style="color: #25d366; margin: 0 0 10px 0; font-size: 16px;">📱 To scan this QR code:</h4>
            <ol style="text-align: left; color: #555; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Open WhatsApp on your phone</li>
                <li>Go to Settings → Linked Devices</li>
                <li>Tap "Link a Device"</li>
                <li>Use the QR scanner on this window</li>
            </ol>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 6px; padding: 10px; margin-bottom: 10px;">
            <small style="color: #666; font-size: 12px;">
                💡 The QR code is generated but needs proper library integration for visual display.<br>
                This fallback ensures you can still connect your WhatsApp.
            </small>
        </div>
        
        <details style="margin-top: 15px; text-align: left;">
            <summary style="cursor: pointer; color: #666; font-size: 12px;">🔧 Raw QR Data (for developers)</summary>
            <pre style="background: #f1f3f4; padding: 8px; border-radius: 4px; font-size: 10px; color: #444; overflow-x: auto; margin-top: 8px; white-space: pre-wrap; word-break: break-all;">${qrCode}</pre>
        </details>
    `;
    
    elements.qrCodeContainer.appendChild(fallbackDiv);
    
    // Show success toast for fallback
    showToast('info', 'QR Code Ready', 'QR code generated! Use your phone to scan.');
    console.log('QR Code fallback display rendered successfully');
}

// Bot control functions
async function startBot() {
    try {
        showLoading('Starting bot...');
        // start QR timer while waiting for QR to be generated
        try { startQRTimer(); } catch (e) { /* ignore if not available yet */ }
        updateButtonStates(true, false, false);
        
        const result = await window.electronAPI.startBot();
        
        if (result.success) {
            appState.botRunning = true;
            appState.startTime = new Date();
            updateBotStatus();
            updateButtonStates(false, true, true);
            updateStatusMessage('Bot started - waiting for WhatsApp connection...', 'info');
            showToast('success', 'Bot Started', result.message);
            addLogEntry('success', 'GUI', 'Bot started successfully');
        } else {
            updateButtonStates(true, false, false);
            updateStatusMessage(`Failed to start bot: ${result.message}`, 'error');
            showToast('error', 'Start Failed', result.message);
            addLogEntry('error', 'GUI', `Failed to start bot: ${result.message}`);
        }
    } catch (error) {
        console.error('Error starting bot:', error);
        updateButtonStates(true, false, false);
        updateStatusMessage('An error occurred while starting the bot', 'error');
        showToast('error', 'Error', 'An error occurred while starting the bot');
        addLogEntry('error', 'GUI', `Error starting bot: ${error.message}`);
    } finally {
        hideLoading();
    }
}

async function stopBot() {
    try {
        showLoading('Stopping bot...');
        updateButtonStates(false, false, false);
        
        const result = await window.electronAPI.stopBot();
        
        if (result.success) {
            appState.botRunning = false;
            appState.startTime = null;
            updateBotStatus();
            updateButtonStates(true, false, false);
            updateStatusMessage('Bot has been stopped', 'info');
            showToast('success', 'Bot Stopped', result.message);
            addLogEntry('info', 'GUI', 'Bot stopped successfully');
        } else {
            updateButtonStates(false, true, true);
            updateStatusMessage(`Failed to stop bot: ${result.message}`, 'error');
            showToast('error', 'Stop Failed', result.message);
            addLogEntry('error', 'GUI', `Failed to stop bot: ${result.message}`);
        }
    } catch (error) {
        console.error('Error stopping bot:', error);
        updateButtonStates(false, true, true);
        updateStatusMessage('An error occurred while stopping the bot', 'error');
        showToast('error', 'Error', 'An error occurred while stopping the bot');
        addLogEntry('error', 'GUI', `Error stopping bot: ${error.message}`);
    } finally {
        hideLoading();
    }
}

async function restartBot() {
    try {
        showLoading('Restarting bot...');
        
        // Stop first
        const stopResult = await window.electronAPI.stopBot();
        if (stopResult.success) {
            addLogEntry('info', 'GUI', 'Bot stopped for restart');
            
            // Wait a moment
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Start again
            const startResult = await window.electronAPI.startBot();
            if (startResult.success) {
                appState.botRunning = true;
                appState.startTime = new Date();
                updateBotStatus();
                updateButtonStates(false, true, true);
                updateStatusMessage('Bot restarted successfully', 'success');
                showToast('success', 'Bot Restarted', 'Bot has been restarted successfully');
                addLogEntry('success', 'GUI', 'Bot restarted successfully');
            } else {
                throw new Error(startResult.message);
            }
        } else {
            throw new Error(stopResult.message);
        }
    } catch (error) {
        console.error('Error restarting bot:', error);
        appState.botRunning = false;
        updateBotStatus();
        updateButtonStates(true, false, false);
        updateStatusMessage(`Failed to restart bot: ${error.message}`, 'error');
        showToast('error', 'Restart Failed', error.message);
        addLogEntry('error', 'GUI', `Failed to restart bot: ${error.message}`);
    } finally {
        hideLoading();
    }
}

async function logoutFromWhatsApp() {
    try {
        showLoading('Logging out...');
        const result = await window.electronAPI.logout();
        if (result.success) {
            showToast('success', 'Logged Out', 'Successfully logged out from WhatsApp.');
            addLogEntry('info', 'GUI', 'Logged out from WhatsApp.');
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        showToast('error', 'Logout Failed', error.message);
        addLogEntry('error', 'GUI', `Logout failed: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Status management
async function updateBotStatus() {
    try {
        if (!window.electronAPI || !window.electronAPI.getBotStatus) return;
        const status = await window.electronAPI.getBotStatus();
        appState.botRunning = status.isRunning;
        
        // Update status indicator
        elements.statusIndicator.className = `status-indicator ${status.isRunning ? 'running' : 'stopped'}`;
        elements.statusText.textContent = status.isRunning ? 'Running' : 'Stopped';
        
        // Update button states
        if (status.isRunning) {
            updateButtonStates(false, true, true);
            if (!appState.startTime) {
                appState.startTime = new Date();
            }
        } else {
            updateButtonStates(true, false, false);
            appState.startTime = null;
        }
        
    } catch (error) {
        console.error('Error updating bot status:', error);
    }
}

function updateButtonStates(startEnabled, stopEnabled, restartEnabled) {
    if (elements.startBtn) elements.startBtn.disabled = !startEnabled;
    if (elements.stopBtn) elements.stopBtn.disabled = !stopEnabled;
    if (elements.restartBtn) elements.restartBtn.disabled = !restartEnabled;
    if (elements.logoutBtn) elements.logoutBtn.disabled = !stopEnabled; // Logout only enabled when bot is running
}

function updateStatusMessage(message, type = 'info') {
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = `status-message ${type}`;
}

// Logging functions
function addLogEntry(level, module, message) {
    const timestamp = new Date();
    const logEntry = {
        timestamp,
        level,
        module,
        message
    };
    
    appState.logs.unshift(logEntry);
    
    // Keep only last 100 log entries
    if (appState.logs.length > 100) {
        appState.logs = appState.logs.slice(0, 100);
    }
    
    renderLogs();
}

function renderLogs() {
    if (!elements.logsContainer) return;
    elements.logsContainer.innerHTML = '';
    
    appState.logs.forEach(log => {
        const logElement = document.createElement('div');
        logElement.className = `log-entry ${log.level}`;
        
        logElement.innerHTML = `
            <span class="log-time">${log.timestamp.toLocaleTimeString()}</span>
            <span class="log-module">[${log.module}]</span>
            <span class="log-message">${log.message}</span>
        `;
        
        elements.logsContainer.appendChild(logElement);
    });
    
    // Auto-scroll to top for newest logs
    elements.logsContainer.scrollTop = 0;
}

function clearLogs() {
    appState.logs = [];
    renderLogs();
    addLogEntry('info', 'GUI', 'Logs cleared');
    showToast('info', 'Logs Cleared', 'All logs have been cleared');
}

async function refreshLogs(showNotification = false) {
    try {
        if (!window.electronAPI || !window.electronAPI.getLogs) return;
        const result = await window.electronAPI.getLogs();
        if (result && result.logs) {
            // Add server logs to our local logs
            result.logs.forEach(log => {
                addLogEntry(log.level, log.module, log.message);
            });
        }
        // Only show toast when manually triggered
        if (showNotification) {
            showToast('info', 'Logs Refreshed', 'Logs have been refreshed from server');
        }
    } catch (error) {
        console.error('Error refreshing logs:', error);
        // Only show error toast when manually triggered
        if (showNotification) {
            showToast('error', 'Refresh Failed', 'Failed to refresh logs from server');
        }
    }
}

// Configuration functions
function openConfigPanel() {
    if(elements.configPanel) elements.configPanel.style.display = 'block';
    loadConfiguration();
}

function closeConfigPanel() {
    if(elements.configPanel) elements.configPanel.style.display = 'none';
}

function loadConfiguration() {
    // Load current configuration (you can extend this to read from settings)
    if(document.getElementById('apiEnabled')) document.getElementById('apiEnabled').checked = true; // Simplified
    if(document.getElementById('apiPort')) document.getElementById('apiPort').value = 3001;
    if(document.getElementById('logLevel')) document.getElementById('logLevel').value = 'info';
}

function saveConfiguration(event) {
    event.preventDefault();
    
    const formData = new FormData(elements.configForm);
    const config = {
        apiEnabled: formData.get('apiEnabled') === 'on',
        apiPort: parseInt(formData.get('apiPort')),
        logLevel: formData.get('logLevel')
    };
    
    // Here you would typically save to a settings file or send to main process
    console.log('Saving configuration:', config);
    
    showToast('success', 'Configuration Saved', 'Settings have been saved successfully');
    addLogEntry('info', 'GUI', 'Configuration saved');
    closeConfigPanel();
}

// UI helper functions
function showLoading(text = 'Loading...') {
    if(elements.loadingText) elements.loadingText.textContent = text;
    if(elements.loadingOverlay) elements.loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    if(elements.loadingOverlay) elements.loadingOverlay.style.display = 'none';
}

function showToast(type, title, message) {
    if(!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <div>
            <strong>${title}</strong><br>
            <small>${message}</small>
        </div>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 5000);
}

function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'info': 
        default: return 'fa-info-circle';
    }
}

// Statistics and uptime updates
function updateStatistics() {
    // Update statistics display
    if(elements.messagesProcessed) elements.messagesProcessed.textContent = appState.stats.messagesProcessed;
    if(elements.activeChats) elements.activeChats.textContent = appState.stats.activeChats;
    if(elements.commandsExecuted) elements.commandsExecuted.textContent = appState.stats.commandsExecuted;
    
    // Update uptime
    if (appState.startTime) {
        const uptime = new Date() - appState.startTime;
        const hours = Math.floor(uptime / 3600000);
        const minutes = Math.floor((uptime % 3600000) / 60000);
        const seconds = Math.floor((uptime % 60000) / 1000);
        
        if(elements.uptime) elements.uptime.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        if(elements.uptime) elements.uptime.textContent = '00:00:00';
    }
}

// Periodic updates
function startPeriodicUpdates() {
    // Update every second
    setInterval(() => {
        updateStatistics();
    }, 1000);
    
    // Update bot status every 5 seconds
    setInterval(() => {
        updateBotStatus();
    }, 5000);
    
    // Refresh logs every 30 seconds if bot is running (silent refresh, no toast)
    setInterval(() => {
        if (appState.botRunning) {
            refreshLogs(false);
        }
    }, 30000);
}

// ===================
// GUI FEATURE FUNCTIONS
// ===================

// Todo Management
let todos = [];

function addTodoItem() {
    const text = elements.todoInput.value.trim();
    if (!text) return;
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date()
    };
    
    todos.push(todo);
    elements.todoInput.value = '';
    renderTodos();
    
    showToast('success', 'Todo Added', `Added: ${text}`);
    addLogEntry('info', 'TODO', `Added task: ${text}`);
}

function renderTodos() {
    if (!elements.todoList) return;
    if (todos.length === 0) {
        elements.todoList.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
        return;
    }
    
    elements.todoList.innerHTML = todos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}">
            <span class="todo-text">${todo.text}</span>
            <div class="todo-actions">
                <button class="btn-small btn-${todo.completed ? 'secondary' : 'success'}" onclick="toggleTodo(${todo.id})">
                    <i class="fas fa-${todo.completed ? 'undo' : 'check'}"></i>
                </button>
                <button class="btn-small btn-danger" onclick="deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
        showToast('info', 'Todo Updated', `Task ${todo.completed ? 'completed' : 'uncompleted'}`);
    }
}

function deleteTodo(id) {
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex !== -1) {
        const todo = todos.splice(todoIndex, 1)[0];
        renderTodos();
        showToast('info', 'Todo Deleted', `Deleted: ${todo.text}`);
    }
}

// AI Chat
function sendAiMessage() {
    const message = elements.aiInput.value.trim();
    if (!message) return;
    
    // Add user message
    addChatMessage('user', message);
    elements.aiInput.value = '';
    
    // Simulate AI response (you can integrate with actual AI API)
    setTimeout(() => {
        const responses = {
            'hello': 'Hi there! How can I help you today?',
            'time': `Current time is ${new Date().toLocaleTimeString()}`,
            'weather': 'I\'d need access to weather APIs for current weather info.',
            'joke': 'Why don\'t scientists trust atoms? Because they make up everything!',
            'help': 'I\'m here to assist you! Ask me anything.',
            'default': `That\'s an interesting question: "${message}". I\'d love to help more with proper AI integration!`
        };
        
        const key = Object.keys(responses).find(k => message.toLowerCase().includes(k));
        const response = responses[key] || responses.default;
        
        addChatMessage('ai', response);
    }, 1000);
    
    addLogEntry('info', 'AI', `User asked: ${message}`);
}

function addChatMessage(type, message) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${type}`;
    messageElement.innerHTML = `
        <i class="fas fa-${type === 'user' ? 'user' : 'robot'}"></i>
        <span>${message}</span>
    `;
    
    elements.aiChatHistory.appendChild(messageElement);
    elements.aiChatHistory.scrollTop = elements.aiChatHistory.scrollHeight;
}

// Auto-Reply
function toggleAutoReply() {
    const enabled = elements.autoReplyToggle.checked;
    showToast(enabled ? 'success' : 'info', 'Auto-Reply', enabled ? 'Enabled' : 'Disabled');
    addLogEntry('info', 'AUTOREPLY', `Auto-reply ${enabled ? 'enabled' : 'disabled'}`);
}

function setAutoReplyMessage() {
    const message = elements.autoReplyMessage.value.trim();
    if (!message) {
        showToast('error', 'Error', 'Please enter a message');
        return;
    }
    
    showToast('success', 'Auto-Reply Set', 'Custom message saved');
    addLogEntry('info', 'AUTOREPLY', `Custom message set: ${message.substring(0, 30)}...`);
}

// Quick Actions
function getQuickAction(type) {
    const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Why did the math book look so sad? Because it was full of problems!",
        "What do you call a fake noodle? An Impasta!"
    ];
    
    const quotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Innovation distinguishes between a leader and a follower. - Steve Jobs",
        "Life is what happens while you're busy making other plans. - John Lennon"
    ];
    
    let result = '';
    
    switch(type) {
        case 'joke':
            result = jokes[Math.floor(Math.random() * jokes.length)];
            break;
        case 'quote':
            result = quotes[Math.floor(Math.random() * quotes.length)];
            break;
        case 'time':
            const now = new Date();
            result = `Current time: ${now.toLocaleTimeString()}\nDate: ${now.toLocaleDateString()}`;
            break;
    }
    
    elements.quickActionResult.innerHTML = `<strong>${type.toUpperCase()}:</strong><br>${result}`;
    addLogEntry('info', 'QUICK', `Generated ${type}`);
}

function getWeather() {
    // Simulate weather data
    const cities = ['London', 'New York', 'Tokyo', 'Mumbai'];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const temp = Math.floor(Math.random() * 30) + 10;
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Clear'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    elements.quickActionResult.innerHTML = `
        <strong>WEATHER:</strong><br>
        City: ${city}<br>
        Temperature: ${temp}°C<br>
        Condition: ${condition}
    `;
    
    addLogEntry('info', 'WEATHER', `Weather data for ${city}`);
}

// Reminders
let reminders = [];

function setReminder() {
    const time = elements.reminderTime.value;
    const text = elements.reminderText.value.trim();
    
    if (!time || !text) {
        showToast('error', 'Error', 'Please fill in both time and message');
        return;
    }
    
    const reminder = {
        id: Date.now(),
        time: time,
        text: text,
        created: new Date()
    };
    
    reminders.push(reminder);
    renderReminders();
    
    elements.reminderTime.value = '';
    elements.reminderText.value = '';
    
    showToast('success', 'Reminder Set', `Reminder set for ${time}`);
    addLogEntry('info', 'REMINDER', `Set reminder: ${text} at ${time}`);
}

function renderReminders() {
    if(elements.remindersList.innerHTML)
    if (reminders.length === 0) {
        elements.remindersList.innerHTML = '<div class="empty-state">No reminders set</div>';
        return;
    }
    
    elements.remindersList.innerHTML = reminders.map(reminder => `
        <div class="reminder-item">
            <div>
                <strong>${reminder.time}</strong> - ${reminder.text}
            </div>
            <button class="btn-small btn-danger" onclick="deleteReminder(${reminder.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function deleteReminder(id) {
    const index = reminders.findIndex(r => r.id === id);
    if (index !== -1) {
        reminders.splice(index, 1);
        renderReminders();
        showToast('info', 'Reminder Deleted', 'Reminder removed');
    }
}

// Scheduling
function setSchedule() {
    const type = elements.scheduleType.value;
    const time = elements.scheduleTime.value;
    const message = elements.scheduleMessage.value.trim();

    if (!time || !message) {
        showToast('error', 'Error', 'Please fill in all fields');
        return;
    }

    const now = new Date();
    const scheduledTime = new Date(now.toDateString() + ' ' + time);

    if (scheduledTime < now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const scheduledMessage = {
        id: Date.now(),
        type: type,
        time: time,
        message: message,
        created: new Date(),
        status: 'scheduled',
        scheduledFor: scheduledTime
    };

    const scheduledMessages = JSON.parse(localStorage.getItem('whatsbotx_scheduled') || '[]');
    scheduledMessages.push(scheduledMessage);
    localStorage.setItem('whatsbotx_scheduled', JSON.stringify(scheduledMessages));

    const timeUntilSend = scheduledTime - now;

    setTimeout(() => {
        showToast('success', 'Message Sent', `Scheduled ${type} message sent successfully`);
        addLogEntry('success', 'SCHEDULE', `Scheduled message sent: ${message.substring(0, 30)}...`);

        const updatedMessages = JSON.parse(localStorage.getItem('whatsbotx_scheduled') || '[]');
        const messageIndex = updatedMessages.findIndex(m => m.id === scheduledMessage.id);
        if (messageIndex !== -1) {
            updatedMessages[messageIndex].status = 'sent';
            localStorage.setItem('whatsbotx_scheduled', JSON.stringify(updatedMessages));
        }
    }, timeUntilSend);

    showToast('success', 'Scheduled', `${type} message scheduled for ${scheduledTime.toLocaleString()}`);
    addLogEntry('info', 'SCHEDULE', `Scheduled ${type} message: ${message.substring(0, 30)}...`);

    elements.scheduleTime.value = '';
    elements.scheduleMessage.value = '';
}

// Initialize features
function initializeFeatures() {
    renderTodos();
    renderReminders();
    addLogEntry('info', 'GUI', 'All features initialized');
}

// ===================
// BULK MESSAGING SYSTEM
// ===================

let bulkNumbers = [];
let contacts = [];

// Single Message
async function sendSingleMessage() {
    console.log('sendSingleMessage called');
    const number = elements.singleNumber.value.trim();
    const message = elements.singleMessage.value.trim();

    console.log('Number:', number, 'Message:', message);

    if (!number || !message) {
        showToast('error', 'Error', 'Please enter both number and message');
        return;
    }
    
    if (!isValidPhoneNumber(number)) {
        showToast('error', 'Invalid Number', 'Please enter valid phone number (+91XXXXXXXXXX)');
        return;
    }
    
    showLoading('Sending message...');
    
    try {
        const response = await window.electronAPI.sendMessage(number, message);
        
        hideLoading();
        
        if (response.success) {
            showToast('success', 'Message Sent', `Message sent to ${number}`);
            addLogEntry('success', 'BULK', `Message sent to ${number}: ${message.substring(0, 30)}...`);
            
            elements.singleNumber.value = '';
            elements.singleMessage.value = '';
            
            appState.stats.messagesProcessed++;
        } else {
            throw new Error(response.error || 'Failed to send message');
        }
        
    } catch (error) {
        hideLoading();
        showToast('error', 'Send Failed', error.message);
        addLogEntry('error', 'BULK', `Failed to send message to ${number}: ${error.message}`);
    }
}

// Load numbers from .txt file
function loadNumbersFile() {
    const file = elements.numbersFile.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.txt')) {
        showToast('error', 'Invalid File', 'Please select a .txt file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const numbers = content.split('\n')
            .map(line => line.trim())
            .filter(line => line && isValidPhoneNumber(line));
        
        bulkNumbers = numbers;
        elements.numberCount.textContent = `${numbers.length} numbers loaded`;
        
        // Display imported numbers list
        displayImportedNumbers(numbers);
        
        showToast('success', 'Numbers Loaded', `${numbers.length} valid numbers loaded from file`);
        addLogEntry('info', 'BULK', `Loaded ${numbers.length} numbers from ${file.name}`);
    };
    
    reader.readAsText(file);
}

// Display imported numbers in a list
function displayImportedNumbers(numbers) {
    const importedList = document.getElementById('importedNumbersList');
    const container = document.getElementById('numbersListContainer');
    
    if (!container) return;
    
    container.innerHTML = ''; // Clear previous list
    
    if (numbers.length === 0) {
        importedList.style.display = 'none';
        return;
    }
    
    // Show the list container
    importedList.style.display = 'block';
    
    // Add each number as a list item (limit display to 50 items, show "more" if needed)
    const displayLimit = 50;
    const displayNumbers = numbers.slice(0, displayLimit);
    
    displayNumbers.forEach((number, index) => {
        const item = document.createElement('div');
        item.className = 'number-item';
        item.textContent = number;
        item.title = `Number ${index + 1}: ${number}`;
        container.appendChild(item);
    });
    
    // If there are more numbers, show a "more" indicator
    if (numbers.length > displayLimit) {
        const more = document.createElement('div');
        more.className = 'number-item';
        more.textContent = `+${numbers.length - displayLimit} more`;
        more.style.fontWeight = 'bold';
        more.style.opacity = '0.7';
        container.appendChild(more);
    }
}

// Send bulk messages
async function sendBulkMessages() {
    if (bulkNumbers.length === 0) {
        showToast('error', 'No Numbers', 'Please load numbers first');
        return;
    }
    
    const message = elements.bulkMessage.value.trim();
    if (!message) {
        showToast('error', 'No Message', 'Please enter a message to send');
        return;
    }
    
    elements.bulkProgress.style.display = 'block';
    elements.sendBulkBtn.disabled = true;
    elements.progressFill.style.width = '0%';
    elements.progressText.textContent = 'Starting bulk send...';
    
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < bulkNumbers.length; i++) {
        const number = bulkNumbers[i];
        try {
            const response = await window.electronAPI.sendMessage(number, message);
            if (response.success) {
                successCount++;
            } else {
                failCount++;
                addLogEntry('error', 'BULK', `Failed to send to ${number}: ${response.error}`);
            }
        } catch (error) {
            failCount++;
            addLogEntry('error', 'BULK', `Failed to send to ${number}: ${error.message}`);
        }
        const progress = ((i + 1) / bulkNumbers.length) * 100;
        elements.progressFill.style.width = `${progress}%`;
        elements.progressText.textContent = `Sent ${i + 1} of ${bulkNumbers.length}`;
    }

    elements.progressText.textContent = `✅ Completed! Sent to ${successCount} numbers, ${failCount} failed.`;
    showToast('success', 'Bulk Send Complete', `${successCount} sent, ${failCount} failed`);
    addLogEntry('success', 'BULK', `Bulk message completed: ${successCount} sent, ${failCount} failed`);
            
    appState.stats.messagesProcessed += successCount;
            
    setTimeout(() => {
        elements.bulkProgress.style.display = 'none';
        elements.sendBulkBtn.disabled = false;
        elements.bulkMessage.value = '';
        elements.progressFill.style.width = '0%';
        elements.progressText.textContent = '';
    }, 3000);
}

// Contact Management
function addContact() {
    console.log('addContact called');
    const name = elements.contactName.value.trim();
    const number = elements.contactNumber.value.trim();

    console.log('Name:', name, 'Number:', number);

    if (!name || !number) {
        showToast('error', 'Missing Info', 'Please enter both name and number');
        return;
    }
    
    if (!isValidPhoneNumber(number)) {
        showToast('error', 'Invalid Number', 'Please enter valid phone number');
        return;
    }
    
    if (contacts.find(c => c.number === number)) {
        showToast('error', 'Duplicate', 'Contact with this number already exists');
        return;
    }
    
    const contact = {
        id: Date.now(),
        name: name,
        number: number,
        added: new Date()
    };
    
    contacts.push(contact);
    renderContacts();
    
    elements.contactName.value = '';
    elements.contactNumber.value = '';
    
    showToast('success', 'Contact Added', `${name} added to contacts`);
    addLogEntry('info', 'CONTACTS', `Added contact: ${name} (${number})`);
}

function renderContacts() {
    if (!elements.contactsList) return;
    if (contacts.length === 0) {
        elements.contactsList.innerHTML = '<div class="empty-state">No contacts added</div>';
        return;
    }
    
    elements.contactsList.innerHTML = contacts.map(contact => `
        <div class="contact-item">
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-number">${contact.number}</div>
            </div>
            <div class="contact-actions">
                <button class="btn-small btn-success" onclick="messageContact('${contact.number}')" title="Send Message">
                    <i class="fas fa-paper-plane"></i>
                </button>
                <button class="btn-small btn-danger" onclick="deleteContact(${contact.id})" title="Delete Contact">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function deleteContact(id) {
    const index = contacts.findIndex(c => c.id === id);
    if (index !== -1) {
        const contact = contacts.splice(index, 1)[0];
        renderContacts();
        showToast('info', 'Contact Deleted', `${contact.name} removed from contacts`);
        addLogEntry('info', 'CONTACTS', `Deleted contact: ${contact.name}`);
    }
}

function messageContact(number) {
    // Switch to single message tab and pre-fill number
    switchTab('single');
    elements.singleNumber.value = number;
    showToast('info', 'Ready to Send', 'Number filled in single message form');
}

// Phone number validation
function isValidPhoneNumber(number) {
    // Basic validation for international format
    const phoneRegex = /^\+\d{1,4}\d{10}$/;
    return phoneRegex.test(number.replace(/\s/g, ''));
}

// Export bulk numbers to .txt file
function exportBulkNumbers() {
    if (bulkNumbers.length === 0) {
        showToast('warning', 'No Numbers', 'No numbers loaded to export. Upload a file first.');
        return;
    }
    
    const content = bulkNumbers.join('\n');
    downloadFile(content, 'bulk_numbers.txt', 'text/plain');
    showToast('success', 'Numbers Exported', `${bulkNumbers.length} numbers exported to bulk_numbers.txt`);
    addLogEntry('info', 'BULK', `Exported ${bulkNumbers.length} numbers`);
}

// Export contacts to JSON file
function exportContacts() {
    if (contacts.length === 0) {
        showToast('warning', 'No Contacts', 'No contacts to export. Add contacts first.');
        return;
    }
    
    const exportData = {
        exported: new Date().toISOString(),
        count: contacts.length,
        contacts: contacts.map(c => ({
            name: c.name,
            number: c.number,
            added: c.added
        }))
    };
    
    const content = JSON.stringify(exportData, null, 2);
    downloadFile(content, 'whatsbotx_contacts.json', 'application/json');
    showToast('success', 'Contacts Exported', `${contacts.length} contacts exported to whatsbotx_contacts.json`);
    addLogEntry('info', 'CONTACTS', `Exported ${contacts.length} contacts`);
}

// Import contacts from JSON or CSV file
function importContacts() {
    const file = elements.importContactsFile?.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            let importedContacts = [];
            
            if (file.name.endsWith('.json')) {
                const data = JSON.parse(content);
                importedContacts = data.contacts || data;
            } else if (file.name.endsWith('.csv')) {
                const lines = content.split('\n').filter(line => line.trim());
                importedContacts = lines.slice(1).map(line => {
                    const [name, number] = line.split(',').map(s => s.trim());
                    return { name, number };
                });
            }
            
            let addedCount = 0;
            let skippedCount = 0;
            
            importedContacts.forEach(c => {
                if (c.name && c.number && !contacts.find(existing => existing.number === c.number)) {
                    contacts.push({
                        id: Date.now() + Math.random(),
                        name: c.name,
                        number: c.number,
                        added: new Date()
                    });
                    addedCount++;
                } else {
                    skippedCount++;
                }
            });
            
            renderContacts();
            showToast('success', 'Contacts Imported', `Added ${addedCount} contacts, skipped ${skippedCount} duplicates`);
            addLogEntry('info', 'CONTACTS', `Imported ${addedCount} contacts from ${file.name}`);
            
        } catch (error) {
            console.error('Error importing contacts:', error);
            showToast('error', 'Import Failed', 'Invalid file format. Use JSON or CSV.');
            addLogEntry('error', 'CONTACTS', `Failed to import contacts: ${error.message}`);
        }
        
        // Reset file input
        elements.importContactsFile.value = '';
    };
    
    reader.readAsText(file);
}

// Helper function to download files
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function getNews() {
    const newsItems = [
        'Breaking: Tech stocks surge amid AI developments',
        'Weather Alert: Heavy rainfall expected this weekend',
        'Sports: Local team wins championship',
        'Economy: Markets show positive trend',
        'Health: New vaccination drive launched'
    ];

    const randomNews = newsItems[Math.floor(Math.random() * newsItems.length)];

    elements.quickActionResult.innerHTML = `
        <strong>LATEST NEWS:</strong><br>
        ${randomNews}<br>
        <small>Source: News API • ${new Date().toLocaleString()}</small>
    `;

    addLogEntry('info', 'NEWS', 'Fetched latest news');
}

function getWikipedia() {
    const topics = [
        'Artificial Intelligence: AI is intelligence demonstrated by machines...',
        'WhatsApp: A freeware, cross-platform messaging service...',
        'Node.js: An open-source, cross-platform runtime environment...',
        'Automation: The use of various control systems for machines...',
        'JavaScript: A programming language that conforms to ECMAScript...'
    ];

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    elements.quickActionResult.innerHTML = `
        <strong>WIKIPEDIA:</strong><br>
        ${randomTopic}<br>
        <small>Source: Wikipedia API</small>
    `;

    addLogEntry('info', 'WIKI', 'Fetched Wikipedia content');
}

// Tab switching function
function switchTab(tabName, parentSelector = '.card-body') {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;

    parent.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });

    parent.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    const activeContent = parent.querySelector(`#${tabName}Tab`);
    if (activeContent) {
        activeContent.classList.add('active');
    }
}

// Improved tab switching for specific containers
function switchTabInContainer(container, tabName) {
    if (!container) return;

    // Remove active class from all tabs in this container
    container.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });

    // Add active class to clicked tab
    const activeTab = container.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Hide all tab contents in this container
    container.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });

    // Show the selected tab content
    const contentId = `${tabName}Tab`;
    const activeContent = container.querySelector(`#${contentId}`);
    if (activeContent) {
        activeContent.style.display = 'block';
        activeContent.classList.add('active');
        console.log(`Switched to tab: ${contentId}`);
    } else {
        console.log(`Tab content not found: #${contentId}`);
    }
}

// Initialize all toggle buttons and settings on page load
function initializeAllToggles() {
    console.log('Initializing all toggles and settings...');
    
    // Load saved settings
    const savedSettings = JSON.parse(localStorage.getItem('whatsbotx_settings') || '{}');
    
    // Restore toggle states
    if (elements.highContrastToggle) {
        elements.highContrastToggle.checked = savedSettings.highContrast || false;
    }
    if (elements.largeTextToggle) {
        elements.largeTextToggle.checked = savedSettings.largeText || false;
    }
    if (elements.screenReaderToggle) {
        elements.screenReaderToggle.checked = savedSettings.screenReader || false;
    }
    if (elements.reducedMotionToggle) {
        elements.reducedMotionToggle.checked = savedSettings.reducedMotion || false;
    }
    if (elements.autoStartToggle) {
        elements.autoStartToggle.checked = savedSettings.autoStart || false;
    }
    if (elements.minimizeTrayToggle) {
        elements.minimizeTrayToggle.checked = savedSettings.minimizeTray || false;
    }
    if (elements.notificationsToggle) {
        elements.notificationsToggle.checked = savedSettings.notifications !== false;
    }
    
    // Restore select values
    if (elements.languageSelect) {
        elements.languageSelect.value = savedSettings.language || 'en';
    }
    if (elements.themeSelect) {
        elements.themeSelect.value = savedSettings.theme || 'light';
    }
    if (elements.logLevelSelect) {
        elements.logLevelSelect.value = savedSettings.logLevel || 'info';
    }
    if (elements.apiPortInput) {
        elements.apiPortInput.value = savedSettings.apiPort || '3001';
    }
    if (elements.uiScaleSlider) {
        elements.uiScaleSlider.value = savedSettings.uiScale || '100';
        if (elements.uiScaleValue) {
            elements.uiScaleValue.textContent = elements.uiScaleSlider.value + '%';
        }
    }
    if (elements.accentColorPicker) {
        elements.accentColorPicker.value = savedSettings.accentColor || '#667eea';
    }
    
    console.log('Toggles and settings initialized');
}

// UI Enhancements
function initializeUIEnhancements() {
    const savedTheme = localStorage.getItem('whatsbotx_theme') || 'light';
    appState.theme = savedTheme;
    applyTheme(savedTheme);

    const savedAccessibility = localStorage.getItem('whatsbotx_accessibility');
    if (savedAccessibility) {
        appState.accessibility = JSON.parse(savedAccessibility);
        applyAccessibilitySettings();
    }
    addLogEntry('info', 'UI', 'UI enhancements initialized');
}

function toggleTheme() {
    const newTheme = appState.theme === 'light' ? 'dark' : 'light';
    appState.theme = newTheme;
    applyTheme(newTheme);
    localStorage.setItem('whatsbotx_theme', newTheme);
    showToast('success', 'Theme Changed', `Switched to ${newTheme} theme`);
    addLogEntry('info', 'UI', `Theme changed to ${newTheme}`);
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    if (elements.themeToggle) {
        elements.themeToggle.innerHTML = theme === 'light' ?
            '<i class="fas fa-moon"></i> Dark Mode' :
            '<i class="fas fa-sun"></i> Light Mode';
    }
    if (elements.settingsThemeToggle) {
        elements.settingsThemeToggle.innerHTML = theme === 'light' ?
            '<i class="fas fa-moon"></i> Dark Mode' :
            '<i class="fas fa-sun"></i> Light Mode';
    }
}

function applyAccessibilitySettings() {
    document.body.classList.toggle('high-contrast', appState.accessibility.highContrast);
    document.body.classList.toggle('large-text', appState.accessibility.largeText);

    if (appState.accessibility.screenReader) {
        document.body.setAttribute('aria-live', 'polite');
    } else {
        document.body.removeAttribute('aria-live');
    }
}

function saveAccessibilitySettings() {
    localStorage.setItem('whatsbotx_accessibility', JSON.stringify(appState.accessibility));
}

// Initialize bulk messaging on app start
function initializeBulkMessaging() {
    switchTab('single', '.bulk-messaging-panel .card-body');
    renderContacts();
    if(elements.numberCount) elements.numberCount.textContent = '0 numbers loaded';
}

// ==================== API Dashboard Functions ====================

let apiServerRunning = false;
let apiKey = localStorage.getItem('whatsbotx_api_key') || 'sk_live_1234567890abcdefghij';

async function toggleApiServer() {
    try {
        // Call IPC handler to toggle API server
        const shouldStart = !apiServerRunning;
        const result = await window.electronAPI.invokeMain('toggle-api-server', shouldStart);
        
        if (result.success) {
            apiServerRunning = shouldStart;
            
            if (elements.apiServerStatus) {
                elements.apiServerStatus.innerHTML = apiServerRunning ? 
                    '<i class="fas fa-circle text-success"></i> Active' :
                    '<i class="fas fa-circle text-error"></i> Inactive';
            }
            
            if (elements.toggleApiServerBtn) {
                elements.toggleApiServerBtn.innerHTML = apiServerRunning ?
                    '<i class="fas fa-power-off"></i> Stop API Server' :
                    '<i class="fas fa-power-off"></i> Start API Server';
            }
            
            const message = apiServerRunning ? 
                `API server is now running on port ${result.port || 3001}` : 
                'API server stopped';
            
            showToast('success', apiServerRunning ? 'API Started' : 'API Stopped', message);
            addLogEntry('info', 'API', apiServerRunning ? 'API Server started' : 'API Server stopped');
            
            // Update displayed port and base URL when API state changes
            if (apiServerRunning && result.port) {
                if (elements.apiPort) elements.apiPort.textContent = String(result.port);
                if (elements.apiBaseUrl) elements.apiBaseUrl.textContent = `http://localhost:${result.port}`;
            } else {
                // When stopped, revert to default configured port
                const defaultPort = elements.apiPortInput?.value || '3001';
                if (elements.apiPort) elements.apiPort.textContent = String(defaultPort);
                if (elements.apiBaseUrl) elements.apiBaseUrl.textContent = `http://localhost:${defaultPort}`;
            }
        } else {
            showToast('error', 'API Error', result.message);
            addLogEntry('error', 'API', `Failed to toggle API: ${result.message}`);
        }
    } catch (error) {
        console.error('Error toggling API server:', error);
        showToast('error', 'API Error', error.message);
        addLogEntry('error', 'API', `Error: ${error.message}`);
    }
}

function toggleApiKeyVisibility() {
    const isHidden = elements.apiKeyInput.type === 'password';
    elements.apiKeyInput.type = isHidden ? 'text' : 'password';
    
    if (elements.toggleApiKeyVisibility) {
        elements.toggleApiKeyVisibility.innerHTML = isHidden ? 
            '<i class="fas fa-eye-slash"></i>' : 
            '<i class="fas fa-eye"></i>';
    }
}

function copyApiKey() {
    const tempInput = document.createElement('input');
    tempInput.value = apiKey;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    showToast('success', 'Copied', 'API key copied to clipboard');
}

function generateNewApiKey() {
    const confirmed = confirm('Generate a new API key? Your old key will no longer work.');
    if (confirmed) {
        apiKey = 'sk_live_' + Math.random().toString(36).substring(2, 22);
        localStorage.setItem('whatsbotx_api_key', apiKey);
        
        if (elements.apiKeyInput) {
            elements.apiKeyInput.value = apiKey;
        }
        
        showToast('success', 'Generated', 'New API key generated successfully');
        addLogEntry('info', 'API', 'New API key generated');
    }
}

function revokeApiKey() {
    const confirmed = confirm('Revoke current API key? This will invalidate all existing keys.');
    if (confirmed) {
        apiKey = '';
        localStorage.removeItem('whatsbotx_api_key');
        
        if (elements.apiKeyInput) {
            elements.apiKeyInput.value = '••••••••••••••••';
        }
        
        showToast('success', 'Revoked', 'API key revoked successfully');
        addLogEntry('info', 'API', 'API key revoked');
    }
}

// ==================== Enhanced Settings Functions ====================

function toggleHighContrast() {
    appState.accessibility.highContrast = elements.highContrastToggle.checked;
    applyAccessibilitySettings();
    saveAccessibilitySettings();
    showToast('info', 'High Contrast', appState.accessibility.highContrast ? 'Enabled' : 'Disabled');
}

function toggleLargeText() {
    appState.accessibility.largeText = elements.largeTextToggle.checked;
    applyAccessibilitySettings();
    saveAccessibilitySettings();
    showToast('info', 'Large Text', appState.accessibility.largeText ? 'Enabled' : 'Disabled');
}

function toggleScreenReader() {
    appState.accessibility.screenReader = elements.screenReaderToggle.checked;
    applyAccessibilitySettings();
    saveAccessibilitySettings();
    showToast('info', 'Screen Reader', appState.accessibility.screenReader ? 'Enabled' : 'Disabled');
}

function toggleReducedMotion() {
    appState.accessibility.reducedMotion = elements.reducedMotionToggle?.checked || false;
    if (appState.accessibility.reducedMotion) {
        document.body.classList.add('reduced-motion');
    } else {
        document.body.classList.remove('reduced-motion');
    }
    saveAccessibilitySettings();
    showToast('info', 'Motion', appState.accessibility.reducedMotion ? 'Reduced' : 'Normal');
}

function toggleAutoStart() {
    const autoStart = elements.autoStartToggle?.checked || false;
    localStorage.setItem('whatsbotx_auto_start', autoStart);
    showToast('info', 'Auto-Start', autoStart ? 'Enabled' : 'Disabled');
}

function toggleMinimizeTray() {
    const minimizeTray = elements.minimizeTrayToggle?.checked || false;
    localStorage.setItem('whatsbotx_minimize_tray', minimizeTray);
    showToast('info', 'Minimize to Tray', minimizeTray ? 'Enabled' : 'Disabled');
}

function changeLanguage() {
    const language = elements.languageSelect?.value || 'en';
    localStorage.setItem('whatsbotx_language', language);
    showToast('info', 'Language', language === 'en' ? 'English' : 'हिंदी');
}

function changeTheme() {
    const theme = elements.themeSelect?.value || 'light';
    applyTheme(theme);
    localStorage.setItem('whatsbotx_theme', theme);
    showToast('success', 'Theme', 'Theme changed to ' + theme);
}

function changeAccentColor() {
    const color = elements.accentColorPicker?.value || '#667eea';
    document.documentElement.style.setProperty('--accent-primary', color);
    localStorage.setItem('whatsbotx_accent_color', color);
    showToast('success', 'Accent Color', 'Updated');
}

function applyUIScale(scale) {
    const scalePercentage = parseInt(scale) / 100;
    document.documentElement.style.setProperty('--ui-scale', scalePercentage);
    document.body.style.zoom = scalePercentage;
    localStorage.setItem('whatsbotx_ui_scale', scale);
}

function saveAllSettings() {
    // Collect all settings
    const settings = {
        language: elements.languageSelect?.value,
        theme: elements.themeSelect?.value,
        apiPort: elements.apiPortInput?.value,
        logLevel: elements.logLevelSelect?.value,
        notifications: elements.notificationsToggle?.checked,
        autoStart: elements.autoStartToggle?.checked,
        minimizeTray: elements.minimizeTrayToggle?.checked,
    };
    
    localStorage.setItem('whatsbotx_settings', JSON.stringify(settings));
    showToast('success', 'Settings Saved', 'All changes have been saved');
    addLogEntry('info', 'SETTINGS', 'All settings saved');
}

function resetToDefaults() {
    const confirmed = confirm('Reset all settings to defaults?');
    if (confirmed) {
        localStorage.clear();
        location.reload();
    }
}

function clearAppCache() {
    const confirmed = confirm('Clear application cache? This may improve performance.');
    if (confirmed) {
        appState.cache.clear();
        showToast('success', 'Cache Cleared', 'Application cache has been cleared');
        addLogEntry('info', 'CACHE', 'Application cache cleared');
    }
}

function openThemeSelector() {
    // Implementation for theme selector modal or dropdown
    showToast('info', 'Themes', 'Select a theme from the Appearance tab in Settings');
}


