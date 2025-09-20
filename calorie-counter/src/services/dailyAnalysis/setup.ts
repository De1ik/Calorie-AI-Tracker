// Daily Analysis Service Setup
// This file shows how to configure the service when you have your OpenAI API key

import { dailyAnalysisService } from './dailyAnalysisService';

/**
 * Setup the daily analysis service with your OpenAI API key
 * Call this function when you have your API key ready
 */
export const setupDailyAnalysis = (apiKey: string) => {
  // Set the API key
  dailyAnalysisService.setApiKey(apiKey);
  
  // Disable mock mode to use real OpenAI API
  dailyAnalysisService.setMockMode(false);
  
  console.log('Daily Analysis Service configured with OpenAI API');
};

/**
 * Reset to mock mode for testing
 */
export const resetToMockMode = () => {
  dailyAnalysisService.setMockMode(true);
  console.log('Daily Analysis Service reset to mock mode');
};

/**
 * Check if the service is configured with a real API key
 */
export const isConfigured = (): boolean => {
  // This would need to be implemented in the service
  // For now, we'll assume it's configured if not in mock mode
  return !dailyAnalysisService['isMockMode'];
};

// Example usage:
// import { setupDailyAnalysis } from './setup';
// setupDailyAnalysis('your-openai-api-key-here');
