# HTML Element Selector - Browser Extension

A powerful browser extension for extracting and retrieving specific HTML elements from web pages.

## Features

- **Multiple Selection Methods**: CSS selectors, XPath expressions, and visual element picker
- **Data Extraction**: Extract text content, HTML, attributes, and computed styles
- **Dynamic Content Support**: Handles JavaScript-loaded content with MutationObserver
- **Export Options**: JSON and CSV export formats
- **Multi-Language Support**: English and Chinese (Simplified) interface
- **User-Friendly Interface**: Intuitive popup UI for configuration
- **Universal Compatibility**: Works on all websites

## Technology Stack

- **Browser**: Chrome (Manifest V3)
- **Languages**: JavaScript, HTML, CSS
- **APIs**: Chrome Extensions API, DOM APIs, MutationObserver

## Project Structure

```
selector/
├── manifest.json           # Extension manifest
├── popup/                  # Extension popup UI
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── content/                # Content scripts
│   ├── content.js
│   ├── element-picker.js
│   └── data-extractor.js
├── background/             # Background service worker
│   └── background.js
├── styles/                 # Shared styles
│   └── common.css
├── icons/                  # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project directory

## Usage

1. Click the extension icon in the browser toolbar
2. Choose your selection method:
   - **Visual Picker**: Click elements directly on the page
   - **CSS Selector**: Enter CSS selector expressions
   - **XPath**: Enter XPath expressions
3. Configure what data to extract (text, HTML, attributes)
4. Extract and export your data

## Quick Start

1. **Install**: Follow the [Installation Guide](INSTALLATION.md)
2. **Learn**: Read the [Usage Guide](USAGE.md)
3. **Test**: Open `test.html` in your browser and try the extension
4. **Test Chinese**: Open `test-i18n.html` for Chinese language testing
5. **Verify**: Run through the [Test Cases](TEST_CASES.md)

## Key Features Implemented

### ✅ Multiple Selection Methods
- **Visual Element Picker**: Interactive point-and-click selection
- **CSS Selectors**: Standard CSS selector expressions
- **XPath Support**: Full XPath expression support

### ✅ Comprehensive Data Extraction
- Text content (innerText, textContent, form values)
- HTML markup (innerHTML, outerHTML)
- Element attributes (all attributes, classes, IDs)
- Computed CSS styles
- Position and dimensions
- Links and images within elements
- Nested child elements (configurable depth)

### ✅ Export Capabilities
- **JSON Format**: Structured data with full hierarchy
- **CSV Format**: Tabular data for spreadsheet analysis
- **Download Integration**: Direct file downloads
- **Export Options**: Metadata, flattening, timestamps

### ✅ Dynamic Content Handling
- **MutationObserver**: Monitors DOM changes
- **Retry Logic**: Handles AJAX-loaded content
- **Element Validation**: Ensures selections remain valid
- **Stability Detection**: Waits for DOM to stabilize

### ✅ User Experience
- **Intuitive Interface**: Clean, tabbed popup design
- **Multi-Language Support**: English and Chinese (Simplified) localization
- **Visual Feedback**: Element highlighting and tooltips
- **Error Handling**: Comprehensive validation and user feedback
- **Performance**: Optimized for large pages and complex selections

### ✅ Technical Excellence
- **Manifest V3**: Modern Chrome extension architecture
- **Security**: Minimal permissions, local processing
- **Cross-Tab Support**: Independent operation per tab
- **Background Service**: State management and coordination

## Development

This extension is built with modern web technologies and follows Chrome Extension Manifest V3 standards.

### Architecture
- **Content Scripts**: Handle page interaction and data extraction
- **Popup Interface**: User interface for configuration and control
- **Background Service Worker**: State management and coordination
- **Validation Layer**: Input validation and error handling

### Technologies Used
- **JavaScript ES6+**: Modern JavaScript features
- **Chrome Extensions API**: Manifest V3 APIs
- **CSS Grid/Flexbox**: Responsive popup layout
- **MutationObserver**: Dynamic content detection
- **Web APIs**: DOM manipulation, file downloads
- **Chrome i18n API**: Multi-language support

## Multi-Language Support

The extension supports multiple languages with automatic detection based on browser settings:

### Supported Languages
- **English (en)**: Default language
- **Chinese Simplified (zh_CN)**: 中文简体支持

### Language Features
- **Automatic Detection**: Uses browser's UI language setting
- **Complete Localization**: All interface elements, messages, and feedback
- **Localized Export**: File names and content adapt to selected language
- **Cultural Adaptation**: Number and date formatting follows locale conventions

### Adding New Languages
To add support for additional languages:

1. Create a new folder in `_locales/` (e.g., `_locales/fr/`)
2. Copy `_locales/en/messages.json` to the new folder
3. Translate all message values while keeping the keys unchanged
4. Test the extension with the new locale

### Language Files Structure
```
_locales/
├── en/
│   └── messages.json     # English translations
└── zh_CN/
    └── messages.json     # Chinese translations
```
