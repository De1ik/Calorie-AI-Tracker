# Calorie Tracker App 🍎

A React Native mobile app for tracking calories with user registration and login functionality.

## Features

- **User Registration**: Complete onboarding flow with goal, activity, height, weight, and gender selection
- **SQLite Database**: Local data storage for user information
- **Auto-login**: Automatic login for returning users
- **Clean UI**: Modern, intuitive interface for all screens

## Project Structure

```
src/
├── database/           # SQLite database schema and operations
├── screens/           # App screens
│   ├── MainScreen.tsx # Main app screen after login
│   └── onboarding/    # Registration flow screens
└── ...
```

## Get Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm start
   ```

3. Open the app in:
   - [Expo Go](https://expo.dev/go) on your mobile device
   - [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)

## How It Works

1. **First Launch**: Users complete a 5-step onboarding process
2. **Data Collection**: Goal, weekly activity, height, weight, and gender
3. **Database Storage**: All information saved to local SQLite database
4. **Return Visits**: Automatic login to main screen
5. **Logout**: Option to clear data and restart onboarding

## Dependencies

- `expo-sqlite`: Local database storage
- `react-native`: Core framework
- `expo`: Expo SDK

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
