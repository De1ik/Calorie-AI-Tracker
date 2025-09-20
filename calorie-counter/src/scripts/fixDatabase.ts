// Script to fix database issues
import { database } from '../database/database';
import { databaseUtils } from '../utils/databaseUtils';

async function fixDatabase() {
  try {
    console.log('Starting database fix...');
    
    // Initialize database
    await database.init();
    
    // Check current status
    console.log('Checking database status...');
    await databaseUtils.logDatabaseStatus();
    
    // Try to reset and recreate
    console.log('Resetting database...');
    await databaseUtils.resetDatabase();
    
    // Create fresh user with sample data
    console.log('Creating fresh user...');
    await databaseUtils.createFreshUser();
    
    // Check final status
    console.log('Final database status:');
    await databaseUtils.logDatabaseStatus();
    
    console.log('Database fix completed successfully!');
  } catch (error) {
    console.error('Error fixing database:', error);
    process.exit(1);
  }
}

// Run the fix if this script is executed directly
if (require.main === module) {
  fixDatabase();
}

export { fixDatabase };
