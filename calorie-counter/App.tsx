import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { database } from './src/database/database';
import { databaseUtils } from './src/utils/databaseUtils';
import OnboardingFlow from './src/screens/onboarding/OnboardingFlow';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasUser, setHasUser] = useState(false);
  const [databaseError, setDatabaseError] = useState<string | null>(null);

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
      
      // Clear any previous database errors
      setDatabaseError(null);
    } catch (error) {
      console.error('Error checking user status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
      setDatabaseError(errorMessage);
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

  const handleResetDatabase = async () => {
    Alert.alert(
      'Reset Database',
      'This will delete all your data and start fresh. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              console.log('Resetting database...');
              await databaseUtils.resetDatabase();
              console.log('Database reset completed');
              setDatabaseError(null);
              setHasUser(false);
              // Recheck user status
              await checkUserStatus();
            } catch (error) {
              console.error('Error resetting database:', error);
              const errorMessage = error instanceof Error ? error.message : 'Failed to reset database';
              setDatabaseError(errorMessage);
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show database error screen if there's an error
  if (databaseError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Database Error</Text>
        <Text style={styles.errorMessage}>{databaseError}</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetDatabase}>
          <Text style={styles.resetButtonText}>Reset Database</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.retryButton} onPress={checkUserStatus}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <View style={styles.container}>
        {hasUser ? (
          <AppNavigator onLogout={handleLogout} />
        ) : (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        )}
      </View>
    </ThemeProvider>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1D29',
    padding: 20,
  },
  errorTitle: {
    color: '#FF6B6B',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

