// Popup script for HTML Element Selector extension
// Manages the user interface and communication with content scripts

class PopupController {
  constructor() {
    this.currentTab = null;
    this.selectedElements = new Set();
    this.extractedData = null;
    this.currentSelectorType = 'css';
    this.isPickerActive = false;
    
    this.init();
  }

  async init() {
    // Get current tab
    this.currentTab = await this.getCurrentTab();
    this.updateURL();
    
    // Initialize UI
    this.initializeTabs();
    this.initializeEventListeners();
    this.initializeMethodButtons();
    
    // Load initial state
    await this.loadSelectedElementsCount();
    
    console.log('Popup initialized');
  }

  async getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  updateURL() {
    const urlDisplay = document.getElementById('current-url');
    if (this.currentTab && urlDisplay) {
      const url = new URL(this.currentTab.url);
      urlDisplay.textContent = url.hostname + url.pathname;
    }
  }

  initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        
        // Update active states
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
      });
    });
  }

  initializeMethodButtons() {
    const visualPickerBtn = document.getElementById('visual-picker-btn');
    const cssSelectorBtn = document.getElementById('css-selector-btn');
    const xpathBtn = document.getElementById('xpath-btn');

    visualPickerBtn.addEventListener('click', () => {
      this.activateVisualPicker();
    });

    cssSelectorBtn.addEventListener('click', () => {
      this.showSelectorInput('css');
    });

    xpathBtn.addEventListener('click', () => {
      this.showSelectorInput('xpath');
    });
  }

  initializeEventListeners() {
    // Selector input events
    document.getElementById('test-selector-btn').addEventListener('click', () => {
      this.testSelector();
    });

    document.getElementById('add-selector-btn').addEventListener('click', () => {
      this.addSelector();
    });

    // Selection management
    document.getElementById('clear-selection-btn').addEventListener('click', () => {
      this.clearSelection();
    });

    // Data extraction
    document.getElementById('extract-data-btn').addEventListener('click', () => {
      this.extractData();
    });

    // Export events
    document.getElementById('export-json-btn').addEventListener('click', () => {
      this.exportData('json');
    });

    document.getElementById('export-csv-btn').addEventListener('click', () => {
      this.exportData('csv');
    });

    document.getElementById('download-btn').addEventListener('click', () => {
      this.downloadExport();
    });

    // Listen for content script events
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'contentScriptEvent') {
        this.handleContentScriptEvent(message.event, message.data);
      }
    });
  }

  async activateVisualPicker() {
    try {
      this.updateStatus('Activating visual picker...');
      
      const response = await this.sendMessageToContentScript({
        action: 'startPicker'
      });

      if (response.success) {
        this.isPickerActive = true;
        this.updateMethodButtonStates('visual');
        this.updateStatus('Click elements on the page to select them');
        this.hideSelectorInput();
      } else {
        this.showError('Failed to activate visual picker');
      }
    } catch (error) {
      this.showError('Error activating visual picker: ' + error.message);
    }
  }

  showSelectorInput(type) {
    this.currentSelectorType = type;
    this.updateMethodButtonStates(type);
    
    const section = document.getElementById('selector-input-section');
    const input = document.getElementById('selector-input');
    
    section.style.display = 'block';
    input.placeholder = type === 'xpath' 
      ? 'Enter XPath expression (e.g., //div[@class="example"])...'
      : 'Enter CSS selector (e.g., .class-name, #id, div.example)...';
    
    input.focus();
    
    if (this.isPickerActive) {
      this.deactivateVisualPicker();
    }
  }

  hideSelectorInput() {
    const section = document.getElementById('selector-input-section');
    section.style.display = 'none';
    this.clearSelectorFeedback();
  }

  updateMethodButtonStates(activeMethod) {
    const buttons = document.querySelectorAll('.method-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (activeMethod === 'visual') {
      document.getElementById('visual-picker-btn').classList.add('active');
    } else if (activeMethod === 'css') {
      document.getElementById('css-selector-btn').classList.add('active');
    } else if (activeMethod === 'xpath') {
      document.getElementById('xpath-btn').classList.add('active');
    }
  }

  async deactivateVisualPicker() {
    if (!this.isPickerActive) return;
    
    try {
      await this.sendMessageToContentScript({
        action: 'stopPicker'
      });
      
      this.isPickerActive = false;
      this.updateStatus('Visual picker deactivated');
    } catch (error) {
      console.error('Error deactivating visual picker:', error);
    }
  }

  async testSelector() {
    const input = document.getElementById('selector-input');
    const selector = input.value.trim();
    
    if (!selector) {
      this.showSelectorFeedback('Please enter a selector', 'error');
      return;
    }

    try {
      this.updateStatus('Testing selector...');
      
      const response = await this.sendMessageToContentScript({
        action: 'highlightElements',
        selectors: [selector]
      });

      if (response.success) {
        this.showSelectorFeedback('Selector is valid and elements are highlighted', 'success');
      } else {
        this.showSelectorFeedback('Invalid selector or no elements found', 'error');
      }
    } catch (error) {
      this.showSelectorFeedback('Error testing selector: ' + error.message, 'error');
    }
  }

  async addSelector() {
    const input = document.getElementById('selector-input');
    const selector = input.value.trim();
    
    if (!selector) {
      this.showSelectorFeedback('Please enter a selector', 'error');
      return;
    }

    try {
      this.updateStatus('Adding elements...');
      
      const response = await this.sendMessageToContentScript({
        action: 'selectBySelector',
        selector: selector,
        selectorType: this.currentSelectorType
      });

      if (response.success) {
        input.value = '';
        this.showSelectorFeedback('Elements added to selection', 'success');
        await this.loadSelectedElementsCount();
      } else {
        this.showSelectorFeedback('Failed to select elements', 'error');
      }
    } catch (error) {
      this.showSelectorFeedback('Error adding selector: ' + error.message, 'error');
    }
  }

  async clearSelection() {
    try {
      const response = await this.sendMessageToContentScript({
        action: 'clearSelection'
      });

      if (response.success) {
        this.selectedElements.clear();
        this.updateSelectedElementsDisplay();
        this.updateStatus('Selection cleared');
      }
    } catch (error) {
      this.showError('Error clearing selection: ' + error.message);
    }
  }

  async loadSelectedElementsCount() {
    try {
      const response = await this.sendMessageToContentScript({
        action: 'getSelectedCount'
      });

      if (response.count !== undefined) {
        this.updateSelectedElementsCount(response.count);
      }
    } catch (error) {
      console.error('Error loading selected elements count:', error);
    }
  }

  updateSelectedElementsCount(count) {
    const countElement = document.getElementById('selected-count');
    if (countElement) {
      countElement.textContent = count;
    }
  }

  updateSelectedElementsDisplay() {
    this.updateSelectedElementsCount(this.selectedElements.size);
  }

  async extractData() {
    try {
      this.updateStatus('Extracting data...');
      
      const options = this.getExtractionOptions();
      const response = await this.sendMessageToContentScript({
        action: 'extractData',
        options: options
      });

      if (response.success && response.data) {
        this.extractedData = response.data;
        this.displayExtractionResults(response.data);
        this.updateStatus(`Extracted data from ${response.data.length} elements`);
        
        // Switch to export tab
        document.querySelector('[data-tab="export"]').click();
      } else {
        this.showError('Failed to extract data');
      }
    } catch (error) {
      this.showError('Error extracting data: ' + error.message);
    }
  }

  getExtractionOptions() {
    return {
      extractText: document.getElementById('extract-text').checked,
      extractHtml: document.getElementById('extract-html').checked,
      extractAttributes: document.getElementById('extract-attributes').checked,
      extractComputedStyles: document.getElementById('extract-styles').checked,
      extractPosition: document.getElementById('extract-position').checked,
      extractLinks: document.getElementById('extract-links').checked,
      extractImages: document.getElementById('extract-images').checked,
      includeChildren: document.getElementById('include-children').checked,
      maxDepth: parseInt(document.getElementById('max-depth').value) || 3
    };
  }

  displayExtractionResults(data) {
    const resultsSection = document.getElementById('extraction-results');
    const resultsCount = document.getElementById('results-count');
    const resultsPreview = document.getElementById('results-preview');
    
    resultsSection.style.display = 'block';
    resultsCount.textContent = data.length;
    
    // Create preview
    resultsPreview.innerHTML = '';
    data.slice(0, 5).forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'result-item';
      div.innerHTML = `
        <div class="tag">${item.tagName}</div>
        <div class="text">${item.text?.innerText?.substring(0, 100) || 'No text content'}${item.text?.innerText?.length > 100 ? '...' : ''}</div>
      `;
      resultsPreview.appendChild(div);
    });
    
    if (data.length > 5) {
      const moreDiv = document.createElement('div');
      moreDiv.className = 'result-item';
      moreDiv.innerHTML = `<div class="text">... and ${data.length - 5} more elements</div>`;
      resultsPreview.appendChild(moreDiv);
    }
  }

  async sendMessageToContentScript(message) {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(this.currentTab.id, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response || {});
        }
      });
    });
  }

  handleContentScriptEvent(event, data) {
    switch (event) {
      case 'elementAdded':
        this.selectedElements.add(data.elementId);
        this.updateSelectedElementsDisplay();
        break;
      case 'selectionCleared':
        this.selectedElements.clear();
        this.updateSelectedElementsDisplay();
        break;
      case 'elementsSelected':
        this.updateStatus(`Selected ${data.count} elements`);
        this.loadSelectedElementsCount();
        break;
    }
  }

  updateStatus(message) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
      statusElement.textContent = message;
    }
  }

  showError(message) {
    this.updateStatus('Error: ' + message);
    console.error(message);
  }

  showSelectorFeedback(message, type) {
    const feedback = document.getElementById('selector-feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
  }

  clearSelectorFeedback() {
    const feedback = document.getElementById('selector-feedback');
    feedback.textContent = '';
    feedback.className = 'feedback';
  }

  // Export functionality
  exportData(format) {
    if (!this.extractedData || this.extractedData.length === 0) {
      this.showError('No data to export. Please extract data first.');
      return;
    }

    const options = this.getExportOptions();
    let exportContent;

    if (format === 'json') {
      exportContent = this.generateJSONExport(this.extractedData, options);
      this.updateFormatButtonStates('json');
    } else if (format === 'csv') {
      exportContent = this.generateCSVExport(this.extractedData, options);
      this.updateFormatButtonStates('csv');
    }

    this.displayExportPreview(exportContent, format);
    this.currentExportFormat = format;
    this.currentExportContent = exportContent;
  }

  getExportOptions() {
    return {
      includeMetadata: document.getElementById('include-metadata').checked,
      flattenData: document.getElementById('flatten-data').checked,
      includeTimestamp: document.getElementById('include-timestamp').checked
    };
  }

  generateJSONExport(data, options) {
    let exportData = [...data];

    if (options.flattenData) {
      exportData = exportData.map(item => this.flattenObject(item));
    }

    const result = {
      metadata: options.includeMetadata ? {
        url: this.currentTab.url,
        timestamp: new Date().toISOString(),
        totalElements: data.length,
        extractionOptions: this.getExtractionOptions()
      } : undefined,
      data: exportData
    };

    if (!options.includeMetadata) {
      return JSON.stringify(exportData, null, 2);
    }

    return JSON.stringify(result, null, 2);
  }

  generateCSVExport(data, options) {
    if (data.length === 0) return '';

    // Flatten data if requested
    let processedData = options.flattenData
      ? data.map(item => this.flattenObject(item))
      : data;

    // Get all unique keys
    const allKeys = new Set();
    processedData.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });

    const headers = Array.from(allKeys);
    const csvRows = [headers.join(',')];

    // Add data rows
    processedData.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        if (value === null || value === undefined) return '';

        // Handle objects and arrays
        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }

        // Escape quotes and wrap in quotes if contains comma or quote
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      });
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  flattenObject(obj, prefix = '') {
    const flattened = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(flattened, this.flattenObject(value, newKey));
        } else if (Array.isArray(value)) {
          flattened[newKey] = JSON.stringify(value);
        } else {
          flattened[newKey] = value;
        }
      }
    }

    return flattened;
  }

  updateFormatButtonStates(activeFormat) {
    const buttons = document.querySelectorAll('.format-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    if (activeFormat === 'json') {
      document.getElementById('export-json-btn').classList.add('active');
    } else if (activeFormat === 'csv') {
      document.getElementById('export-csv-btn').classList.add('active');
    }
  }

  displayExportPreview(content, format) {
    const previewSection = document.getElementById('export-preview-section');
    const previewContent = document.getElementById('export-preview-content');

    previewSection.style.display = 'block';
    previewContent.textContent = content.substring(0, 2000) + (content.length > 2000 ? '\n...' : '');
  }

  downloadExport() {
    if (!this.currentExportContent) {
      this.showError('No export content available');
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `html-elements-${timestamp}.${this.currentExportFormat}`;

    const blob = new Blob([this.currentExportContent], {
      type: this.currentExportFormat === 'json' ? 'application/json' : 'text/csv'
    });

    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        this.showError('Download failed: ' + chrome.runtime.lastError.message);
      } else {
        this.updateStatus('Export downloaded successfully');
      }
      URL.revokeObjectURL(url);
    });
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
