// Database utility functions for troubleshooting and maintenance
import { database } from '../database/database';

export const databaseUtils = {
  // Reset the entire database (use with caution!)
  async resetDatabase(): Promise<void> {
    try {
      console.log('Resetting database...');
      await database.resetDatabase();
      console.log('Database reset completed successfully');
    } catch (error) {
      console.error('Error resetting database:', error);
      throw error;
    }
  },

  // Check database health
  async checkDatabaseHealth(): Promise<{
    isHealthy: boolean;
    issues: string[];
    userCount: number;
    dataCounts: Record<string, number>;
  }> {
    try {
      const issues: string[] = [];
      const dataCounts: Record<string, number> = {};

      // Check if database is initialized
      if (!database) {
        issues.push('Database not initialized');
        return { isHealthy: false, issues, userCount: 0, dataCounts };
      }

      // Check user count
      const user = await database.getUser();
      const userCount = user ? 1 : 0;
      
      if (userCount === 0) {
        issues.push('No user found in database');
      }

      // Check data counts
      try {
        const userId = await database.getCurrentUserId();
        if (userId) {
          const weightEntries = await database.getWeightEntries();
          const stepsEntries = await database.getStepsEntries();
          const mealEntries = await database.getMealEntries();
          const personalFoods = await database.getPersonalFoods();
          const chatHistory = await database.getChatHistory(userId);

          dataCounts.weightEntries = weightEntries.length;
          dataCounts.stepsEntries = stepsEntries.length;
          dataCounts.mealEntries = mealEntries.length;
          dataCounts.personalFoods = personalFoods.length;
          dataCounts.chatHistory = chatHistory ? 1 : 0;
        }
      } catch (error) {
        issues.push(`Error checking data counts: ${error instanceof Error ? error.message : String(error)}`);
      }

      const isHealthy = issues.length === 0;
      
      return {
        isHealthy,
        issues,
        userCount,
        dataCounts
      };
    } catch (error) {
      return {
        isHealthy: false,
        issues: [`Database health check failed: ${error instanceof Error ? error.message : String(error)}`],
        userCount: 0,
        dataCounts: {}
      };
    }
  },

  // Create a fresh user with sample data
  async createFreshUser(): Promise<string> {
    try {
      console.log('Creating fresh user with sample data...');
      const userId = await database.createUserWithRandomData();
      console.log(`Fresh user created with ID: ${userId}`);
      return userId;
    } catch (error) {
      console.error('Error creating fresh user:', error);
      throw error;
    }
  },

  // Log database status
  async logDatabaseStatus(): Promise<void> {
    try {
      const health = await this.checkDatabaseHealth();
      
      console.log('=== Database Status ===');
      console.log(`Healthy: ${health.isHealthy}`);
      console.log(`User Count: ${health.userCount}`);
      console.log('Data Counts:', health.dataCounts);
      
      if (health.issues.length > 0) {
        console.log('Issues:');
        health.issues.forEach(issue => console.log(`  - ${issue}`));
      }
      
      console.log('======================');
    } catch (error) {
      console.error('Error logging database status:', error);
    }
  }
};

// Export for easy access
export default databaseUtils;
