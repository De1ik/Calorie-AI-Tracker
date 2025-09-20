# Database Issue Fix

## Problem
The app was experiencing a database constraint error:
```
ERROR: NOT NULL constraint failed: weight_entries.userId
```

This occurred because the database schema was updated to require a `userId` field for all tables, but the default data insertion code was not providing this field.

## Root Cause
1. The database schema was updated to include `userId` as a NOT NULL field
2. The `addDefaultData()` method was still using the old INSERT statements without `userId`
3. Existing data in the database had NULL `userId` values, causing constraint violations

## Solution Implemented

### 1. Fixed Default Data Insertion
Updated the `addDefaultData()` method in `database.ts` to:
- Get or create a user before inserting default data
- Include `userId` in all INSERT statements for:
  - `weight_entries`
  - `steps_entries` 
  - `meal_entries`

### 2. Added Data Cleanup
Created a `cleanupOrphanedData()` method that:
- Removes any existing records with NULL `userId`
- Runs during database initialization
- Prevents constraint violations from old data

### 3. Enhanced Error Handling
Updated `App.tsx` to:
- Catch and display database initialization errors
- Provide a "Reset Database" button for users
- Show a "Retry" option to attempt reconnection
- Gracefully handle database issues

### 4. Added Database Utilities
Created `databaseUtils.ts` with:
- Database health checking
- Fresh user creation
- Database reset functionality
- Status logging

### 5. Added Reset Functionality
- Users can reset the database from the error screen
- Complete database recreation with fresh schema
- Automatic user creation with sample data

## Files Modified

### Core Database Files:
- `src/database/database.ts` - Fixed INSERT statements and added cleanup
- `src/database/schema.ts` - Already had correct schema

### App Files:
- `App.tsx` - Added error handling and reset functionality

### New Utility Files:
- `src/utils/databaseUtils.ts` - Database maintenance utilities
- `src/scripts/fixDatabase.ts` - Standalone fix script

## How to Use

### For Users:
1. If you see a "Database Error" screen, tap "Reset Database"
2. Confirm the reset (this will delete all data)
3. The app will recreate the database with fresh data

### For Developers:
```typescript
// Check database health
import { databaseUtils } from './src/utils/databaseUtils';
await databaseUtils.logDatabaseStatus();

// Reset database programmatically
await databaseUtils.resetDatabase();

// Create fresh user
const userId = await databaseUtils.createFreshUser();
```

## Prevention
The fix includes:
- Proper error handling during database initialization
- Automatic cleanup of orphaned data
- User-friendly error recovery options
- Comprehensive logging for debugging

## Testing
The solution has been tested to:
- Handle existing databases with NULL userId values
- Create fresh databases correctly
- Provide fallback options for users
- Maintain data integrity

The database issue should now be resolved, and users have options to recover from any future database problems.
