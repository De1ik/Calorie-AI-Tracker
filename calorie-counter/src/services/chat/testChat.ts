// Test the chat service with mock user data
import { chatService } from './chatService';

// Mock the database to return test data
const mockUserData = {
  userProfile: {
    id: 1,
    goal: 'decrease' as const,
    sportActivity: 'moderate',
    height: 170,
    weight: 75,
    gender: 'male' as const,
    activityLevel: 'moderate' as const
  },
  dailyData: {
    steps: {
      current: 6500,
      goal: 10000,
      average: 7000
    },
    calories: {
      consumed: 1200,
      burned: 400,
      goal: 1800,
      deficit: 800
    },
    weight: {
      current: 75,
      previous: 75.2,
      change: -0.2
    },
    meals: {
      breakfast: [
        { id: 1, foodName: 'Oatmeal with berries', calories: 300, protein: 12, carbs: 45, fat: 8, mealType: 'breakfast' as const, date: '2024-01-15', userId: 'user123', foodId: 1, createdAt: '2024-01-15T08:00:00Z' }
      ],
      lunch: [
        { id: 2, foodName: 'Grilled chicken salad', calories: 400, protein: 35, carbs: 15, fat: 12, mealType: 'lunch' as const, date: '2024-01-15', userId: 'user123', foodId: 2, createdAt: '2024-01-15T13:00:00Z' }
      ],
      dinner: [
        { id: 3, foodName: 'Salmon with vegetables', calories: 500, protein: 40, carbs: 20, fat: 25, mealType: 'dinner' as const, date: '2024-01-15', userId: 'user123', foodId: 3, createdAt: '2024-01-15T19:00:00Z' }
      ],
      snacks: []
    },
    water: {
      consumed: 1500,
      goal: 2000
    }
  }
};

// Test function
export const testChatWithUserData = async () => {
  console.log('=== Testing Chat Service with User Data ===\n');

  // Test questions
  const testQuestions = [
    "Can I eat a donut today?",
    "What should I eat for dinner?",
    "How am I doing today?",
    "How many calories do I have left?",
    "Should I exercise today?"
  ];

  for (const question of testQuestions) {
    console.log(`Question: "${question}"`);
    
    try {
      // Get predefined response (current mode)
      const response = await chatService.generateResponse(question);
      console.log(`Response: ${response}`);
    } catch (error) {
      console.log(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
  }
};

// Show what the AI prompt would look like
export const showAIPrompt = () => {
  console.log('=== AI Prompt Example ===\n');
  
  const prompt = `
Current Date: ${new Date().toLocaleDateString()}
Current Time: ${new Date().toLocaleTimeString()}

User Profile:
- Goal: ${mockUserData.userProfile.goal} weight
- Gender: ${mockUserData.userProfile.gender}
- Height: ${mockUserData.userProfile.height}cm
- Weight: ${mockUserData.userProfile.weight}kg
- Activity Level: ${mockUserData.userProfile.sportActivity}

Today's Data:
- Steps: ${mockUserData.dailyData.steps.current}/${mockUserData.dailyData.steps.goal} (${Math.round((mockUserData.dailyData.steps.current/mockUserData.dailyData.steps.goal)*100)}% of goal)
- Calories Consumed: ${mockUserData.dailyData.calories.consumed}/${mockUserData.dailyData.calories.goal} (${Math.round((mockUserData.dailyData.calories.consumed/mockUserData.dailyData.calories.goal)*100)}% of goal)
- Calories Burned: ${mockUserData.dailyData.calories.burned}
- Calorie Deficit/Surplus: ${mockUserData.dailyData.calories.deficit > 0 ? '+' : ''}${mockUserData.dailyData.calories.deficit}
- Weight Change: ${mockUserData.dailyData.weight.change > 0 ? '+' : ''}${mockUserData.dailyData.weight.change.toFixed(1)}kg from yesterday
- Water: ${mockUserData.dailyData.water.consumed}/${mockUserData.dailyData.water.goal}ml

Today's Meals:
breakfast: 300 calories (Oatmeal with berries)
lunch: 400 calories (Grilled chicken salad)
dinner: 500 calories (Salmon with vegetables)
snacks: No meals recorded

User Question: "Can I eat a donut today?"

Please provide a personalized response based on this data. Consider:
1. The user's specific goal (decrease weight)
2. Their current progress today
3. The time of day and what they might need next
4. Whether they can afford certain foods based on their remaining calories
5. Encouragement and actionable advice

Keep your response concise but helpful (under 200 words).
  `.trim();

  console.log(prompt);
};

// Export for use
export default { testChatWithUserData, showAIPrompt };
