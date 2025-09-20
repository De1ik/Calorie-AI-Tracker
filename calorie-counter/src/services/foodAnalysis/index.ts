// Food Analysis Service Exports
export { default as foodAnalysisService } from './foodAnalysisService';
export * from './types';
export * from './mockData';

// Re-export for convenience
export { 
  FoodAnalysisRequest,
  FoodAnalysisResponse,
  NutritionalInfo,
  FoodItem,
  FoodRating,
  HealthInsights,
  OpenAIConfig,
  MockFoodData
} from './types';
