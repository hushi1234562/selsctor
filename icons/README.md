# Extension Icons

This directory should contain the extension icons in PNG format:

- `icon16.png` - 16x16 pixels (toolbar icon)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Creating Icons

You can create icons using any image editor. The icons should:

1. **Be in PNG format** with transparency support
2. **Use the extension's color scheme** (blue #007cba as primary color)
3. **Be simple and recognizable** at small sizes
4. **Include a visual element** that represents element selection (like a target or selector symbol)

## Suggested Design

- Background: Transparent or white
- Primary color: #007cba (blue)
- Symbol: Target/crosshair icon or CSS selector symbol
- Style: Modern, flat design

## Temporary Solution

For development purposes, you can use placeholder icons or create simple colored squares:

1. Create a 128x128 blue square and save as `icon128.png`
2. Resize to 48x48 and save as `icon48.png`
3. Resize to 16x16 and save as `icon16.png`

## Online Icon Generators

You can use online tools to create icons:
- [Favicon.io](https://favicon.io/)
- [IconGenerator](https://www.icongenerator.net/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

## Icon Requirements

- **16x16**: Used in the browser toolbar
- **48x48**: Used in the extension management page
- **128x128**: Used in the Chrome Web Store and extension details

All icons should be visually consistent and represent the extension's purpose of selecting HTML elements.
