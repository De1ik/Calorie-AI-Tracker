# Daily Analysis Service

This service provides AI-powered daily progress analysis using OpenAI's GPT-4 model. It analyzes your daily data (steps, calories, meals, weight) and provides personalized insights, recommendations, and meal suggestions based on the current time of day and your goals.

## Features

- **Comprehensive Analysis**: Analyzes steps, calories, meals, weight, and activity data
- **Time-Aware**: Considers current time of day and meal periods for contextual advice
- **Personalized Recommendations**: Tailored suggestions based on user goals and activity level
- **Meal Planning**: Suggests specific meals and food additions based on current progress
- **Health Insights**: Provides strengths, areas for improvement, and motivational messages
- **Mock Mode**: Includes realistic mock data for testing without API calls

## File Structure

```
src/services/dailyAnalysis/
├── index.ts                 # Main exports
├── types.ts                 # TypeScript interfaces
├── dailyAnalysisService.ts  # Main service class
├── mockData.ts             # Mock data for testing
├── config.ts               # Configuration settings
├── setup.ts                # Setup functions
└── README.md               # This documentation
```

## Usage

### Basic Usage

```typescript
import { dailyAnalysisService } from '../services/dailyAnalysis';

// Analyze daily progress
const result = await dailyAnalysisService.analyzeDailyProgress({
  date: '2024-01-15',
  currentTime: '2024-01-15T14:30:00Z',
  userProfile: {
    id: 1,
    goal: 'decrease',
    sportActivity: 'moderate',
    height: 175,
    weight: 70,
    gender: 'male',
    activityLevel: 'moderate'
  },
  dailyData: {
    steps: { current: 7500, goal: 10000, average: 8000 },
    calories: { consumed: 1200, burned: 300, goal: 1500, deficit: 900 },
    weight: { current: 70, previous: 70.2, change: -0.2 },
    meals: { breakfast: [...], lunch: [...], dinner: [...], snacks: [...] },
    water: { consumed: 1500, goal: 2000 }
  }
});

if (result.success) {
  console.log('Overall Score:', result.data.healthInsights.overallScore);
  console.log('Next Meal:', result.data.mealRecommendations.nextMeal.type);
  console.log('Advice:', result.data.personalizedAdvice);
}
```

### Setting API Key

```typescript
// Set your OpenAI API key
dailyAnalysisService.setApiKey('your-openai-api-key-here');

// Enable real analysis (disable mock mode)
dailyAnalysisService.setMockMode(false);
```

### Using the Analysis Modal

```typescript
import DailyAnalysisModal from '../components/DailyAnalysisModal';

<DailyAnalysisModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  analysisResult={analysisResult}
/>
```

## Analysis Components

### 1. Time Context
- **Time of Day**: early_morning, morning, midday, afternoon, evening, night
- **Meal Period**: pre_breakfast, breakfast, pre_lunch, lunch, pre_dinner, dinner, post_dinner
- **Hours Until Next Meal**: Calculated based on current time
- **Workout Day**: Determined by day of week
- **Weekend**: Boolean flag for weekend vs weekday

### 2. Nutritional Analysis
- **Macronutrients**: Total calories, protein, carbs, fat, fiber
- **Macro Balance**: Percentage breakdown of macronutrients
- **Micronutrient Score**: Overall nutritional quality (1-10)
- **Meal Distribution**: Percentage of calories from each meal type

### 3. Activity Analysis
- **Steps Progress**: Percentage of daily step goal achieved
- **Calorie Burn**: Estimated calories burned from activity
- **Activity Level**: low, moderate, high, very_high
- **Movement Score**: Overall activity quality (1-10)
- **Sedentary Time**: Hours spent inactive

### 4. Health Insights
- **Overall Score**: Comprehensive health score (1-10)
- **Strengths**: Positive aspects of the day
- **Areas for Improvement**: Areas needing attention
- **Recommendations**: Specific actionable advice
- **Warnings**: Important health concerns
- **Encouragements**: Motivational messages

### 5. Meal Recommendations
- **Next Meal**: Suggested meal type and specific options
- **Food Additions**: Foods to add or avoid
- **Hydration**: Water intake status and recommendations
- **Reasoning**: Explanation for each recommendation

## Mock Data

The service includes comprehensive mock data for testing:

- **4 different time scenarios** (morning, midday, evening, night)
- **Realistic nutritional data** with proper macro balances
- **Varied activity levels** and step counts
- **Contextual meal recommendations** based on time of day
- **Personalized advice** tailored to different scenarios

### Mock Scenarios

1. **Morning Scenario**: Good start to the day with balanced breakfast
2. **Midday Scenario**: Need more activity, behind on steps
3. **Evening Scenario**: Excellent day overall, approaching dinner
4. **Night Scenario**: End of day review with planning for tomorrow

## Configuration

### Environment Variables

Set these environment variables for production:

```bash
OPENAI_API_KEY=your-openai-api-key-here
```

### Configuration Options

Edit `config.ts` to customize:

- **Model**: OpenAI model to use (default: 'gpt-4')
- **Max Tokens**: Maximum response length
- **Temperature**: Response creativity (0-1)
- **Mock Mode**: Enable/disable mock data for testing
- **Goals**: Default step, calorie, and water goals
- **Time Context**: Time ranges for different periods

## API Response Format

```typescript
interface DailyAnalysisResponse {
  success: boolean;
  data?: {
    timeContext: {
      timeOfDay: string;
      mealPeriod: string;
      hoursUntilNextMeal: number;
      isWorkoutDay: boolean;
      isWeekend: boolean;
    };
    nutritionalAnalysis: {
      totalCalories: number;
      totalProtein: number;
      totalCarbs: number;
      totalFat: number;
      macroBalance: { proteinPercentage: number; carbsPercentage: number; fatPercentage: number };
      micronutrientScore: number;
      mealDistribution: { breakfast: number; lunch: number; dinner: number; snacks: number };
    };
    activityAnalysis: {
      stepsProgress: number;
      calorieBurn: number;
      activityLevel: string;
      movementScore: number;
      sedentaryTime: number;
    };
    healthInsights: {
      overallScore: number;
      strengths: string[];
      areasForImprovement: string[];
      recommendations: string[];
      warnings: string[];
      encouragements: string[];
    };
    mealRecommendations: {
      nextMeal: { type: string; suggestions: MealSuggestion[]; reasoning: string };
      foodAdditions: { needed: string[]; avoid: string[]; reasoning: string };
      hydration: { status: string; recommendation: string };
    };
    personalizedAdvice: string;
    dailyGoal: string;
    motivationMessage: string;
    confidence: number;
    analysisTime: number;
  };
  error?: string;
}
```

## Implementation Status

### ✅ Completed
- [x] TypeScript interfaces and types
- [x] Mock data generation with 4 scenarios
- [x] Service architecture with OpenAI template
- [x] DailyAnalysisModal component
- [x] Integration with ProgressScreen
- [x] Configuration management
- [x] Error handling
- [x] Time context analysis
- [x] Nutritional and activity analysis

### 🔄 In Progress
- [ ] Real OpenAI API integration
- [ ] Advanced prompt engineering
- [ ] Response parsing and validation

### 📋 TODO
- [ ] Add API key management UI
- [ ] Implement analysis history
- [ ] Add offline mode
- [ ] Performance optimization
- [ ] Unit tests
- [ ] Water intake tracking
- [ ] Sleep data integration

## OpenAI API Integration

### Prerequisites

1. **OpenAI Account**: Sign up at https://platform.openai.com
2. **API Key**: Generate an API key from your dashboard
3. **Billing**: Ensure you have credits for API usage

### Implementation Steps

1. **Set API Key**: Call `dailyAnalysisService.setApiKey('your-key')`
2. **Disable Mock Mode**: Call `dailyAnalysisService.setMockMode(false)`
3. **Test**: Click "Daily Analysis" button and verify real analysis works

### API Costs

- **GPT-4**: ~$0.03-0.06 per analysis
- **Token Usage**: Varies by data complexity and response length
- **Rate Limits**: 10 requests per minute (free tier)

## Error Handling

The service includes comprehensive error handling:

- **Network Errors**: Retry logic with exponential backoff
- **API Errors**: Graceful fallback to mock data
- **Data Validation**: Input validation and sanitization
- **Timeout**: Configurable timeout with fallback

## Performance Considerations

- **Data Aggregation**: Efficient calculation of daily stats
- **Caching**: Results can be cached to avoid re-analysis
- **Async Processing**: Non-blocking analysis with loading states
- **Memory Management**: Proper cleanup of analysis data

## Security

- **API Key Storage**: Store securely (not in code)
- **Data Privacy**: User data is not stored permanently
- **Data Validation**: All inputs are validated and sanitized
- **Error Messages**: No sensitive data in error messages

## Testing

### Mock Mode Testing

```typescript
// Enable mock mode for testing
dailyAnalysisService.setMockMode(true);

// Test with different times
const result = await dailyAnalysisService.analyzeDailyProgress({
  date: '2024-01-15',
  currentTime: '2024-01-15T14:30:00Z', // Midday
  userProfile: mockUserProfile,
  dailyData: mockDailyData
});
```

### Real API Testing

```typescript
// Set real API key
dailyAnalysisService.setApiKey('your-real-api-key');
dailyAnalysisService.setMockMode(false);

// Test with real data
const result = await dailyAnalysisService.analyzeDailyProgress(realAnalysisRequest);
```

## Troubleshooting

### Common Issues

1. **"Analysis Failed"**: Check API key and network connection
2. **"User profile not found"**: Complete onboarding first
3. **"Low Confidence"**: Ensure sufficient data is available
4. **"Timeout Error"**: Check network speed and API status

### Debug Mode

Enable debug logging:

```typescript
// Add to your app initialization
if (__DEV__) {
  console.log('Daily Analysis Service initialized');
}
```

## Contributing

When adding new features:

1. Update TypeScript interfaces in `types.ts`
2. Add mock data in `mockData.ts`
3. Update configuration in `config.ts`
4. Add tests for new functionality
5. Update this README

## License

This service is part of the Calorie Tracker app and follows the same license terms.
