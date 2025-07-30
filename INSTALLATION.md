# Installation Guide - HTML Element Selector Extension

## Prerequisites

- Google Chrome browser (version 88 or later)
- Developer mode enabled in Chrome Extensions

## Installation Steps

### Method 1: Load Unpacked Extension (Development)

1. **Download the Extension**
   - Clone or download this repository to your local machine
   - Extract the files if downloaded as a ZIP

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or go to Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner
   - This will reveal additional options

4. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to the folder containing the extension files
   - Select the folder and click "Select Folder"

5. **Verify Installation**
   - The extension should appear in your extensions list
   - You should see the HTML Element Selector icon in your browser toolbar
   - If the icon is not visible, click the puzzle piece icon and pin the extension

### Method 2: Chrome Web Store (Future)

*This extension is not yet published to the Chrome Web Store. Use Method 1 for now.*

## Post-Installation Setup

### Permissions

The extension requires the following permissions:
- **Active Tab**: To interact with the current webpage
- **Storage**: To save your preferences and extraction rules
- **Downloads**: To export extracted data as files
- **Host Permissions**: To work on all websites

### First Use

1. **Navigate to a webpage** you want to extract data from
2. **Click the extension icon** in the toolbar
3. **Choose a selection method**:
   - Visual Picker: Click elements directly on the page
   - CSS Selector: Enter CSS selector expressions
   - XPath: Enter XPath expressions

## Troubleshooting

### Extension Not Working

**Problem**: Extension icon is grayed out or not responding
**Solution**: 
- Refresh the webpage
- Check if the page is a restricted page (chrome://, extension pages, etc.)
- Reload the extension from chrome://extensions/

**Problem**: "Extension context invalidated" error
**Solution**:
- The extension was reloaded/updated
- Refresh the webpage and try again

### Selection Issues

**Problem**: Visual picker not highlighting elements
**Solution**:
- Make sure you clicked the Visual Picker button
- Try refreshing the page
- Check browser console for errors (F12 → Console)

**Problem**: CSS selector not finding elements
**Solution**:
- Verify the selector syntax is correct
- Use the "Test" button to validate selectors
- Wait for dynamic content to load
- Try more specific selectors

### Data Extraction Issues

**Problem**: Extracted data is empty or incomplete
**Solution**:
- Wait for page content to fully load
- Check if elements contain the expected data
- Try different extraction options
- For dynamic content, wait a few seconds before extracting

### Export Issues

**Problem**: Download not starting
**Solution**:
- Check if downloads are blocked in browser settings
- Ensure the extension has download permissions
- Try a different export format

## Browser Compatibility

### Supported Browsers
- ✅ Google Chrome (88+)
- ✅ Microsoft Edge (88+)
- ✅ Chromium-based browsers

### Unsupported Browsers
- ❌ Firefox (uses different extension API)
- ❌ Safari (uses different extension API)
- ❌ Internet Explorer (deprecated)

## Security Considerations

### Safe Usage
- Only use on trusted websites
- Be cautious when extracting sensitive data
- Review extracted data before exporting

### Permissions Explanation
- **Active Tab**: Required to interact with webpage content
- **Storage**: Saves your preferences locally (not shared)
- **Downloads**: Enables file export functionality
- **All URLs**: Allows the extension to work on any website

## Performance Tips

### For Large Pages
- Select specific elements rather than entire page
- Limit extraction depth for nested content
- Use specific CSS selectors instead of broad ones

### For Dynamic Content
- Wait for content to load before selecting
- Use the retry functionality for AJAX-loaded content
- Consider using XPath for complex dynamic selectors

## Getting Help

### Common Resources
- Check the browser console (F12) for error messages
- Review the extension popup for status messages
- Ensure you're using supported selector syntax

### Reporting Issues
If you encounter problems:
1. Note the website URL where the issue occurs
2. Describe the steps you took
3. Include any error messages
4. Check browser console for additional details

## Updates

### Automatic Updates
- Extension updates are handled automatically when installed from Chrome Web Store
- For unpacked extensions, manually update by reloading from chrome://extensions/

### Manual Updates
1. Download the latest version
2. Replace the old extension files
3. Go to chrome://extensions/
4. Click the reload button for the extension

## Uninstallation

### Remove Extension
1. Go to `chrome://extensions/`
2. Find "HTML Element Selector"
3. Click "Remove"
4. Confirm removal

### Clean Up
- Extension data is automatically removed
- Downloaded files remain in your Downloads folder
- No additional cleanup required
