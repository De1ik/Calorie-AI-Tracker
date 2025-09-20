import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { database } from '../../database/database';
import { User } from '../../database/schema';
import GenderScreen from './GenderScreen';
import WeightHeightScreen from './WeightHeightScreen';
import SportActivityScreen from './SportActivityScreen';
import GoalScreen from './GoalScreen';

interface OnboardingFlowProps {
  onComplete: () => void;
}

type OnboardingStep = 'gender' | 'weightHeight' | 'sportActivity' | 'goal';

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('gender');
  const [userData, setUserData] = useState<Partial<User>>({});

  const handleGenderSelect = (gender: User['gender']) => {
    setUserData(prev => ({ ...prev, gender }));
    setCurrentStep('weightHeight');
  };

  const handleWeightHeightSelect = (weight: number, height: number) => {
    setUserData(prev => ({ ...prev, weight, height }));
    setCurrentStep('sportActivity');
  };

  const handleSportActivitySelect = (sportActivity: string) => {
    setUserData(prev => ({ ...prev, sportActivity }));
    setCurrentStep('goal');
  };

  const handleGoalSelect = async (goal: User['goal']) => {
    const completeUserData = { ...userData, goal } as Omit<User, 'id' | 'createdAt'>;
    
    try {
      // Check if user exists
      const currentUserId = await database.getCurrentUserId();
      
      if (currentUserId) {
        // User exists, update with onboarding data
        await database.updateUser(currentUserId, completeUserData);
        console.log('User onboarding completed successfully (updated existing user)');
      } else {
        // No user exists, create new user with onboarding data + historical data
        console.log('No user found, creating new user with onboarding data...');
        const newUserId = await database.createUserWithRandomData();
        console.log('Created new user with ID:', newUserId);
        
        // Update the newly created user with the onboarding data
        await database.updateUser(newUserId, completeUserData);
        console.log('User onboarding completed successfully (created new user)');
      }
      
      onComplete();
    } catch (error) {
      console.error('Error saving user data:', error);
      // Handle error - could show an alert or retry
      Alert.alert('Error', 'Failed to save your preferences. Please try again.');
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'weightHeight':
        setCurrentStep('gender');
        break;
      case 'sportActivity':
        setCurrentStep('weightHeight');
        break;
      case 'goal':
        setCurrentStep('sportActivity');
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'gender':
        return <GenderScreen onNext={handleGenderSelect} onBack={handleBack} />;
      case 'weightHeight':
        return <WeightHeightScreen onNext={handleWeightHeightSelect} onBack={handleBack} />;
      case 'sportActivity':
        return <SportActivityScreen onNext={handleSportActivitySelect} onBack={handleBack} />;
      case 'goal':
        return <GoalScreen onNext={handleGoalSelect} onBack={handleBack} />;
      default:
        return <GenderScreen onNext={handleGenderSelect} onBack={handleBack} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
