import { 
  FoodAnalysisRequest, 
  FoodAnalysisResponse, 
  OpenAIConfig,
  NutritionalInfo,
  FoodItem,
  FoodRating,
  HealthInsights
} from './types';
import { getRandomMockFood, simulateAnalysisDelay } from './mockData';
import { getConfig } from './config';
import * as FileSystem from 'expo-file-system/legacy';
import Constants from 'expo-constants';

class FoodAnalysisService {
  private config: OpenAIConfig | null = null;
  private isMockMode: boolean = true;

  constructor() {
    this.loadConfig();
  }

  // Load OpenAI configuration from environment
  private loadConfig(): void {
    const appConfig = getConfig();
    const apiKey = Constants.expoConfig?.extra?.openaiApiKey;
    
    this.isMockMode = appConfig.ANALYSIS.MOCK_MODE;
    
    console.log('🤖 Food Analysis Service Config:');
    console.log('  - Mock mode from config:', this.isMockMode);
    console.log('  - API Key available:', !!apiKey);
    console.log('  - Will use:', this.isMockMode ? 'MOCK ANALYSIS' : 'REAL OPENAI API');
    
    if (apiKey && !this.isMockMode) {
      // Validate API key format
      if (!apiKey.startsWith('sk-')) {
        console.error('  - Invalid API key format - should start with "sk-"');
        console.log('  - Falling back to mock mode due to invalid API key');
        this.isMockMode = true;
        return;
      }
      
      this.config = {
        apiKey: apiKey,
        model: appConfig.OPENAI.MODEL,
        maxTokens: appConfig.OPENAI.MAX_TOKENS,
        temperature: appConfig.OPENAI.TEMPERATURE
      };
      console.log('  - OpenAI config created successfully');
      console.log('  - API key format: Valid (starts with sk-)');
    } else if (this.isMockMode) {
      console.log('  - Using mock mode - no OpenAI config needed');
    } else {
      console.log('  - No API key available - will fallback to mock');
    }
  }

  // Set API key (to be called when user provides it)
  public setApiKey(apiKey: string): void {
    if (this.config) {
      this.config.apiKey = apiKey;
      this.isMockMode = false;
    }
  }

  // Enable/disable mock mode for testing
  public setMockMode(enabled: boolean): void {
    this.isMockMode = enabled;
  }

  // Main analysis function
  public async analyzeFoodImage(request: FoodAnalysisRequest): Promise<FoodAnalysisResponse> {
    try {
      console.log('🍎 Starting food image analysis...');
      console.log('  - Current mock mode:', this.isMockMode);
      console.log('  - Config available:', !!this.config);
      console.log('  - API key available:', !!this.config?.apiKey);
      
      if (this.isMockMode || !this.config?.apiKey) {
        console.log('📝 Using mock analysis (demo mode or no API key)');
        console.log('  - Reason: isMockMode =', this.isMockMode, ', config =', !!this.config, ', apiKey =', !!this.config?.apiKey);
        return await this.mockAnalysis(request);
      }

      console.log('🤖 Using real OpenAI API analysis');
      console.log('  - Model:', this.config.model);
      console.log('  - Max tokens:', this.config.maxTokens);
      return await this.realAnalysis(request);
    } catch (error) {
      console.error('❌ Food analysis error:', error);
      console.log('📝 Falling back to mock analysis due to error');
      return await this.mockAnalysis(request);
    }
  }

  // Mock analysis for testing (current implementation)
  private async mockAnalysis(request: FoodAnalysisRequest): Promise<FoodAnalysisResponse> {
    console.log('📝 MOCK ANALYSIS: Starting mock food analysis...');
    // Simulate analysis delay
    await simulateAnalysisDelay();

    // Get random mock data
    const mockData = getRandomMockFood();

    // Simulate some variation in the data
    const variation = 0.1; // 10% variation
    const nutritionalInfo: NutritionalInfo = {
      ...mockData.nutritionalInfo,
      calories: Math.round(mockData.nutritionalInfo.calories * (1 + (Math.random() - 0.5) * variation)),
      protein: Math.round(mockData.nutritionalInfo.protein * (1 + (Math.random() - 0.5) * variation) * 10) / 10,
      carbs: Math.round(mockData.nutritionalInfo.carbs * (1 + (Math.random() - 0.5) * variation) * 10) / 10,
      fat: Math.round(mockData.nutritionalInfo.fat * (1 + (Math.random() - 0.5) * variation) * 10) / 10,
    };

    return {
      success: true,
      data: {
        foodItem: {
          name: mockData.name,
          category: mockData.category,
          description: `Fresh ${mockData.name.toLowerCase()} with excellent nutritional value`,
          servingSize: "1 serving",
          servingWeight: Math.round(100 + Math.random() * 200) // 100-300g
        },
        nutritionalInfo,
        rating: mockData.rating,
        healthInsights: mockData.healthInsights,
        confidence: mockData.confidence,
        analysisTime: Math.round(1000 + Math.random() * 2000) // 1-3 seconds
      }
    };
  }

  // Real OpenAI analysis using GPT-4 Vision
  private async realAnalysis(request: FoodAnalysisRequest): Promise<FoodAnalysisResponse> {
    console.log('🤖 REAL ANALYSIS: Starting OpenAI API analysis...');
    
    if (!this.config) {
      throw new Error('OpenAI configuration not found');
    }

    try {
      console.log('🤖 Converting image to base64...');
      // Convert image to base64
      const base64Image = await this.imageToBase64(request.imageUri);
      
      // Create OpenAI API request
      const openAIRequest = {
        model: this.config.model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this food image and provide detailed nutritional information. Please respond with a JSON object containing:

1. foodItem: { name: string, category: string, description: string, servingSize: string, servingWeight: number }
2. nutritionalInfo: { calories: number, protein: number, carbs: number, fat: number, fiber?: number, sugar?: number, sodium?: number }
3. rating: { overall: number, healthiness: number, nutrition: number, freshness: number, portionSize: number } (all 1-10 scale)
4. healthInsights: { benefits: string[], concerns: string[], recommendations: string[] }
5. confidence: number (0-100 percentage)
6. analysisTime: number (milliseconds)

Categories should be one of: Protein, Carbs, Fats, Vegetables, Fruits, Dairy, Grains, Nuts, Seeds, Beverages, Snacks, Desserts, Other.

Please be as accurate as possible with nutritional estimates. If you cannot clearly identify the food, provide your best estimate with appropriate confidence level.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      };

      // Make API call to OpenAI
      console.log('🤖 Making API call to OpenAI...');
      console.log('🤖 Request URL:', 'https://api.openai.com/v1/chat/completions');
      console.log('🤖 Request Model:', openAIRequest.model);
      console.log('🤖 Request Headers:', {
        'Authorization': `Bearer ${this.config.apiKey.substring(0, 20)}...`,
        'Content-Type': 'application/json',
      });
      console.log('🤖 Request Body (without image):', {
        ...openAIRequest,
        messages: openAIRequest.messages.map(msg => ({
          ...msg,
          content: msg.content.map(c => c.type === 'image_url' ? { ...c, image_url: { url: '[BASE64_IMAGE_DATA]' } } : c)
        }))
      });
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(openAIRequest)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI API Error Response:', errorData);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorData}`);
      }

      const data = await response.json();
      console.log('OpenAI API Success Response:', JSON.stringify(data, null, 2));
      
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        console.error('No content in OpenAI response:', data);
        throw new Error('No content received from OpenAI API');
      }

      // Parse the JSON response
      const analysisResult = await this.parseOpenAIResponse(content);
      return analysisResult;

    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  // Helper function to convert image URI to base64
  private async imageToBase64(imageUri: string): Promise<string> {
    try {
      // Use the legacy FileSystem API to avoid deprecation warnings
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64
      });
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to convert image to base64');
    }
  }

  // Helper function to parse OpenAI response
  private async parseOpenAIResponse(content: string): Promise<FoodAnalysisResponse> {
    try {
      // Try to extract JSON from the response
      let jsonString = content.trim();
      
      // Remove markdown code blocks if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Parse the JSON
      const parsedData = JSON.parse(jsonString);
      
      // Validate and structure the response
      const foodItem: FoodItem = {
        name: parsedData.foodItem?.name || 'Unknown Food',
        category: parsedData.foodItem?.category || 'Other',
        description: parsedData.foodItem?.description || '',
        servingSize: parsedData.foodItem?.servingSize || '1 serving',
        servingWeight: parsedData.foodItem?.servingWeight || 100
      };
      
      const nutritionalInfo: NutritionalInfo = {
        calories: Math.round(parsedData.nutritionalInfo?.calories || 0),
        protein: Math.round((parsedData.nutritionalInfo?.protein || 0) * 10) / 10,
        carbs: Math.round((parsedData.nutritionalInfo?.carbs || 0) * 10) / 10,
        fat: Math.round((parsedData.nutritionalInfo?.fat || 0) * 10) / 10,
        fiber: parsedData.nutritionalInfo?.fiber ? Math.round((parsedData.nutritionalInfo.fiber) * 10) / 10 : undefined,
        sugar: parsedData.nutritionalInfo?.sugar ? Math.round((parsedData.nutritionalInfo.sugar) * 10) / 10 : undefined,
        sodium: parsedData.nutritionalInfo?.sodium ? Math.round(parsedData.nutritionalInfo.sodium) : undefined
      };
      
      const rating: FoodRating = {
        overall: Math.min(10, Math.max(1, Math.round(parsedData.rating?.overall || 5))),
        healthiness: Math.min(10, Math.max(1, Math.round(parsedData.rating?.healthiness || 5))),
        nutrition: Math.min(10, Math.max(1, Math.round(parsedData.rating?.nutrition || 5))),
        freshness: Math.min(10, Math.max(1, Math.round(parsedData.rating?.freshness || 5))),
        portionSize: Math.min(10, Math.max(1, Math.round(parsedData.rating?.portionSize || 5)))
      };
      
      const healthInsights: HealthInsights = {
        benefits: Array.isArray(parsedData.healthInsights?.benefits) ? parsedData.healthInsights.benefits : [],
        concerns: Array.isArray(parsedData.healthInsights?.concerns) ? parsedData.healthInsights.concerns : [],
        recommendations: Array.isArray(parsedData.healthInsights?.recommendations) ? parsedData.healthInsights.recommendations : []
      };
      
      return {
        success: true,
        data: {
          foodItem,
          nutritionalInfo,
          rating,
          healthInsights,
          confidence: Math.min(100, Math.max(0, Math.round(parsedData.confidence || 80))),
          analysisTime: Math.round(parsedData.analysisTime || 2000)
        }
      };
      
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Raw response:', content);
      
      // Fallback to mock data if parsing fails
      console.log('Falling back to mock analysis due to parsing error');
      return await this.mockAnalysis({ imageUri: '' });
    }
  }

  // Get analysis history (for future implementation)
  public async getAnalysisHistory(): Promise<FoodAnalysisResponse[]> {
    // TODO: Implement analysis history storage and retrieval
    return [];
  }

  // Save analysis result (for future implementation)
  public async saveAnalysisResult(result: FoodAnalysisResponse): Promise<void> {
    // TODO: Implement saving analysis results to local storage or database
  }
}

// Export singleton instance
export const foodAnalysisService = new FoodAnalysisService();
export default foodAnalysisService;
