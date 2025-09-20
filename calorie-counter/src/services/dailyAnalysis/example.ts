// Daily Analysis Service Usage Example
// This file shows how to use the daily analysis service in your app

import { dailyAnalysisService, DailyAnalysisRequest } from './dailyAnalysisService';

// Example: How to perform daily analysis
export const exampleDailyAnalysis = async () => {
  try {
    // Create analysis request with current data
    const analysisRequest: DailyAnalysisRequest = {
      date: new Date().toISOString().split('T')[0], // Today's date
      currentTime: new Date().toISOString(), // Current time
      userProfile: {
        id: 1,
        goal: 'decrease', // 'increase' | 'decrease' | 'maintain'
        sportActivity: 'moderate', // 'none' | 'light' | 'moderate' | 'high'
        height: 175, // cm
        weight: 70, // kg
        gender: 'male', // 'male' | 'female' | 'other'
        activityLevel: 'moderate' // 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
      },
      dailyData: {
        steps: {
          current: 7500,
          goal: 10000,
          average: 8000
        },
        calories: {
          consumed: 1200,
          burned: 300,
          goal: 1500,
          deficit: 900
        },
        weight: {
          current: 70,
          previous: 70.2,
          change: -0.2
        },
        meals: {
          breakfast: [
            {
              id: 1,
              foodId: 1,
              foodName: 'Greek Yogurt',
              calories: 150,
              protein: 15,
              carbs: 10,
              fat: 5,
              mealType: 'breakfast',
              date: new Date().toISOString().split('T')[0],
              createdAt: new Date().toISOString()
            }
          ],
          lunch: [
            {
              id: 2,
              foodId: 2,
              foodName: 'Chicken Salad',
              calories: 300,
              protein: 25,
              carbs: 15,
              fat: 12,
              mealType: 'lunch',
              date: new Date().toISOString().split('T')[0],
              createdAt: new Date().toISOString()
            }
          ],
          dinner: [],
          snacks: []
        },
        water: {
          consumed: 1500, // ml
          goal: 2000 // ml
        }
      }
    };

    // Perform analysis
    const result = await dailyAnalysisService.analyzeDailyProgress(analysisRequest);

    if (result.success && result.data) {
      // Access analysis results
      console.log('Overall Score:', result.data.healthInsights.overallScore);
      console.log('Time Context:', result.data.timeContext.timeOfDay);
      console.log('Next Meal:', result.data.mealRecommendations.nextMeal.type);
      console.log('Personalized Advice:', result.data.personalizedAdvice);
      console.log('Motivation Message:', result.data.motivationMessage);

      // Access specific insights
      console.log('Strengths:', result.data.healthInsights.strengths);
      console.log('Areas for Improvement:', result.data.healthInsights.areasForImprovement);
      console.log('Recommendations:', result.data.healthInsights.recommendations);

      // Access meal suggestions
      result.data.mealRecommendations.nextMeal.suggestions.forEach((suggestion, index) => {
        console.log(`Meal Suggestion ${index + 1}:`, suggestion.name);
        console.log(`  Calories: ${suggestion.calories}`);
        console.log(`  Protein: ${suggestion.protein}g`);
        console.log(`  Reasoning: ${suggestion.reasoning}`);
      });

      // Access nutritional analysis
      console.log('Total Calories:', result.data.nutritionalAnalysis.totalCalories);
      console.log('Macro Balance:', result.data.nutritionalAnalysis.macroBalance);
      console.log('Micronutrient Score:', result.data.nutritionalAnalysis.micronutrientScore);

      // Access activity analysis
      console.log('Steps Progress:', result.data.activityAnalysis.stepsProgress + '%');
      console.log('Activity Level:', result.data.activityAnalysis.activityLevel);
      console.log('Movement Score:', result.data.activityAnalysis.movementScore);

      return result;
    } else {
      console.error('Analysis failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('Error performing daily analysis:', error);
    return null;
  }
};

// Example: How to set up the service with API key
export const setupService = () => {
  // For testing with mock data
  dailyAnalysisService.setMockMode(true);
  console.log('Daily Analysis Service set to mock mode');

  // For production with real API
  // dailyAnalysisService.setApiKey('your-openai-api-key-here');
  // dailyAnalysisService.setMockMode(false);
  // console.log('Daily Analysis Service configured with OpenAI API');
};

// Example: How to handle different time scenarios
export const getTimeBasedAnalysis = async () => {
  const now = new Date();
  const hour = now.getHours();

  let timeContext = '';
  if (hour >= 5 && hour < 8) timeContext = 'early_morning';
  else if (hour >= 8 && hour < 11) timeContext = 'morning';
  else if (hour >= 11 && hour < 14) timeContext = 'midday';
  else if (hour >= 14 && hour < 17) timeContext = 'afternoon';
  else if (hour >= 17 && hour < 20) timeContext = 'evening';
  else timeContext = 'night';

  console.log(`Current time context: ${timeContext}`);
  
  // The service will automatically determine the appropriate analysis
  // based on the current time and provide relevant recommendations
  return await exampleDailyAnalysis();
};

// Example: How to customize analysis based on user goals
export const getGoalBasedAnalysis = async (userGoal: 'increase' | 'decrease' | 'maintain') => {
  const analysisRequest: DailyAnalysisRequest = {
    date: new Date().toISOString().split('T')[0],
    currentTime: new Date().toISOString(),
    userProfile: {
      id: 1,
      goal: userGoal,
      sportActivity: 'moderate',
      height: 175,
      weight: 70,
      gender: 'male',
      activityLevel: 'moderate'
    },
    dailyData: {
      steps: { current: 8000, goal: 10000, average: 8000 },
      calories: { consumed: 1400, burned: 320, goal: userGoal === 'decrease' ? 1500 : 2000, deficit: 1080 },
      weight: { current: 70, previous: 70.1, change: -0.1 },
      meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      water: { consumed: 1200, goal: 2000 }
    }
  };

  const result = await dailyAnalysisService.analyzeDailyProgress(analysisRequest);
  
  if (result.success && result.data) {
    // The analysis will be tailored to the user's goal
    console.log(`Analysis for ${userGoal} goal:`, result.data.personalizedAdvice);
    console.log('Food additions needed:', result.data.mealRecommendations.foodAdditions.needed);
    console.log('Foods to avoid:', result.data.mealRecommendations.foodAdditions.avoid);
  }

  return result;
};
