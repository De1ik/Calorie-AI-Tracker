import OpenAI from 'openai';
import { DailyAnalysisRequest, UserProfile, DailyData } from '../dailyAnalysis/types';
import { database } from '../../database/database';
import { ENV, isOpenAIMode } from '../../config/environment';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatHistory {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatServiceConfig {
  apiKey?: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

class ChatService {
  private openai: OpenAI | null = null;
  private config: ChatServiceConfig;
  private isMockMode: boolean = true;

  constructor() {
    this.config = {
      model: 'gpt-4',
      maxTokens: 1000,
      temperature: 0.7
    };
    
    // Check MODE environment variable
    this.isMockMode = !isOpenAIMode();
    
    console.log('ChatService initialized with MODE:', ENV.MODE, 'isMockMode:', this.isMockMode);
    console.log('OpenAI API Key available:', !!ENV.OPENAI_API_KEY);
    console.log('API Key length:', ENV.OPENAI_API_KEY ? ENV.OPENAI_API_KEY.length : 0);
    
    // Set API key if available and in OpenAI mode
    if (!this.isMockMode && ENV.OPENAI_API_KEY) {
      console.log('Setting OpenAI API key...');
      this.setApiKey(ENV.OPENAI_API_KEY);
      console.log('OpenAI API key set successfully');
    } else {
      console.log('Not setting API key. isMockMode:', this.isMockMode, 'hasApiKey:', !!ENV.OPENAI_API_KEY);
    }
  }

  // Set API key for OpenAI
  public setApiKey(apiKey: string): void {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
    this.config.apiKey = apiKey;
    this.isMockMode = false;
  }

  // Enable/disable mock mode
  public setMockMode(enabled: boolean): void {
    this.isMockMode = enabled;
    console.log('Mock mode set to:', enabled);
  }

  // Force enable OpenAI mode (for testing)
  public forceOpenAIMode(): void {
    this.isMockMode = false;
    if (ENV.OPENAI_API_KEY) {
      this.setApiKey(ENV.OPENAI_API_KEY);
      console.log('Forced OpenAI mode enabled');
    } else {
      console.log('Cannot force OpenAI mode - no API key available');
    }
  }

  // Get daily user data for the current date
  private async getDailyUserData(): Promise<{ userProfile: UserProfile; dailyData: DailyData } | null> {
    try {
      const user = await database.getUser();
      if (!user) {
        console.log('No user found');
        return null;
      }

      const today = new Date().toISOString().split('T')[0];
      
      // Get today's meal entries
      const mealEntries = await database.getMealEntries(today);
      
      // Get today's steps
      const stepsEntries = await database.getStepsEntries(today, today);
      const todaySteps = stepsEntries.length > 0 ? stepsEntries[0].steps : 0;
      
      // Get latest weight entries
      const weightEntries = await database.getWeightEntries();
      const currentWeight = weightEntries.length > 0 ? weightEntries[0].weight : user.weight;
      const previousWeight = weightEntries.length > 1 ? weightEntries[1].weight : user.weight;
      
      // Calculate calories consumed
      const totalCalories = mealEntries.reduce((sum, meal) => sum + meal.calories, 0);
      
      // Calculate macros
      const totalProtein = mealEntries.reduce((sum, meal) => sum + meal.protein, 0);
      const totalCarbs = mealEntries.reduce((sum, meal) => sum + meal.carbs, 0);
      const totalFat = mealEntries.reduce((sum, meal) => sum + meal.fat, 0);
      
      // Organize meals by type
      const meals = {
        breakfast: mealEntries.filter(m => m.mealType === 'breakfast'),
        lunch: mealEntries.filter(m => m.mealType === 'lunch'),
        dinner: mealEntries.filter(m => m.mealType === 'dinner'),
        snacks: mealEntries.filter(m => m.mealType === 'snack'),
      };
      
      // Calculate calorie goals based on user profile
      const calorieGoal = this.calculateCalorieGoal(user);
      const stepsGoal = 10000; // Default steps goal
      const waterGoal = 2000; // Default water goal in ml
      
      const userProfile: UserProfile = {
        id: user.id,
        goal: user.goal,
        sportActivity: user.sportActivity,
        height: user.height,
        weight: currentWeight,
        gender: user.gender,
        activityLevel: this.mapSportActivityToLevel(user.sportActivity)
      };
      
      const dailyData: DailyData = {
        steps: {
          current: todaySteps,
          goal: stepsGoal,
          average: todaySteps // For now, use current as average
        },
        calories: {
          consumed: totalCalories,
          burned: this.estimateCaloriesBurned(userProfile, todaySteps),
          goal: calorieGoal,
          deficit: totalCalories - this.estimateCaloriesBurned(userProfile, todaySteps)
        },
        weight: {
          current: currentWeight,
          previous: previousWeight,
          change: currentWeight - previousWeight
        },
        meals,
        water: {
          consumed: 0, // Not tracked yet
          goal: waterGoal
        }
      };
      
      return { userProfile, dailyData };
    } catch (error) {
      console.error('Error getting daily user data:', error);
      return null;
    }
  }

  // Calculate calorie goal based on user profile
  private calculateCalorieGoal(user: any): number {
    // Basic BMR calculation (Mifflin-St Jeor Equation)
    let bmr: number;
    if (user.gender === 'male') {
      bmr = 10 * user.weight + 6.25 * user.height - 5 * 30 + 5; // Assuming age 30
    } else {
      bmr = 10 * user.weight + 6.25 * user.height - 5 * 30 - 161;
    }
    
    // Activity multiplier
    const activityMultiplier = this.getActivityMultiplier(user.sportActivity);
    
    // Goal adjustment
    let goalMultiplier = 1.0;
    if (user.goal === 'decrease') {
      goalMultiplier = 0.8; // 20% deficit
    } else if (user.goal === 'increase') {
      goalMultiplier = 1.2; // 20% surplus
    }
    
    return Math.round(bmr * activityMultiplier * goalMultiplier);
  }

  // Map sport activity to activity level
  private mapSportActivityToLevel(sportActivity: string): 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' {
    switch (sportActivity.toLowerCase()) {
      case 'none': return 'sedentary';
      case 'light': return 'light';
      case 'moderate': return 'moderate';
      case 'active': return 'active';
      default: return 'moderate';
    }
  }

  // Get activity multiplier for BMR calculation
  private getActivityMultiplier(sportActivity: string): number {
    switch (sportActivity.toLowerCase()) {
      case 'none': return 1.2;
      case 'light': return 1.375;
      case 'moderate': return 1.55;
      case 'active': return 1.725;
      default: return 1.55;
    }
  }

  // Estimate calories burned based on activity
  private estimateCaloriesBurned(userProfile: UserProfile, steps: number): number {
    // Rough estimation: 0.04 calories per step for average person
    const baseCalories = steps * 0.04;
    
    // Adjust based on weight
    const weightMultiplier = userProfile.weight / 70; // Normalize to 70kg
    
    return Math.round(baseCalories * weightMultiplier);
  }

  // Generate AI response using OpenAI or predefined responses
  public async generateResponse(userMessage: string): Promise<string> {
    try {
      console.log('generateResponse called with message:', userMessage);
      console.log('isMockMode:', this.isMockMode);
      console.log('openai instance:', !!this.openai);
      
      if (this.isMockMode) {
        console.log('Using predefined response (mock mode)');
        return this.generatePredefinedResponse(userMessage);
      }

      if (!this.openai) {
        console.log('OpenAI not initialized, falling back to predefined response');
        throw new Error('OpenAI API key not set');
      }

      console.log('Getting daily user data...');
      const dailyData = await this.getDailyUserData();
      if (!dailyData) {
        console.log('No daily data found, returning error message');
        return "I don't have access to your daily data. Please make sure you're logged in and have some data recorded.";
      }

      console.log('Daily data found, creating prompt...');
      const prompt = this.createPrompt(userMessage, dailyData.userProfile, dailyData.dailyData);
      console.log('Prompt created, sending to OpenAI...');
      
      const completion = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI nutrition assistant. Provide personalized advice based on the user\'s daily data including calories, meals, steps, and weight. Be encouraging, specific, and actionable.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });

      console.log('OpenAI response received');
      return completion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
    } catch (error) {
      console.error('Error generating AI response:', error);
      console.log('Falling back to predefined response');
      return this.generatePredefinedResponse(userMessage);
    }
  }

  // Create comprehensive prompt for OpenAI
  private createPrompt(userMessage: string, userProfile: UserProfile, dailyData: DailyData): string {
    const currentTime = new Date().toLocaleTimeString();
    const currentDate = new Date().toLocaleDateString();
    
    const mealsSummary = Object.entries(dailyData.meals)
      .map(([mealType, meals]) => {
        if (meals.length === 0) return `${mealType}: No meals recorded`;
        const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
        const foods = meals.map(meal => meal.foodName).join(', ');
        return `${mealType}: ${totalCalories} calories (${foods})`;
      })
      .join('\n');

    return `
Current Date: ${currentDate}
Current Time: ${currentTime}

User Profile:
- Goal: ${userProfile.goal} weight
- Gender: ${userProfile.gender}
- Height: ${userProfile.height}cm
- Weight: ${userProfile.weight}kg
- Activity Level: ${userProfile.sportActivity}

Today's Data:
- Steps: ${dailyData.steps.current}/${dailyData.steps.goal} (${Math.round((dailyData.steps.current/dailyData.steps.goal)*100)}% of goal)
- Calories Consumed: ${dailyData.calories.consumed}/${dailyData.calories.goal} (${Math.round((dailyData.calories.consumed/dailyData.calories.goal)*100)}% of goal)
- Calories Burned: ${dailyData.calories.burned}
- Calorie Deficit/Surplus: ${dailyData.calories.deficit > 0 ? '+' : ''}${dailyData.calories.deficit}
- Weight Change: ${dailyData.weight.change > 0 ? '+' : ''}${dailyData.weight.change.toFixed(1)}kg from yesterday
- Water: ${dailyData.water.consumed}/${dailyData.water.goal}ml

Today's Meals:
${mealsSummary}

User Question: "${userMessage}"

Please provide a personalized response based on this data. Consider:
1. The user's specific goal (${userProfile.goal} weight)
2. Their current progress today
3. The time of day and what they might need next
4. Whether they can afford certain foods based on their remaining calories
5. Encouragement and actionable advice

Keep your response concise but helpful (under 200 words).
    `.trim();
  }

  // Generate predefined responses for mock mode
  private generatePredefinedResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for donut question specifically
    if (lowerMessage.includes('donut') || lowerMessage.includes('doughnut')) {
      return "A typical donut has around 250-400 calories. Based on your daily goal, I'd recommend checking your remaining calories first. If you have room in your budget and it fits your goals, you could enjoy one as a treat! Consider pairing it with some protein or having it after a workout to help with blood sugar balance.";
    }
    
    if (lowerMessage.includes('calorie') || lowerMessage.includes('calories')) {
      return "I can help you track your calories! Based on your profile, your daily calorie goal is calculated to support your weight management goals. Focus on nutrient-dense foods like lean proteins, vegetables, and whole grains to make the most of your calorie budget.";
    }
    
    if (lowerMessage.includes('protein') || lowerMessage.includes('protein')) {
      return "Protein is essential for muscle maintenance and satiety. Aim for 0.8-1.2g of protein per kg of body weight daily. Great sources include chicken breast, fish, eggs, Greek yogurt, and legumes. Try to include protein in each meal for better blood sugar control.";
    }
    
    if (lowerMessage.includes('meal') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      return "For balanced meals, aim for a combination of protein, healthy carbs, and vegetables. Consider your current calorie intake and remaining budget for the day. If you're looking for meal suggestions, I can help based on your specific goals and preferences!";
    }
    
    if (lowerMessage.includes('weight') || lowerMessage.includes('lose') || lowerMessage.includes('gain')) {
      return "Weight management is about creating a sustainable calorie balance. For weight loss, aim for a moderate deficit. For weight gain, focus on a slight surplus with strength training. Consistency and patience are key - small changes add up over time!";
    }
    
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('steps')) {
      return "Regular physical activity is important for overall health! Aim for at least 10,000 steps daily and include both cardio and strength training. Even small activities like walking can make a big difference in your daily calorie burn and overall well-being.";
    }
    
    if (lowerMessage.includes('water') || lowerMessage.includes('hydrat')) {
      return "Staying hydrated is crucial for your health and can help with appetite control. Aim for at least 8 glasses (2 liters) of water daily. You can also get hydration from fruits, vegetables, and herbal teas.";
    }
    
    return "That's a great question! I'm here to help with your nutrition and fitness goals. Could you provide more details about what specific aspect you'd like to discuss? I can help with meal planning, calorie tracking, exercise recommendations, and more!";
  }

  // Save chat history
  public async saveChatHistory(messages: ChatMessage[]): Promise<void> {
    try {
      const userId = await database.getCurrentUserId();
      if (!userId) return;

      await database.saveChatHistory(userId, messages);
      console.log('Chat history saved for user:', userId);
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }

  // Load chat history
  public async loadChatHistory(): Promise<ChatMessage[]> {
    try {
      const userId = await database.getCurrentUserId();
      if (!userId) return [];

      const chatHistory = await database.getChatHistory(userId);
      if (!chatHistory) return [];

      // Parse the messages from JSON string
      const messages = JSON.parse(chatHistory.messages);
      
      // Convert timestamp strings back to Date objects
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }
}

// Export singleton instance
export const chatService = new ChatService();
export default chatService;
