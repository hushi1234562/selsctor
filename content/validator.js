// Validation and error handling utilities for HTML Element Selector extension

class SelectorValidator {
  static validateCSSSelector(selector) {
    if (!selector || typeof selector !== 'string') {
      throw new Error('Selector must be a non-empty string');
    }

    const trimmedSelector = selector.trim();
    if (!trimmedSelector) {
      throw new Error('Selector cannot be empty or whitespace only');
    }

    try {
      // Test if the selector is valid by attempting to use it
      document.querySelector(trimmedSelector);
      return {
        isValid: true,
        selector: trimmedSelector,
        type: 'css'
      };
    } catch (error) {
      throw new Error(`Invalid CSS selector: ${error.message}`);
    }
  }

  static validateXPathSelector(xpath) {
    if (!xpath || typeof xpath !== 'string') {
      throw new Error('XPath must be a non-empty string');
    }

    const trimmedXPath = xpath.trim();
    if (!trimmedXPath) {
      throw new Error('XPath cannot be empty or whitespace only');
    }

    try {
      // Test if the XPath is valid by attempting to evaluate it
      document.evaluate(
        trimmedXPath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      return {
        isValid: true,
        selector: trimmedXPath,
        type: 'xpath'
      };
    } catch (error) {
      throw new Error(`Invalid XPath expression: ${error.message}`);
    }
  }

  static validateSelector(selector, type = 'css') {
    if (type === 'xpath') {
      return this.validateXPathSelector(selector);
    } else {
      return this.validateCSSSelector(selector);
    }
  }

  static getSelectorSuggestions(selector, type = 'css') {
    const suggestions = [];

    if (type === 'css') {
      // Common CSS selector fixes
      if (selector.includes(' ')) {
        suggestions.push(`Try: "${selector.replace(/ /g, '')}" (remove spaces)`);
      }
      if (!selector.startsWith('.') && !selector.startsWith('#') && !selector.includes('[')) {
        suggestions.push(`Try: ".${selector}" (add class selector)`);
        suggestions.push(`Try: "#${selector}" (add ID selector)`);
      }
      if (selector.includes('::')) {
        suggestions.push(`Try: "${selector.replace('::', ':')}" (use single colon for pseudo-classes)`);
      }
    } else if (type === 'xpath') {
      // Common XPath fixes
      if (!selector.startsWith('/')) {
        suggestions.push(`Try: "//${selector}" (add descendant axis)`);
      }
      if (selector.includes('"') && selector.includes("'")) {
        suggestions.push('Try using concat() function for strings with both quotes');
      }
    }

    return suggestions;
  }
}

class ErrorHandler {
  static handleError(error, context = '') {
    const errorInfo = {
      message: error.message || 'Unknown error occurred',
      context: context,
      timestamp: new Date().toISOString(),
      stack: error.stack,
      type: error.constructor.name
    };

    console.error(`[HTML Element Selector] ${context}:`, errorInfo);
    
    return errorInfo;
  }

  static createUserFriendlyMessage(error, context = '') {
    let userMessage = '';

    if (error.message.includes('Invalid CSS selector')) {
      userMessage = 'The CSS selector you entered is not valid. Please check the syntax and try again.';
    } else if (error.message.includes('Invalid XPath')) {
      userMessage = 'The XPath expression you entered is not valid. Please check the syntax and try again.';
    } else if (error.message.includes('No elements found')) {
      userMessage = 'No elements were found matching your selector. Try a different selector or check if the content has loaded.';
    } else if (error.message.includes('Permission denied')) {
      userMessage = 'Permission denied. This extension cannot access this page due to browser security restrictions.';
    } else if (error.message.includes('Extension context invalidated')) {
      userMessage = 'The extension was reloaded. Please refresh the page and try again.';
    } else if (error.message.includes('Failed to extract data')) {
      userMessage = 'Failed to extract data from the selected elements. The page content may have changed.';
    } else {
      userMessage = `An error occurred: ${error.message}`;
    }

    return userMessage;
  }

  static isRetryableError(error) {
    const retryableErrors = [
      'No elements found',
      'Failed to extract data',
      'Network error',
      'Timeout',
      'DOM not ready'
    ];

    return retryableErrors.some(retryableError => 
      error.message.includes(retryableError)
    );
  }
}

class ValidationUtils {
  static isValidElement(element) {
    return element && 
           element.nodeType === Node.ELEMENT_NODE && 
           document.contains(element);
  }

  static isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isExtensionPage(url) {
    return url.startsWith('chrome://') || 
           url.startsWith('chrome-extension://') ||
           url.startsWith('moz-extension://') ||
           url.startsWith('edge://') ||
           url.startsWith('about:');
  }

  static canAccessPage(url) {
    if (!this.isValidURL(url)) {
      return { canAccess: false, reason: 'Invalid URL' };
    }

    if (this.isExtensionPage(url)) {
      return { canAccess: false, reason: 'Cannot access browser internal pages' };
    }

    const protocol = new URL(url).protocol;
    if (protocol === 'file:') {
      return { canAccess: false, reason: 'Cannot access local files without special permissions' };
    }

    return { canAccess: true };
  }

  static validateExtractionOptions(options) {
    const validOptions = {
      extractText: 'boolean',
      extractHtml: 'boolean',
      extractAttributes: 'boolean',
      extractComputedStyles: 'boolean',
      extractPosition: 'boolean',
      extractLinks: 'boolean',
      extractImages: 'boolean',
      includeChildren: 'boolean',
      maxDepth: 'number'
    };

    const errors = [];

    for (const [key, value] of Object.entries(options)) {
      if (key in validOptions) {
        const expectedType = validOptions[key];
        if (typeof value !== expectedType) {
          errors.push(`Option '${key}' should be of type ${expectedType}, got ${typeof value}`);
        }
        
        if (key === 'maxDepth' && (value < 1 || value > 10)) {
          errors.push(`Option 'maxDepth' should be between 1 and 10, got ${value}`);
        }
      } else {
        errors.push(`Unknown option: ${key}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  static sanitizeSelector(selector, type = 'css') {
    if (!selector || typeof selector !== 'string') {
      return '';
    }

    let sanitized = selector.trim();

    if (type === 'css') {
      // Remove potentially dangerous characters for CSS selectors
      sanitized = sanitized.replace(/[<>]/g, '');
    } else if (type === 'xpath') {
      // Basic XPath sanitization
      // Remove script-like content
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    return sanitized;
  }

  static validateExportFormat(format) {
    const validFormats = ['json', 'csv'];
    
    if (!validFormats.includes(format)) {
      throw new Error(`Invalid export format: ${format}. Valid formats are: ${validFormats.join(', ')}`);
    }

    return true;
  }

  static validateExportData(data) {
    if (!Array.isArray(data)) {
      throw new Error('Export data must be an array');
    }

    if (data.length === 0) {
      throw new Error('No data to export');
    }

    // Check if data contains valid objects
    const invalidItems = data.filter(item => 
      !item || typeof item !== 'object' || Array.isArray(item)
    );

    if (invalidItems.length > 0) {
      throw new Error(`Export data contains ${invalidItems.length} invalid items`);
    }

    return true;
  }
}

// Export classes for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SelectorValidator, ErrorHandler, ValidationUtils };
} else {
  // Browser environment
  window.SelectorValidator = SelectorValidator;
  window.ErrorHandler = ErrorHandler;
  window.ValidationUtils = ValidationUtils;
}
