// Internationalization utility for HTML Element Selector extension
// Handles multi-language support using Chrome i18n API

class I18nManager {
  constructor() {
    this.currentLocale = chrome.i18n.getUILanguage();
    this.init();
  }

  init() {
    // Initialize i18n when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.localizeHTML();
      });
    } else {
      this.localizeHTML();
    }
  }

  // Get localized message
  getMessage(key, substitutions = []) {
    try {
      return chrome.i18n.getMessage(key, substitutions) || key;
    } catch (error) {
      console.warn(`Failed to get i18n message for key: ${key}`, error);
      return key;
    }
  }

  // Localize all elements with data-i18n attributes
  localizeHTML() {
    // Localize elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const message = this.getMessage(key);
      
      if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'textarea')) {
        element.placeholder = message;
      } else {
        element.textContent = message;
      }
    });

    // Localize elements with data-i18n-title attribute
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      const message = this.getMessage(key);
      element.title = message;
    });

    // Localize elements with data-i18n-placeholder attribute
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const message = this.getMessage(key);
      element.placeholder = message;
    });

    // Localize elements with data-i18n-value attribute
    const valueElements = document.querySelectorAll('[data-i18n-value]');
    valueElements.forEach(element => {
      const key = element.getAttribute('data-i18n-value');
      const message = this.getMessage(key);
      element.value = message;
    });
  }

  // Get current locale
  getCurrentLocale() {
    return this.currentLocale;
  }

  // Check if current locale is Chinese
  isChinese() {
    return this.currentLocale.startsWith('zh');
  }

  // Check if current locale is English
  isEnglish() {
    return this.currentLocale.startsWith('en');
  }

  // Format number with locale-specific formatting
  formatNumber(number) {
    try {
      return new Intl.NumberFormat(this.currentLocale).format(number);
    } catch (error) {
      return number.toString();
    }
  }

  // Format date with locale-specific formatting
  formatDate(date) {
    try {
      return new Intl.DateTimeFormat(this.currentLocale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return date.toLocaleString();
    }
  }

  // Get localized text for dynamic content
  getLocalizedText(key, count = null) {
    if (count !== null) {
      // Handle pluralization for different languages
      if (this.isChinese()) {
        // Chinese doesn't have plural forms
        return `${count} ${this.getMessage(key)}`;
      } else {
        // English pluralization
        const singular = this.getMessage(key);
        if (count === 1) {
          return `${count} ${singular.replace(/s$/, '')}`;
        } else {
          return `${count} ${singular}`;
        }
      }
    }
    return this.getMessage(key);
  }

  // Update element text with localized content
  updateElementText(elementId, key, substitutions = []) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = this.getMessage(key, substitutions);
    }
  }

  // Update element placeholder with localized content
  updateElementPlaceholder(elementId, key, substitutions = []) {
    const element = document.getElementById(elementId);
    if (element) {
      element.placeholder = this.getMessage(key, substitutions);
    }
  }

  // Get localized status messages
  getStatusMessage(type, data = {}) {
    const messages = {
      ready: 'statusReady',
      activatingPicker: 'statusActivatingPicker',
      clickElements: 'statusClickElements',
      testingSelector: 'statusTestingSelector',
      addingElements: 'statusAddingElements',
      extractingData: 'statusExtractingData'
    };

    const key = messages[type];
    if (key) {
      return this.getMessage(key);
    }
    return type;
  }

  // Get localized error messages
  getErrorMessage(type, data = {}) {
    const messages = {
      failedActivatePicker: 'errorFailedActivatePicker',
      enterSelector: 'errorEnterSelector',
      invalidSelector: 'errorInvalidSelector',
      failedSelectElements: 'errorFailedSelectElements',
      failedExtractData: 'errorFailedExtractData',
      noDataToExport: 'errorNoDataToExport',
      downloadFailed: 'errorDownloadFailed'
    };

    const key = messages[type];
    if (key) {
      return this.getMessage(key);
    }
    return type;
  }

  // Get localized success messages
  getSuccessMessage(type, data = {}) {
    const messages = {
      selectorValid: 'successSelectorValid',
      elementsAdded: 'successElementsAdded',
      selectionCleared: 'successSelectionCleared',
      exportDownloaded: 'successExportDownloaded'
    };

    const key = messages[type];
    if (key) {
      return this.getMessage(key);
    }
    return type;
  }

  // Dynamically update count displays
  updateCountDisplay(elementId, count, messageKey) {
    const element = document.getElementById(elementId);
    if (element) {
      if (this.isChinese()) {
        element.textContent = `${count} ${this.getMessage(messageKey)}`;
      } else {
        const baseMessage = this.getMessage(messageKey);
        const word = baseMessage.replace(/s$/, '');
        element.textContent = count === 1 ? `${count} ${word}` : `${count} ${word}s`;
      }
    }
  }

  // Get localized filename for exports
  getExportFilename(format, timestamp) {
    const baseNames = {
      en: 'html-elements',
      zh_CN: 'html元素'
    };

    const baseName = baseNames[this.currentLocale] || baseNames.en;
    const formattedTimestamp = timestamp.replace(/[:.]/g, '-');
    
    return `${baseName}-${formattedTimestamp}.${format}`;
  }
}

// Create global instance
const i18n = new I18nManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18nManager;
} else {
  window.I18nManager = I18nManager;
  window.i18n = i18n;
}
