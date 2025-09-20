// Food Analysis Service Setup
// This file shows how to configure the service when you have your OpenAI API key

import { foodAnalysisService } from './foodAnalysisService';

/**
 * Setup the food analysis service with your OpenAI API key
 * Call this function when you have your API key ready
 */
export const setupFoodAnalysis = (apiKey: string) => {
  // Set the API key
  foodAnalysisService.setApiKey(apiKey);
  
  // Disable mock mode to use real OpenAI API
  foodAnalysisService.setMockMode(false);
  
  console.log('Food Analysis Service configured with OpenAI API');
};

/**
 * Reset to mock mode for testing
 */
export const resetToMockMode = () => {
  foodAnalysisService.setMockMode(true);
  console.log('Food Analysis Service reset to mock mode');
};

/**
 * Check if the service is configured with a real API key
 */
export const isConfigured = (): boolean => {
  // This would need to be implemented in the service
  // For now, we'll assume it's configured if not in mock mode
  return !foodAnalysisService['isMockMode'];
};

// Example usage:
// import { setupFoodAnalysis } from './setup';
// setupFoodAnalysis('your-openai-api-key-here');
