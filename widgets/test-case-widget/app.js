// YouTrack Widget API
let host = null;
let projectId = null;

// Initialize the widget
async function init() {
    try {
        // Register with YouTrack
        host = await YTApp.register();
        
        if (!host) {
            showStatus('YouTrack API not available', 'error');
            return;
        }

        // Get current issue context using YTApp.entity
        // YTApp.entity contains the current entity (issue) context
        if (typeof YTApp !== 'undefined' && YTApp.entity && YTApp.entity.id) {
            try {
                const issue = await host.fetchYouTrack(`issues/${YTApp.entity.id}?fields=id,project(id)`);
                projectId = issue?.project?.id;
                console.log('Project ID loaded:', projectId);
            } catch (err) {
                console.error('Failed to fetch issue:', err);
                // Try alternative approach - get from URL
                tryGetProjectFromUrl();
            }
        } else {
            console.warn('YTApp.entity not available, trying alternative approach');
            // Try alternative approach
            tryGetProjectFromUrl();
        }

        // Setup event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Initialization error:', error);
        showStatus('Failed to initialize widget: ' + error.message, 'error');
    }
}

// Try to get project from URL as fallback
function tryGetProjectFromUrl() {
    try {
        if (typeof window !== 'undefined' && window.location) {
            const urlParts = window.location.pathname.split('/');
            const issueIdIndex = urlParts.findIndex(part => part === 'issue');
            
            if (issueIdIndex !== -1 && issueIdIndex + 1 < urlParts.length) {
                const issueId = urlParts[issueIdIndex + 1];
                console.log('Found issue ID from URL:', issueId);
                
                // Fetch issue details
                host.fetchYouTrack(`issues/${issueId}?fields=id,project(id)`)
                    .then(issue => {
                        projectId = issue?.project?.id;
                        console.log('Project ID loaded from URL:', projectId);
                    })
                    .catch(err => {
                        console.error('Failed to fetch issue from URL:', err);
                    });
            }
        }
    } catch (err) {
        console.error('Error in tryGetProjectFromUrl:', err);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Open modal button
    document.getElementById('open-generator-btn').addEventListener('click', openModal);
    
    // Close modal button
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') {
            closeModal();
        }
    });
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });

    // Test case count change
    document.getElementById('test-case-count').addEventListener('change', updateTestCaseForms);
    
    // Initialize with 1 test case form
    updateTestCaseForms();

    // Manual form button
    document.getElementById('create-manual-btn').addEventListener('click', handleManualSubmit);

    // AI form button
    document.getElementById('generate-ai-btn').addEventListener('click', handleAISubmit);
}

// Update test case forms based on count
function updateTestCaseForms() {
    const count = parseInt(document.getElementById('test-case-count').value) || 1;
    const container = document.getElementById('test-cases-container');
    const generalTitleContainer = document.getElementById('general-title-container');
    
    // Show/hide general title field
    if (count > 1) {
        generalTitleContainer.classList.remove('hidden');
    } else {
        generalTitleContainer.classList.add('hidden');
    }
    
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const formCard = document.createElement('div');
        formCard.className = 'test-case-form';
        formCard.innerHTML = `
            <h4>Test Case ${i + 1}</h4>
            <div class="form-group">
                <label for="test-title-${i}">Test Case Title:</label>
                <input type="text" id="test-title-${i}" class="test-title" required placeholder="Enter test case title">
            </div>

            <div class="form-group">
                <label for="test-description-${i}">Description:</label>
                <textarea id="test-description-${i}" class="test-description" rows="3" placeholder="Enter test case description"></textarea>
            </div>

            <div class="form-group">
                <label for="test-steps-${i}">Test Steps:</label>
                <textarea id="test-steps-${i}" class="test-steps" rows="4" placeholder="1. Step one&#10;2. Step two&#10;3. Step three"></textarea>
            </div>

            <div class="form-group">
                <label for="expected-result-${i}">Expected Result:</label>
                <textarea id="expected-result-${i}" class="test-expected" rows="2" placeholder="Enter expected result"></textarea>
            </div>
        `;
        container.appendChild(formCard);
    }
}

// Open modal
function openModal() {
    document.getElementById('modal-overlay').classList.remove('hidden');
    // Use host.enterModalMode if available
    if (host && typeof host.enterModalMode === 'function') {
        host.enterModalMode();
    }
}

// Close modal
function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    // Clear forms
    updateTestCaseForms();
    document.getElementById('ai-api-key').value = '';
    document.getElementById('feature-description').value = '';
    document.getElementById('generated-tests').classList.add('hidden');
    // Use host.exitModalMode if available
    if (host && typeof host.exitModalMode === 'function') {
        host.exitModalMode();
    }
}

// Switch tabs
function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
}

// Handle manual test case creation
async function handleManualSubmit() {
    const titles = document.querySelectorAll('.test-title');
    const descriptions = document.querySelectorAll('.test-description');
    const steps = document.querySelectorAll('.test-steps');
    const expectedResults = document.querySelectorAll('.test-expected');
    const generalTitle = document.getElementById('general-title').value.trim();
    
    // Collect all test cases
    const testCases = [];
    for (let i = 0; i < titles.length; i++) {
        const title = titles[i].value.trim();
        if (!title) continue; // Skip empty test cases
        
        testCases.push({
            title: title,
            description: descriptions[i].value,
            steps: steps[i].value,
            expectedResult: expectedResults[i].value
        });
    }
    
    if (testCases.length === 0) {
        showStatus('Please enter at least one test case', 'error');
        return;
    }

    // Validate general title for multiple test cases
    if (testCases.length > 1 && !generalTitle) {
        showStatus('Please enter a general title for multiple test cases', 'error');
        return;
    }

    try {
        showLoading(true);
        
        // Create one issue with all test cases
        const issueTitle = testCases.length === 1 
            ? testCases[0].title 
            : generalTitle;
        
        const fullDescription = formatMultipleTestCases(testCases);
        
        await createTestCase(issueTitle, fullDescription);
        showStatus(`Successfully created 1 issue with ${testCases.length} test case(s)`, 'success');
        
        // Clear forms
        document.getElementById('general-title').value = '';
        updateTestCaseForms();
    } catch (error) {
        showStatus('Failed to create test cases: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Format multiple test cases into one description
function formatMultipleTestCases(testCases) {
    let description = '';
    
    testCases.forEach((testCase, index) => {
        if (index > 0) {
            description += '\n\n---\n\n';
        }
        
        description += `## Test Case ${index + 1}: ${testCase.title}\n\n`;
        
        if (testCase.description) {
            description += `**Description:**\n${testCase.description}\n\n`;
        }
        
        if (testCase.steps) {
            description += `**Test Steps:**\n${testCase.steps}\n\n`;
        }
        
        if (testCase.expectedResult) {
            description += `**Expected Result:**\n${testCase.expectedResult}`;
        }
    });
    
    return description;
}

// Handle AI test case generation
async function handleAISubmit() {
    const apiKey = document.getElementById('ai-api-key').value.trim();
    const aiProvider = document.getElementById('ai-provider').value;
    
    if (!apiKey) {
        showStatus('Please enter your AI API key', 'error');
        return;
    }

    const featureDescription = document.getElementById('feature-description').value;
    
    if (!featureDescription) {
        showStatus('Please enter a feature description', 'error');
        return;
    }
    
    const testCount = parseInt(document.getElementById('test-count').value);

    try {
        showLoading(true);
        const testCases = await generateTestCases(featureDescription, testCount, apiKey, aiProvider);
        displayGeneratedTests(testCases);
        showStatus(`Generated ${testCases.length} test cases`, 'success');
    } catch (error) {
        showStatus('Failed to generate test cases: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Generate test cases using AI
async function generateTestCases(featureDescription, count, apiKey, aiProvider) {
    const prompt = `Generate ${count} detailed test cases for the following feature:

Feature: ${featureDescription}

For each test case, provide:
1. A clear title
2. Test description
3. Step-by-step test steps
4. Expected result

Format the response as a JSON array of objects with properties: title, description, steps (array), expectedResult`;

    let response;
    
    if (aiProvider === 'openai' || !aiProvider) {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'You are a QA expert that generates comprehensive test cases.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7
            })
        });
    } else if (aiProvider === 'anthropic') {
        response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 2000,
                messages: [
                    { role: 'user', content: prompt }
                ]
            })
        });
    }

    if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    let content;
    
    if (aiProvider === 'anthropic') {
        content = data.content[0].text;
    } else {
        content = data.choices[0].message.content;
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse AI response');
}

// Display generated test cases
function displayGeneratedTests(testCases) {
    const testList = document.getElementById('test-list');
    testList.innerHTML = '';

    testCases.forEach((testCase, index) => {
        const card = document.createElement('div');
        card.className = 'test-card';
        
        const steps = Array.isArray(testCase.steps) 
            ? testCase.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')
            : testCase.steps;

        card.innerHTML = `
            <h4>${testCase.title}</h4>
            <p><strong>Description:</strong> ${testCase.description}</p>
            <p><strong>Steps:</strong></p>
            <pre>${steps}</pre>
            <p><strong>Expected Result:</strong> ${testCase.expectedResult}</p>
            <div class="test-card-actions">
                <button class="btn btn-primary" onclick="createFromGenerated(${index})">Create Issue</button>
            </div>
        `;
        
        testList.appendChild(card);
    });

    document.getElementById('generated-tests').classList.remove('hidden');
}

// Create test case from generated data
async function createFromGenerated(index) {
    const testList = document.getElementById('test-list');
    const cards = testList.querySelectorAll('.test-card');
    const card = cards[index];
    
    const title = card.querySelector('h4').textContent;
    const description = card.querySelector('p:nth-of-type(1)').textContent.replace('Description: ', '');
    const steps = card.querySelector('pre').textContent;
    const expectedResult = card.querySelector('p:nth-of-type(3)').textContent.replace('Expected Result: ', '');

    const fullDescription = formatTestCase(description, steps, expectedResult);

    try {
        showLoading(true);
        await createTestCase(title, fullDescription);
        showStatus('Test case created successfully!', 'success');
        
        // Disable the button
        card.querySelector('button').disabled = true;
        card.querySelector('button').textContent = 'Created';
    } catch (error) {
        showStatus('Failed to create test case: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Make function available globally
if (typeof window !== 'undefined') {
    window.createFromGenerated = createFromGenerated;
}

// Format test case description
function formatTestCase(description, steps, expectedResult) {
    return `${description}

**Test Steps:**
${steps}

**Expected Result:**
${expectedResult}`;
}

// Create test case in YouTrack
async function createTestCase(title, description) {
    // If project ID is not available, try to get it again
    if (!projectId) {
        if (typeof YTApp !== 'undefined' && YTApp.entity && YTApp.entity.id) {
            try {
                const issue = await host.fetchYouTrack(`issues/${YTApp.entity.id}?fields=id,project(id)`);
                projectId = issue?.project?.id;
            } catch (err) {
                console.error('Failed to fetch project ID:', err);
            }
        }
    }
    
    if (!projectId) {
        throw new Error('Project ID not available. Please refresh the page and try again.');
    }

    const issueData = {
        project: { id: projectId },
        summary: title,
        description: description
    };

    try {
        // Use YouTrack API to create issue
        const response = await host.fetchYouTrack('issues', {
            method: 'POST',
            body: issueData
        });

        return response;
    } catch (error) {
        console.error('Create issue error:', error);
        // Provide more helpful error message
        if (error.status === 500) {
            throw new Error('Failed to create issue. Please check that all required fields are configured in your project.');
        }
        throw error;
    }
}

// Show/hide loading indicator
function showLoading(show) {
    document.getElementById('loading').classList.toggle('hidden', !show);
}

// Show status message
function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
    status.classList.remove('hidden');

    setTimeout(() => {
        status.classList.add('hidden');
    }, 5000);
}

// Initialize when DOM is ready
(async function() {
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            await init();
        }
    }
})();
