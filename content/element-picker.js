// Visual element picker for HTML Element Selector extension
// Provides interactive element selection with hover and click functionality

class ElementPicker {
  constructor() {
    this.isActive = false;
    this.currentHighlight = null;
    this.overlay = null;
    this.tooltip = null;
    this.onElementSelected = null;
    
    // Bind methods to preserve context
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  activate() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.createOverlay();
    this.createTooltip();
    this.addEventListeners();
    this.addPickerStyles();
    
    console.log('Element picker activated');
  }

  deactivate() {
    if (!this.isActive) return;
    
    this.isActive = false;
    this.removeEventListeners();
    this.removeOverlay();
    this.removeTooltip();
    this.clearHighlight();
    this.removePickerStyles();
    
    console.log('Element picker deactivated');
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'html-selector-overlay';
    this.overlay.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: rgba(0, 0, 0, 0.05) !important;
      z-index: 999998 !important;
      pointer-events: none !important;
    `;
    document.body.appendChild(this.overlay);
  }

  removeOverlay() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
      this.overlay = null;
    }
  }

  createTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'html-selector-tooltip';
    this.tooltip.style.cssText = `
      position: fixed !important;
      background: #333 !important;
      color: white !important;
      padding: 8px 12px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      font-family: monospace !important;
      z-index: 1000001 !important;
      pointer-events: none !important;
      display: none !important;
      max-width: 300px !important;
      word-wrap: break-word !important;
    `;
    document.body.appendChild(this.tooltip);
  }

  removeTooltip() {
    if (this.tooltip && this.tooltip.parentNode) {
      this.tooltip.parentNode.removeChild(this.tooltip);
      this.tooltip = null;
    }
  }

  addPickerStyles() {
    document.body.classList.add('html-selector-picker-active');
    document.body.style.cursor = 'crosshair';
  }

  removePickerStyles() {
    document.body.classList.remove('html-selector-picker-active');
    document.body.style.cursor = '';
  }

  addEventListeners() {
    document.addEventListener('mousemove', this.handleMouseMove, true);
    document.addEventListener('click', this.handleClick, true);
    document.addEventListener('keydown', this.handleKeyDown, true);
    document.addEventListener('scroll', this.handleScroll, true);
  }

  removeEventListeners() {
    document.removeEventListener('mousemove', this.handleMouseMove, true);
    document.removeEventListener('click', this.handleClick, true);
    document.removeEventListener('keydown', this.handleKeyDown, true);
    document.removeEventListener('scroll', this.handleScroll, true);
  }

  handleMouseMove(event) {
    if (!this.isActive) return;

    event.preventDefault();
    event.stopPropagation();

    const element = this.getElementFromPoint(event.clientX, event.clientY);
    if (element && element !== this.currentHighlight) {
      this.highlightElement(element);
      this.updateTooltip(element, event.clientX, event.clientY);
    }
  }

  handleClick(event) {
    if (!this.isActive) return;

    event.preventDefault();
    event.stopPropagation();

    const element = this.getElementFromPoint(event.clientX, event.clientY);
    if (element) {
      this.selectElement(element);
    }
  }

  handleKeyDown(event) {
    if (!this.isActive) return;

    // ESC key to cancel picker
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.deactivate();
    }
  }

  handleScroll() {
    if (!this.isActive) return;
    this.hideTooltip();
  }

  getElementFromPoint(x, y) {
    // Temporarily hide overlay and tooltip to get element underneath
    const overlayDisplay = this.overlay ? this.overlay.style.display : '';
    const tooltipDisplay = this.tooltip ? this.tooltip.style.display : '';
    
    if (this.overlay) this.overlay.style.display = 'none';
    if (this.tooltip) this.tooltip.style.display = 'none';

    const element = document.elementFromPoint(x, y);

    // Restore overlay and tooltip
    if (this.overlay) this.overlay.style.display = overlayDisplay;
    if (this.tooltip) this.tooltip.style.display = tooltipDisplay;

    // Filter out extension elements and non-interactive elements
    if (this.isValidTarget(element)) {
      return element;
    }

    return null;
  }

  isValidTarget(element) {
    if (!element || element === document.body || element === document.documentElement) {
      return false;
    }

    // Skip extension elements
    if (element.classList.contains('html-selector-overlay') ||
        element.classList.contains('html-selector-tooltip') ||
        element.closest('.html-selector-overlay, .html-selector-tooltip')) {
      return false;
    }

    // Skip script and style elements
    const tagName = element.tagName.toLowerCase();
    if (['script', 'style', 'meta', 'link', 'title'].includes(tagName)) {
      return false;
    }

    return true;
  }

  highlightElement(element) {
    this.clearHighlight();
    
    if (element) {
      this.currentHighlight = element;
      element.classList.add('html-selector-highlight');
      
      // Add selector info as data attribute for CSS display
      const selector = this.generateQuickSelector(element);
      element.setAttribute('data-selector-info', selector);
    }
  }

  clearHighlight() {
    if (this.currentHighlight) {
      this.currentHighlight.classList.remove('html-selector-highlight');
      this.currentHighlight.removeAttribute('data-selector-info');
      this.currentHighlight = null;
    }
  }

  selectElement(element) {
    const selector = this.generateSelector(element);
    
    // Clear highlight before selection
    this.clearHighlight();
    
    // Notify parent about selection
    if (this.onElementSelected) {
      this.onElementSelected(element, selector);
    }

    // Optionally deactivate picker after selection
    // this.deactivate();
  }

  updateTooltip(element, x, y) {
    if (!this.tooltip) return;

    const info = this.getElementInfo(element);
    this.tooltip.innerHTML = info;
    this.tooltip.style.display = 'block';

    // Position tooltip
    const tooltipRect = this.tooltip.getBoundingClientRect();
    let left = x + 10;
    let top = y - tooltipRect.height - 10;

    // Adjust if tooltip goes off screen
    if (left + tooltipRect.width > window.innerWidth) {
      left = x - tooltipRect.width - 10;
    }
    if (top < 0) {
      top = y + 10;
    }

    this.tooltip.style.left = left + 'px';
    this.tooltip.style.top = top + 'px';
  }

  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.style.display = 'none';
    }
  }

  getElementInfo(element) {
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const classes = element.className ? `.${Array.from(element.classList).join('.')}` : '';
    const text = element.innerText?.trim().substring(0, 50) || '';
    const selector = this.generateQuickSelector(element);

    return `
      <strong>${tagName}${id}${classes}</strong><br>
      ${text ? `Text: "${text}${text.length > 50 ? '...' : ''}"<br>` : ''}
      Selector: <code>${selector}</code>
    `;
  }

  generateQuickSelector(element) {
    if (element.id) {
      return `#${element.id}`;
    }

    let selector = element.tagName.toLowerCase();
    
    if (element.className) {
      const classes = Array.from(element.classList)
        .filter(cls => !cls.startsWith('html-selector-'))
        .slice(0, 2) // Limit to first 2 classes for brevity
        .join('.');
      if (classes) {
        selector += `.${classes}`;
      }
    }

    return selector;
  }

  generateSelector(element) {
    // Try ID first
    if (element.id) {
      return `#${element.id}`;
    }

    // Try class-based selector
    if (element.className) {
      const classes = Array.from(element.classList)
        .filter(cls => !cls.startsWith('html-selector-'))
        .join('.');
      if (classes) {
        const selector = `${element.tagName.toLowerCase()}.${classes}`;
        // Check if this selector is unique
        if (document.querySelectorAll(selector).length === 1) {
          return selector;
        }
      }
    }

    // Generate path-based selector
    const path = [];
    let current = element;

    while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
      let selector = current.tagName.toLowerCase();

      // Add classes if available
      if (current.className) {
        const classes = Array.from(current.classList)
          .filter(cls => !cls.startsWith('html-selector-'))
          .join('.');
        if (classes) {
          selector += `.${classes}`;
        }
      }

      // Add nth-child if needed
      const siblings = Array.from(current.parentElement?.children || [])
        .filter(sibling => sibling.tagName === current.tagName);
      
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }

      path.unshift(selector);

      // Check if current path is unique
      const currentSelector = path.join(' > ');
      if (document.querySelectorAll(currentSelector).length === 1) {
        return currentSelector;
      }

      current = current.parentElement;
    }

    return path.join(' > ');
  }
}
