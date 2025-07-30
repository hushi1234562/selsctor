// Data extraction engine for HTML Element Selector extension
// Handles extraction of text, HTML, attributes, and computed styles

class DataExtractor {
  constructor() {
    this.onDataExtracted = null;
    this.defaultOptions = {
      extractText: true,
      extractHtml: false,
      extractAttributes: true,
      extractComputedStyles: false,
      extractPosition: false,
      extractLinks: true,
      extractImages: true,
      includeChildren: false,
      maxDepth: 3
    };
  }

  async extractFromElement(element, options = {}) {
    const extractOptions = { ...this.defaultOptions, ...options };
    const data = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      tagName: element.tagName.toLowerCase(),
      xpath: this.getXPath(element),
      cssSelector: this.generateCSSSelector(element)
    };

    try {
      // Extract text content
      if (extractOptions.extractText) {
        data.text = {
          innerText: element.innerText?.trim() || '',
          textContent: element.textContent?.trim() || '',
          value: element.value || null
        };
      }

      // Extract HTML content
      if (extractOptions.extractHtml) {
        data.html = {
          innerHTML: element.innerHTML,
          outerHTML: element.outerHTML
        };
      }

      // Extract attributes
      if (extractOptions.extractAttributes) {
        data.attributes = this.extractAttributes(element);
      }

      // Extract computed styles
      if (extractOptions.extractComputedStyles) {
        data.computedStyles = this.extractComputedStyles(element);
      }

      // Extract position and dimensions
      if (extractOptions.extractPosition) {
        data.position = this.extractPosition(element);
      }

      // Extract links
      if (extractOptions.extractLinks) {
        data.links = this.extractLinks(element);
      }

      // Extract images
      if (extractOptions.extractImages) {
        data.images = this.extractImages(element);
      }

      // Extract children data if requested
      if (extractOptions.includeChildren) {
        data.children = await this.extractChildren(element, extractOptions);
      }

      return data;

    } catch (error) {
      console.error('Error extracting data from element:', error);
      return {
        ...data,
        error: error.message,
        extractionFailed: true
      };
    }
  }

  extractAttributes(element) {
    const attributes = {};
    
    // Get all attributes
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      attributes[attr.name] = attr.value;
    }

    // Add special properties
    attributes._id = element.id || null;
    attributes._className = element.className || null;
    attributes._classList = Array.from(element.classList);

    return attributes;
  }

  extractComputedStyles(element) {
    const computedStyle = window.getComputedStyle(element);
    const styles = {};

    // Extract commonly useful style properties
    const importantProperties = [
      'display', 'visibility', 'position', 'top', 'left', 'right', 'bottom',
      'width', 'height', 'margin', 'padding', 'border', 'background',
      'color', 'font-family', 'font-size', 'font-weight', 'text-align',
      'z-index', 'opacity', 'transform'
    ];

    importantProperties.forEach(prop => {
      styles[prop] = computedStyle.getPropertyValue(prop);
    });

    return styles;
  }

  extractPosition(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    return {
      viewport: {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      },
      page: {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft,
        right: rect.right + scrollLeft,
        bottom: rect.bottom + scrollTop
      },
      scroll: {
        top: scrollTop,
        left: scrollLeft
      }
    };
  }

  extractLinks(element) {
    const links = [];
    
    // Check if element itself is a link
    if (element.tagName.toLowerCase() === 'a' && element.href) {
      links.push({
        href: element.href,
        text: element.innerText?.trim() || '',
        title: element.title || null,
        target: element.target || null
      });
    }

    // Find links within the element
    const childLinks = element.querySelectorAll('a[href]');
    childLinks.forEach(link => {
      links.push({
        href: link.href,
        text: link.innerText?.trim() || '',
        title: link.title || null,
        target: link.target || null
      });
    });

    return links;
  }

  extractImages(element) {
    const images = [];

    // Check if element itself is an image
    if (element.tagName.toLowerCase() === 'img' && element.src) {
      images.push({
        src: element.src,
        alt: element.alt || null,
        title: element.title || null,
        width: element.naturalWidth || element.width,
        height: element.naturalHeight || element.height
      });
    }

    // Find images within the element
    const childImages = element.querySelectorAll('img[src]');
    childImages.forEach(img => {
      images.push({
        src: img.src,
        alt: img.alt || null,
        title: img.title || null,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height
      });
    });

    return images;
  }

  async extractChildren(element, options, currentDepth = 0) {
    if (currentDepth >= options.maxDepth) {
      return [];
    }

    const children = [];
    const childElements = Array.from(element.children);

    for (const child of childElements) {
      const childData = await this.extractFromElement(child, {
        ...options,
        includeChildren: currentDepth < options.maxDepth - 1
      });
      children.push(childData);
    }

    return children;
  }

  getXPath(element) {
    if (element.id) {
      return `//*[@id="${element.id}"]`;
    }

    const parts = [];
    let current = element;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let index = 1;
      let sibling = current.previousElementSibling;

      while (sibling) {
        if (sibling.tagName === current.tagName) {
          index++;
        }
        sibling = sibling.previousElementSibling;
      }

      const tagName = current.tagName.toLowerCase();
      const part = index > 1 ? `${tagName}[${index}]` : tagName;
      parts.unshift(part);

      current = current.parentElement;
    }

    return '/' + parts.join('/');
  }

  generateCSSSelector(element) {
    if (element.id) {
      return `#${element.id}`;
    }

    const path = [];
    let current = element;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let selector = current.tagName.toLowerCase();

      if (current.className) {
        const classes = Array.from(current.classList)
          .filter(cls => !cls.startsWith('html-selector-'))
          .join('.');
        if (classes) {
          selector += `.${classes}`;
        }
      }

      // Add nth-child if needed for uniqueness
      const siblings = Array.from(current.parentElement?.children || [])
        .filter(sibling => sibling.tagName === current.tagName);
      
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }

      path.unshift(selector);

      // Stop if we have a unique selector
      if (document.querySelectorAll(path.join(' > ')).length === 1) {
        break;
      }

      current = current.parentElement;
    }

    return path.join(' > ');
  }

  // Batch extraction for multiple elements
  async extractFromElements(elements, options = {}) {
    const results = [];
    
    for (const element of elements) {
      const data = await this.extractFromElement(element, options);
      results.push(data);
    }

    if (this.onDataExtracted) {
      this.onDataExtracted(results);
    }

    return results;
  }
}
