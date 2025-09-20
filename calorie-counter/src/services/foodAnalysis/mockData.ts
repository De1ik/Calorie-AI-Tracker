import { MockFoodData } from './types';

// Mock food data for testing
export const mockFoodDatabase: MockFoodData[] = [
  {
    name: "Grilled Chicken Breast",
    category: "Protein",
    nutritionalInfo: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      cholesterol: 85,
      saturatedFat: 1,
      transFat: 0,
      potassium: 256,
      vitaminA: 0,
      vitaminC: 0,
      calcium: 15,
      iron: 1
    },
    rating: {
      overall: 9,
      healthiness: 9,
      nutrition: 8,
      freshness: 8,
      portionSize: 7
    },
    healthInsights: {
      benefits: [
        "High-quality lean protein",
        "Low in calories and fat",
        "Rich in essential amino acids",
        "Good source of B vitamins"
      ],
      concerns: [
        "May be high in sodium if seasoned heavily",
        "Risk of overcooking can reduce nutritional value"
      ],
      recommendations: [
        "Pair with vegetables for balanced meal",
        "Use minimal oil for grilling",
        "Season with herbs instead of salt"
      ],
      allergens: [],
      dietaryRestrictions: []
    },
    nutritionalAdvice: {
      generalAdvice: "Excellent protein choice! This grilled chicken breast provides high-quality protein with minimal fat. To make this meal even more nutritious, consider adding colorful vegetables and a small portion of complex carbohydrates.",
      specificSuggestions: {
        vegetables: "Add steamed broccoli, roasted bell peppers, or a mixed green salad to increase fiber, vitamins, and minerals",
        fruits: "Consider a side of berries or citrus fruits for antioxidants and vitamin C",
        proteins: "This is already an excellent protein source - no additional protein needed",
        carbs: "Add quinoa, brown rice, or sweet potato for sustained energy and fiber",
        healthyFats: "Drizzle with olive oil or add avocado slices for healthy monounsaturated fats",
        hydration: "Drink water with your meal to aid digestion and stay hydrated"
      },
      mealEnhancement: [
        "Serve with a side of roasted vegetables",
        "Add a small portion of quinoa or brown rice",
        "Include a mixed green salad with olive oil dressing",
        "Consider adding herbs like rosemary or thyme for flavor"
      ],
      portionAdvice: "This portion size looks appropriate for a main protein source. Aim for 3-4 oz of protein per meal.",
      timingAdvice: "Great choice for lunch or dinner. Protein helps with satiety and muscle maintenance."
    },
    confidence: 95
  },
  {
    name: "Mixed Green Salad",
    category: "Vegetables",
    nutritionalInfo: {
      calories: 25,
      protein: 2,
      carbs: 5,
      fat: 0.3,
      fiber: 2,
      sugar: 3,
      sodium: 10,
      cholesterol: 0,
      saturatedFat: 0,
      transFat: 0,
      potassium: 200,
      vitaminA: 150,
      vitaminC: 20,
      calcium: 30,
      iron: 1
    },
    rating: {
      overall: 8,
      healthiness: 9,
      nutrition: 7,
      freshness: 9,
      portionSize: 6
    },
    healthInsights: {
      benefits: [
        "Low in calories",
        "High in vitamins and minerals",
        "Good source of fiber",
        "Antioxidant-rich"
      ],
      concerns: [
        "Low in protein",
        "May need dressing for palatability"
      ],
      recommendations: [
        "Add lean protein for complete meal",
        "Use olive oil-based dressing",
        "Include colorful vegetables"
      ],
      allergens: [],
      dietaryRestrictions: []
    },
    nutritionalAdvice: {
      generalAdvice: "Great start with fresh vegetables! This mixed green salad provides excellent vitamins, minerals, and fiber. To make it a complete meal, add a protein source and healthy fats.",
      specificSuggestions: {
        vegetables: "Already excellent! Consider adding more colorful vegetables like bell peppers, carrots, or tomatoes",
        fruits: "Add berries, apple slices, or pomegranate seeds for natural sweetness and antioxidants",
        proteins: "Add grilled chicken, salmon, chickpeas, or hard-boiled eggs for complete protein",
        carbs: "Include quinoa, brown rice, or sweet potato for sustained energy",
        healthyFats: "Add avocado, nuts, seeds, or olive oil for healthy fats and satiety",
        hydration: "The high water content in vegetables helps with hydration"
      },
      mealEnhancement: [
        "Top with grilled chicken or salmon",
        "Add avocado slices or nuts for healthy fats",
        "Include quinoa or chickpeas for protein",
        "Drizzle with olive oil and lemon dressing"
      ],
      portionAdvice: "This is a good base portion. Add protein and healthy fats to make it a complete meal.",
      timingAdvice: "Perfect for lunch or as a side dish. The fiber helps with satiety and digestion."
    },
    confidence: 88
  },
  {
    name: "Avocado Toast",
    category: "Fats",
    nutritionalInfo: {
      calories: 320,
      protein: 8,
      carbs: 35,
      fat: 18,
      fiber: 12,
      sugar: 2,
      sodium: 400,
      cholesterol: 0,
      saturatedFat: 3,
      transFat: 0,
      potassium: 600,
      vitaminA: 50,
      vitaminC: 10,
      calcium: 80,
      iron: 2
    },
    rating: {
      overall: 7,
      healthiness: 7,
      nutrition: 8,
      freshness: 8,
      portionSize: 8
    },
    healthInsights: {
      benefits: [
        "Healthy monounsaturated fats",
        "High in fiber",
        "Good source of potassium",
        "Contains folate and vitamin K"
      ],
      concerns: [
        "High in calories",
        "May be high in sodium from bread"
      ],
      recommendations: [
        "Use whole grain bread",
        "Limit portion size",
        "Add protein like eggs"
      ],
      allergens: ["Gluten"],
      dietaryRestrictions: ["Gluten-free option available"]
    },
    nutritionalAdvice: {
      generalAdvice: "Nutritious choice with healthy fats and fiber! Avocado toast provides monounsaturated fats and potassium. To make it more balanced, add a protein source and consider the portion size.",
      specificSuggestions: {
        vegetables: "Add sliced tomatoes, cucumber, or microgreens for extra vitamins and crunch",
        fruits: "Top with pomegranate seeds or serve with a side of berries for antioxidants",
        proteins: "Add a poached or scrambled egg, smoked salmon, or hummus for complete protein",
        carbs: "Use whole grain or sourdough bread for better fiber and nutrients",
        healthyFats: "The avocado already provides excellent healthy fats - no additional fats needed",
        hydration: "Pair with herbal tea or water to stay hydrated"
      },
      mealEnhancement: [
        "Top with a poached egg for protein",
        "Add sliced tomatoes and microgreens",
        "Sprinkle with hemp seeds or chia seeds",
        "Use whole grain bread for better nutrition"
      ],
      portionAdvice: "This portion looks appropriate. Avocado is calorie-dense, so one slice is usually sufficient.",
      timingAdvice: "Great for breakfast or brunch. The healthy fats provide sustained energy throughout the morning."
    },
    confidence: 92
  },
  {
    name: "Grilled Salmon Fillet",
    category: "Protein",
    nutritionalInfo: {
      calories: 206,
      protein: 22,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
      sodium: 59,
      cholesterol: 55,
      saturatedFat: 2,
      transFat: 0,
      potassium: 363,
      vitaminA: 0,
      vitaminC: 0,
      calcium: 12,
      iron: 0.8
    },
    rating: {
      overall: 9,
      healthiness: 9,
      nutrition: 9,
      freshness: 8,
      portionSize: 7
    },
    healthInsights: {
      benefits: [
        "Excellent source of omega-3 fatty acids",
        "High-quality protein",
        "Rich in B vitamins",
        "Good source of selenium"
      ],
      concerns: [
        "May contain mercury",
        "Higher in calories than white fish"
      ],
      recommendations: [
        "Choose wild-caught when possible",
        "Limit to 2-3 servings per week",
        "Pair with vegetables"
      ],
      allergens: ["Fish"],
      dietaryRestrictions: []
    },
    nutritionalAdvice: {
      generalAdvice: "Excellent choice! Salmon is rich in omega-3 fatty acids, high-quality protein, and essential nutrients. This is a complete protein source that pairs well with vegetables and complex carbohydrates.",
      specificSuggestions: {
        vegetables: "Serve with steamed asparagus, roasted Brussels sprouts, or a mixed vegetable medley for vitamins and fiber",
        fruits: "Add a side of citrus fruits or berries for vitamin C and antioxidants",
        proteins: "This is already an excellent complete protein source - no additional protein needed",
        carbs: "Pair with quinoa, brown rice, or sweet potato for balanced macronutrients",
        healthyFats: "The salmon already provides omega-3 fatty acids - consider adding olive oil to vegetables",
        hydration: "Drink water with your meal to support the high protein content"
      },
      mealEnhancement: [
        "Serve with roasted vegetables and quinoa",
        "Add a side salad with olive oil dressing",
        "Include lemon wedges for flavor and vitamin C",
        "Consider adding herbs like dill or parsley"
      ],
      portionAdvice: "This portion size looks appropriate for a main protein source. Aim for 4-6 oz of fish per serving.",
      timingAdvice: "Perfect for lunch or dinner. Omega-3s support brain health and the protein helps with muscle maintenance."
    },
    confidence: 96
  },
  {
    name: "Quinoa Bowl",
    category: "Carbs",
    nutritionalInfo: {
      calories: 222,
      protein: 8,
      carbs: 39,
      fat: 4,
      fiber: 5,
      sugar: 1,
      sodium: 13,
      cholesterol: 0,
      saturatedFat: 0.5,
      transFat: 0,
      potassium: 318,
      vitaminA: 0,
      vitaminC: 0,
      calcium: 31,
      iron: 2.8
    },
    rating: {
      overall: 8,
      healthiness: 8,
      nutrition: 8,
      freshness: 7,
      portionSize: 8
    },
    healthInsights: {
      benefits: [
        "Complete protein source",
        "High in fiber",
        "Gluten-free",
        "Rich in minerals"
      ],
      concerns: [
        "Higher in calories than rice",
        "May be expensive"
      ],
      recommendations: [
        "Great base for bowls",
        "Rinse before cooking",
        "Combine with vegetables"
      ],
      allergens: [],
      dietaryRestrictions: ["Gluten-free"]
    },
    nutritionalAdvice: {
      generalAdvice: "Excellent choice! Quinoa is a complete protein and provides complex carbohydrates with fiber. This makes a great base for a nutritious bowl - just add vegetables and healthy fats.",
      specificSuggestions: {
        vegetables: "Add roasted vegetables like bell peppers, zucchini, or sweet potato for vitamins and fiber",
        fruits: "Top with avocado, pomegranate seeds, or dried cranberries for flavor and nutrients",
        proteins: "Add beans, chickpeas, grilled chicken, or tofu for additional protein",
        carbs: "Quinoa is already a great carb source - no additional carbs needed",
        healthyFats: "Add avocado, nuts, seeds, or olive oil for healthy fats and satiety",
        hydration: "Quinoa absorbs water well - ensure you're drinking enough fluids"
      },
      mealEnhancement: [
        "Top with roasted vegetables and avocado",
        "Add black beans or chickpeas for protein",
        "Include nuts or seeds for crunch and healthy fats",
        "Drizzle with olive oil and lemon dressing"
      ],
      portionAdvice: "This portion size looks good for a base. Add vegetables and protein to make it a complete meal.",
      timingAdvice: "Great for lunch or dinner. The protein and fiber provide sustained energy and satiety."
    },
    confidence: 90
  },
  {
    name: "Greek Yogurt with Berries",
    category: "Dairy",
    nutritionalInfo: {
      calories: 150,
      protein: 15,
      carbs: 20,
      fat: 2,
      fiber: 3,
      sugar: 15,
      sodium: 50,
      cholesterol: 10,
      saturatedFat: 1,
      transFat: 0,
      potassium: 200,
      vitaminA: 100,
      vitaminC: 30,
      calcium: 150,
      iron: 0.5
    },
    rating: {
      overall: 8,
      healthiness: 8,
      nutrition: 8,
      freshness: 9,
      portionSize: 7
    },
    healthInsights: {
      benefits: [
        "High in protein",
        "Probiotics for gut health",
        "Good source of calcium",
        "Antioxidants from berries"
      ],
      concerns: [
        "May contain added sugars",
        "Some people are lactose intolerant"
      ],
      recommendations: [
        "Choose plain yogurt",
        "Add fresh berries",
        "Great for breakfast or snack"
      ],
      allergens: ["Dairy"],
      dietaryRestrictions: ["Lactose-free options available"]
    },
    nutritionalAdvice: {
      generalAdvice: "Excellent choice! Greek yogurt provides high-quality protein and probiotics, while berries add antioxidants and natural sweetness. This makes a great breakfast or snack.",
      specificSuggestions: {
        vegetables: "Consider adding cucumber or celery sticks on the side for extra fiber and crunch",
        fruits: "The berries are perfect! You could also add banana slices, apple chunks, or pomegranate seeds",
        proteins: "This already has excellent protein - consider adding nuts or seeds for additional protein and healthy fats",
        carbs: "Add granola, oats, or whole grain cereal for complex carbohydrates and fiber",
        healthyFats: "Top with nuts, seeds, or a drizzle of nut butter for healthy fats and satiety",
        hydration: "Yogurt has good water content, but still drink water to stay hydrated"
      },
      mealEnhancement: [
        "Add granola or nuts for crunch and healthy fats",
        "Include chia seeds or flax seeds for omega-3s",
        "Top with honey or maple syrup for natural sweetness",
        "Serve with a side of whole grain toast"
      ],
      portionAdvice: "This portion size looks appropriate for a snack or part of breakfast. Add other foods to make it a complete meal.",
      timingAdvice: "Perfect for breakfast, post-workout snack, or afternoon snack. The protein helps with satiety and muscle recovery."
    },
    confidence: 93
  }
];

// Function to get random mock food data
export const getRandomMockFood = (): MockFoodData => {
  const randomIndex = Math.floor(Math.random() * mockFoodDatabase.length);
  return mockFoodDatabase[randomIndex];
};

// Function to get mock food by category
export const getMockFoodByCategory = (category: string): MockFoodData[] => {
  return mockFoodDatabase.filter(food => 
    food.category.toLowerCase() === category.toLowerCase()
  );
};

// Function to simulate analysis delay
export const simulateAnalysisDelay = (): Promise<void> => {
  const delay = Math.random() * 2000 + 1000; // 1-3 seconds
  return new Promise(resolve => setTimeout(resolve, delay));
};
