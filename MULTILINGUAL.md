# 多语言支持指南 / Multi-Language Support Guide

## 概述 / Overview

HTML元素选择器扩展现在支持多种语言，为全球用户提供本地化体验。

The HTML Element Selector extension now supports multiple languages, providing a localized experience for users worldwide.

## 支持的语言 / Supported Languages

### 🇺🇸 English (en)
- **Status**: Default language / 默认语言
- **Coverage**: Complete interface localization / 完整界面本地化
- **File**: `_locales/en/messages.json`

### 🇨🇳 中文简体 (zh_CN)
- **Status**: Fully supported / 完全支持
- **Coverage**: Complete interface localization / 完整界面本地化
- **File**: `_locales/zh_CN/messages.json`

## 语言切换 / Language Switching

### 自动检测 / Automatic Detection

扩展会自动检测您的浏览器语言设置：

The extension automatically detects your browser's language setting:

1. **Chrome设置 / Chrome Settings**: `chrome://settings/languages`
2. **系统语言 / System Language**: 跟随操作系统语言设置
3. **回退机制 / Fallback**: 如果不支持当前语言，将使用英文

### 手动切换 / Manual Switching

要更改扩展语言 / To change the extension language:

1. 打开Chrome设置 / Open Chrome Settings
2. 转到"高级" → "语言" / Go to "Advanced" → "Languages"
3. 添加或重新排序语言 / Add or reorder languages
4. 重启浏览器 / Restart browser
5. 扩展将使用新的语言设置 / Extension will use new language setting

## 本地化功能 / Localized Features

### 界面元素 / Interface Elements

所有界面元素都已本地化：

All interface elements are localized:

- ✅ 标签页标题 / Tab titles
- ✅ 按钮文本 / Button text
- ✅ 输入框占位符 / Input placeholders
- ✅ 选项标签 / Option labels
- ✅ 状态消息 / Status messages
- ✅ 错误提示 / Error messages
- ✅ 成功提示 / Success messages

### 数据导出 / Data Export

导出功能支持本地化：

Export functionality supports localization:

- **文件名 / Filenames**: 
  - English: `html-elements-2024-01-15.json`
  - 中文: `html元素-2024-01-15.json`
- **元数据 / Metadata**: 时间戳和标签使用本地格式
- **数字格式 / Number Format**: 遵循地区惯例

### 计数显示 / Count Display

元素计数显示适应不同语言：

Element count display adapts to different languages:

- **English**: "3 elements selected"
- **中文**: "3 个元素已选择"

## 测试多语言功能 / Testing Multi-Language Features

### 英文测试 / English Testing
1. 确保浏览器语言设置为英文 / Ensure browser language is set to English
2. 打开 `test.html` / Open `test.html`
3. 使用扩展功能 / Use extension features
4. 验证所有文本为英文 / Verify all text is in English

### 中文测试 / Chinese Testing
1. 将浏览器语言设置为中文 / Set browser language to Chinese
2. 打开 `test-i18n.html` / Open `test-i18n.html`
3. 使用扩展功能 / Use extension features
4. 验证所有文本为中文 / Verify all text is in Chinese

## 开发者指南 / Developer Guide

### 添加新语言 / Adding New Languages

要添加新语言支持：

To add support for a new language:

1. **创建语言目录 / Create Language Directory**
   ```
   _locales/[language_code]/
   ```

2. **复制消息文件 / Copy Message File**
   ```bash
   cp _locales/en/messages.json _locales/[language_code]/messages.json
   ```

3. **翻译消息 / Translate Messages**
   - 保持键名不变 / Keep keys unchanged
   - 翻译所有消息值 / Translate all message values
   - 保持占位符格式 / Maintain placeholder format

4. **测试新语言 / Test New Language**
   - 更改浏览器语言设置 / Change browser language setting
   - 重新加载扩展 / Reload extension
   - 验证翻译效果 / Verify translations

### 消息文件结构 / Message File Structure

```json
{
  "messageName": {
    "message": "Translated text",
    "description": "Description of the message"
  }
}
```

### 在代码中使用 / Using in Code

```javascript
// 获取本地化消息 / Get localized message
const message = i18n.getMessage('messageName');

// 更新元素文本 / Update element text
i18n.updateElementText('elementId', 'messageName');

// 获取状态消息 / Get status message
const status = i18n.getStatusMessage('ready');
```

## 常见问题 / FAQ

### Q: 为什么扩展没有显示我的语言？
### Q: Why isn't the extension showing my language?

A: 请检查：
A: Please check:

1. 浏览器语言设置是否正确 / Browser language setting is correct
2. 该语言是否受支持 / The language is supported
3. 是否需要重启浏览器 / Browser restart may be needed

### Q: 如何贡献翻译？
### Q: How can I contribute translations?

A: 您可以：
A: You can:

1. Fork项目仓库 / Fork the project repository
2. 添加新的语言文件 / Add new language files
3. 提交Pull Request / Submit a Pull Request
4. 或者提交Issue报告翻译问题 / Or submit an Issue for translation issues

### Q: 某些文本没有翻译怎么办？
### Q: What if some text is not translated?

A: 这可能是因为：
A: This might be because:

1. 该文本是动态生成的 / The text is dynamically generated
2. 翻译文件中缺少对应的键 / Missing key in translation file
3. 需要更新扩展版本 / Extension needs to be updated

## 技术实现 / Technical Implementation

### Chrome i18n API

扩展使用Chrome的国际化API：

The extension uses Chrome's internationalization API:

```javascript
// 获取消息 / Get message
chrome.i18n.getMessage('messageName')

// 获取当前语言 / Get current language
chrome.i18n.getUILanguage()

// 获取接受的语言 / Get accepted languages
chrome.i18n.getAcceptLanguages()
```

### 自动本地化 / Automatic Localization

HTML元素通过data属性自动本地化：

HTML elements are automatically localized via data attributes:

```html
<!-- 文本内容 / Text content -->
<span data-i18n="messageName">Default text</span>

<!-- 占位符 / Placeholder -->
<input data-i18n-placeholder="placeholderName" />

<!-- 标题 / Title -->
<button data-i18n-title="titleName">Button</button>
```

## 支持的地区代码 / Supported Locale Codes

| 语言 / Language | 代码 / Code | 状态 / Status |
|----------------|-------------|---------------|
| English | en | ✅ 完全支持 / Fully supported |
| 中文简体 / Chinese Simplified | zh_CN | ✅ 完全支持 / Fully supported |
| 中文繁体 / Chinese Traditional | zh_TW | 🔄 计划中 / Planned |
| 日本语 / Japanese | ja | 🔄 计划中 / Planned |
| 한국어 / Korean | ko | 🔄 计划中 / Planned |
| Français / French | fr | 🔄 计划中 / Planned |
| Deutsch / German | de | 🔄 计划中 / Planned |
| Español / Spanish | es | 🔄 计划中 / Planned |

## 贡献指南 / Contributing Guidelines

欢迎贡献翻译！请遵循以下指南：

Translation contributions are welcome! Please follow these guidelines:

1. **准确性 / Accuracy**: 确保翻译准确且符合上下文
2. **一致性 / Consistency**: 保持术语翻译的一致性
3. **简洁性 / Conciseness**: 保持界面文本简洁明了
4. **测试 / Testing**: 在提交前测试翻译效果

## 联系我们 / Contact Us

如有翻译问题或建议，请：

For translation issues or suggestions, please:

- 提交GitHub Issue / Submit a GitHub Issue
- 发送Pull Request / Send a Pull Request
- 联系项目维护者 / Contact project maintainers
