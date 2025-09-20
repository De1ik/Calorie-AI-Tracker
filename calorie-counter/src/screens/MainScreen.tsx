import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { database } from '../database/database';
import { User, MealEntry, WeightEntry, StepsEntry } from '../database/schema';
import { dailyAnalysisService, DailyAnalysisResponse, DailyAnalysisRequest } from '../services/dailyAnalysis';
import DailyAnalysisModal from '../components/DailyAnalysisModal';

interface MainScreenProps {
  onLogout: () => void;
}

export default function MainScreen({ onLogout }: MainScreenProps) {
  const [user, setUser] = useState<User | null>(null);
  const [showDailyAnalysisModal, setShowDailyAnalysisModal] = useState(false);
  const [dailyAnalysisResult, setDailyAnalysisResult] = useState<DailyAnalysisResponse | null>(null);
  const [analyzingDaily, setAnalyzingDaily] = useState(false);
  const [todaysMeals, setTodaysMeals] = useState<MealEntry[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [stepsEntries, setStepsEntries] = useState<StepsEntry[]>([]);

  useEffect(() => {
    loadUserData();
    loadTodaysData();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTodaysData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const userData = await database.getUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadTodaysData = async () => {
    try {
      const meals = await database.getTodaysMealEntries();
      setTodaysMeals(meals);
      
      const weightData = await database.getWeightEntriesForWeek();
      setWeightEntries(weightData);
      
      const stepsData = await database.getStepsEntriesForWeek();
      setStepsEntries(stepsData);
    } catch (error) {
      console.error('Error loading today\'s data:', error);
    }
  };

  const performDailyAnalysis = async () => {
    if (!user) {
      Alert.alert('Error', 'User profile not found. Please complete onboarding first.');
      return;
    }

    setAnalyzingDaily(true);

    try {
      // Get current date and time
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = now.toISOString();

      // Calculate daily stats
      const todaysSteps = stepsEntries.find(entry => entry.date === today)?.steps || 0;
      const todaysWeight = weightEntries.find(entry => entry.date === today)?.weight || user.weight;
      const previousWeight = weightEntries[weightEntries.length - 1]?.weight || user.weight;

      // Calculate calories from meals
      const totalCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
      const totalProtein = todaysMeals.reduce((sum, meal) => sum + meal.protein, 0);
      const totalCarbs = todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0);
      const totalFat = todaysMeals.reduce((sum, meal) => sum + meal.fat, 0);

      // Organize meals by type
      const mealsByType = {
        breakfast: todaysMeals.filter(meal => meal.mealType === 'breakfast'),
        lunch: todaysMeals.filter(meal => meal.mealType === 'lunch'),
        dinner: todaysMeals.filter(meal => meal.mealType === 'dinner'),
        snacks: todaysMeals.filter(meal => meal.mealType === 'snack'),
      };

      // Create analysis request
      const analysisRequest: DailyAnalysisRequest = {
        date: today,
        currentTime,
        userProfile: {
          ...user,
          activityLevel: user.sportActivity === 'none' ? 'sedentary' : 
                        user.sportActivity === 'light' ? 'light' :
                        user.sportActivity === 'moderate' ? 'moderate' : 'active'
        },
        dailyData: {
          steps: {
            current: todaysSteps,
            goal: 10000, // Default goal, could be user-configurable
            average: 8000, // Could be calculated from historical data
          },
          calories: {
            consumed: totalCalories,
            burned: Math.round(todaysSteps * 0.04), // Rough estimate: 0.04 calories per step
            goal: user.goal === 'decrease' ? 1500 : user.goal === 'increase' ? 2500 : 2000,
            deficit: totalCalories - Math.round(todaysSteps * 0.04),
          },
          weight: {
            current: todaysWeight,
            previous: previousWeight,
            change: todaysWeight - previousWeight,
          },
          meals: mealsByType as any,
          water: {
            consumed: 0, // Not tracked yet, could be added
            goal: 2000, // 2L default
          },
        },
      };

      // Perform analysis
      console.log('Starting daily analysis with request:', analysisRequest);
      const result = await dailyAnalysisService.analyzeDailyProgress(analysisRequest);
      console.log('Daily analysis result:', result);
      setDailyAnalysisResult(result);
      setShowDailyAnalysisModal(true);
      
      // Fallback alert in case modal doesn't show
      if (result.success && result.data) {
        Alert.alert(
          'Daily Analysis Complete!',
          `Overall Score: ${result.data.healthInsights.overallScore}/10\n\n${result.data.personalizedAdvice}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error performing daily analysis:', error);
      Alert.alert('Analysis Error', 'Failed to analyze your daily progress. Please try again.');
    } finally {
      setAnalyzingDaily(false);
    }
  };

  const handleLogout = async () => {
    try {
      await database.clearUser();
      onLogout();
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 18) return 'Good afternoon!';
    return 'Good evening!';
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.date}>{getCurrentDate()}</Text>
        </View>

        {/* Today's Progress Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="trending-up" size={20} color="#4CAF50" />
            <Text style={styles.cardTitle}>Today's Progress</Text>
          </View>
          
          <View style={styles.caloriesSection}>
            <Text style={styles.caloriesLabel}>Calories</Text>
            <Text style={styles.caloriesValue}>
              {todaysMeals.reduce((sum, meal) => sum + meal.calories, 0)} / {user?.goal === 'decrease' ? 1500 : user?.goal === 'increase' ? 2500 : 2000}
            </Text>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill, 
              { 
                width: `${Math.min(100, (todaysMeals.reduce((sum, meal) => sum + meal.calories, 0) / (user?.goal === 'decrease' ? 1500 : user?.goal === 'increase' ? 2500 : 2000)) * 100)}%` 
              }
            ]} />
          </View>
          
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: '#4CAF50' }]}>
                {todaysMeals.reduce((sum, meal) => sum + meal.protein, 0).toFixed(0)}g
              </Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: '#FF9800' }]}>
                {todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0).toFixed(0)}g
              </Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: '#FFFFFF' }]}>
                {todaysMeals.reduce((sum, meal) => sum + meal.fat, 0).toFixed(0)}g
              </Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Daily Analysis Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="bulb" size={20} color="#FF9800" />
            <Text style={styles.cardTitle}>Daily Analysis</Text>
          </View>
          <Text style={styles.cardSubtitle}>Get personalized insights about your nutrition</Text>
          <TouchableOpacity 
            style={[styles.analysisButton, analyzingDaily && styles.analysisButtonDisabled]} 
            onPress={performDailyAnalysis}
            disabled={analyzingDaily}
          >
            {analyzingDaily ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.analysisButtonText}>Generate Today's Analysis</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Recent Meals Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="restaurant" size={20} color="#4CAF50" />
            <Text style={styles.cardTitle}>Recent Meals</Text>
          </View>
          
          {todaysMeals.length > 0 ? (
            todaysMeals.slice(0, 3).map((meal, index) => (
              <View key={meal.id} style={styles.mealItem}>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.foodName}</Text>
                  <Text style={styles.mealTime}>
                    {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)} • {new Date(meal.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.mealCalories}>{meal.calories} cal</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noMealsText}>No meals logged today</Text>
          )}
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="calendar" size={24} color="#4CAF50" />
              <Text style={styles.summaryNumber}>{todaysMeals.length}</Text>
            </View>
            <Text style={styles.summaryLabel}>Meals Today</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="trending-up" size={24} color="#FF9800" />
            </View>
            <Text style={styles.summaryText}>
              {user?.goal === 'decrease' ? 'Lose' : user?.goal === 'increase' ? 'Gain' : 'Maintain'}
            </Text>
            <Text style={styles.summaryLabel}>Goal</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Daily Analysis Modal */}
      <DailyAnalysisModal
        visible={showDailyAnalysisModal}
        onClose={() => {
          setShowDailyAnalysisModal(false);
          setDailyAnalysisResult(null);
        }}
        analysisResult={dailyAnalysisResult}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D29',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: '#8E8E93',
  },
  card: {
    backgroundColor: '#2C2F3A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
  },
  caloriesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  caloriesLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  caloriesValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#3A3A3A',
    borderRadius: 2,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    width: '0%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  analysisButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  analysisButtonDisabled: {
    opacity: 0.7,
  },
  analysisButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  mealCalories: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  noMealsText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    paddingVertical: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#2C2F3A',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  summaryIcon: {
    position: 'relative',
    marginBottom: 8,
  },
  summaryNumber: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  summaryText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
