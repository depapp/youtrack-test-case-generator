# YouTrack Test Case Generator Plugin

A YouTrack plugin that enables manual and AI-powered test case creation directly within your YouTrack issues.

## Features

- **Manual Test Case Creation**: Create one or multiple test cases in a single issue with structured fields
- **AI-Powered Generation**: Generate multiple test cases automatically using OpenAI or Anthropic AI
- **Automatic Issue Linking**: Created test cases are automatically linked to the original issue using "relates to" link type
- **Ring UI Integration**: Native YouTrack look and feel with Ring UI design language
- **User API Key Configuration**: Users provide their own AI API keys for secure, personalized access
- **Dark Theme Support**: Automatically adapts to YouTrack's theme
- **Seamless Integration**: Works directly within YouTrack's issue interface

## Installation

1. Package the plugin files into a ZIP archive:
   ```bash
   zip -r test-case-generator.zip manifest.json widgets/ icon.svg icon-dark.svg LICENSE README.md
   ```

2. Upload to YouTrack:
   - Go to YouTrack Settings → Apps
   - Click "Upload app"
   - Select the ZIP file
   - Enable the app

## Usage

### Manual Test Case Creation

1. Open any issue in your project
2. Find the "Create Test Case" button in the right panel
3. Click to open the Test Case Generator modal
4. Select the "Manual Creation" tab
5. Choose the number of test cases (1-10)
6. For multiple test cases, enter a general title
7. Fill in each test case:
   - Test Case Title
   - Description
   - Test Steps (numbered list)
   - Expected Result
8. Click "Create Test Cases"
9. The created issue will be automatically linked to the original issue

### AI-Powered Generation

1. Open the Test Case Generator modal
2. Select the "AI Generation" tab
3. Enter your AI API key (OpenAI or Anthropic)
4. Describe the feature you want to test
5. Choose the number of test cases to generate (1-10)
6. Click "Generate Test Cases"
7. Review the generated test cases
8. Click "Create Issue" on any test case to add it to YouTrack
9. Each created issue will be automatically linked to the original issue

## File Structure

```
test-case-generator/
├── manifest.json                      # Plugin configuration
├── widgets/
│   └── test-case-widget/
│       ├── index.html                 # Widget UI
│       ├── app.js                     # Widget logic
│       └── styles.css                 # Widget styling (Ring UI compatible)
├── icon.svg                           # Widget icon (light theme)
├── icon-dark.svg                      # Widget icon (dark theme)
├── LICENSE                            # MIT License
└── README.md                          # This file
```

## Requirements

- YouTrack Cloud 2022.2.0 or later
- API key from OpenAI or Anthropic (user-provided, for AI generation only)

## Permissions

The plugin requires the following permissions:
- `READ_ISSUE`: Read issue information
- `CREATE_ISSUE`: Create new test case issues
- `UPDATE_ISSUE`: Link test cases to original issues

## Design

The plugin follows JetBrains Ring UI design language for seamless integration with YouTrack's native interface:
- Ring UI color scheme and typography
- Consistent spacing and border radius
- Native-looking buttons and form controls
- Smooth transitions and hover states
- Dark theme support

## Development

To modify the plugin:

1. Edit the source files in the `widgets/test-case-widget/` directory
2. Test locally using YouTrack's development mode
3. Repackage and upload to YouTrack

## Support

For issues or questions, contact: depapanjiep@gmail.com

## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Depa Panjie Purnama
