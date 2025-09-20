# Calorie Tracker - Registration & Login Flow

This document describes the registration and login flow implementation for the Calorie Tracker React Native app.

## Features Implemented

### 1. SQLite Database
- **Location**: `database/`
- **Schema**: User table with goal, weekly activity, height, weight, gender, and timestamps
- **Helper Functions**: Database initialization, user creation, user retrieval, and user existence checking

### 2. Onboarding Flow
- **Goal Selection**: Choose between increase/decrease/maintain weight
- **Activity Level**: Select weekly exercise sessions (0-7)
- **Height Input**: Enter height in centimeters with quick select options
- **Weight Input**: Enter weight in kilograms with quick select options
- **Gender Selection**: Choose between male/female/other

### 3. Navigation System
- **React Navigation**: Stack navigator for smooth transitions
- **Auto-login**: If user data exists, skip onboarding and go directly to main screen
- **Logout**: Clear user data and return to onboarding

### 4. Main Screen
- **User Profile Display**: Shows all collected user information
- **Logout Functionality**: Clear data and return to onboarding

## File Structure

```
screens/
├── AppNavigator.tsx          # Main navigation controller
├── MainScreen.tsx            # Main app screen after login
└── onboarding/
    ├── OnboardingFlow.tsx    # Manages onboarding sequence
    ├── GoalScreen.tsx        # Goal selection screen
    ├── ActivityScreen.tsx    # Weekly activity input
    ├── HeightScreen.tsx      # Height input screen
    ├── WeightScreen.tsx      # Weight input screen
    └── GenderScreen.tsx      # Gender selection screen

database/
├── schema.ts                 # Database schema and types
├── database.ts              # Database operations
└── index.ts                 # Exports
```

## Usage

1. **First Launch**: User goes through onboarding flow
2. **Subsequent Launches**: User is automatically logged in
3. **Logout**: User can logout to clear data and restart onboarding

## Dependencies Added

- `expo-sqlite`: For local SQLite database
- `@react-navigation/stack`: For stack navigation

## Database Schema

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  goal TEXT NOT NULL CHECK (goal IN ('increase', 'decrease', 'maintain')),
  weeklyActivity INTEGER NOT NULL,
  height REAL NOT NULL,
  weight REAL NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## How It Works

1. App starts and checks if user data exists in SQLite
2. If no user data: Show onboarding flow
3. If user data exists: Show main screen
4. Onboarding collects user information step by step
5. After completion, user data is saved to SQLite
6. User can logout to clear data and restart the process
