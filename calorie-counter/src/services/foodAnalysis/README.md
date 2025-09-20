# Food Analysis Service

This service provides AI-powered food image analysis using OpenAI's GPT-4 Vision model. It analyzes food images and returns detailed nutritional information, health ratings, and insights.

## Features

- **Image Analysis**: Analyzes food photos to identify ingredients and nutritional content
- **Nutritional Data**: Provides detailed macronutrient and micronutrient information
- **Health Ratings**: Rates food on multiple dimensions (healthiness, nutrition, freshness, etc.)
- **Health Insights**: Provides benefits, concerns, and recommendations
- **Mock Mode**: Includes mock data for testing without API calls

## File Structure

```
src/services/foodAnalysis/
├── index.ts                 # Main exports
├── types.ts                 # TypeScript interfaces
├── foodAnalysisService.ts   # Main service class
├── mockData.ts             # Mock data for testing
├── config.ts               # Configuration settings
└── README.md               # This documentation
```

## Usage

### Basic Usage

```typescript
import { foodAnalysisService } from '../services/foodAnalysis';

// Analyze a food image
const result = await foodAnalysisService.analyzeFoodImage({
  imageUri: 'path/to/image.jpg'
});

if (result.success) {
  console.log('Food:', result.data.foodItem.name);
  console.log('Calories:', result.data.nutritionalInfo.calories);
  console.log('Rating:', result.data.rating.overall);
}
```

### Setting API Key

```typescript
// Set your OpenAI API key
foodAnalysisService.setApiKey('your-openai-api-key-here');

// Enable real analysis (disable mock mode)
foodAnalysisService.setMockMode(false);
```

### Using the Analysis Modal

```typescript
import FoodAnalysisModal from '../components/FoodAnalysisModal';

<FoodAnalysisModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  analysisResult={analysisResult}
  imageUri={imageUri}
  onAddToMeal={(foodData) => {
    // Handle adding to meal
  }}
  onSaveToDiary={(foodData) => {
    // Handle saving to diary
  }}
/>
```

## Configuration

### Environment Variables

Set these environment variables for production:

```bash
OPENAI_API_KEY=your-openai-api-key-here
```

### Configuration Options

Edit `config.ts` to customize:

- **Model**: OpenAI model to use (default: 'gpt-4-vision-preview')
- **Max Tokens**: Maximum response length
- **Temperature**: Response creativity (0-1)
- **Mock Mode**: Enable/disable mock data for testing
- **Image Limits**: Maximum image size and dimensions

## API Response Format

```typescript
interface FoodAnalysisResponse {
  success: boolean;
  data?: {
    foodItem: {
      name: string;
      category: string;
      description?: string;
      servingSize?: string;
    };
    nutritionalInfo: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      // ... additional nutrients
    };
    rating: {
      overall: number;
      healthiness: number;
      nutrition: number;
      freshness: number;
      portionSize: number;
    };
    healthInsights: {
      benefits: string[];
      concerns: string[];
      recommendations: string[];
      allergens?: string[];
    };
    confidence: number;
    analysisTime: number;
  };
  error?: string;
}
```

## Mock Data

The service includes comprehensive mock data for testing:

- **6 different food items** with realistic nutritional data
- **Varied ratings** across all dimensions
- **Detailed health insights** with benefits, concerns, and recommendations
- **Random variations** to simulate real analysis results

### Mock Foods Included

1. Grilled Chicken Breast
2. Mixed Green Salad
3. Avocado Toast
4. Grilled Salmon Fillet
5. Quinoa Bowl
6. Greek Yogurt with Berries

## Implementation Status

### ✅ Completed
- [x] TypeScript interfaces and types
- [x] Mock data generation
- [x] Service architecture
- [x] FoodAnalysisModal component
- [x] Integration with FoodScreen
- [x] Configuration management
- [x] Error handling

### 🔄 In Progress
- [ ] Real OpenAI API integration
- [ ] Image preprocessing
- [ ] Response parsing
- [ ] Caching and storage

### 📋 TODO
- [ ] Add API key management UI
- [ ] Implement analysis history
- [ ] Add offline mode
- [ ] Performance optimization
- [ ] Unit tests

## OpenAI API Integration

### Prerequisites

1. **OpenAI Account**: Sign up at https://platform.openai.com
2. **API Key**: Generate an API key from your dashboard
3. **Billing**: Ensure you have credits for API usage

### Implementation Steps

1. **Set API Key**: Call `foodAnalysisService.setApiKey('your-key')`
2. **Disable Mock Mode**: Call `foodAnalysisService.setMockMode(false)`
3. **Test**: Take a photo and verify real analysis works

### API Costs

- **GPT-4 Vision**: ~$0.01-0.02 per image analysis
- **Token Usage**: Varies by image complexity and response length
- **Rate Limits**: 10 requests per minute (free tier)

## Error Handling

The service includes comprehensive error handling:

- **Network Errors**: Retry logic with exponential backoff
- **API Errors**: Graceful fallback to mock data
- **Image Errors**: Validation and preprocessing
- **Timeout**: Configurable timeout with fallback

## Performance Considerations

- **Image Compression**: Images are compressed before analysis
- **Caching**: Results can be cached to avoid re-analysis
- **Async Processing**: Non-blocking analysis with loading states
- **Memory Management**: Proper cleanup of image data

## Security

- **API Key Storage**: Store securely (not in code)
- **Image Privacy**: Images are not stored permanently
- **Data Validation**: All inputs are validated and sanitized
- **Error Messages**: No sensitive data in error messages

## Testing

### Mock Mode Testing

```typescript
// Enable mock mode for testing
foodAnalysisService.setMockMode(true);

// Test with different images
const result = await foodAnalysisService.analyzeFoodImage({
  imageUri: 'any-image-uri'
});
```

### Real API Testing

```typescript
// Set real API key
foodAnalysisService.setApiKey('your-real-api-key');
foodAnalysisService.setMockMode(false);

// Test with real images
const result = await foodAnalysisService.analyzeFoodImage({
  imageUri: 'path/to/real/food/image.jpg'
});
```

## Troubleshooting

### Common Issues

1. **"Analysis Failed"**: Check API key and network connection
2. **"Image Too Large"**: Compress image or reduce dimensions
3. **"Low Confidence"**: Try clearer, well-lit food photos
4. **"Timeout Error"**: Check network speed and API status

### Debug Mode

Enable debug logging:

```typescript
// Add to your app initialization
if (__DEV__) {
  console.log('Food Analysis Service initialized');
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
