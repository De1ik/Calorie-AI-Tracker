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
