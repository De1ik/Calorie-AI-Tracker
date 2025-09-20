# Chat System Demo: Personalized Responses Based on User Data

## How the Chat System Works

The chat system now provides **personalized responses** based on the user's actual daily data. Here's how it works:

### 1. Data Collection
The system automatically gathers:
- **User Profile**: Goal (weight loss/gain/maintain), height, weight, gender, activity level
- **Today's Progress**: Calories consumed vs goal, steps taken vs goal, weight changes
- **Meal History**: All meals eaten today with calories and macros
- **Time Context**: Current time and meal periods

### 2. Response Generation

#### Mode 0 (OpenAI): Personalized AI Responses
When `MODE=0`, the system creates a comprehensive prompt with all user data and sends it to OpenAI GPT-4.

#### Mode 1 (Predefined): Smart Predefined Responses  
When `MODE=1`, the system uses intelligent predefined responses that consider the user's context.

---

## Example: "Can I eat a donut today?"

### Current Predefined Response (MODE=1):
> "A typical donut has around 250-400 calories. Based on your daily goal, I'd recommend checking your remaining calories first. If you have room in your budget and it fits your goals, you could enjoy one as a treat! Consider pairing it with some protein or having it after a workout to help with blood sugar balance."

### AI Response with User Data (MODE=0):
**User Data Context:**
- Goal: Weight loss
- Current Weight: 75kg
- Calories Consumed: 1,200/1,800 (67% of goal)
- Remaining Calories: 600
- Steps: 6,500/10,000 (65% of goal)
- Weight Change: -0.2kg from yesterday
- Meals: Oatmeal (300 cal), Chicken salad (400 cal), Salmon (500 cal)

**AI Response:**
> "Great question! Looking at your data, you've consumed 1,200 calories out of your 1,800 goal, leaving you 600 calories for the day. A typical donut has 250-400 calories, so you could fit one in! Since you're working on weight loss and have a 600-calorie deficit, a donut would still keep you in a healthy deficit. I'd suggest having it as an afternoon snack and maybe pairing it with some protein to help with satiety. You're doing great with your weight loss - down 0.2kg from yesterday!"

---

## Different Scenarios

### Scenario A: User Exceeded Calorie Goal
**Data:** 2,000/1,800 calories (exceeded by 200)
**AI Response:**
> "I see you've already exceeded your daily calorie goal by 200 calories. While a donut would be delicious, it would add another 250-400 calories to your day. For your weight loss goal, I'd recommend skipping the donut today and focusing on staying within your calorie budget. Maybe try a piece of fruit or some Greek yogurt with berries instead?"

### Scenario B: User Has Plenty of Calories Left
**Data:** 800/1,800 calories (1,000 remaining)
**AI Response:**
> "Absolutely! You've only consumed 800 calories so far, leaving you 1,000 calories for the rest of the day. A donut (250-400 calories) would fit perfectly into your budget. Since you're working on weight loss and still have a good deficit, you can definitely enjoy a donut as a treat. Consider having it with some protein to help balance your blood sugar!"

---

## Other Personalized Questions

### "What should I eat for dinner?"
**AI Response:**
> "Based on your data, you've had 700 calories so far and have 1,100 calories left for dinner. Since you're working on weight loss and need more protein (you've had 47g so far), I'd suggest a protein-rich dinner like grilled chicken breast (200 calories, 40g protein) with roasted vegetables (100 calories) and quinoa (200 calories). This would give you a balanced 500-calorie dinner with plenty of protein to support your goals!"

### "How am I doing today?"
**AI Response:**
> "You're doing great! You've consumed 1,200 calories out of your 1,800 goal (67%), which is perfect pacing. You're at 6,500 steps out of 10,000 (65%) - try to get in a 20-minute walk to reach your goal! The best news is you're down 0.2kg from yesterday, showing your weight loss plan is working. Keep up the excellent work!"

---

## Key Benefits

1. **Uses Actual Data**: Responses based on real user progress, not generic advice
2. **Contextual**: Considers user's specific goals and current situation
3. **Specific Numbers**: Provides exact calorie counts and recommendations
4. **Encouraging**: Highlights achievements and positive progress
5. **Actionable**: Gives specific next steps based on current data
6. **Time-Aware**: Considers time of day and meal timing
7. **Balanced**: Helps users enjoy treats while staying on track

---

## Technical Implementation

### Data Flow:
1. User asks question in chat
2. System gathers daily user data from database
3. Creates comprehensive prompt with user context
4. Sends to OpenAI (MODE=0) or uses predefined response (MODE=1)
5. Returns personalized answer
6. Saves conversation to chat history

### User Data Structure:
```typescript
{
  userProfile: {
    goal: 'decrease' | 'increase' | 'maintain',
    height: number,
    weight: number,
    gender: 'male' | 'female' | 'other',
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  },
  dailyData: {
    steps: { current: number, goal: number },
    calories: { consumed: number, goal: number, burned: number, deficit: number },
    weight: { current: number, change: number },
    meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
    water: { consumed: number, goal: number }
  }
}
```

The chat system now provides truly personalized nutrition advice based on the user's actual daily progress and goals!
