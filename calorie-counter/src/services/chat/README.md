# Chat Service

The Chat Service provides AI-powered nutrition assistance with two modes of operation:

## Modes

### Mode 0: OpenAI Integration
- Uses OpenAI GPT-4 to generate personalized responses
- Analyzes user's daily data (calories, meals, steps, weight)
- Provides contextual advice based on user's goals and current progress
- Requires OpenAI API key

### Mode 1: Predefined Responses (Default)
- Uses predefined responses for common questions
- No API key required
- Good for testing and development

## Environment Variables

Set the `MODE` environment variable to control the behavior:

```bash
# For OpenAI mode
MODE=0

# For predefined responses mode (default)
MODE=1
```

For OpenAI mode, also set your API key:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

The chat service automatically detects the mode and configures itself accordingly. It integrates with the user's daily data to provide personalized responses.

### Example Questions

- "Can I eat a donut today?" - Analyzes remaining calories and provides advice
- "What should I eat today?" - Suggests meals based on current progress
- "How many calories do I need?" - Calculates based on user profile and goals

## Features

- **Personalized Responses**: Uses user's daily data including calories, meals, steps, and weight
- **Chat History**: Saves and loads conversation history
- **Fallback Support**: Falls back to predefined responses if OpenAI fails
- **Context Awareness**: Considers time of day, user goals, and current progress

## Data Integration

The service automatically gathers:
- User profile (goal, weight, height, activity level)
- Today's meal entries and calories
- Steps progress
- Weight changes
- Calorie goals and remaining budget

This data is used to provide contextual and personalized nutrition advice.
