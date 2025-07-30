# Test Cases for HTML Element Selector Extension

## Pre-Test Setup

1. **Install the extension** following INSTALLATION.md
2. **Open the test page** (`test.html`) in Chrome
3. **Verify extension icon** appears in toolbar
4. **Open extension popup** by clicking the icon

## Test Case 1: Visual Element Picker

### Objective
Test the visual element picker functionality

### Steps
1. Click "Visual Picker" button in the extension popup
2. Hover over different elements on the test page
3. Observe highlighting behavior
4. Click on a product card to select it
5. Press ESC to stop picker mode

### Expected Results
- ✅ Elements highlight with blue outline when hovering
- ✅ Tooltip shows element information
- ✅ Clicked elements get green outline (selected state)
- ✅ Selected count updates in popup
- ✅ ESC key stops picker mode

### Pass/Fail Criteria
- All highlighting works correctly
- Selection count is accurate
- Picker can be stopped with ESC

## Test Case 2: CSS Selector Input

### Objective
Test CSS selector functionality

### Steps
1. Click "CSS Selector" button
2. Enter `.product-card` in the input field
3. Click "Test" button
4. Observe highlighting on page
5. Click "Add" button
6. Check selected count

### Expected Results
- ✅ Input field appears with correct placeholder
- ✅ Test button highlights matching elements
- ✅ Add button adds elements to selection
- ✅ Selected count increases by 3 (for 3 product cards)

### Pass/Fail Criteria
- Selector input works correctly
- Test functionality highlights elements
- Add functionality updates selection

## Test Case 3: XPath Selector Input

### Objective
Test XPath selector functionality

### Steps
1. Click "XPath" button
2. Enter `//div[@class='article']` in the input field
3. Click "Test" button
4. Click "Add" button
5. Verify selection count

### Expected Results
- ✅ XPath input field appears
- ✅ Test highlights article elements
- ✅ Add button works correctly
- ✅ Selection count updates

### Pass/Fail Criteria
- XPath expressions are processed correctly
- Elements are selected and counted properly

## Test Case 4: Data Extraction

### Objective
Test data extraction functionality

### Steps
1. Select some elements using any method
2. Switch to "Extract" tab
3. Configure extraction options:
   - ✅ Text Content
   - ✅ Attributes
   - ✅ Links
4. Click "Extract Data" button
5. Review results

### Expected Results
- ✅ Extract tab shows extraction options
- ✅ Extraction process completes successfully
- ✅ Results show extracted data
- ✅ Data includes text, attributes, and links
- ✅ Automatically switches to Export tab

### Pass/Fail Criteria
- Extraction completes without errors
- Data structure is correct
- All requested data types are included

## Test Case 5: JSON Export

### Objective
Test JSON export functionality

### Steps
1. Extract data from selected elements
2. Go to "Export" tab
3. Click "JSON" format button
4. Review export preview
5. Click "Download" button

### Expected Results
- ✅ JSON format button activates
- ✅ Export preview shows valid JSON
- ✅ Download initiates successfully
- ✅ File is saved to Downloads folder

### Pass/Fail Criteria
- JSON export is valid and well-formatted
- Download works correctly
- File contains expected data

## Test Case 6: CSV Export

### Objective
Test CSV export functionality

### Steps
1. Extract data from selected elements
2. Click "CSV" format button
3. Enable "Flatten Nested Data" option
4. Review export preview
5. Click "Download" button

### Expected Results
- ✅ CSV format button activates
- ✅ Export preview shows CSV format
- ✅ Nested data is flattened correctly
- ✅ Download works

### Pass/Fail Criteria
- CSV format is correct
- Flattening works properly
- File can be opened in spreadsheet software

## Test Case 7: Dynamic Content Handling

### Objective
Test handling of dynamically loaded content

### Steps
1. Click "Load Dynamic Content" button on test page
2. Wait for content to load
3. Use visual picker to select dynamic elements
4. Extract data from dynamic elements

### Expected Results
- ✅ Extension detects new content
- ✅ Dynamic elements can be selected
- ✅ Data extraction works on dynamic content
- ✅ No errors in browser console

### Pass/Fail Criteria
- Dynamic content is handled correctly
- No JavaScript errors occur
- Selection and extraction work normally

## Test Case 8: Error Handling

### Objective
Test error handling and validation

### Steps
1. Enter invalid CSS selector: `..invalid..selector`
2. Click "Test" button
3. Try to extract data with no elements selected
4. Test on a restricted page (chrome://extensions/)

### Expected Results
- ✅ Invalid selector shows error message
- ✅ No extraction without selected elements
- ✅ Graceful handling of restricted pages
- ✅ User-friendly error messages

### Pass/Fail Criteria
- Errors are caught and displayed properly
- Extension doesn't crash on invalid input
- Error messages are helpful

## Test Case 9: Selection Management

### Objective
Test selection management features

### Steps
1. Select multiple elements using different methods
2. Check selection count accuracy
3. Click "Clear" button
4. Verify all selections are cleared

### Expected Results
- ✅ Selection count is accurate
- ✅ Clear button removes all selections
- ✅ Visual indicators are removed
- ✅ Count resets to 0

### Pass/Fail Criteria
- Selection tracking is accurate
- Clear functionality works completely

## Test Case 10: Cross-Tab Functionality

### Objective
Test extension behavior across browser tabs

### Steps
1. Select elements in first tab
2. Open new tab with different page
3. Use extension in new tab
4. Return to first tab
5. Check if selections persist

### Expected Results
- ✅ Extension works independently in each tab
- ✅ Selections are tab-specific
- ✅ No interference between tabs

### Pass/Fail Criteria
- Tab isolation works correctly
- No cross-tab contamination

## Performance Tests

### Large Page Test
1. Open a page with many elements (100+ elements)
2. Select multiple elements
3. Extract data
4. Monitor performance

**Expected**: Reasonable performance, no browser freezing

### Complex Selector Test
1. Use complex CSS selectors with multiple conditions
2. Test deeply nested XPath expressions
3. Verify accuracy and performance

**Expected**: Correct results within reasonable time

## Browser Console Checks

During all tests, monitor the browser console (F12) for:
- ❌ No JavaScript errors
- ❌ No extension-related warnings
- ✅ Appropriate debug messages
- ✅ Clean console output

## Accessibility Tests

1. **Keyboard Navigation**: Test tab navigation through popup
2. **Screen Reader**: Verify popup elements have proper labels
3. **High Contrast**: Test extension visibility in high contrast mode

## Security Tests

1. **XSS Prevention**: Test with malicious selectors
2. **Data Sanitization**: Verify extracted data is safe
3. **Permission Boundaries**: Test on restricted pages

## Regression Tests

After any code changes, re-run:
- Test Cases 1-3 (Core selection functionality)
- Test Case 4 (Data extraction)
- Test Cases 5-6 (Export functionality)

## Test Environment

- **Browser**: Chrome 88+
- **OS**: Windows/Mac/Linux
- **Test Page**: Included test.html file
- **Network**: Online (for placeholder images)

## Reporting Issues

When reporting test failures:
1. **Test Case Number**: Which test failed
2. **Steps to Reproduce**: Exact steps taken
3. **Expected vs Actual**: What should happen vs what happened
4. **Browser Console**: Any error messages
5. **Screenshots**: Visual evidence of issues
6. **Environment**: Browser version, OS, etc.

## Test Completion Checklist

- [ ] All 10 test cases pass
- [ ] No console errors during testing
- [ ] Performance is acceptable
- [ ] Export files are valid
- [ ] Error handling works correctly
- [ ] Documentation is accurate

## Automated Testing (Future)

Consider implementing:
- Unit tests for utility functions
- Integration tests for content scripts
- End-to-end tests with Puppeteer
- Performance benchmarks
