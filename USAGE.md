# Usage Guide - HTML Element Selector Extension

## Quick Start

1. **Install the extension** (see INSTALLATION.md)
2. **Navigate to any webpage**
3. **Click the extension icon** in the toolbar
4. **Choose your selection method** and start extracting data

## Selection Methods

### 1. Visual Element Picker 🎯

**Best for**: Beginners, quick selection of visible elements

**How to use**:
1. Click the "Visual Picker" button
2. Hover over elements on the page (they will be highlighted)
3. Click on elements you want to select
4. Press ESC to stop picking

**Tips**:
- Elements are highlighted with a blue outline when hovering
- Selected elements show a green outline
- A tooltip shows element information while hovering

### 2. CSS Selector 📝

**Best for**: Selecting multiple similar elements, precise targeting

**How to use**:
1. Click the "CSS Selector" button
2. Enter a CSS selector in the text field
3. Click "Test" to preview which elements will be selected
4. Click "Add" to add elements to your selection

**Examples**:
```css
/* Select all paragraphs */
p

/* Select elements with specific class */
.product-title

/* Select by ID */
#main-content

/* Select nested elements */
.article .title

/* Select by attribute */
[data-testid="product-card"]

/* Complex selectors */
.container > .item:nth-child(odd)
```

### 3. XPath 🔍

**Best for**: Complex selections, text-based targeting, advanced users

**How to use**:
1. Click the "XPath" button
2. Enter an XPath expression
3. Click "Test" to preview selection
4. Click "Add" to add elements

**Examples**:
```xpath
// Select all div elements
//div

// Select by text content
//span[contains(text(), 'Price')]

// Select by attribute
//button[@class='btn-primary']

// Select parent elements
//img[@alt='Product']/parent::div

// Complex conditions
//div[@class='product' and contains(@data-price, '100')]
```

## Data Extraction Options

### Basic Options

- **Text Content** ✅: Extract visible text from elements
- **HTML Content**: Extract raw HTML markup
- **Attributes** ✅: Extract element attributes (id, class, data-*, etc.)
- **Links** ✅: Extract href attributes from links within elements
- **Images** ✅: Extract image sources and metadata

### Advanced Options

- **Computed Styles**: Extract CSS styles as applied by the browser
- **Position & Size**: Extract element coordinates and dimensions
- **Include Children**: Extract data from child elements recursively

### Configuration

- **Max Depth**: Control how deep to extract nested child elements (1-10)

## Extraction Process

### Step-by-Step

1. **Select Elements** using any of the three methods
2. **Switch to Extract tab** (or it switches automatically)
3. **Configure extraction options** based on what data you need
4. **Click "Extract Data"** to process selected elements
5. **Review results** in the preview section

### What Gets Extracted

For each selected element, you'll get:
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "url": "https://example.com/page",
  "tagName": "div",
  "xpath": "//div[@class='product'][1]",
  "cssSelector": "div.product:nth-child(1)",
  "text": {
    "innerText": "Product Name",
    "textContent": "Product Name\n$99.99",
    "value": null
  },
  "attributes": {
    "class": "product featured",
    "data-id": "123",
    "_id": null,
    "_className": "product featured"
  },
  "links": [
    {
      "href": "https://example.com/product/123",
      "text": "View Details",
      "title": null,
      "target": "_blank"
    }
  ],
  "images": [
    {
      "src": "https://example.com/image.jpg",
      "alt": "Product Image",
      "width": 300,
      "height": 200
    }
  ]
}
```

## Export Options

### Formats

#### JSON Format
- **Best for**: Preserving data structure, programmatic use
- **Features**: Maintains nested objects, arrays, and data types
- **Use cases**: API integration, data analysis, backup

#### CSV Format
- **Best for**: Spreadsheet analysis, simple data viewing
- **Features**: Tabular format, easy to open in Excel/Google Sheets
- **Use cases**: Data analysis, reporting, sharing with non-technical users

### Export Settings

- **Include Metadata** ✅: Add extraction timestamp, URL, and options
- **Flatten Nested Data**: Convert nested objects to flat structure
- **Include Timestamp** ✅: Add extraction time to exported data

### Download Process

1. **Extract data** from selected elements
2. **Switch to Export tab**
3. **Choose format** (JSON or CSV)
4. **Configure export options**
5. **Preview the export** in the preview section
6. **Click Download** to save the file

## Common Use Cases

### 1. Product Information Extraction

**Scenario**: Extract product details from e-commerce sites

**Steps**:
1. Use CSS selector: `.product-card`
2. Enable: Text Content, Attributes, Links, Images
3. Export as CSV for spreadsheet analysis

### 2. Article Content Scraping

**Scenario**: Extract article titles and links from news sites

**Steps**:
1. Use CSS selector: `article h2 a`
2. Enable: Text Content, Attributes (for href)
3. Export as JSON for further processing

### 3. Contact Information Gathering

**Scenario**: Extract contact details from directory pages

**Steps**:
1. Use XPath: `//div[contains(@class, 'contact')]`
2. Enable: Text Content, Include Children
3. Set Max Depth to 2
4. Export as CSV

### 4. Social Media Post Analysis

**Scenario**: Extract post content and metadata

**Steps**:
1. Use Visual Picker to select individual posts
2. Enable: Text Content, Attributes, Links
3. Export as JSON for analysis

## Tips and Best Practices

### Selection Tips

- **Start specific**: Use IDs or unique classes when available
- **Test selectors**: Always use the "Test" button before adding
- **Wait for content**: Let dynamic content load before selecting
- **Use browser dev tools**: Inspect elements to find good selectors

### Extraction Tips

- **Choose relevant options**: Only extract data you actually need
- **Consider performance**: Large extractions may take time
- **Handle dynamic content**: Some sites load content after page load
- **Validate results**: Review extracted data before exporting

### Troubleshooting

#### No Elements Selected
- Check if selector syntax is correct
- Verify elements exist on the page
- Wait for dynamic content to load
- Try more general selectors

#### Missing Data
- Check if extraction options are enabled
- Verify elements contain expected content
- Try different extraction depth settings
- Check for dynamic content loading

#### Export Issues
- Ensure you have extracted data first
- Check browser download permissions
- Try different export formats
- Verify data is not empty

## Advanced Features

### Dynamic Content Handling

The extension automatically:
- Monitors page changes with MutationObserver
- Retries failed selections
- Validates selected elements
- Handles AJAX-loaded content

### Batch Processing

- Select multiple elements at once
- Extract data from all selected elements
- Export combined results
- Process large datasets efficiently

### Cross-Page Workflows

- Extension state persists across page navigation
- Background service manages data coordination
- Settings are saved automatically

## Keyboard Shortcuts

- **ESC**: Stop visual picker mode
- **Ctrl+Click**: (Future feature) Multi-select in visual picker

## Browser Developer Tools Integration

### Debugging Selectors
1. Open Developer Tools (F12)
2. Use Console to test selectors:
   ```javascript
   // Test CSS selector
   document.querySelectorAll('.your-selector')
   
   // Test XPath
   $x('//your/xpath/expression')
   ```

### Performance Monitoring
- Check Console for extension logs
- Monitor Network tab for dynamic content
- Use Elements tab to inspect selected elements

## Limitations

### Technical Limitations
- Cannot access cross-origin iframes
- Limited on browser internal pages
- Requires page content to be loaded
- Subject to browser security restrictions

### Performance Considerations
- Large extractions may be slow
- Complex selectors impact performance
- Deep nesting increases processing time
- Memory usage scales with data size

## Privacy and Security

### Data Handling
- All processing happens locally in your browser
- No data is sent to external servers
- Extracted data stays on your device
- Extension permissions are minimal and necessary

### Best Practices
- Only extract data you have permission to access
- Be mindful of website terms of service
- Don't extract sensitive personal information
- Review data before sharing or exporting
