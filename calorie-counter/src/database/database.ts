import * as SQLite from 'expo-sqlite';
import { createUserTable, createPersonalFoodTable, createMealEntriesTable, createWeightEntriesTable, createStepsEntriesTable, createUserPreferencesTable, createChatHistoryTable, User, PersonalFood, MealEntry, WeightEntry, StepsEntry, UserPreferences, ChatHistory } from './schema';
import { generateRandomUserId, generateRandomHistoricalData, generateRandomUserProfile, generateIncompleteUserProfile } from '../utils/userUtils';

const DB_NAME = 'calorie_tracker.db';

class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      console.log('Opening database:', DB_NAME);
      this.db = await SQLite.openDatabaseAsync(DB_NAME);
      console.log('Database opened successfully');
      
      console.log('Creating tables...');
      await this.createTables();
      console.log('Tables created successfully');
      
      console.log('Adding default data...');
      await this.addDefaultData();
      console.log('Default data added successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.execAsync(createUserTable);
    await this.db.execAsync(createPersonalFoodTable);
    await this.db.execAsync(createMealEntriesTable);
    await this.db.execAsync(createWeightEntriesTable);
    await this.db.execAsync(createStepsEntriesTable);
    await this.db.execAsync(createUserPreferencesTable);
    await this.db.execAsync(createChatHistoryTable);
    
    // Add migration for sportActivity column and userId columns
    await this.migrateUserTable();
    await this.migrateAllTablesForUserId();
    await this.cleanupOrphanedData();
  }

  private async migrateUserTable(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      // Check table structure
      const tableInfo = await this.db.getAllAsync('PRAGMA table_info(users)');
      const hasUserIdColumn = tableInfo.some((column: any) => column.name === 'userId');
      const hasSportActivityColumn = tableInfo.some((column: any) => column.name === 'sportActivity');
      const hasWeeklyActivityColumn = tableInfo.some((column: any) => column.name === 'weeklyActivity');
      
      // If userId column doesn't exist, we need to recreate the table with the new schema
      if (!hasUserIdColumn) {
        console.log('Adding userId column to users table...');
        await this.recreateUserTableWithUserId();
        console.log('userId column added successfully');
      }
      
      // Add sportActivity column if it doesn't exist
      if (!hasSportActivityColumn) {
        console.log('Adding sportActivity column to users table...');
        await this.db.execAsync('ALTER TABLE users ADD COLUMN sportActivity TEXT NOT NULL DEFAULT "none"');
        console.log('sportActivity column added successfully');
      }
      
      // Remove weeklyActivity column if it exists (since we no longer use it)
      if (hasWeeklyActivityColumn) {
        console.log('Removing weeklyActivity column from users table...');
        // SQLite doesn't support DROP COLUMN directly, so we need to recreate the table
        await this.recreateUserTable();
        console.log('weeklyActivity column removed successfully');
      }
    } catch (error) {
      console.error('Error migrating user table:', error);
      // If migration fails, we'll handle it gracefully
    }
  }

  private async recreateUserTable(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      // Create new table with correct structure
      await this.db.execAsync(`
        CREATE TABLE users_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          goal TEXT NOT NULL CHECK (goal IN ('increase', 'decrease', 'maintain')),
          sportActivity TEXT NOT NULL,
          height REAL NOT NULL,
          weight REAL NOT NULL,
          gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      // Copy data from old table to new table (excluding weeklyActivity)
      await this.db.execAsync(`
        INSERT INTO users_new (id, goal, sportActivity, height, weight, gender, createdAt)
        SELECT id, goal, COALESCE(sportActivity, 'none'), height, weight, gender, createdAt
        FROM users;
      `);
      
      // Drop old table
      await this.db.execAsync('DROP TABLE users;');
      
      // Rename new table
      await this.db.execAsync('ALTER TABLE users_new RENAME TO users;');
      
    } catch (error) {
      console.error('Error recreating user table:', error);
      throw error;
    }
  }

  private async recreateUserTableWithUserId(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      // Create new table with userId column
      await this.db.execAsync(`
        CREATE TABLE users_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT UNIQUE NOT NULL,
          goal TEXT NOT NULL CHECK (goal IN ('increase', 'decrease', 'maintain')),
          sportActivity TEXT NOT NULL,
          height REAL NOT NULL,
          weight REAL NOT NULL,
          gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      // Copy data from old table to new table, generating userId for existing users
      const existingUsers = await this.db.getAllAsync('SELECT * FROM users');
      for (const user of existingUsers as any[]) {
        const randomUserId = generateRandomUserId();
        await this.db.runAsync(`
          INSERT INTO users_new (id, userId, goal, sportActivity, height, weight, gender, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [user.id, randomUserId, user.goal, user.sportActivity || 'none', user.height, user.weight, user.gender, user.createdAt]);
      }
      
      // Drop old table and rename new table
      await this.db.execAsync('DROP TABLE users');
      await this.db.execAsync('ALTER TABLE users_new RENAME TO users');
    } catch (error) {
      console.error('Error recreating user table with userId:', error);
      throw error;
    }
  }

  private async migrateAllTablesForUserId(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      // Get current user ID (should exist after user table migration)
      const currentUserId = await this.getCurrentUserId();
      if (!currentUserId) {
        console.log('No user ID found, skipping table migrations');
        return;
      }

      // Migrate personal_foods table
      await this.migrateTableForUserId('personal_foods', currentUserId);
      
      // Migrate meal_entries table
      await this.migrateTableForUserId('meal_entries', currentUserId);
      
      // Migrate weight_entries table
      await this.migrateTableForUserId('weight_entries', currentUserId);
      
      // Migrate steps_entries table
      await this.migrateTableForUserId('steps_entries', currentUserId);
      
      // Migrate user_preferences table
      await this.migrateTableForUserId('user_preferences', currentUserId);
      
      console.log('All tables migrated for userId');
    } catch (error) {
      console.error('Error migrating tables for userId:', error);
      // Don't throw error, just log it
    }
  }

  private async cleanupOrphanedData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      console.log('Cleaning up orphaned data...');
      
      // Delete any records with NULL userId
      const tables = ['weight_entries', 'steps_entries', 'meal_entries', 'personal_foods', 'user_preferences', 'chat_history'];
      
      for (const table of tables) {
        try {
          const result = await this.db.runAsync(`DELETE FROM ${table} WHERE userId IS NULL`);
          if (result.changes > 0) {
            console.log(`Cleaned up ${result.changes} orphaned records from ${table}`);
          }
        } catch (error) {
          // Table might not exist or might not have userId column yet
          console.log(`Skipping cleanup for ${table}:`, error instanceof Error ? error.message : String(error));
        }
      }
      
      console.log('Orphaned data cleanup completed');
    } catch (error) {
      console.error('Error cleaning up orphaned data:', error);
      // Don't throw error, just log it
    }
  }

  private async migrateTableForUserId(tableName: string, userId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const tableInfo = await this.db.getAllAsync(`PRAGMA table_info(${tableName})`);
      const hasUserIdColumn = tableInfo.some((column: any) => column.name === 'userId');
      
      if (!hasUserIdColumn) {
        console.log(`Adding userId column to ${tableName} table...`);
        
        // Add userId column to existing table
        await this.db.execAsync(`ALTER TABLE ${tableName} ADD COLUMN userId TEXT`);
        
        // Update all existing records with the current user ID
        await this.db.runAsync(`UPDATE ${tableName} SET userId = ? WHERE userId IS NULL`, [userId]);
        
        console.log(`userId column added to ${tableName} table`);
      }
    } catch (error) {
      console.error(`Error migrating ${tableName} table:`, error);
      // Don't throw error, just log it
    }
  }

  private async addDefaultData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Get or create a user for the default data
    let userId = await this.getCurrentUserId();
    if (!userId) {
      console.log('No user found, creating default user for sample data...');
      userId = await this.createUserWithRandomData();
    }

    // Check if data already exists for this user
    const existingWeight = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM weight_entries WHERE userId = ?', [userId]) as any;
    const existingSteps = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM steps_entries WHERE userId = ?', [userId]) as any;
    const existingMeals = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM meal_entries WHERE userId = ?', [userId]) as any;

    if (existingWeight?.count > 0 || existingSteps?.count > 0 || existingMeals?.count > 0) {
      console.log('Default data already exists for user, skipping...');
      return;
    }

    // Generate data for the last 30 days
    const today = new Date();
    const defaultData = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      // Weight data (gradual decrease for weight loss goal)
      const baseWeight = 75;
      const weightVariation = (Math.random() - 0.5) * 0.8; // ±0.4kg variation
      const weightTrend = -0.1 * (29 - i); // Gradual weight loss
      const weight = Math.round((baseWeight + weightTrend + weightVariation) * 10) / 10;

      // Steps data (realistic daily variation)
      const baseSteps = 8000;
      const stepsVariation = Math.floor((Math.random() - 0.5) * 4000); // ±2000 steps
      const steps = Math.max(3000, baseSteps + stepsVariation);

      // Calories data (realistic daily intake)
      const baseCalories = 2000;
      const caloriesVariation = Math.floor((Math.random() - 0.5) * 600); // ±300 calories
      const calories = Math.max(1200, baseCalories + caloriesVariation);

      defaultData.push({
        date: dateString,
        weight,
        steps,
        calories,
        hasPhoto: Math.random() > 0.7, // 30% chance of having a photo
        notes: Math.random() > 0.8 ? 'Feeling great today!' : undefined, // 20% chance of notes
      });
    }

    // Insert weight entries
    for (const data of defaultData) {
      await this.db.runAsync(
        `INSERT INTO weight_entries (userId, weight, imageUri, notes, date) VALUES (?, ?, ?, ?, ?)`,
        [
          userId,
          data.weight,
          data.hasPhoto ? `https://picsum.photos/200/200?random=${data.date}` : null,
          data.notes || null,
          data.date
        ]
      );
    }

    // Insert steps entries
    for (const data of defaultData) {
      await this.db.runAsync(
        `INSERT INTO steps_entries (userId, steps, date) VALUES (?, ?, ?)`,
        [userId, data.steps, data.date]
      );
    }

    // Insert meal entries (distribute calories across meals)
    for (const data of defaultData) {
      const meals = ['breakfast', 'lunch', 'dinner', 'snack'];
      const mealCalories = [
        Math.floor(data.calories * 0.25), // breakfast
        Math.floor(data.calories * 0.35), // lunch
        Math.floor(data.calories * 0.30), // dinner
        Math.floor(data.calories * 0.10), // snack
      ];

      for (let i = 0; i < meals.length; i++) {
        if (mealCalories[i] > 0) {
          await this.db.runAsync(
            `INSERT INTO meal_entries (userId, foodId, foodName, calories, protein, carbs, fat, mealType, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              userId,
              1, // Default food ID
              `Sample ${meals[i]}`,
              mealCalories[i],
              Math.floor(mealCalories[i] * 0.2), // 20% protein
              Math.floor(mealCalories[i] * 0.5), // 50% carbs
              Math.floor(mealCalories[i] * 0.3), // 30% fat
              meals[i],
              data.date
            ]
          );
        }
      }
    }

    console.log(`Added ${defaultData.length} days of default data`);
  }

  async saveUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(
      `INSERT INTO users (userId, goal, sportActivity, height, weight, gender) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userData.userId, userData.goal, userData.sportActivity, userData.height, userData.weight, userData.gender]
    );

    return result.lastInsertRowId as number;
  }

  async getUser(): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<User>(
      'SELECT * FROM users ORDER BY createdAt DESC LIMIT 1'
    );

    return result || null;
  }

  async hasUser(): Promise<boolean> {
    const user = await this.getUser();
    return user !== null;
  }

  async getCurrentUserId(): Promise<string | null> {
    const user = await this.getUser();
    return user?.userId || null;
  }

  async updateUser(userId: string, userData: Omit<User, 'id' | 'userId' | 'createdAt'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `UPDATE users SET goal = ?, sportActivity = ?, height = ?, weight = ?, gender = ? WHERE userId = ?`,
      [userData.goal, userData.sportActivity, userData.height, userData.weight, userData.gender, userId]
    );
  }

  async clearUser(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM users');
  }

  async createUserWithRandomData(): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');
    
    const userId = generateRandomUserId();
    const userProfile = generateIncompleteUserProfile(userId);
    const historicalData = generateRandomHistoricalData(userId);
    
    try {
      // Create user
      await this.saveUser(userProfile);
      
      // Add historical weight data
      for (const weightEntry of historicalData.weightEntries) {
        await this.db.runAsync(
          `INSERT INTO weight_entries (userId, weight, date, createdAt) VALUES (?, ?, ?, ?)`,
          [weightEntry.userId, weightEntry.weight, weightEntry.date, weightEntry.createdAt]
        );
      }
      
      // Add historical steps data
      for (const stepsEntry of historicalData.stepsEntries) {
        await this.db.runAsync(
          `INSERT INTO steps_entries (userId, steps, date, createdAt) VALUES (?, ?, ?, ?)`,
          [stepsEntry.userId, stepsEntry.steps, stepsEntry.date, stepsEntry.createdAt]
        );
      }
      
      // Add historical meal data
      for (const mealEntry of historicalData.mealEntries) {
        await this.db.runAsync(
          `INSERT INTO meal_entries (userId, foodId, foodName, calories, protein, carbs, fat, mealType, date, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [mealEntry.userId, mealEntry.foodId, mealEntry.foodName, mealEntry.calories, mealEntry.protein, mealEntry.carbs, mealEntry.fat, mealEntry.mealType, mealEntry.date, mealEntry.createdAt]
        );
      }
      
      // Create default user preferences
      await this.saveUserPreferences({
        userId,
        hidePhotos: false,
        defaultGraphType: 'line',
        defaultTimePeriod: 'week',
        defaultDataType: 'weight',
      });
      
      console.log(`Created user with ID: ${userId} and ${historicalData.weightEntries.length} weight entries, ${historicalData.stepsEntries.length} steps entries, ${historicalData.mealEntries.length} meal entries`);
      
      return userId;
    } catch (error) {
      console.error('Error creating user with random data:', error);
      throw error;
    }
  }

  // Personal Foods methods
  async savePersonalFood(foodData: Omit<PersonalFood, 'id' | 'createdAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(
      `INSERT INTO personal_foods (userId, name, calories, protein, carbs, fat, category, imageUri, isFromPhoto) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [foodData.userId, foodData.name, foodData.calories, foodData.protein, foodData.carbs, foodData.fat, foodData.category, foodData.imageUri || null, foodData.isFromPhoto ? 1 : 0]
    );

    return result.lastInsertRowId as number;
  }

  async getPersonalFoods(): Promise<PersonalFood[]> {
    if (!this.db) throw new Error('Database not initialized');

    const userId = await this.getCurrentUserId();
    if (!userId) return [];

    const result = await this.db.getAllAsync<PersonalFood>(
      'SELECT * FROM personal_foods WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );

    return result || [];
  }

  async deletePersonalFood(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM personal_foods WHERE id = ?', [id]);
  }

  // Meal Entries methods
  async saveMealEntry(mealData: Omit<MealEntry, 'id' | 'createdAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(
      `INSERT INTO meal_entries (userId, foodId, foodName, calories, protein, carbs, fat, mealType, date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [mealData.userId, mealData.foodId, mealData.foodName, mealData.calories, mealData.protein, mealData.carbs, mealData.fat, mealData.mealType, mealData.date]
    );

    return result.lastInsertRowId as number;
  }

  async getMealEntries(date?: string): Promise<MealEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const userId = await this.getCurrentUserId();
    if (!userId) return [];

    let query = 'SELECT * FROM meal_entries WHERE userId = ?';
    let params: any[] = [userId];

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }

    query += ' ORDER BY createdAt DESC';

    const result = await this.db.getAllAsync<MealEntry>(query, params);
    return result || [];
  }

  async getMealEntriesForDateRange(startDate: string, endDate: string): Promise<MealEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const userId = await this.getCurrentUserId();
    if (!userId) return [];

    const query = 'SELECT * FROM meal_entries WHERE userId = ? AND date >= ? AND date <= ? ORDER BY date DESC, createdAt DESC';
    const params = [userId, startDate, endDate];

    const result = await this.db.getAllAsync<MealEntry>(query, params);
    return result || [];
  }

  async getTodaysMealEntries(): Promise<MealEntry[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getMealEntries(today);
  }

  async deleteMealEntry(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM meal_entries WHERE id = ?', [id]);
  }

  // Weight Entries methods
  async saveWeightEntry(weightData: Omit<WeightEntry, 'id' | 'createdAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(
      `INSERT INTO weight_entries (userId, weight, imageUri, notes, date) 
       VALUES (?, ?, ?, ?, ?)`,
      [weightData.userId, weightData.weight, weightData.imageUri || null, weightData.notes || null, weightData.date]
    );

    return result.lastInsertRowId as number;
  }

  async getWeightEntries(startDate?: string, endDate?: string): Promise<WeightEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const userId = await this.getCurrentUserId();
    if (!userId) return [];

    let query = 'SELECT * FROM weight_entries WHERE userId = ?';
    let params: any[] = [userId];

    if (startDate && endDate) {
      query += ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }

    query += ' ORDER BY date DESC';

    const result = await this.db.getAllAsync<WeightEntry>(query, params);
    return result || [];
  }

  async getWeightEntriesForWeek(): Promise<WeightEntry[]> {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startDate = weekAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    
    return this.getWeightEntries(startDate, endDate);
  }

  async deleteWeightEntry(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM weight_entries WHERE id = ?', [id]);
  }

  // User Preferences methods
  async saveUserPreferences(preferences: Omit<UserPreferences, 'id' | 'createdAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    // First, try to update existing preferences
    const existing = await this.getUserPreferences();
    if (existing) {
      await this.db.runAsync(
        `UPDATE user_preferences SET hidePhotos = ?, defaultGraphType = ?, defaultTimePeriod = ?, defaultDataType = ? WHERE userId = ?`,
        [preferences.hidePhotos ? 1 : 0, preferences.defaultGraphType, preferences.defaultTimePeriod, preferences.defaultDataType, preferences.userId]
      );
      return existing.id;
    } else {
      // Create new preferences
      const result = await this.db.runAsync(
        `INSERT INTO user_preferences (userId, hidePhotos, defaultGraphType, defaultTimePeriod, defaultDataType) 
         VALUES (?, ?, ?, ?, ?)`,
        [preferences.userId, preferences.hidePhotos ? 1 : 0, preferences.defaultGraphType, preferences.defaultTimePeriod, preferences.defaultDataType]
      );
      return result.lastInsertRowId as number;
    }
  }

  async getUserPreferences(): Promise<UserPreferences | null> {
    if (!this.db) throw new Error('Database not initialized');

    const userId = await this.getCurrentUserId();
    if (!userId) return null;

    const result = await this.db.getFirstAsync<UserPreferences>(
      'SELECT * FROM user_preferences WHERE userId = ? ORDER BY createdAt DESC LIMIT 1',
      [userId]
    );

    return result || null;
  }

  // Steps Entry methods
  async saveStepsEntry(stepsData: Omit<StepsEntry, 'id' | 'createdAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(
      `INSERT INTO steps_entries (userId, steps, date) VALUES (?, ?, ?)`,
      [stepsData.userId, stepsData.steps, stepsData.date]
    );

    return result.lastInsertRowId as number;
  }

  async getStepsEntries(startDate?: string, endDate?: string): Promise<StepsEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const userId = await this.getCurrentUserId();
    if (!userId) return [];

    let query = 'SELECT * FROM steps_entries WHERE userId = ?';
    const params: any[] = [userId];

    if (startDate && endDate) {
      query += ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    } else if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY date DESC';

    const result = await this.db.getAllAsync<StepsEntry>(query, params);
    return result || [];
  }

  async getStepsEntriesForWeek(): Promise<StepsEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startDate = weekAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    return this.getStepsEntries(startDate, endDate);
  }

  async updateWeightEntry(id: number, data: { weight: number; imageUri?: string; notes?: string }): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `UPDATE weight_entries SET weight = ?, imageUri = ?, notes = ? WHERE id = ?`,
      [data.weight, data.imageUri || null, data.notes || null, id]
    );
  }

  async updateStepsEntry(id: number, data: { steps: number }): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `UPDATE steps_entries SET steps = ? WHERE id = ?`,
      [data.steps, id]
    );
  }


  async deleteStepsEntry(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(`DELETE FROM steps_entries WHERE id = ?`, [id]);
  }

  // Combined data methods for progress tracking
  async getProgressData(dataType: 'weight' | 'calories' | 'steps', startDate: string, endDate: string) {
    if (!this.db) throw new Error('Database not initialized');

    switch (dataType) {
      case 'weight':
        return this.getWeightEntries(startDate, endDate);
      case 'calories':
        return this.getMealEntries(startDate);
      case 'steps':
        return this.getStepsEntries(startDate, endDate);
      default:
        return [];
    }
  }

  // Chat History methods
  async saveChatHistory(userId: string, messages: any[]): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    // Check if chat history already exists for this user
    const existing = await this.getChatHistory(userId);
    
    if (existing) {
      // Update existing chat history
      await this.db.runAsync(
        `UPDATE chat_history SET messages = ?, updatedAt = CURRENT_TIMESTAMP WHERE userId = ?`,
        [JSON.stringify(messages), userId]
      );
      return existing.id;
    } else {
      // Create new chat history
      const result = await this.db.runAsync(
        `INSERT INTO chat_history (userId, messages) VALUES (?, ?)`,
        [userId, JSON.stringify(messages)]
      );
      return result.lastInsertRowId as number;
    }
  }

  async getChatHistory(userId: string): Promise<ChatHistory | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<ChatHistory>(
      'SELECT * FROM chat_history WHERE userId = ? ORDER BY updatedAt DESC LIMIT 1',
      [userId]
    );

    return result || null;
  }

  async deleteChatHistory(userId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM chat_history WHERE userId = ?', [userId]);
  }

  // Utility method to reset database (for development/testing)
  async resetDatabase(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      console.log('Resetting database...');
      
      // Drop all tables
      const tables = ['chat_history', 'user_preferences', 'steps_entries', 'weight_entries', 'meal_entries', 'personal_foods', 'users'];
      
      for (const table of tables) {
        try {
          await this.db.execAsync(`DROP TABLE IF EXISTS ${table}`);
        } catch (error) {
          console.log(`Error dropping table ${table}:`, error instanceof Error ? error.message : String(error));
        }
      }
      
      // Recreate tables
      await this.createTables();
      
      console.log('Database reset completed');
    } catch (error) {
      console.error('Error resetting database:', error);
      throw error;
    }
  }

}

export const database = new Database();
