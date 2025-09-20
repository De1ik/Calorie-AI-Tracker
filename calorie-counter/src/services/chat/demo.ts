// Demo showing how the chat system provides personalized responses based on user data
import { chatService } from './chatService';

// Example user data that would be gathered from the database
const exampleUserData = {
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

// Demo function showing different responses
export const demonstrateChatResponses = () => {
  console.log('=== Chat System Demo ===\n');

  // Example 1: Donut question with predefined response (MODE=1)
  console.log('1. PREDEFINED RESPONSE (MODE=1):');
  console.log('Question: "Can I eat a donut today?"');
  console.log('Response:', chatService.generatePredefinedResponse("Can I eat a donut today?"));
  console.log('\n');

  // Example 2: What the AI response would look like with user data (MODE=0)
  console.log('2. AI RESPONSE WITH USER DATA (MODE=0):');
  console.log('Question: "Can I eat a donut today?"');
  console.log('User Data Context:');
  console.log(`- Goal: ${exampleUserData.userProfile.goal} weight`);
  console.log(`- Current Weight: ${exampleUserData.userProfile.weight}kg`);
  console.log(`- Calories Consumed: ${exampleUserData.dailyData.calories.consumed}/${exampleUserData.dailyData.calories.goal}`);
  console.log(`- Remaining Calories: ${exampleUserData.dailyData.calories.goal - exampleUserData.dailyData.calories.consumed}`);
  console.log(`- Steps: ${exampleUserData.dailyData.steps.current}/${exampleUserData.dailyData.steps.goal}`);
  console.log(`- Weight Change: ${exampleUserData.dailyData.weight.change}kg`);
  console.log('\nAI Response would be:');
  console.log('"Great question! Looking at your data, you\'ve consumed 1,200 calories out of your 1,800 goal, leaving you 600 calories for the day. A typical donut has 250-400 calories, so you could fit one in! Since you\'re working on weight loss and have a 600-calorie deficit, a donut would still keep you in a healthy deficit. I\'d suggest having it as an afternoon snack and maybe pairing it with some protein to help with satiety. You\'re doing great with your weight loss - down 0.2kg from yesterday!"');
  console.log('\n');

  // Example 3: Different scenarios
  console.log('3. DIFFERENT SCENARIOS:');
  
  // Scenario A: User has already exceeded calorie goal
  const scenarioA = {
    ...exampleUserData,
    dailyData: {
      ...exampleUserData.dailyData,
      calories: {
        consumed: 2000,
        burned: 400,
        goal: 1800,
        deficit: 1600
      }
    }
  };
  
  console.log('Scenario A - User exceeded calorie goal:');
  console.log(`Calories: ${scenarioA.dailyData.calories.consumed}/${scenarioA.dailyData.calories.goal} (exceeded by ${scenarioA.dailyData.calories.consumed - scenarioA.dailyData.calories.goal})`);
  console.log('AI Response: "I see you\'ve already exceeded your daily calorie goal by 200 calories. While a donut would be delicious, it would add another 250-400 calories to your day. For your weight loss goal, I\'d recommend skipping the donut today and focusing on staying within your calorie budget. Maybe try a piece of fruit or some Greek yogurt with berries instead?"');
  console.log('\n');

  // Scenario B: User has plenty of calories left
  const scenarioB = {
    ...exampleUserData,
    dailyData: {
      ...exampleUserData.dailyData,
      calories: {
        consumed: 800,
        burned: 400,
        goal: 1800,
        deficit: 400
      }
    }
  };
  
  console.log('Scenario B - User has plenty of calories left:');
  console.log(`Calories: ${scenarioB.dailyData.calories.consumed}/${scenarioB.dailyData.calories.goal} (${scenarioB.dailyData.calories.goal - scenarioB.dailyData.calories.consumed} remaining)`);
  console.log('AI Response: "Absolutely! You\'ve only consumed 800 calories so far, leaving you 1,000 calories for the rest of the day. A donut (250-400 calories) would fit perfectly into your budget. Since you\'re working on weight loss and still have a good deficit, you can definitely enjoy a donut as a treat. Consider having it with some protein to help balance your blood sugar!"');
  console.log('\n');

  // Example 4: Other personalized questions
  console.log('4. OTHER PERSONALIZED QUESTIONS:');
  console.log('Question: "What should I eat for dinner?"');
  console.log('AI Response: "Based on your data, you\'ve had 700 calories so far and have 1,100 calories left for dinner. Since you\'re working on weight loss and need more protein (you\'ve had 47g so far), I\'d suggest a protein-rich dinner like grilled chicken breast (200 calories, 40g protein) with roasted vegetables (100 calories) and quinoa (200 calories). This would give you a balanced 500-calorie dinner with plenty of protein to support your goals!"');
  console.log('\n');

  console.log('Question: "How am I doing today?"');
  console.log('AI Response: "You\'re doing great! You\'ve consumed 1,200 calories out of your 1,800 goal (67%), which is perfect pacing. You\'re at 6,500 steps out of 10,000 (65%) - try to get in a 20-minute walk to reach your goal! The best news is you\'re down 0.2kg from yesterday, showing your weight loss plan is working. Keep up the excellent work!"');
  console.log('\n');

  console.log('=== Key Benefits of Personalized Responses ===');
  console.log('1. Uses actual user data (calories, steps, weight, meals)');
  console.log('2. Considers user\'s specific goals (weight loss/gain/maintain)');
  console.log('3. Provides contextual advice based on current progress');
  console.log('4. Gives specific recommendations with actual numbers');
  console.log('5. Offers encouragement based on achievements');
  console.log('6. Considers time of day and meal timing');
  console.log('7. Balances treats with health goals');
};

// Export for use in other files
export default demonstrateChatResponses;
