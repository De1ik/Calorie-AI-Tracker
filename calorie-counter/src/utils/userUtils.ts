// User utility functions for generating random IDs and managing user data

/**
 * Generates a random UUID-like string for user identification
 * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
export const generateRandomUserId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Generates random historical data for testing purposes
 */
export const generateRandomHistoricalData = (userId: string) => {
  const today = new Date();
  const data = {
    weightEntries: [] as any[],
    stepsEntries: [] as any[],
    mealEntries: [] as any[],
  };

  // Generate weight entries for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Weight varies between 65-75kg with some fluctuation
    const baseWeight = 70;
    const variation = (Math.random() - 0.5) * 2; // -1 to +1 kg variation
    const weight = Math.round((baseWeight + variation) * 10) / 10;
    
    data.weightEntries.push({
      userId,
      weight,
      date: dateStr,
      createdAt: date.toISOString(),
    });
  }

  // Generate steps entries for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Steps vary between 5000-15000 with some days being more active
    const isActiveDay = Math.random() > 0.3; // 70% chance of being an active day
    const baseSteps = isActiveDay ? 10000 : 6000;
    const variation = Math.random() * 5000; // 0-5000 steps variation
    const steps = Math.round(baseSteps + variation);
    
    data.stepsEntries.push({
      userId,
      steps,
      date: dateStr,
      createdAt: date.toISOString(),
    });
  }

  // Generate meal entries for the last 7 days (more recent data)
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const foodItems = [
    { name: 'Oatmeal with berries', calories: 300, protein: 12, carbs: 45, fat: 8 },
    { name: 'Grilled chicken breast', calories: 250, protein: 35, carbs: 0, fat: 10 },
    { name: 'Brown rice', calories: 200, protein: 4, carbs: 40, fat: 2 },
    { name: 'Salmon fillet', calories: 350, protein: 30, carbs: 0, fat: 20 },
    { name: 'Greek yogurt', calories: 150, protein: 15, carbs: 10, fat: 5 },
    { name: 'Mixed vegetables', calories: 80, protein: 4, carbs: 15, fat: 1 },
    { name: 'Avocado toast', calories: 280, protein: 8, carbs: 25, fat: 18 },
    { name: 'Protein shake', calories: 200, protein: 25, carbs: 15, fat: 3 },
    { name: 'Quinoa salad', calories: 220, protein: 8, carbs: 35, fat: 6 },
    { name: 'Almonds', calories: 160, protein: 6, carbs: 6, fat: 14 },
  ];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate 2-4 meals per day
    const mealsPerDay = Math.floor(Math.random() * 3) + 2; // 2-4 meals
    
    for (let j = 0; j < mealsPerDay; j++) {
      const mealType = mealTypes[j % mealTypes.length];
      const foodItem = foodItems[Math.floor(Math.random() * foodItems.length)];
      
      data.mealEntries.push({
        userId,
        foodId: Math.floor(Math.random() * 1000) + 1,
        foodName: foodItem.name,
        calories: foodItem.calories,
        protein: foodItem.protein,
        carbs: foodItem.carbs,
        fat: foodItem.fat,
        mealType,
        date: dateStr,
        createdAt: date.toISOString(),
      });
    }
  }

  return data;
};

/**
 * Generates a random user profile for testing
 */
export const generateRandomUserProfile = (userId: string) => {
  const goals = ['increase', 'decrease', 'maintain'];
  const sportActivities = ['none', 'light', 'moderate', 'active'];
  const genders = ['male', 'female', 'other'];
  
  return {
    userId,
    goal: goals[Math.floor(Math.random() * goals.length)] as 'increase' | 'decrease' | 'maintain',
    sportActivity: sportActivities[Math.floor(Math.random() * sportActivities.length)],
    height: Math.floor(Math.random() * 30) + 160, // 160-190 cm
    weight: Math.round((Math.random() * 30 + 60) * 10) / 10, // 60-90 kg
    gender: genders[Math.floor(Math.random() * genders.length)] as 'male' | 'female' | 'other',
    createdAt: new Date().toISOString(),
  };
};

/**
 * Generates an incomplete user profile for onboarding (with placeholder values)
 */
export const generateIncompleteUserProfile = (userId: string) => {
  return {
    userId,
    goal: 'maintain' as 'increase' | 'decrease' | 'maintain', // Default placeholder
    sportActivity: 'none', // Default placeholder
    height: 170, // Default placeholder
    weight: 70, // Default placeholder
    gender: 'other' as 'male' | 'female' | 'other', // Default placeholder
    createdAt: new Date().toISOString(),
  };
};
