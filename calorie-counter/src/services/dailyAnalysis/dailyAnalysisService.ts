import { 
  DailyAnalysisRequest, 
  DailyAnalysisResponse, 
  DailyAnalysisConfig,
  TimeContext,
  NutritionalAnalysis,
  ActivityAnalysis,
  HealthInsights,
  MealRecommendations,
  UserProfile,
  DailyData
} from './types';
import { getRandomMockDailyAnalysis, getMockAnalysisByTime, simulateDailyAnalysisDelay } from './mockData';

class DailyAnalysisService {
  private config: DailyAnalysisConfig | null = null;
  private isMockMode: boolean = true; // Set to false when real API is implemented

  constructor() {
    console.log('DailyAnalysisService initialized');
    this.loadConfig();
  }

  // Load OpenAI configuration (placeholder for now)
  private loadConfig(): void {
    // TODO: Load from environment variables or secure storage
    this.config = {
      apiKey: 'YOUR_OPENAI_API_KEY_HERE', // Will be provided later
      model: 'gpt-4',
      maxTokens: 1500,
      temperature: 0.4
    };
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
  public async analyzeDailyProgress(request: DailyAnalysisRequest): Promise<DailyAnalysisResponse> {
    console.log('analyzeDailyProgress called with request:', request);
    console.log('isMockMode:', this.isMockMode);
    
    try {
      if (this.isMockMode || !this.config?.apiKey || this.config.apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
        console.log('Using mock analysis');
        return await this.mockAnalysis(request);
      }

      console.log('Using real analysis');
      return await this.realAnalysis(request);
    } catch (error) {
      console.error('Daily analysis error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Mock analysis for testing (current implementation)
  private async mockAnalysis(request: DailyAnalysisRequest): Promise<DailyAnalysisResponse> {
    console.log('Running mock analysis...');
    
    // Simulate analysis delay
    await simulateDailyAnalysisDelay();

    // Get time context from request
    const timeContext = this.getTimeContext(request.currentTime);
    console.log('Time context:', timeContext);
    
    // Try to get scenario based on time of day, otherwise random
    let mockData = getMockAnalysisByTime(timeContext.timeOfDay);
    if (!mockData) {
      console.log('No specific scenario found, using random data');
      mockData = getRandomMockDailyAnalysis();
    } else {
      console.log('Using scenario for time:', timeContext.timeOfDay);
    }

    // Customize the mock data based on actual user data
    const customizedData = this.customizeMockData(mockData, request);

    const result = {
      success: true,
      data: {
        ...customizedData,
        analysisTime: Math.round(2000 + Math.random() * 3000) // 2-5 seconds
      }
    };

    console.log('Mock analysis completed:', result);
    return result;
  }

  // Real OpenAI analysis (placeholder for future implementation)
  private async realAnalysis(request: DailyAnalysisRequest): Promise<DailyAnalysisResponse> {
    if (!this.config) {
      throw new Error('OpenAI configuration not found');
    }

    // TODO: Implement real OpenAI API call
    // This will include:
    // 1. Create comprehensive prompt with user data
    // 2. Send request to OpenAI API
    // 3. Parse response and extract structured data
    // 4. Return formatted response

    throw new Error('Real analysis not yet implemented. Please use mock mode for testing.');
  }

  // Helper function to determine time context
  private getTimeContext(currentTime: string): TimeContext {
    const hour = new Date(currentTime).getHours();
    const dayOfWeek = new Date(currentTime).getDay();
    
    let timeOfDay: TimeContext['timeOfDay'];
    let mealPeriod: TimeContext['mealPeriod'];
    let hoursUntilNextMeal: number;

    if (hour >= 5 && hour < 8) {
      timeOfDay = 'early_morning';
      mealPeriod = 'pre_breakfast';
      hoursUntilNextMeal = 1;
    } else if (hour >= 8 && hour < 11) {
      timeOfDay = 'morning';
      mealPeriod = 'breakfast';
      hoursUntilNextMeal = 3;
    } else if (hour >= 11 && hour < 14) {
      timeOfDay = 'midday';
      mealPeriod = 'pre_lunch';
      hoursUntilNextMeal = 1;
    } else if (hour >= 14 && hour < 17) {
      timeOfDay = 'afternoon';
      mealPeriod = 'lunch';
      hoursUntilNextMeal = 3;
    } else if (hour >= 17 && hour < 20) {
      timeOfDay = 'evening';
      mealPeriod = 'pre_dinner';
      hoursUntilNextMeal = 1;
    } else {
      timeOfDay = 'night';
      mealPeriod = 'post_dinner';
      hoursUntilNextMeal = 12;
    }

    return {
      timeOfDay,
      mealPeriod,
      hoursUntilNextMeal,
      isWorkoutDay: this.isWorkoutDay(dayOfWeek),
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6
    };
  }

  // Helper function to determine if it's a workout day
  private isWorkoutDay(dayOfWeek: number): boolean {
    // Simple logic - can be enhanced based on user preferences
    return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5; // Mon, Wed, Fri
  }

  // Customize mock data based on actual user data
  private customizeMockData(mockData: any, request: DailyAnalysisRequest): any {
    const { userProfile, dailyData } = request;
    
    // Customize based on user's actual data
    const customizedData = { ...mockData };
    
    // Update nutritional analysis with actual data
    if (dailyData.calories.consumed > 0) {
      customizedData.nutritionalAnalysis.totalCalories = dailyData.calories.consumed;
      customizedData.nutritionalAnalysis.totalProtein = this.calculateTotalProtein(dailyData.meals);
      customizedData.nutritionalAnalysis.totalCarbs = this.calculateTotalCarbs(dailyData.meals);
      customizedData.nutritionalAnalysis.totalFat = this.calculateTotalFat(dailyData.meals);
    }

    // Update activity analysis with actual data
    if (dailyData.steps.current > 0) {
      customizedData.activityAnalysis.stepsProgress = Math.min(100, (dailyData.steps.current / dailyData.steps.goal) * 100);
      customizedData.activityAnalysis.calorieBurn = dailyData.calories.burned;
    }

    // Customize recommendations based on user's goal
    if (userProfile.goal === 'decrease') {
      customizedData.mealRecommendations.foodAdditions.needed.push('More vegetables', 'Lean proteins');
      customizedData.mealRecommendations.foodAdditions.avoid.push('High-calorie snacks', 'Processed foods');
    } else if (userProfile.goal === 'increase') {
      customizedData.mealRecommendations.foodAdditions.needed.push('Healthy fats', 'Complex carbs', 'Protein-rich foods');
    }

    // Update personalized advice based on actual data
    customizedData.personalizedAdvice = this.generatePersonalizedAdvice(customizedData, request);

    return customizedData;
  }

  // Helper functions to calculate totals from meals
  private calculateTotalProtein(meals: DailyData['meals']): number {
    return Object.values(meals).flat().reduce((total, meal) => total + meal.protein, 0);
  }

  private calculateTotalCarbs(meals: DailyData['meals']): number {
    return Object.values(meals).flat().reduce((total, meal) => total + meal.carbs, 0);
  }

  private calculateTotalFat(meals: DailyData['meals']): number {
    return Object.values(meals).flat().reduce((total, meal) => total + meal.fat, 0);
  }

  // Generate personalized advice based on actual data
  private generatePersonalizedAdvice(mockData: any, request: DailyAnalysisRequest): string {
    const { userProfile, dailyData } = request;
    const { timeContext } = mockData;

    let advice = mockData.personalizedAdvice;

    // Add specific advice based on actual data
    if (dailyData.steps.current < dailyData.steps.goal * 0.5) {
      advice += ` You're currently at ${dailyData.steps.current} steps, which is below your goal of ${dailyData.steps.goal}. `;
    }

    if (dailyData.calories.consumed > dailyData.calories.goal) {
      advice += ` You've consumed ${dailyData.calories.consumed} calories, which exceeds your goal of ${dailyData.calories.goal}. `;
    }

    if (userProfile.goal === 'decrease' && dailyData.weight.change > 0) {
      advice += ` Your weight has increased by ${dailyData.weight.change.toFixed(1)}kg since yesterday. `;
    }

    return advice;
  }

  // Helper function to create OpenAI prompt (for future use)
  private createAnalysisPrompt(request: DailyAnalysisRequest): string {
    // TODO: Create comprehensive prompt for OpenAI
    // This will include user profile, daily data, time context, and specific questions
    return '';
  }

  // Helper function to parse OpenAI response (for future use)
  private parseOpenAIResponse(response: any): DailyAnalysisResponse {
    // TODO: Implement OpenAI response parsing
    // This will extract structured data from the AI response
    throw new Error('OpenAI response parsing not yet implemented');
  }

  // Get analysis history (for future implementation)
  public async getAnalysisHistory(): Promise<DailyAnalysisResponse[]> {
    // TODO: Implement analysis history storage and retrieval
    return [];
  }

  // Save analysis result (for future implementation)
  public async saveAnalysisResult(result: DailyAnalysisResponse): Promise<void> {
    // TODO: Implement saving analysis results to local storage or database
  }
}

// Export singleton instance
export const dailyAnalysisService = new DailyAnalysisService();
export default dailyAnalysisService;
