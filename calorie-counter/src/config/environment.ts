import Constants from 'expo-constants';

// Environment configuration
export const ENV = {
  // MODE: 0 = OpenAI mode, 1 = Predefined responses mode
  MODE: Constants.expoConfig?.extra?.demo || process.env.MODE || '1',
  
  // OpenAI configuration
  OPENAI_API_KEY: Constants.expoConfig?.extra?.openaiApiKey || process.env.OPENAI_API_KEY || '',
  
  // App configuration
  APP_NAME: 'Calorie AI Tracker',
  VERSION: '1.0.0',
};

export const isOpenAIMode = () => ENV.MODE === '0';
export const isPredefinedMode = () => ENV.MODE === '1';
