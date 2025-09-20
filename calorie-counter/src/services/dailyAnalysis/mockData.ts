import { MockDailyAnalysisData, TimeContext, NutritionalAnalysis, ActivityAnalysis, HealthInsights, MealRecommendations } from './types';

// Mock daily analysis scenarios based on different times and data
export const mockDailyAnalysisScenarios: MockDailyAnalysisData[] = [
  // Morning scenario - Good start to the day
  {
    timeContext: {
      timeOfDay: 'morning',
      mealPeriod: 'breakfast',
      hoursUntilNextMeal: 4,
      isWorkoutDay: true,
      isWeekend: false,
    },
    nutritionalAnalysis: {
      totalCalories: 320,
      totalProtein: 25,
      totalCarbs: 35,
      totalFat: 12,
      totalFiber: 8,
      macroBalance: {
        proteinPercentage: 31,
        carbsPercentage: 44,
        fatPercentage: 34,
      },
      micronutrientScore: 8,
      mealDistribution: {
        breakfast: 100,
        lunch: 0,
        dinner: 0,
        snacks: 0,
      },
    },
    activityAnalysis: {
      stepsProgress: 15,
      calorieBurn: 180,
      activityLevel: 'low',
      movementScore: 3,
      sedentaryTime: 2,
    },
    healthInsights: {
      overallScore: 7,
      strengths: [
        'Great protein intake for breakfast',
        'Good fiber content',
        'Balanced macronutrients',
        'Started the day with healthy choices'
      ],
      areasForImprovement: [
        'Need to increase daily steps',
        'Consider adding more vegetables',
        'Stay hydrated throughout the day'
      ],
      recommendations: [
        'Take a 10-minute walk every hour',
        'Include leafy greens in your next meal',
        'Drink water before each meal',
        'Plan a protein-rich lunch'
      ],
      warnings: [],
      encouragements: [
        'You\'re off to a great start!',
        'Your breakfast choices show good nutrition awareness',
        'Keep up the momentum for the rest of the day'
      ],
    },
    mealRecommendations: {
      nextMeal: {
        type: 'lunch',
        suggestions: [
          {
            name: 'Grilled Chicken Salad',
            calories: 350,
            protein: 30,
            carbs: 15,
            fat: 18,
            reasoning: 'High protein to maintain energy and support muscle recovery',
            category: 'Protein'
          },
          {
            name: 'Quinoa Buddha Bowl',
            calories: 420,
            protein: 18,
            carbs: 45,
            fat: 16,
            reasoning: 'Complete protein with complex carbs for sustained energy',
            category: 'Grains'
          }
        ],
        reasoning: 'Focus on lean protein and vegetables to maintain energy levels and support your fitness goals'
      },
      foodAdditions: {
        needed: ['Leafy greens', 'Colorful vegetables', 'Healthy fats'],
        avoid: ['Processed foods', 'Excessive sodium', 'Added sugars'],
        reasoning: 'Add nutrient-dense foods to boost micronutrient intake and support overall health'
      },
      hydration: {
        status: 'needs_improvement',
        recommendation: 'Aim for 8-10 glasses of water today. Start with a glass now and continue throughout the day.'
      },
    },
    personalizedAdvice: 'You\'re having a solid start to your day! Your breakfast shows good nutrition awareness with balanced macros. Since you have a workout planned, focus on staying hydrated and consider a light snack 30 minutes before exercise. Your lunch should include lean protein and complex carbs to fuel your afternoon activities.',
    dailyGoal: 'Complete 8,000 steps and maintain balanced nutrition throughout the day',
    motivationMessage: 'Every healthy choice you make today is a step toward your goals. You\'ve got this! 💪',
    confidence: 92,
  },

  // Midday scenario - Need more activity
  {
    timeContext: {
      timeOfDay: 'midday',
      mealPeriod: 'pre_lunch',
      hoursUntilNextMeal: 1,
      isWorkoutDay: false,
      isWeekend: false,
    },
    nutritionalAnalysis: {
      totalCalories: 680,
      totalProtein: 45,
      totalCarbs: 75,
      totalFat: 22,
      totalFiber: 12,
      macroBalance: {
        proteinPercentage: 26,
        carbsPercentage: 44,
        fatPercentage: 29,
      },
      micronutrientScore: 7,
      mealDistribution: {
        breakfast: 60,
        lunch: 40,
        dinner: 0,
        snacks: 0,
      },
    },
    activityAnalysis: {
      stepsProgress: 35,
      calorieBurn: 420,
      activityLevel: 'low',
      movementScore: 4,
      sedentaryTime: 5,
    },
    healthInsights: {
      overallScore: 6,
      strengths: [
        'Good protein intake so far',
        'Decent fiber content',
        'Balanced meal distribution'
      ],
      areasForImprovement: [
        'Low step count for midday',
        'Need more movement',
        'Consider adding more vegetables'
      ],
      recommendations: [
        'Take a 15-minute walk after lunch',
        'Use stairs instead of elevator',
        'Set hourly movement reminders',
        'Include more colorful vegetables in lunch'
      ],
      warnings: [
        'You\'re behind on your daily step goal'
      ],
      encouragements: [
        'Your nutrition is on track',
        'There\'s still time to reach your step goal',
        'Small movements add up throughout the day'
      ],
    },
    mealRecommendations: {
      nextMeal: {
        type: 'lunch',
        suggestions: [
          {
            name: 'Mediterranean Wrap',
            calories: 380,
            protein: 22,
            carbs: 35,
            fat: 18,
            reasoning: 'Balanced meal with healthy fats and protein',
            category: 'Mediterranean'
          },
          {
            name: 'Vegetable Stir-fry with Tofu',
            calories: 320,
            protein: 20,
            carbs: 28,
            fat: 14,
            reasoning: 'High in vegetables and plant-based protein',
            category: 'Asian'
          }
        ],
        reasoning: 'Choose a balanced lunch with vegetables and lean protein to fuel your afternoon and help reach your daily goals'
      },
      foodAdditions: {
        needed: ['More vegetables', 'Whole grains', 'Healthy fats'],
        avoid: ['Heavy, greasy foods', 'Excessive carbs', 'Large portions'],
        reasoning: 'Focus on nutrient-dense foods that will provide sustained energy without making you feel sluggish'
      },
      hydration: {
        status: 'good',
        recommendation: 'Keep up the good hydration! Continue drinking water throughout the afternoon.'
      },
    },
    personalizedAdvice: 'You\'re doing well with nutrition but need to increase your activity level. Since it\'s midday and you\'re behind on steps, try to incorporate more movement into your afternoon. Take walking breaks, use stairs, and consider a post-lunch walk. Your lunch should be balanced but not too heavy to avoid afternoon sluggishness.',
    dailyGoal: 'Catch up on steps with 3,000 more steps this afternoon',
    motivationMessage: 'You\'re halfway through the day! Small steps now will make a big difference. Keep going! 🚶‍♀️',
    confidence: 88,
  },

  // Evening scenario - Good day overall
  {
    timeContext: {
      timeOfDay: 'evening',
      mealPeriod: 'pre_dinner',
      hoursUntilNextMeal: 0.5,
      isWorkoutDay: true,
      isWeekend: false,
    },
    nutritionalAnalysis: {
      totalCalories: 1200,
      totalProtein: 85,
      totalCarbs: 120,
      totalFat: 35,
      totalFiber: 20,
      macroBalance: {
        proteinPercentage: 28,
        carbsPercentage: 40,
        fatPercentage: 26,
      },
      micronutrientScore: 8,
      mealDistribution: {
        breakfast: 35,
        lunch: 40,
        dinner: 0,
        snacks: 25,
      },
    },
    activityAnalysis: {
      stepsProgress: 85,
      calorieBurn: 680,
      activityLevel: 'high',
      movementScore: 8,
      sedentaryTime: 3,
    },
    healthInsights: {
      overallScore: 8,
      strengths: [
        'Excellent step count',
        'Great protein intake',
        'Good meal distribution',
        'High activity level',
        'Balanced macronutrients'
      ],
      areasForImprovement: [
        'Could add more vegetables to dinner',
        'Consider earlier dinner time'
      ],
      recommendations: [
        'Include 2-3 servings of vegetables in dinner',
        'Finish eating 2-3 hours before bedtime',
        'Consider a light post-dinner walk',
        'Stay hydrated in the evening'
      ],
      warnings: [],
      encouragements: [
        'Outstanding day so far!',
        'You\'ve exceeded your step goal',
        'Your nutrition is well-balanced',
        'Great job staying active'
      ],
    },
    mealRecommendations: {
      nextMeal: {
        type: 'dinner',
        suggestions: [
          {
            name: 'Grilled Salmon with Roasted Vegetables',
            calories: 450,
            protein: 35,
            carbs: 25,
            fat: 22,
            reasoning: 'High-quality protein with omega-3s and plenty of vegetables',
            category: 'Seafood'
          },
          {
            name: 'Turkey and Vegetable Stir-fry',
            calories: 380,
            protein: 30,
            carbs: 20,
            fat: 18,
            reasoning: 'Lean protein with colorful vegetables for recovery',
            category: 'Asian'
          }
        ],
        reasoning: 'Focus on lean protein and vegetables for dinner to support recovery and maintain your excellent progress'
      },
      foodAdditions: {
        needed: ['Leafy greens', 'Colorful vegetables', 'Healthy fats'],
        avoid: ['Heavy, processed foods', 'Large portions', 'Excessive sodium'],
        reasoning: 'Keep dinner light and nutritious to maintain your great progress and support recovery'
      },
      hydration: {
        status: 'good',
        recommendation: 'Great hydration today! Continue drinking water but reduce intake 2 hours before bed.'
      },
    },
    personalizedAdvice: 'Fantastic day! You\'ve exceeded your step goal and maintained excellent nutrition. Since you worked out today, focus on a protein-rich dinner with plenty of vegetables to support recovery. Keep dinner light and finish eating 2-3 hours before bedtime for optimal sleep quality.',
    dailyGoal: 'Maintain your excellent progress with a nutritious dinner',
    motivationMessage: 'You\'re crushing it today! Your consistency is paying off. Finish strong! 🌟',
    confidence: 95,
  },

  // Night scenario - End of day review
  {
    timeContext: {
      timeOfDay: 'night',
      mealPeriod: 'post_dinner',
      hoursUntilNextMeal: 12,
      isWorkoutDay: false,
      isWeekend: true,
    },
    nutritionalAnalysis: {
      totalCalories: 1850,
      totalProtein: 120,
      totalCarbs: 180,
      totalFat: 55,
      totalFiber: 28,
      macroBalance: {
        proteinPercentage: 26,
        carbsPercentage: 39,
        fatPercentage: 27,
      },
      micronutrientScore: 9,
      mealDistribution: {
        breakfast: 25,
        lunch: 35,
        dinner: 30,
        snacks: 10,
      },
    },
    activityAnalysis: {
      stepsProgress: 95,
      calorieBurn: 520,
      activityLevel: 'moderate',
      movementScore: 7,
      sedentaryTime: 4,
    },
    healthInsights: {
      overallScore: 8,
      strengths: [
        'Excellent nutrition balance',
        'Great protein intake',
        'High fiber content',
        'Good meal distribution',
        'Met step goal',
        'Balanced macronutrients'
      ],
      areasForImprovement: [
        'Could increase activity level slightly',
        'Consider more variety in vegetables'
      ],
      recommendations: [
        'Plan tomorrow\'s meals',
        'Prepare healthy snacks for tomorrow',
        'Get 7-9 hours of sleep',
        'Consider a light morning walk tomorrow'
      ],
      warnings: [],
      encouragements: [
        'Outstanding day overall!',
        'You\'ve met all your major goals',
        'Your nutrition is exemplary',
        'Great job maintaining balance'
      ],
    },
    mealRecommendations: {
      nextMeal: {
        type: 'breakfast',
        suggestions: [
          {
            name: 'Greek Yogurt Parfait',
            calories: 300,
            protein: 20,
            carbs: 35,
            fat: 8,
            reasoning: 'High protein start with probiotics and antioxidants',
            category: 'Dairy'
          },
          {
            name: 'Avocado Toast with Eggs',
            calories: 350,
            protein: 18,
            carbs: 25,
            fat: 22,
            reasoning: 'Healthy fats and protein for sustained energy',
            category: 'Breakfast'
          }
        ],
        reasoning: 'Start tomorrow with a protein-rich breakfast to maintain your excellent nutrition habits'
      },
      foodAdditions: {
        needed: ['More vegetable variety', 'Whole grains', 'Healthy fats'],
        avoid: ['Late-night snacks', 'Heavy foods', 'Excessive caffeine'],
        reasoning: 'Focus on planning tomorrow\'s meals and getting quality sleep'
      },
      hydration: {
        status: 'good',
        recommendation: 'Excellent hydration today! Reduce water intake 2 hours before bed for better sleep.'
      },
    },
    personalizedAdvice: 'What an amazing day! You\'ve excelled in both nutrition and activity. Your balanced approach to health is really paying off. Take time to plan tomorrow\'s meals and get quality sleep to maintain this momentum. You\'re setting a great example of sustainable healthy living.',
    dailyGoal: 'Plan tomorrow\'s meals and get quality sleep',
    motivationMessage: 'You\'ve had an incredible day! Your dedication to health is inspiring. Rest well and keep up the amazing work! 🌙✨',
    confidence: 96,
  },
];

// Function to get random mock daily analysis
export const getRandomMockDailyAnalysis = (): MockDailyAnalysisData => {
  const randomIndex = Math.floor(Math.random() * mockDailyAnalysisScenarios.length);
  console.log('Getting random mock analysis, index:', randomIndex);
  return mockDailyAnalysisScenarios[randomIndex];
};

// Function to get mock analysis based on time of day
export const getMockAnalysisByTime = (timeOfDay: string): MockDailyAnalysisData | null => {
  console.log('Looking for scenario with time of day:', timeOfDay);
  const scenario = mockDailyAnalysisScenarios.find(s => s.timeContext.timeOfDay === timeOfDay);
  console.log('Found scenario:', !!scenario);
  return scenario || getRandomMockDailyAnalysis();
};

// Function to simulate analysis delay
export const simulateDailyAnalysisDelay = (): Promise<void> => {
  const delay = Math.random() * 3000 + 2000; // 2-5 seconds
  return new Promise(resolve => setTimeout(resolve, delay));
};
