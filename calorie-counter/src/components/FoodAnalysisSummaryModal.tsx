import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FoodAnalysisSummaryModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  foodData: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    category: string;
    imageUri?: string;
    rating?: {
      overall: number;
      healthiness: number;
      freshness: number;
    };
    healthInsights?: string[];
  };
  mealType: string;
}

export const FoodAnalysisSummaryModal: React.FC<FoodAnalysisSummaryModalProps> = ({
  visible,
  onClose,
  onConfirm,
  foodData,
  mealType,
}) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return '#4CAF50';
    if (rating >= 6) return '#FF9800';
    return '#F44336';
  };

  const getRatingText = (rating: number) => {
    if (rating >= 8) return 'Excellent';
    if (rating >= 6) return 'Good';
    return 'Fair';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <Text style={styles.headerTitle}>Food Analyzed!</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            {/* Food Image */}
            {foodData.imageUri && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: foodData.imageUri }} style={styles.foodImage} />
              </View>
            )}

            {/* Food Name */}
            <View style={styles.foodNameContainer}>
              <Text style={styles.foodName}>{foodData.name}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{foodData.category}</Text>
              </View>
            </View>

            {/* Nutritional Information */}
            <View style={styles.nutritionContainer}>
              <Text style={styles.sectionTitle}>Nutritional Information</Text>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <View style={[styles.nutritionIcon, { backgroundColor: '#FF5722' }]}>
                    <Ionicons name="flame" size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.nutritionValue}>{foodData.calories}</Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                
                <View style={styles.nutritionItem}>
                  <View style={[styles.nutritionIcon, { backgroundColor: '#4CAF50' }]}>
                    <Ionicons name="fitness" size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.nutritionValue}>{foodData.protein}g</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                
                <View style={styles.nutritionItem}>
                  <View style={[styles.nutritionIcon, { backgroundColor: '#FF9800' }]}>
                    <Ionicons name="leaf" size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.nutritionValue}>{foodData.carbs}g</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                
                <View style={styles.nutritionItem}>
                  <View style={[styles.nutritionIcon, { backgroundColor: '#2196F3' }]}>
                    <Ionicons name="water" size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.nutritionValue}>{foodData.fat}g</Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
              </View>
            </View>

            {/* Food Rating */}
            {foodData.rating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.sectionTitle}>Food Rating</Text>
                <View style={styles.ratingGrid}>
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingLabel}>Overall</Text>
                    <View style={styles.ratingBar}>
                      <View 
                        style={[
                          styles.ratingFill, 
                          { 
                            width: `${(foodData.rating.overall / 10) * 100}%`,
                            backgroundColor: getRatingColor(foodData.rating.overall)
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.ratingValue, { color: getRatingColor(foodData.rating.overall) }]}>
                      {foodData.rating.overall}/10
                    </Text>
                  </View>
                  
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingLabel}>Healthiness</Text>
                    <View style={styles.ratingBar}>
                      <View 
                        style={[
                          styles.ratingFill, 
                          { 
                            width: `${(foodData.rating.healthiness / 10) * 100}%`,
                            backgroundColor: getRatingColor(foodData.rating.healthiness)
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.ratingValue, { color: getRatingColor(foodData.rating.healthiness) }]}>
                      {foodData.rating.healthiness}/10
                    </Text>
                  </View>
                  
                  <View style={styles.ratingItem}>
                    <Text style={styles.ratingLabel}>Freshness</Text>
                    <View style={styles.ratingBar}>
                      <View 
                        style={[
                          styles.ratingFill, 
                          { 
                            width: `${(foodData.rating.freshness / 10) * 100}%`,
                            backgroundColor: getRatingColor(foodData.rating.freshness)
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.ratingValue, { color: getRatingColor(foodData.rating.freshness) }]}>
                      {foodData.rating.freshness}/10
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Health Insights */}
            {foodData.healthInsights && foodData.healthInsights.length > 0 && (
              <View style={styles.insightsContainer}>
                <Text style={styles.sectionTitle}>Health Insights</Text>
                {foodData.healthInsights.map((insight, index) => (
                  <View key={index} style={styles.insightItem}>
                    <Ionicons name="bulb" size={16} color="#FFD700" />
                    <Text style={styles.insightText}>{insight}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Meal Type Info */}
            <View style={styles.mealTypeContainer}>
              <View style={styles.mealTypeInfo}>
                <Ionicons name="restaurant" size={20} color="#4CAF50" />
                <Text style={styles.mealTypeText}>Will be added to: <Text style={styles.mealTypeBold}>{mealType}</Text></Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={styles.confirmButtonText}>Add to {mealType}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#2C2F3A',
    borderRadius: 20,
    width: '100%',
    maxHeight: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3D4A',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 5,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  foodImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  foodNameContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  nutritionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    width: '48%',
    backgroundColor: '#3A3D4A',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  nutritionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  ratingContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  ratingGrid: {
    gap: 15,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    width: 80,
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#3A3D4A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingFill: {
    height: '100%',
    borderRadius: 4,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
  insightsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
    backgroundColor: '#3A3D4A',
    padding: 12,
    borderRadius: 8,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  mealTypeContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mealTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1B5E20',
    padding: 15,
    borderRadius: 12,
  },
  mealTypeText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  mealTypeBold: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: '#3A3D4A',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#3A3D4A',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  confirmButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
