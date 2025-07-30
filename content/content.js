// Main content script for HTML Element Selector extension
// Coordinates between popup, element picker, and data extractor

class HTMLElementSelector {
  constructor() {
    this.isPickerActive = false;
    this.selectedElements = new Set();
    this.extractionRules = [];
    this.dataExtractor = new DataExtractor();
    this.elementPicker = new ElementPicker();
    this.mutationObserver = null;
    this.dynamicContentHandlers = new Map();

    this.init();
  }

  init() {
    // Listen for messages from popup and background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });

    // Initialize element picker
    this.elementPicker.onElementSelected = (element, selector) => {
      this.addSelectedElement(element, selector);
    };

    // Initialize data extractor
    this.dataExtractor.onDataExtracted = (data) => {
      this.sendDataToPopup(data);
    };

    // Initialize dynamic content handling
    this.initializeDynamicContentHandling();

    console.log('HTML Element Selector content script initialized');
  }

  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.action) {
        case 'startPicker':
          this.startElementPicker();
          sendResponse({ success: true });
          break;

        case 'stopPicker':
          this.stopElementPicker();
          sendResponse({ success: true });
          break;

        case 'selectBySelector':
          await this.selectBySelector(message.selector, message.selectorType);
          sendResponse({ success: true });
          break;

        case 'extractData':
          const data = await this.extractData(message.options);
          sendResponse({ success: true, data });
          break;

        case 'clearSelection':
          this.clearSelection();
          sendResponse({ success: true });
          break;

        case 'getSelectedCount':
          sendResponse({ count: this.selectedElements.size });
          break;

        case 'highlightElements':
          this.highlightElements(message.selectors);
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

  startElementPicker() {
    this.isPickerActive = true;
    this.elementPicker.activate();
    this.notifyPopup('pickerStarted');
  }

  stopElementPicker() {
    this.isPickerActive = false;
    this.elementPicker.deactivate();
    this.notifyPopup('pickerStopped');
  }

  async selectBySelector(selector, selectorType = 'css') {
    try {
      let elements;
      
      if (selectorType === 'xpath') {
        elements = this.getElementsByXPath(selector);
      } else {
        elements = document.querySelectorAll(selector);
      }

      if (elements.length === 0) {
        throw new Error(`No elements found for selector: ${selector}`);
      }

      // Add elements to selection
      elements.forEach(element => {
        this.addSelectedElement(element, selector);
      });

      this.notifyPopup('elementsSelected', { 
        count: elements.length, 
        selector,
        selectorType 
      });

    } catch (error) {
      console.error('Error selecting by selector:', error);
      throw error;
    }
  }

  getElementsByXPath(xpath) {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    const elements = [];
    for (let i = 0; i < result.snapshotLength; i++) {
      elements.push(result.snapshotItem(i));
    }
    return elements;
  }

  addSelectedElement(element, selector) {
    // Create unique identifier for element
    const elementId = this.generateElementId(element);
    
    this.selectedElements.add({
      element,
      selector,
      id: elementId,
      tagName: element.tagName.toLowerCase(),
      className: element.className,
      id: element.id
    });

    // Add visual selection indicator
    element.classList.add('html-selector-selected');
    
    this.notifyPopup('elementAdded', { 
      elementId,
      tagName: element.tagName.toLowerCase(),
      selector 
    });
  }

  generateElementId(element) {
    return `elem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async extractData(options = {}) {
    const extractedData = [];
    
    for (const selectedElement of this.selectedElements) {
      const data = await this.dataExtractor.extractFromElement(
        selectedElement.element, 
        options
      );
      
      extractedData.push({
        ...data,
        selector: selectedElement.selector,
        elementId: selectedElement.id
      });
    }

    return extractedData;
  }

  clearSelection() {
    // Remove visual indicators
    this.selectedElements.forEach(({ element }) => {
      element.classList.remove('html-selector-selected');
    });

    this.selectedElements.clear();
    this.notifyPopup('selectionCleared');
  }

  highlightElements(selectors) {
    // Remove existing highlights
    document.querySelectorAll('.html-selector-highlight').forEach(el => {
      el.classList.remove('html-selector-highlight');
    });

    // Add new highlights
    selectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.classList.add('html-selector-highlight');
        });
      } catch (error) {
        console.warn('Invalid selector:', selector);
      }
    });
  }

  notifyPopup(event, data = {}) {
    chrome.runtime.sendMessage({
      action: 'contentScriptEvent',
      event,
      data,
      url: window.location.href
    });
  }

  sendDataToPopup(data) {
    this.notifyPopup('dataExtracted', { data });
  }

  // Dynamic content handling methods
  initializeDynamicContentHandling() {
    // Set up MutationObserver to watch for DOM changes
    this.mutationObserver = new MutationObserver((mutations) => {
      this.handleDOMChanges(mutations);
    });

    // Start observing
    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true
    });

    console.log('Dynamic content handling initialized');
  }

  handleDOMChanges(mutations) {
    let hasRelevantChanges = false;

    mutations.forEach(mutation => {
      // Check if changes affect our selected elements or potential targets
      if (mutation.type === 'childList') {
        // New nodes added or removed
        if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
          hasRelevantChanges = true;
        }
      } else if (mutation.type === 'attributes') {
        // Attributes changed on existing elements
        const target = mutation.target;
        if (this.isElementSelected(target) || this.isElementHighlighted(target)) {
          hasRelevantChanges = true;
        }
      }
    });

    if (hasRelevantChanges) {
      // Debounce the handling to avoid excessive processing
      this.debouncedHandleContentChange();
    }
  }

  debouncedHandleContentChange = this.debounce(() => {
    this.handleDynamicContentChange();
  }, 500);

  handleDynamicContentChange() {
    // Re-validate selected elements
    this.validateSelectedElements();

    // Re-apply highlights if picker is active
    if (this.isPickerActive) {
      this.refreshPickerHighlights();
    }

    // Notify popup about potential changes
    this.notifyPopup('dynamicContentChanged', {
      selectedCount: this.selectedElements.size
    });
  }

  validateSelectedElements() {
    const invalidElements = [];

    this.selectedElements.forEach(selectedElement => {
      const { element } = selectedElement;

      // Check if element is still in the DOM
      if (!document.contains(element)) {
        invalidElements.push(selectedElement);
      }
    });

    // Remove invalid elements
    invalidElements.forEach(invalidElement => {
      this.selectedElements.delete(invalidElement);
    });

    if (invalidElements.length > 0) {
      console.log(`Removed ${invalidElements.length} invalid elements from selection`);
      this.notifyPopup('elementsRemoved', { count: invalidElements.length });
    }
  }

  refreshPickerHighlights() {
    // Remove old highlights
    document.querySelectorAll('.html-selector-highlight').forEach(el => {
      el.classList.remove('html-selector-highlight');
    });

    // This would be called by the element picker if needed
    if (this.elementPicker && this.elementPicker.isActive) {
      // The element picker will handle re-highlighting on mouse move
    }
  }

  isElementSelected(element) {
    for (const selectedElement of this.selectedElements) {
      if (selectedElement.element === element) {
        return true;
      }
    }
    return false;
  }

  isElementHighlighted(element) {
    return element.classList.contains('html-selector-highlight') ||
           element.classList.contains('html-selector-selected');
  }

  // Utility method for debouncing
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Enhanced selector methods with retry logic for dynamic content
  async selectBySelectorWithRetry(selector, selectorType = 'css', maxRetries = 3, retryDelay = 1000) {
    let attempts = 0;
    let lastError = null;

    while (attempts < maxRetries) {
      try {
        await this.selectBySelector(selector, selectorType);
        return; // Success
      } catch (error) {
        lastError = error;
        attempts++;

        if (attempts < maxRetries) {
          console.log(`Selector attempt ${attempts} failed, retrying in ${retryDelay}ms...`);
          await this.delay(retryDelay);

          // Increase delay for next attempt
          retryDelay *= 1.5;
        }
      }
    }

    // All attempts failed
    throw new Error(`Failed to select elements after ${maxRetries} attempts. Last error: ${lastError.message}`);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Enhanced extraction with dynamic content awareness
  async extractDataWithDynamicHandling(options = {}) {
    // Wait for any pending DOM changes to settle
    await this.waitForDOMStability();

    // Validate elements before extraction
    this.validateSelectedElements();

    // Proceed with normal extraction
    return await this.extractData(options);
  }

  async waitForDOMStability(timeout = 2000, stabilityDelay = 500) {
    return new Promise((resolve) => {
      let stabilityTimer;
      let timeoutTimer;

      const resetStabilityTimer = () => {
        clearTimeout(stabilityTimer);
        stabilityTimer = setTimeout(() => {
          // DOM has been stable for the specified delay
          clearTimeout(timeoutTimer);
          this.mutationObserver.disconnect();
          resolve();
        }, stabilityDelay);
      };

      // Set up temporary mutation observer for stability detection
      const tempObserver = new MutationObserver(() => {
        resetStabilityTimer();
      });

      tempObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });

      // Start the stability timer
      resetStabilityTimer();

      // Set overall timeout
      timeoutTimer = setTimeout(() => {
        clearTimeout(stabilityTimer);
        tempObserver.disconnect();
        resolve(); // Resolve even if not stable, to avoid hanging
      }, timeout);
    });
  }

  // Cleanup method
  destroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    this.clearSelection();
    this.stopElementPicker();
  }
}

// Initialize the content script when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new HTMLElementSelector();
  });
} else {
  new HTMLElementSelector();
}
