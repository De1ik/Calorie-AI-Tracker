import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { database } from './src/database/database';
import OnboardingFlow from './src/screens/onboarding/OnboardingFlow';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      console.log('Initializing database...');
      await database.init();
      console.log('Database initialized successfully');
      
      console.log('Checking if user exists...');
      const userExists = await database.hasUser();
      console.log('User exists:', userExists);
      
      if (!userExists) {
        console.log('No user found, will create user during onboarding...');
        // Don't create user here - let onboarding handle it
        setHasUser(false);
      } else {
        // User exists, check if they've completed onboarding
        const user = await database.getUser();
        if (user && user.goal && user.height && user.weight && user.gender && user.sportActivity) {
          // User has completed onboarding
          setHasUser(true);
        } else {
          // User exists but hasn't completed onboarding
          setHasUser(false);
        }
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      // Set to false to show onboarding if there's an error
      setHasUser(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setHasUser(true);
  };

  const handleLogout = () => {
    setHasUser(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {hasUser ? (
        <AppNavigator onLogout={handleLogout} />
      ) : (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1D29',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
  },
});

