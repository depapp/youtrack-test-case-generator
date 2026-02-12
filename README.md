# YouTrack Test Case Generator Plugin

A YouTrack plugin that enables manual and AI-powered test case creation directly within your YouTrack issues.

## Features

- **Manual Test Case Creation**: Create test cases with structured fields for title, description, steps, and expected results
- **AI-Powered Generation**: Generate multiple test cases automatically using OpenAI or Anthropic AI
- **User API Key Configuration**: Users provide their own AI API keys for secure, personalized access
- **Seamless Integration**: Works directly within YouTrack's issue interface

## Installation

1. Package the plugin files into a ZIP archive:
   ```bash
   zip -r test-case-generator.zip manifest.json settings-schema.json index.html app.js styles.css icon.png icon.svg icon-dark.svg
   ```

2. Upload to YouTrack:
   - Go to YouTrack Settings → Apps
   - Click "Upload app"
   - Select the ZIP file
   - Enable the app

## Configuration

After installation, users need to configure their AI API key:

1. Navigate to any issue in your project
2. Find the "Test Case Generator" widget
3. Click the widget settings icon
4. Enter your API key:
   - **OpenAI**: Get your key from https://platform.openai.com/api-keys
   - **Anthropic**: Get your key from https://console.anthropic.com/

## Usage

### Manual Test Case Creation

1. Open the widget in any issue
2. Select the "Manual Creation" tab
3. Fill in:
   - Test Case Title
   - Description
   - Test Steps (numbered list)
   - Expected Result
4. Click "Create Test Case"

### AI-Powered Generation

1. Select the "AI Generation" tab
2. Describe the feature you want to test
3. Choose the number of test cases to generate (1-10)
4. Click "Generate Test Cases"
5. Review the generated test cases
6. Click "Create Issue" on any test case to add it to YouTrack

## File Structure

```
test-case-generator/
├── manifest.json           # Plugin configuration
├── settings-schema.json    # User settings schema
├── index.html             # Widget UI
├── app.js                 # Widget logic
├── styles.css             # Widget styling
├── icon.png               # Widget icon (light theme)
├── icon.svg               # Widget icon (vector)
├── icon-dark.svg          # Widget icon (dark theme)
└── README.md              # This file
```

## Requirements

- YouTrack Cloud 2022.2.0 or later
- API key from OpenAI or Anthropic (user-provided)

## Permissions

The plugin requires the following permissions:
- `ISSUE_READ`: Read issue information
- `ISSUE_CREATE`: Create new test case issues
- `ISSUE_UPDATE`: Update issue fields

## Development

To modify the plugin:

1. Edit the source files
2. Test locally using YouTrack's development mode
3. Repackage and upload to YouTrack

## Support

For issues or questions, contact: support@yourcompany.com

## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 [Your Name]
