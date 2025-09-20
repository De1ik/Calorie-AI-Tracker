// Food Analysis Types
export interface FoodAnalysisRequest {
  imageUri: string;
  imageBase64?: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
  sugar?: number; // in grams
  sodium?: number; // in mg
  cholesterol?: number; // in mg
  saturatedFat?: number; // in grams
  transFat?: number; // in grams
  potassium?: number; // in mg
  vitaminA?: number; // in IU
  vitaminC?: number; // in mg
  calcium?: number; // in mg
  iron?: number; // in mg
}

export interface FoodItem {
  name: string;
  category: string;
  description?: string;
  servingSize?: string;
  servingWeight?: number; // in grams
}

export interface FoodRating {
  overall: number; // 1-10 scale
  healthiness: number; // 1-10 scale
  nutrition: number; // 1-10 scale
  freshness: number; // 1-10 scale
  portionSize: number; // 1-10 scale
}

export interface HealthInsights {
  benefits: string[];
  concerns: string[];
  recommendations: string[];
  allergens?: string[];
  dietaryRestrictions?: string[];
}

export interface FoodAnalysisResponse {
  success: boolean;
  data?: {
    foodItem: FoodItem;
    nutritionalInfo: NutritionalInfo;
    rating: FoodRating;
    healthInsights: HealthInsights;
    confidence: number; // 0-100 percentage
    analysisTime: number; // in milliseconds
  };
  error?: string;
}

// OpenAI API Configuration
export interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

// Mock data for testing
export interface MockFoodData {
  name: string;
  category: string;
  nutritionalInfo: NutritionalInfo;
  rating: FoodRating;
  healthInsights: HealthInsights;
  confidence: number;
}
