// Background service worker for HTML Element Selector extension
// Manages extension state, cross-tab communication, and data coordination

class BackgroundService {
  constructor() {
    this.extensionState = new Map();
    this.init();
  }

  init() {
    // Listen for extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    // Listen for messages from content scripts and popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });

    // Listen for tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    // Listen for tab removal
    chrome.tabs.onRemoved.addListener((tabId) => {
      this.handleTabRemoved(tabId);
    });

    console.log('HTML Element Selector background service initialized');
  }

  handleInstallation(details) {
    if (details.reason === 'install') {
      console.log('Extension installed');
      this.initializeDefaultSettings();
    } else if (details.reason === 'update') {
      console.log('Extension updated');
      this.handleExtensionUpdate(details);
    }
  }

  async initializeDefaultSettings() {
    const defaultSettings = {
      extractionOptions: {
        extractText: true,
        extractHtml: false,
        extractAttributes: true,
        extractComputedStyles: false,
        extractPosition: false,
        extractLinks: true,
        extractImages: true,
        includeChildren: false,
        maxDepth: 3
      },
      exportOptions: {
        includeMetadata: true,
        flattenData: false,
        includeTimestamp: true
      },
      uiPreferences: {
        defaultTab: 'select',
        autoSwitchToExtract: true
      }
    };

    try {
      await chrome.storage.sync.set({ settings: defaultSettings });
      console.log('Default settings initialized');
    } catch (error) {
      console.error('Error initializing default settings:', error);
    }
  }

  handleExtensionUpdate(details) {
    console.log(`Extension updated from ${details.previousVersion} to ${chrome.runtime.getManifest().version}`);
    // Handle any migration logic here if needed
  }

  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.action) {
        case 'contentScriptEvent':
          await this.handleContentScriptEvent(message, sender);
          sendResponse({ success: true });
          break;

        case 'getExtensionState':
          const state = this.getTabState(sender.tab?.id);
          sendResponse({ success: true, state });
          break;

        case 'updateExtensionState':
          this.updateTabState(sender.tab?.id, message.state);
          sendResponse({ success: true });
          break;

        case 'getSettings':
          const settings = await this.getSettings();
          sendResponse({ success: true, settings });
          break;

        case 'updateSettings':
          await this.updateSettings(message.settings);
          sendResponse({ success: true });
          break;

        case 'exportData':
          await this.handleDataExport(message.data, message.format, message.options);
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async handleContentScriptEvent(message, sender) {
    const tabId = sender.tab?.id;
    if (!tabId) return;

    // Update tab state based on content script events
    const currentState = this.getTabState(tabId);
    
    switch (message.event) {
      case 'pickerStarted':
        currentState.pickerActive = true;
        break;
      case 'pickerStopped':
        currentState.pickerActive = false;
        break;
      case 'elementAdded':
        currentState.selectedElements = currentState.selectedElements || [];
        currentState.selectedElements.push(message.data);
        break;
      case 'selectionCleared':
        currentState.selectedElements = [];
        break;
      case 'dataExtracted':
        currentState.extractedData = message.data;
        currentState.lastExtractionTime = Date.now();
        break;
    }

    this.updateTabState(tabId, currentState);

    // Notify other parts of the extension if needed
    this.broadcastStateChange(tabId, message.event, message.data);
  }

  handleTabUpdate(tabId, changeInfo, tab) {
    // Reset state when tab navigates to a new page
    if (changeInfo.status === 'loading' && changeInfo.url) {
      this.resetTabState(tabId);
    }
  }

  handleTabRemoved(tabId) {
    // Clean up state for removed tab
    this.extensionState.delete(tabId);
  }

  getTabState(tabId) {
    if (!this.extensionState.has(tabId)) {
      this.extensionState.set(tabId, {
        pickerActive: false,
        selectedElements: [],
        extractedData: null,
        lastExtractionTime: null,
        selectors: []
      });
    }
    return this.extensionState.get(tabId);
  }

  updateTabState(tabId, newState) {
    const currentState = this.getTabState(tabId);
    Object.assign(currentState, newState);
    this.extensionState.set(tabId, currentState);
  }

  resetTabState(tabId) {
    this.extensionState.set(tabId, {
      pickerActive: false,
      selectedElements: [],
      extractedData: null,
      lastExtractionTime: null,
      selectors: []
    });
  }

  async getSettings() {
    try {
      const result = await chrome.storage.sync.get('settings');
      return result.settings || {};
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  }

  async updateSettings(newSettings) {
    try {
      const currentSettings = await this.getSettings();
      const mergedSettings = { ...currentSettings, ...newSettings };
      await chrome.storage.sync.set({ settings: mergedSettings });
      console.log('Settings updated');
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  async handleDataExport(data, format, options) {
    try {
      // Store export data temporarily for download
      const exportId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await chrome.storage.local.set({
        [exportId]: {
          data,
          format,
          options,
          timestamp: Date.now()
        }
      });

      // Clean up old exports (older than 1 hour)
      this.cleanupOldExports();

      return exportId;
    } catch (error) {
      console.error('Error handling data export:', error);
      throw error;
    }
  }

  async cleanupOldExports() {
    try {
      const result = await chrome.storage.local.get();
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const keysToRemove = [];

      for (const [key, value] of Object.entries(result)) {
        if (key.startsWith('export_') && value.timestamp < oneHourAgo) {
          keysToRemove.push(key);
        }
      }

      if (keysToRemove.length > 0) {
        await chrome.storage.local.remove(keysToRemove);
        console.log(`Cleaned up ${keysToRemove.length} old exports`);
      }
    } catch (error) {
      console.error('Error cleaning up old exports:', error);
    }
  }

  broadcastStateChange(tabId, event, data) {
    // This could be used to notify other parts of the extension
    // about state changes, if needed for future features
    console.log(`State change in tab ${tabId}: ${event}`, data);
  }

  // Utility method to inject content scripts if needed
  async ensureContentScriptInjected(tabId) {
    try {
      // Check if content script is already injected
      const response = await chrome.tabs.sendMessage(tabId, { action: 'ping' });
      return true;
    } catch (error) {
      // Content script not injected, inject it
      try {
        await chrome.scripting.executeScript({
          target: { tabId },
          files: [
            'content/data-extractor.js',
            'content/element-picker.js',
            'content/content.js'
          ]
        });

        await chrome.scripting.insertCSS({
          target: { tabId },
          files: ['styles/common.css']
        });

        console.log('Content script injected successfully');
        return true;
      } catch (injectionError) {
        console.error('Error injecting content script:', injectionError);
        return false;
      }
    }
  }
}

// Initialize the background service
new BackgroundService();
