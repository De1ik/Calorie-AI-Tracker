# Calorie Tracker - Project Structure

## Updated Structure

The project has been restructured to use a cleaner `src` folder organization and a simple App.tsx entry point instead of Expo Router.

### File Structure

```
calorie-counter/
├── App.tsx                    # Main app entry point
├── app.json                   # Expo configuration
├── package.json               # Dependencies
├── src/
│   ├── database/
│   │   ├── schema.ts          # Database schema and types
│   │   ├── database.ts        # Database operations
│   │   └── index.ts           # Database exports
│   └── screens/
│       ├── MainScreen.tsx     # Main app screen after login
│       └── onboarding/
│           ├── OnboardingFlow.tsx  # Manages onboarding sequence
│           ├── GoalScreen.tsx      # Goal selection
│           ├── ActivityScreen.tsx  # Weekly activity input
│           ├── HeightScreen.tsx    # Height input
│           ├── WeightScreen.tsx    # Weight input
│           └── GenderScreen.tsx    # Gender selection
└── assets/                    # Images and static assets
```

## Key Changes

1. **Removed Expo Router**: Simplified to use a single App.tsx entry point
2. **Added src folder**: Organized code into logical folders
3. **Fixed NavigationContainer issue**: No more nested navigation containers
4. **Simplified navigation**: Direct state-based screen switching instead of complex navigation

## How It Works

1. **App.tsx**: Main entry point that checks for existing user data
2. **Database**: SQLite storage for user information
3. **Onboarding Flow**: 5-step registration process
4. **Main Screen**: Welcome screen with user profile and logout

## Dependencies

- `expo-sqlite`: For local database storage
- `react-native`: Core React Native framework
- `expo`: Expo SDK

## Running the App

```bash
npm start
```

The app will automatically detect if a user exists and show either the onboarding flow or the main screen accordingly.

