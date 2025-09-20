// Daily Analysis Types
import { MealEntry as DatabaseMealEntry } from '../../database/schema';

export interface DailyAnalysisRequest {
  date: string; // ISO date string
  currentTime: string; // ISO time string
  userProfile: UserProfile;
  dailyData: DailyData;
}

export interface UserProfile {
  id: number;
  goal: 'increase' | 'decrease' | 'maintain';
  sportActivity: string;
  height: number; // in cm
  weight: number; // in kg
  gender: 'male' | 'female' | 'other';
  age?: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface DailyData {
  // Steps data
  steps: {
    current: number;
    goal: number;
    average: number;
  };
  
  // Calorie data
  calories: {
    consumed: number;
    burned: number;
    goal: number;
    deficit: number; // consumed - burned
  };
  
  // Weight data
  weight: {
    current: number;
    previous: number;
    change: number;
  };
  
  // Meal data
  meals: {
    breakfast: DatabaseMealEntry[];
    lunch: DatabaseMealEntry[];
    dinner: DatabaseMealEntry[];
    snacks: DatabaseMealEntry[];
  };
  
  // Water intake
  water: {
    consumed: number; // in ml
    goal: number; // in ml
  };
  
  // Sleep data (if available)
  sleep?: {
    duration: number; // in hours
    quality: number; // 1-10 scale
  };
}

// Use the database MealEntry type
export type MealEntry = DatabaseMealEntry;

export interface TimeContext {
  timeOfDay: 'early_morning' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
  mealPeriod: 'pre_breakfast' | 'breakfast' | 'pre_lunch' | 'lunch' | 'pre_dinner' | 'dinner' | 'post_dinner';
  hoursUntilNextMeal: number;
  isWorkoutDay: boolean;
  isWeekend: boolean;
}

export interface NutritionalAnalysis {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  macroBalance: {
    proteinPercentage: number;
    carbsPercentage: number;
    fatPercentage: number;
  };
  micronutrientScore: number; // 1-10 scale
  mealDistribution: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
  };
}

export interface ActivityAnalysis {
  stepsProgress: number; // percentage of goal
  calorieBurn: number;
  activityLevel: 'low' | 'moderate' | 'high' | 'very_high';
  movementScore: number; // 1-10 scale
  sedentaryTime: number; // in hours
}

export interface HealthInsights {
  overallScore: number; // 1-10 scale
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  warnings: string[];
  encouragements: string[];
}

export interface MealRecommendations {
  nextMeal: {
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    suggestions: MealSuggestion[];
    reasoning: string;
  };
  foodAdditions: {
    needed: string[];
    avoid: string[];
    reasoning: string;
  };
  hydration: {
    status: 'good' | 'needs_improvement' | 'critical';
    recommendation: string;
  };
}

export interface MealSuggestion {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  reasoning: string;
  category: string;
}

export interface DailyAnalysisResponse {
  success: boolean;
  data?: {
    timeContext: TimeContext;
    nutritionalAnalysis: NutritionalAnalysis;
    activityAnalysis: ActivityAnalysis;
    healthInsights: HealthInsights;
    mealRecommendations: MealRecommendations;
    personalizedAdvice: string;
    dailyGoal: string;
    motivationMessage: string;
    confidence: number; // 0-100 percentage
    analysisTime: number; // in milliseconds
  };
  error?: string;
}

// OpenAI API Configuration for Daily Analysis
export interface DailyAnalysisConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

// Mock data for testing
export interface MockDailyAnalysisData {
  timeContext: TimeContext;
  nutritionalAnalysis: NutritionalAnalysis;
  activityAnalysis: ActivityAnalysis;
  healthInsights: HealthInsights;
  mealRecommendations: MealRecommendations;
  personalizedAdvice: string;
  dailyGoal: string;
  motivationMessage: string;
  confidence: number;
}
