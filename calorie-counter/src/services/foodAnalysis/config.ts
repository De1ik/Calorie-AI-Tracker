// Environment variables are loaded via app.json and expo-constants
import Constants from 'expo-constants';

// Food Analysis Configuration
export const FOOD_ANALYSIS_CONFIG = {
  // OpenAI API Configuration
  OPENAI: {
    MODEL: 'gpt-4o', // Updated to current model (gpt-4-vision-preview is deprecated)
    MAX_TOKENS: 1000,
    TEMPERATURE: 0.3,
    // API Key will be set dynamically
    API_KEY: Constants.expoConfig?.extra?.openaiApiKey,
  },

  // Analysis Settings
  ANALYSIS: {
    // Mock mode for testing (set to false when real API is implemented)
    MOCK_MODE: true,
    
    // Analysis timeout in milliseconds
    TIMEOUT: 30000,
    
    // Confidence threshold for accepting results
    MIN_CONFIDENCE: 70,
    
    // Maximum retry attempts
    MAX_RETRIES: 3,
  },

  // Image Processing
  IMAGE: {
    // Maximum image size in MB
    MAX_SIZE_MB: 10,
    
    // Supported image formats
    SUPPORTED_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
    
    // Image quality for compression (0-1)
    COMPRESSION_QUALITY: 0.8,
    
    // Maximum dimensions for analysis
    MAX_WIDTH: 1024,
    MAX_HEIGHT: 1024,
  },

  // Food Categories
  CATEGORIES: [
    'Protein',
    'Carbs',
    'Fats',
    'Vegetables',
    'Fruits',
    'Dairy',
    'Grains',
    'Nuts',
    'Seeds',
    'Beverages',
    'Snacks',
    'Desserts',
    'Other',
  ],

  // Nutritional Ranges (for validation)
  NUTRITION_RANGES: {
    CALORIES: { min: 0, max: 2000 },
    PROTEIN: { min: 0, max: 200 },
    CARBS: { min: 0, max: 300 },
    FAT: { min: 0, max: 100 },
    FIBER: { min: 0, max: 50 },
    SUGAR: { min: 0, max: 100 },
    SODIUM: { min: 0, max: 5000 },
  },

  // Rating Scales
  RATING_SCALES: {
    OVERALL: { min: 1, max: 10 },
    HEALTHINESS: { min: 1, max: 10 },
    NUTRITION: { min: 1, max: 10 },
    FRESHNESS: { min: 1, max: 10 },
    PORTION_SIZE: { min: 1, max: 10 },
  },
};

// Environment-specific configurations
export const getConfig = () => {
  const isDevelopment = __DEV__;
  const demoValue = Constants.expoConfig?.extra?.demo;
  const isDemo = demoValue === '1';
  
  console.log('🔧 Food Analysis Config Debug:');
  console.log('  - Constants.expoConfig?.extra:', Constants.expoConfig?.extra);
  console.log('  - Demo value from config:', demoValue);
  console.log('  - Is demo mode (demo === "1"):', isDemo);
  console.log('  - Mock mode will be:', isDemo);
  console.log('  - API Key available:', !!Constants.expoConfig?.extra?.openaiApiKey);
  
  return {
    ...FOOD_ANALYSIS_CONFIG,
    ANALYSIS: {
      ...FOOD_ANALYSIS_CONFIG.ANALYSIS,
      MOCK_MODE: isDemo, // Use mock mode when DEMO=1
    },
  };
};
