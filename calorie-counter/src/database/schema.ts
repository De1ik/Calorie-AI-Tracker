export interface User {
  id: number;
  userId: string; // Random UUID for user identification
  goal: 'increase' | 'decrease' | 'maintain';
  sportActivity: string;
  height: number; // in cm
  weight: number; // in kg
  gender: 'male' | 'female' | 'other';
  createdAt: string;
}

export interface PersonalFood {
  id: number;
  userId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  imageUri?: string;
  isFromPhoto: boolean;
  createdAt: string;
}

export interface MealEntry {
  id: number;
  userId: string;
  foodId: number;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  createdAt: string;
}

export interface WeightEntry {
  id: number;
  userId: string;
  weight: number;
  imageUri?: string;
  notes?: string;
  date: string;
  createdAt: string;
}

export interface StepsEntry {
  id: number;
  userId: string;
  steps: number;
  date: string;
  createdAt: string;
}

export interface UserPreferences {
  id: number;
  userId: string;
  hidePhotos: boolean;
  defaultGraphType: 'line' | 'bar' | 'area';
  defaultTimePeriod: 'week' | 'month' | '3months' | 'year';
  defaultDataType: 'weight' | 'calories' | 'steps';
  createdAt: string;
}

export const createUserTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT UNIQUE NOT NULL,
    goal TEXT NOT NULL CHECK (goal IN ('increase', 'decrease', 'maintain')),
    sportActivity TEXT NOT NULL,
    height REAL NOT NULL,
    weight REAL NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

export const createPersonalFoodTable = `
  CREATE TABLE IF NOT EXISTS personal_foods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    calories REAL NOT NULL,
    protein REAL NOT NULL,
    carbs REAL NOT NULL,
    fat REAL NOT NULL,
    category TEXT NOT NULL,
    imageUri TEXT,
    isFromPhoto BOOLEAN DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (userId)
  );
`;

export const createMealEntriesTable = `
  CREATE TABLE IF NOT EXISTS meal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    foodId INTEGER NOT NULL,
    foodName TEXT NOT NULL,
    calories REAL NOT NULL,
    protein REAL NOT NULL,
    carbs REAL NOT NULL,
    fat REAL NOT NULL,
    mealType TEXT NOT NULL CHECK (mealType IN ('breakfast', 'lunch', 'dinner', 'snack')),
    date TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (userId)
  );
`;

export const createWeightEntriesTable = `
  CREATE TABLE IF NOT EXISTS weight_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    weight REAL NOT NULL,
    imageUri TEXT,
    notes TEXT,
    date TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (userId)
  );
`;

export const createStepsEntriesTable = `
  CREATE TABLE IF NOT EXISTS steps_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    steps INTEGER NOT NULL,
    date TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (userId)
  );
`;

export const createUserPreferencesTable = `
  CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    hidePhotos BOOLEAN DEFAULT 0,
    defaultGraphType TEXT DEFAULT 'line' CHECK (defaultGraphType IN ('line', 'bar', 'area')),
    defaultTimePeriod TEXT DEFAULT 'week' CHECK (defaultTimePeriod IN ('week', 'month', '3months', 'year')),
    defaultDataType TEXT DEFAULT 'weight' CHECK (defaultDataType IN ('weight', 'calories', 'steps')),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (userId)
  );
`;
