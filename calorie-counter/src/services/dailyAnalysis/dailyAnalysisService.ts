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
import { getConfig } from './config';
import Constants from 'expo-constants';

class DailyAnalysisService {
  private config: DailyAnalysisConfig | null = null;
  private isMockMode: boolean = true; // Set to false when real API is implemented

  constructor() {
    console.log('DailyAnalysisService initialized');
    this.loadConfig();
  }

  // Load OpenAI configuration from environment
  private loadConfig(): void {
    const appConfig = getConfig();
    const apiKey = Constants.expoConfig?.extra?.openaiApiKey;
    
    this.isMockMode = appConfig.ANALYSIS.MOCK_MODE;
    
    console.log('🤖 Daily Analysis Service Config:');
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
  public async analyzeDailyProgress(request: DailyAnalysisRequest): Promise<DailyAnalysisResponse> {
    console.log('📊 Starting daily analysis...');
    console.log('  - Current mock mode:', this.isMockMode);
    console.log('  - Config available:', !!this.config);
    console.log('  - API key available:', !!this.config?.apiKey);
    console.log('  - Request data:', {
      date: request.date,
      currentTime: request.currentTime,
      userGoal: request.userProfile.goal,
      steps: request.dailyData.steps.current,
      calories: request.dailyData.calories.consumed,
      weight: request.dailyData.weight.current
    });
    
    try {
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
      console.error('❌ Daily analysis error:', error);
      console.log('📝 Falling back to mock analysis due to error');
      return await this.mockAnalysis(request);
    }
  }

  // Mock analysis for testing (current implementation)
  private async mockAnalysis(request: DailyAnalysisRequest): Promise<DailyAnalysisResponse> {
    console.log('📝 MOCK ANALYSIS: Starting mock daily analysis...');
    
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

  // Real OpenAI analysis using GPT-4o
  private async realAnalysis(request: DailyAnalysisRequest): Promise<DailyAnalysisResponse> {
    console.log('🤖 REAL ANALYSIS: Starting OpenAI API analysis...');
    
    if (!this.config) {
      throw new Error('OpenAI configuration not found');
    }

    try {
      // Create detailed prompt for daily analysis
      const prompt = this.createDailyAnalysisPrompt(request);
      
      // Create OpenAI API request
      const openAIRequest = {
        model: this.config.model,
        messages: [
          {
            role: "system",
            content: "You are a professional nutritionist and fitness coach. Analyze the user's daily data and provide comprehensive, personalized insights and recommendations. Always respond with valid JSON in the exact format specified."
          },
          {
            role: "user",
            content: prompt
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


  // Get analysis history (for future implementation)
  public async getAnalysisHistory(): Promise<DailyAnalysisResponse[]> {
    // TODO: Implement analysis history storage and retrieval
    return [];
  }

  // Save analysis result (for future implementation)
  public async saveAnalysisResult(result: DailyAnalysisResponse): Promise<void> {
    // TODO: Implement saving analysis results to local storage or database
  }

  // Helper function to create comprehensive prompt for daily analysis
  private createDailyAnalysisPrompt(request: DailyAnalysisRequest): string {
    const { userProfile, dailyData, currentTime, date } = request;
    const timeContext = this.getTimeContext(currentTime);
    
    return `Analyze this user's daily progress and provide comprehensive insights. Respond with a JSON object in this exact format:

{
  "timeContext": {
    "timeOfDay": "${timeContext.timeOfDay}",
    "mealPeriod": "${timeContext.mealPeriod}",
    "hoursUntilNextMeal": ${timeContext.hoursUntilNextMeal},
    "isWorkoutDay": ${timeContext.isWorkoutDay},
    "isWeekend": ${timeContext.isWeekend}
  },
  "nutritionalAnalysis": {
    "totalCalories": ${dailyData.calories.consumed},
    "totalProtein": ${this.calculateTotalProtein(dailyData.meals)},
    "totalCarbs": ${this.calculateTotalCarbs(dailyData.meals)},
    "totalFat": ${this.calculateTotalFat(dailyData.meals)},
    "totalFiber": 15,
    "macroBalance": {
      "proteinPercentage": 25,
      "carbsPercentage": 45,
      "fatPercentage": 30
    },
    "micronutrientScore": 8,
    "mealDistribution": {
      "breakfast": 30,
      "lunch": 40,
      "dinner": 25,
      "snacks": 5
    }
  },
  "activityAnalysis": {
    "stepsProgress": ${Math.round((dailyData.steps.current / dailyData.steps.goal) * 100)},
    "calorieBurn": ${dailyData.calories.burned},
    "activityLevel": "${dailyData.steps.current > 8000 ? 'moderate' : 'low'}",
    "movementScore": ${Math.min(10, Math.round(dailyData.steps.current / 1000))},
    "sedentaryTime": 6
  },
  "healthInsights": {
    "overallScore": 8,
    "strengths": ["Good protein intake", "Balanced meals", "Active lifestyle"],
    "areasForImprovement": ["Increase water intake", "More vegetables needed"],
    "recommendations": ["Add more fiber", "Stay hydrated"],
    "warnings": [],
    "encouragements": ["Great progress today!", "Keep up the good work!"]
  },
  "mealRecommendations": {
    "nextMeal": {
      "suggestion": "Grilled chicken with quinoa",
      "reasoning": "High protein, balanced carbs",
      "calories": 450,
      "category": "main"
    },
    "foodAdditions": [
      {
        "food": "Mixed vegetables",
        "reasoning": "Increase fiber and vitamins",
        "calories": 50,
        "category": "side"
      }
    ]
  },
  "personalizedAdvice": "Based on your current progress, focus on maintaining your protein intake and consider adding more vegetables to your next meal.",
  "confidence": 85,
  "analysisTime": 2500
}

User Data:
- Date: ${date}
- Current Time: ${currentTime}
- Goal: ${userProfile.goal}
- Activity Level: ${userProfile.activityLevel}
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Height: ${userProfile.height}cm
- Weight: ${dailyData.weight.current}kg
- Weight Change: ${dailyData.weight.change}kg
- Steps: ${dailyData.steps.current}/${dailyData.steps.goal}
- Calories Consumed: ${dailyData.calories.consumed}
- Calories Burned: ${dailyData.calories.burned}
- Calorie Goal: ${dailyData.calories.goal}
- Meals: ${Object.keys(dailyData.meals).length} meal types logged

Provide personalized, actionable advice based on the current time of day and user's progress.`;
  }

  // Helper function to parse OpenAI response
  private async parseOpenAIResponse(content: string): Promise<DailyAnalysisResponse> {
    try {
      let jsonString = content.trim();
      
      // Remove markdown code blocks if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const parsedData = JSON.parse(jsonString);
      
      // Validate and structure the response with defensive programming
      const response: DailyAnalysisResponse = {
        success: true,
        data: {
          timeContext: {
            timeOfDay: parsedData.timeContext?.timeOfDay || 'unknown',
            mealPeriod: parsedData.timeContext?.mealPeriod || 'unknown',
            hoursUntilNextMeal: parsedData.timeContext?.hoursUntilNextMeal || 0,
            isWorkoutDay: parsedData.timeContext?.isWorkoutDay || false,
            isWeekend: parsedData.timeContext?.isWeekend || false,
          },
          nutritionalAnalysis: parsedData.nutritionalAnalysis || {
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            totalFiber: 0,
            macroBalance: { proteinPercentage: 0, carbsPercentage: 0, fatPercentage: 0 },
            micronutrientScore: 5,
            mealDistribution: { breakfast: 0, lunch: 0, dinner: 0, snacks: 0 }
          },
          activityAnalysis: parsedData.activityAnalysis || {
            stepsProgress: 0,
            calorieBurn: 0,
            activityLevel: 'low',
            movementScore: 5,
            sedentaryTime: 8
          },
          healthInsights: parsedData.healthInsights || {
            overallScore: 5,
            strengths: ['Good effort today'],
            areasForImprovement: ['Keep working on your goals'],
            recommendations: ['Stay consistent'],
            warnings: [],
            encouragements: ['You\'re doing great!']
          },
          mealRecommendations: parsedData.mealRecommendations || {
            nextMeal: {
              type: 'balanced',
              reasoning: 'Maintain a balanced diet',
              suggestions: ['Include vegetables', 'Add protein']
            },
            foodAdditions: {
              needed: ['Vegetables', 'Protein'],
              avoid: ['Processed foods']
            },
            hydration: {
              status: 'needs_improvement',
              recommendation: 'Drink more water throughout the day'
            }
          },
          personalizedAdvice: parsedData.personalizedAdvice || "Keep up the good work and stay consistent with your health goals.",
          dailyGoal: parsedData.dailyGoal || "Maintain healthy eating habits and stay active",
          motivationMessage: parsedData.motivationMessage || "You're doing great! Keep up the excellent work!",
          confidence: parsedData.confidence || 85,
          analysisTime: parsedData.analysisTime || 2500
        }
      };
      
      console.log('✅ Successfully parsed OpenAI response');
      return response;
      
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Raw response:', content);
      console.log('Falling back to mock analysis due to parsing error');
      return await this.mockAnalysis({ 
        date: new Date().toISOString().split('T')[0],
        currentTime: new Date().toISOString(),
        userProfile: {
          id: 999,
          age: 30,
          gender: 'other',
          height: 170,
          weight: 70,
          goal: 'maintain',
          sportActivity: 'moderate',
          activityLevel: 'moderate'
        },
        dailyData: {
          steps: { current: 5000, goal: 10000, average: 8000 },
          calories: { consumed: 1500, burned: 200, goal: 2000, deficit: 1300 },
          weight: { current: 70, previous: 70, change: 0 },
          meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
          water: { consumed: 1000, goal: 2000 }
        }
      });
    }
  }
}

// Export singleton instance
export const dailyAnalysisService = new DailyAnalysisService();
export default dailyAnalysisService;
