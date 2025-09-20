// Environment variables are loaded via app.json and expo-constants
import Constants from 'expo-constants';

// Daily Analysis Configuration
export const DAILY_ANALYSIS_CONFIG = {
  // OpenAI API Configuration
  OPENAI: {
    MODEL: 'gpt-4o', // Updated to current model
    MAX_TOKENS: 1500,
    TEMPERATURE: 0.4,
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

  // Default Goals
  GOALS: {
    STEPS: 10000,
    WATER: 2000, // ml
    CALORIES: {
      DECREASE: 1500,
      MAINTAIN: 2000,
      INCREASE: 2500,
    },
  },

  // Activity Level Mapping
  ACTIVITY_LEVELS: {
    'none': 'sedentary',
    'light': 'light',
    'moderate': 'moderate',
    'high': 'active',
  },

  // Time Context Settings
  TIME_CONTEXT: {
    EARLY_MORNING: { start: 5, end: 8 },
    MORNING: { start: 8, end: 11 },
    MIDDAY: { start: 11, end: 14 },
    AFTERNOON: { start: 14, end: 17 },
    EVENING: { start: 17, end: 20 },
    NIGHT: { start: 20, end: 5 },
  },

  // Meal Periods
  MEAL_PERIODS: {
    PRE_BREAKFAST: { start: 5, end: 8 },
    BREAKFAST: { start: 8, end: 11 },
    PRE_LUNCH: { start: 11, end: 14 },
    LUNCH: { start: 14, end: 17 },
    PRE_DINNER: { start: 17, end: 20 },
    DINNER: { start: 20, end: 22 },
    POST_DINNER: { start: 22, end: 5 },
  },

  // Scoring Ranges
  SCORING: {
    OVERALL: { min: 1, max: 10 },
    NUTRITION: { min: 1, max: 10 },
    ACTIVITY: { min: 1, max: 10 },
    CONFIDENCE: { min: 0, max: 100 },
  },

  // Analysis Categories
  CATEGORIES: {
    STRENGTHS: 'strengths',
    IMPROVEMENTS: 'areasForImprovement',
    RECOMMENDATIONS: 'recommendations',
    WARNINGS: 'warnings',
    ENCOURAGEMENTS: 'encouragements',
  },

  // Mock Data Settings
  MOCK: {
    // Number of different scenarios
    SCENARIO_COUNT: 4,
    
    // Analysis delay range (ms)
    DELAY_RANGE: { min: 2000, max: 5000 },
    
    // Confidence range
    CONFIDENCE_RANGE: { min: 85, max: 98 },
  },
};

// Environment-specific configurations
export const getConfig = () => {
  const isDevelopment = __DEV__;
  const isDemo = Constants.expoConfig?.extra?.demo === '1';
  
  console.log('🔧 Daily Analysis Config Debug:');
  console.log('  - Constants.expoConfig?.extra:', Constants.expoConfig?.extra);
  console.log('  - Demo value from config:', Constants.expoConfig?.extra?.demo);
  console.log('  - Is demo mode (demo === "1"):', isDemo);
  console.log('  - Mock mode will be:', isDemo);
  console.log('  - API Key available:', !!Constants.expoConfig?.extra?.openaiApiKey);
  
  return {
    ...DAILY_ANALYSIS_CONFIG,
    ANALYSIS: {
      ...DAILY_ANALYSIS_CONFIG.ANALYSIS,
      MOCK_MODE: isDemo, // Use mock mode when DEMO=1
    },
  };
};
