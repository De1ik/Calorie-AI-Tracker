# OpenAI Integration Fix

## Problem
The chat was giving predefined responses instead of using ChatGPT with user data, even though the configuration was set to use OpenAI mode.

## Root Cause
The environment configuration was reading from `process.env` but the values were stored in `app.json` under `extra`. In React Native/Expo, we need to use `Constants.expoConfig.extra` to access these values.

## Solution Implemented

### 1. Fixed Environment Configuration
Updated `src/config/environment.ts` to properly read from `app.json`:
```typescript
import Constants from 'expo-constants';

export const ENV = {
  MODE: Constants.expoConfig?.extra?.demo || process.env.MODE || '1',
  OPENAI_API_KEY: Constants.expoConfig?.extra?.openaiApiKey || process.env.OPENAI_API_KEY || '',
};
```

### 2. Added Debugging
Enhanced the chat service with comprehensive logging to track:
- Configuration values
- API key availability
- Mode switching
- Response generation flow

### 3. Added Force OpenAI Mode
Created a method to manually enable OpenAI mode for testing:
```typescript
chatService.forceOpenAIMode();
```

### 4. Added Debug UI
Added a settings button in the chat header that shows:
- Current configuration
- API key status
- Option to force OpenAI mode

## How to Test

### Method 1: Use the Debug Button
1. Open the chat screen
2. Tap the settings icon (⚙️) in the header
3. Tap "Force OpenAI" to enable ChatGPT mode
4. Ask a question like "Can I eat a donut today?"

### Method 2: Check Console Logs
The app now logs detailed information:
```
ChatService initialized with MODE: 0 isMockMode: false
OpenAI API Key available: true
API Key length: 123
Setting OpenAI API key...
OpenAI API key set successfully
```

### Method 3: Verify Configuration
The chat header now shows the current mode:
- "OpenAI Mode • Ready to help" (when using ChatGPT)
- "Predefined Mode • Ready to help" (when using predefined responses)

## Expected Behavior

### With OpenAI Mode Enabled:
- Questions like "Can I eat a donut today?" will get personalized responses based on user data
- The AI will consider calories consumed, remaining budget, weight goals, etc.
- Responses will be contextual and specific to the user's situation

### Example Response:
> "Great question! Looking at your data, you've consumed 1,200 calories out of your 1,800 goal, leaving you 600 calories for the day. A typical donut has 250-400 calories, so you could fit one in! Since you're working on weight loss and have a 600-calorie deficit, a donut would still keep you in a healthy deficit..."

## Configuration in app.json
Your current configuration is correct:
```json
{
  "extra": {
    "openaiApiKey": "sk-proj-...",
    "demo": "0"
  }
}
```

- `"demo": "0"` = OpenAI mode
- `"demo": "1"` = Predefined responses mode

## Troubleshooting

If it's still not working:

1. **Check Console Logs**: Look for the initialization messages
2. **Use Force OpenAI**: Tap the settings button and force OpenAI mode
3. **Verify API Key**: Make sure the API key in `app.json` is valid
4. **Check Network**: Ensure the device has internet connection

The system should now properly use ChatGPT with your user data to provide personalized nutrition advice!
