import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, FlatList, Alert, Modal, Image, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { database } from '../database/database';
import { PersonalFood, MealEntry } from '../database/schema';
import { foodAnalysisService } from '../services/foodAnalysis';
import { FoodAnalysisSummaryModal } from '../components/FoodAnalysisSummaryModal';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  imageUri?: string;
  isFromPhoto?: boolean;
}

const sampleFoods: FoodItem[] = [
  { id: '1', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'Protein' },
  { id: '2', name: 'Brown Rice', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, category: 'Carbs' },
  { id: '3', name: 'Avocado', calories: 160, protein: 2, carbs: 9, fat: 15, category: 'Fats' },
  { id: '4', name: 'Salmon', calories: 208, protein: 25, carbs: 0, fat: 12, category: 'Protein' },
  { id: '5', name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, category: 'Carbs' },
  { id: '6', name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, category: 'Fats' },
];

type TabType = 'database' | 'diary';
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export default function FoodScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('database');
  const [personalFoods, setPersonalFoods] = useState<PersonalFood[]>([]);
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
  const [showMealTypeModal, setShowMealTypeModal] = useState(false);
  const [selectedFoodForMeal, setSelectedFoodForMeal] = useState<FoodItem | null>(null);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [newFoodData, setNewFoodData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    category: 'Other',
  });
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState<string>('');
  const [isPhotoFlow, setIsPhotoFlow] = useState(false);
  const [pendingPhotoUri, setPendingPhotoUri] = useState<string>('');
  const [showAnalysisSummary, setShowAnalysisSummary] = useState(false);
  const [analyzedFoodData, setAnalyzedFoodData] = useState<any>(null);
  const [pendingMealType, setPendingMealType] = useState<MealType>('breakfast');

  const categories = ['All', 'Protein', 'Carbs', 'Fats', 'Vegetables', 'Fruits'];
  const mealTypes: { type: MealType; label: string; icon: string }[] = [
    { type: 'breakfast', label: 'Breakfast', icon: 'sunny' },
    { type: 'lunch', label: 'Lunch', icon: 'restaurant' },
    { type: 'dinner', label: 'Dinner', icon: 'moon' },
    { type: 'snack', label: 'Snack', icon: 'cafe' },
  ];

  useEffect(() => {
    loadPersonalFoods();
    loadTodaysMeals();
  }, []);

  const loadPersonalFoods = async () => {
    try {
      const foods = await database.getPersonalFoods();
      setPersonalFoods(foods);
    } catch (error) {
      console.error('Error loading personal foods:', error);
    }
  };

  const loadTodaysMeals = async () => {
    try {
      const meals = await database.getTodaysMealEntries();
      setMealEntries(meals);
    } catch (error) {
      console.error('Error loading meal entries:', error);
    }
  };

  const getFilteredFoods = () => {
    let foods: FoodItem[] = [];
    
    switch (activeTab) {
      case 'database':
        foods = sampleFoods;
        break;
      case 'diary':
        foods = personalFoods.map(food => ({
          id: food.id.toString(),
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          category: food.category,
          imageUri: food.imageUri,
          isFromPhoto: food.isFromPhoto,
        }));
        break;
    }

    return foods.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const addFood = (food: FoodItem) => {
    setSelectedFoodForMeal(food);
    setShowMealTypeModal(true);
  };

  const addToMeal = async (mealType: MealType) => {
    setShowMealTypeModal(false);

    // If this is a photo flow, analyze the image first
    if (isPhotoFlow && pendingPhotoUri) {
      setCurrentImageUri(pendingPhotoUri);
      setAnalyzingImage(true);
      setPendingMealType(mealType);

      try {
        // Analyze the food image using AI
        const result = await foodAnalysisService.analyzeFoodImage({ imageUri: pendingPhotoUri });
        
        if (result.success && result.data) {
          // Create a food item from the analysis result
          const analyzedFood: FoodItem = {
            id: Date.now().toString(),
            name: result.data.foodItem.name,
            calories: result.data.nutritionalInfo.calories,
            protein: result.data.nutritionalInfo.protein,
            carbs: result.data.nutritionalInfo.carbs,
            fat: result.data.nutritionalInfo.fat,
            category: result.data.foodItem.category,
            imageUri: pendingPhotoUri,
            isFromPhoto: true,
          };

          // Prepare data for the summary modal
          const summaryData = {
            name: analyzedFood.name,
            calories: analyzedFood.calories,
            protein: analyzedFood.protein,
            carbs: analyzedFood.carbs,
            fat: analyzedFood.fat,
            category: analyzedFood.category,
            imageUri: analyzedFood.imageUri,
            rating: result.data.rating,
            healthInsights: result.data.healthInsights?.benefits || [],
            nutritionalAdvice: result.data.nutritionalAdvice,
          };

          setAnalyzedFoodData(summaryData);
          setShowAnalysisSummary(true);
        } else {
          Alert.alert('Analysis Error', 'Failed to analyze the food image. Please try again.');
        }
      } catch (error) {
        console.error('Error analyzing food image:', error);
        Alert.alert('Analysis Error', 'Failed to analyze the food image. Please try again.');
      } finally {
        setAnalyzingImage(false);
      }
    } else if (selectedFoodForMeal) {
      // Regular food flow
      try {
        const userId = await database.getCurrentUserId();
        if (!userId) throw new Error('No user ID found');
        
        const today = new Date().toISOString().split('T')[0];
        await database.saveMealEntry({
          userId,
          foodId: parseInt(selectedFoodForMeal.id),
          foodName: selectedFoodForMeal.name,
          calories: selectedFoodForMeal.calories,
          protein: selectedFoodForMeal.protein,
          carbs: selectedFoodForMeal.carbs,
          fat: selectedFoodForMeal.fat,
          mealType,
          date: today,
        });

        setSelectedFoods(prev => [...prev, selectedFoodForMeal]);
        setSelectedFoodForMeal(null);
        loadTodaysMeals();
      } catch (error) {
        console.error('Error adding meal entry:', error);
        Alert.alert('Error', 'Failed to add food to meal');
      }
    }
  };

  const removeFood = (foodId: string) => {
    setSelectedFoods(prev => prev.filter(food => food.id !== foodId));
  };

  const getTotalCalories = () => {
    return selectedFoods.reduce((total, food) => total + food.calories, 0);
  };

  const getTotalMacros = () => {
    return selectedFoods.reduce(
      (totals, food) => ({
        protein: totals.protein + food.protein,
        carbs: totals.carbs + food.carbs,
        fat: totals.fat + food.fat,
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handlePhotoResult(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Gallery permission is required to select photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handlePhotoResult(result.assets[0].uri);
    }
  };

  const handlePhotoResult = async (imageUri: string) => {
    // Store the photo URI and show meal type selection first
    setPendingPhotoUri(imageUri);
    setIsPhotoFlow(true);
    setShowMealTypeModal(true);
  };

  const handleAnalysisSummaryConfirm = async () => {
    if (!analyzedFoodData) return;

    try {
      // Save to personal foods first
      const userId = await database.getCurrentUserId();
      if (!userId) throw new Error('No user ID found');
      
      await database.savePersonalFood({
        userId,
        name: analyzedFoodData.name,
        calories: analyzedFoodData.calories,
        protein: analyzedFoodData.protein,
        carbs: analyzedFoodData.carbs,
        fat: analyzedFoodData.fat,
        category: analyzedFoodData.category,
        imageUri: analyzedFoodData.imageUri,
        isFromPhoto: true,
      });

      // Add to meal entry
      const today = new Date().toISOString().split('T')[0];
      await database.saveMealEntry({
        userId,
        foodId: Date.now(),
        foodName: analyzedFoodData.name,
        calories: analyzedFoodData.calories,
        protein: analyzedFoodData.protein,
        carbs: analyzedFoodData.carbs,
        fat: analyzedFoodData.fat,
        mealType: pendingMealType,
        date: today,
      });

      // Create food item for selected foods
      const analyzedFood: FoodItem = {
        id: Date.now().toString(),
        name: analyzedFoodData.name,
        calories: analyzedFoodData.calories,
        protein: analyzedFoodData.protein,
        carbs: analyzedFoodData.carbs,
        fat: analyzedFoodData.fat,
        category: analyzedFoodData.category,
        imageUri: analyzedFoodData.imageUri,
        isFromPhoto: true,
      };

      setSelectedFoods(prev => [...prev, analyzedFood]);
      loadTodaysMeals();
      loadPersonalFoods();
      
      // Close modal and reset states
      setShowAnalysisSummary(false);
      setIsPhotoFlow(false);
      setPendingPhotoUri('');
      setCurrentImageUri('');
      setAnalyzedFoodData(null);
      
      Alert.alert('Success', `Food analyzed and added to ${pendingMealType}!`);
    } catch (error) {
      console.error('Error saving analyzed food:', error);
      Alert.alert('Error', 'Failed to save the analyzed food. Please try again.');
    }
  };

  const handleAnalysisSummaryCancel = () => {
    setShowAnalysisSummary(false);
    setIsPhotoFlow(false);
    setPendingPhotoUri('');
    setCurrentImageUri('');
    setAnalyzedFoodData(null);
  };

  const saveToPersonalFoods = async (food: FoodItem) => {
    try {
      const userId = await database.getCurrentUserId();
      if (!userId) throw new Error('No user ID found');
      
      await database.savePersonalFood({
        userId,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        category: food.category,
        imageUri: food.imageUri,
        isFromPhoto: food.isFromPhoto || false,
      });

      loadPersonalFoods();
      Alert.alert('Success', 'Food added to your personal diary');
    } catch (error) {
      console.error('Error saving personal food:', error);
      Alert.alert('Error', 'Failed to save food to diary');
    }
  };


  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <View style={styles.foodItem}>
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.foodImage} />
      )}
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodCategory}>{item.category}</Text>
        {item.isFromPhoto && (
          <Text style={styles.photoLabel}>📷 From Photo</Text>
        )}
        <View style={styles.macrosRow}>
          <Text style={styles.macroText}>{item.calories} cal</Text>
          <Text style={styles.macroText}>P: {item.protein}g</Text>
          <Text style={styles.macroText}>C: {item.carbs}g</Text>
          <Text style={styles.macroText}>F: {item.fat}g</Text>
        </View>
      </View>
      <View style={styles.foodActions}>
        <TouchableOpacity style={styles.addButton} onPress={() => addFood(item)}>
          <Ionicons name="add" size={20} color="#4CAF50" />
        </TouchableOpacity>
        {activeTab === 'database' && (
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={() => saveToPersonalFoods(item)}
          >
            <Ionicons name="bookmark" size={16} color="#FF9800" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );


  const totals = getTotalMacros();
  const filteredFoods = getFilteredFoods();

  const renderHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Food Logging</Text>
        <Text style={styles.subtitle}>Track your meals and nutrition</Text>
      </View>

      {/* Photo Actions */}
      <View style={styles.photoActionsContainer}>
        <TouchableOpacity 
          style={[styles.photoButton, analyzingImage && styles.photoButtonDisabled]} 
          onPress={takePhoto}
          disabled={analyzingImage}
        >
          {analyzingImage ? (
            <ActivityIndicator size="small" color="#4CAF50" />
          ) : (
            <Ionicons name="camera" size={24} color="#4CAF50" />
          )}
          <Text style={styles.photoButtonText}>
            {analyzingImage ? 'Analyzing...' : 'Take Photo'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.photoButton, analyzingImage && styles.photoButtonDisabled]} 
          onPress={pickFromGallery}
          disabled={analyzingImage}
        >
          {analyzingImage ? (
            <ActivityIndicator size="small" color="#4CAF50" />
          ) : (
            <Ionicons name="images" size={24} color="#4CAF50" />
          )}
          <Text style={styles.photoButtonText}>
            {analyzingImage ? 'Analyzing...' : 'From Gallery'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'database' && styles.activeTab]}
          onPress={() => setActiveTab('database')}
        >
          <Text style={[styles.tabText, activeTab === 'database' && styles.activeTabText]}>
            Database
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'diary' && styles.activeTab]}
          onPress={() => setActiveTab('diary')}
        >
          <Text style={[styles.tabText, activeTab === 'diary' && styles.activeTabText]}>
            My Diary
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search foods..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.categoryButtonTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Selected Foods Summary */}
      {selectedFoods.length > 0 && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Meals</Text>
          <View style={styles.summaryStats}>
            <Text style={styles.summaryCalories}>{getTotalCalories()} cal</Text>
            <View style={styles.summaryMacros}>
              <Text style={styles.summaryMacroText}>P: {totals.protein.toFixed(1)}g</Text>
              <Text style={styles.summaryMacroText}>C: {totals.carbs.toFixed(1)}g</Text>
              <Text style={styles.summaryMacroText}>F: {totals.fat.toFixed(1)}g</Text>
            </View>
          </View>
          <View style={styles.selectedFoodsList}>
            {selectedFoods.map((item) => (
              <View key={item.id} style={styles.selectedFoodItem}>
                <View style={styles.selectedFoodInfo}>
                  <Text style={styles.selectedFoodName}>{item.name}</Text>
                  <Text style={styles.selectedFoodCalories}>{item.calories} cal</Text>
                </View>
                <TouchableOpacity style={styles.removeButton} onPress={() => removeFood(item.id)}>
                  <Ionicons name="close" size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Section Title */}
      <View style={styles.foodListContainer}>
        <Text style={styles.sectionTitle}>
          {activeTab === 'database' ? 'Available Foods' : 'My Food Diary'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={filteredFoods}
            renderItem={renderFoodItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* Meal Type Modal */}
      <Modal
        visible={showMealTypeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMealTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isPhotoFlow ? 'Select Meal Type' : 'Add to Meal'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {isPhotoFlow 
                ? 'Choose which meal this food belongs to' 
                : `${selectedFoodForMeal?.name} - ${selectedFoodForMeal?.calories} cal`
              }
            </Text>
            
            <View style={styles.mealTypesContainer}>
              {mealTypes.map((meal) => (
                <TouchableOpacity
                  key={meal.type}
                  style={[styles.mealTypeButton, analyzingImage && styles.mealTypeButtonDisabled]}
                  onPress={() => addToMeal(meal.type)}
                  disabled={analyzingImage}
                >
                  {analyzingImage ? (
                    <ActivityIndicator size="small" color="#4CAF50" />
                  ) : (
                    <Ionicons name={meal.icon as any} size={24} color="#4CAF50" />
                  )}
                  <Text style={styles.mealTypeText}>{meal.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowMealTypeModal(false);
                if (isPhotoFlow) {
                  setIsPhotoFlow(false);
                  setPendingPhotoUri('');
                }
                setSelectedFoodForMeal(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Food Analysis Summary Modal */}
      {analyzedFoodData && (
        <FoodAnalysisSummaryModal
          visible={showAnalysisSummary}
          onClose={handleAnalysisSummaryCancel}
          onConfirm={handleAnalysisSummaryConfirm}
          foodData={analyzedFoodData}
          mealType={pendingMealType}
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D29',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  photoActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  photoButton: {
    backgroundColor: '#2C2F3A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  photoButtonDisabled: {
    opacity: 0.6,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#2C2F3A',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2F3A',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 12,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2C2F3A',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
  },
  categoryButtonText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: '#2C2F3A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryCalories: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  summaryMacros: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryMacroText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  selectedFoodsList: {
    maxHeight: 150,
  },
  selectedFoodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  selectedFoodInfo: {
    flex: 1,
  },
  selectedFoodName: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 2,
  },
  selectedFoodCalories: {
    color: '#8E8E93',
    fontSize: 12,
  },
  removeButton: {
    padding: 4,
  },
  foodListContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2F3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  foodCategory: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 4,
  },
  photoLabel: {
    fontSize: 10,
    color: '#FF9800',
    marginBottom: 8,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  macroText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  foodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    padding: 8,
    marginRight: 8,
  },
  saveButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2C2F3A',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  mealTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  mealTypeButton: {
    backgroundColor: '#1A1D29',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  mealTypeButtonDisabled: {
    opacity: 0.6,
  },
  mealTypeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: '#3A3A3A',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
