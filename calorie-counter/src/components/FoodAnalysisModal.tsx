import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodAnalysisResponse } from '../services/foodAnalysis/types';

interface FoodAnalysisModalProps {
  visible: boolean;
  onClose: () => void;
  analysisResult: FoodAnalysisResponse | null;
  imageUri?: string;
  onAddToMeal?: (foodData: any) => void;
  onSaveToDiary?: (foodData: any) => void;
}

const { width, height } = Dimensions.get('window');

export default function FoodAnalysisModal({
  visible,
  onClose,
  analysisResult,
  imageUri,
  onAddToMeal,
  onSaveToDiary,
}: FoodAnalysisModalProps) {
  if (!analysisResult?.success || !analysisResult.data) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Analysis Failed</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            <Text style={styles.errorText}>
              {analysisResult?.error || 'Unable to analyze the food image. Please try again.'}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={onClose}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  const { foodItem, nutritionalInfo, rating, healthInsights, confidence } = analysisResult.data;

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={16} color="#FFD700" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#8E8E93" />);
    }

    return stars;
  };

  const renderRatingSection = (label: string, rating: number) => (
    <View style={styles.ratingItem}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.ratingStars}>
        {renderRatingStars(rating)}
        <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Food Analysis</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            {/* Image */}
            {imageUri && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.foodImage} />
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>{confidence}% confident</Text>
                </View>
              </View>
            )}

            {/* Food Info */}
            <View style={styles.section}>
              <Text style={styles.foodName}>{foodItem.name}</Text>
              <Text style={styles.foodCategory}>{foodItem.category}</Text>
              {foodItem.description && (
                <Text style={styles.foodDescription}>{foodItem.description}</Text>
              )}
              {foodItem.servingSize && (
                <Text style={styles.servingSize}>Serving: {foodItem.servingSize}</Text>
              )}
            </View>

            {/* Nutritional Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutritional Information</Text>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutritionalInfo.calories}</Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutritionalInfo.protein}g</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutritionalInfo.carbs}g</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutritionalInfo.fat}g</Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
              </View>

              {/* Additional nutrients */}
              {(nutritionalInfo.fiber || nutritionalInfo.sugar || nutritionalInfo.sodium) && (
                <View style={styles.additionalNutrition}>
                  {nutritionalInfo.fiber && (
                    <Text style={styles.additionalNutrient}>Fiber: {nutritionalInfo.fiber}g</Text>
                  )}
                  {nutritionalInfo.sugar && (
                    <Text style={styles.additionalNutrient}>Sugar: {nutritionalInfo.sugar}g</Text>
                  )}
                  {nutritionalInfo.sodium && (
                    <Text style={styles.additionalNutrient}>Sodium: {nutritionalInfo.sodium}mg</Text>
                  )}
                </View>
              )}
            </View>

            {/* Rating */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Food Rating</Text>
              <View style={styles.ratingContainer}>
                {renderRatingSection('Overall', rating.overall)}
                {renderRatingSection('Healthiness', rating.healthiness)}
                {renderRatingSection('Nutrition', rating.nutrition)}
                {renderRatingSection('Freshness', rating.freshness)}
                {renderRatingSection('Portion Size', rating.portionSize)}
              </View>
            </View>

            {/* Health Insights */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Health Insights</Text>
              
              {healthInsights.benefits.length > 0 && (
                <View style={styles.insightGroup}>
                  <Text style={styles.insightGroupTitle}>Benefits</Text>
                  {healthInsights.benefits.map((benefit, index) => (
                    <View key={index} style={styles.insightItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                      <Text style={styles.insightText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              )}

              {healthInsights.concerns.length > 0 && (
                <View style={styles.insightGroup}>
                  <Text style={styles.insightGroupTitle}>Concerns</Text>
                  {healthInsights.concerns.map((concern, index) => (
                    <View key={index} style={styles.insightItem}>
                      <Ionicons name="warning" size={16} color="#FF9800" />
                      <Text style={styles.insightText}>{concern}</Text>
                    </View>
                  ))}
                </View>
              )}

              {healthInsights.recommendations.length > 0 && (
                <View style={styles.insightGroup}>
                  <Text style={styles.insightGroupTitle}>Recommendations</Text>
                  {healthInsights.recommendations.map((recommendation, index) => (
                    <View key={index} style={styles.insightItem}>
                      <Ionicons name="bulb" size={16} color="#2196F3" />
                      <Text style={styles.insightText}>{recommendation}</Text>
                    </View>
                  ))}
                </View>
              )}

              {healthInsights.allergens && healthInsights.allergens.length > 0 && (
                <View style={styles.insightGroup}>
                  <Text style={styles.insightGroupTitle}>Allergens</Text>
                  <Text style={styles.allergenText}>
                    {healthInsights.allergens.join(', ')}
                  </Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.addToMealButton}
                onPress={() => {
                  onAddToMeal?.({
                    name: foodItem.name,
                    calories: nutritionalInfo.calories,
                    protein: nutritionalInfo.protein,
                    carbs: nutritionalInfo.carbs,
                    fat: nutritionalInfo.fat,
                    category: foodItem.category,
                    imageUri,
                    isFromPhoto: true,
                  });
                  onClose();
                }}
              >
                <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                <Text style={styles.addToMealButtonText}>Add to Meal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveToDiaryButton}
                onPress={() => {
                  onSaveToDiary?.({
                    name: foodItem.name,
                    calories: nutritionalInfo.calories,
                    protein: nutritionalInfo.protein,
                    carbs: nutritionalInfo.carbs,
                    fat: nutritionalInfo.fat,
                    category: foodItem.category,
                    imageUri,
                    isFromPhoto: true,
                  });
                  onClose();
                }}
              >
                <Ionicons name="bookmark" size={20} color="#4CAF50" />
                <Text style={styles.saveToDiaryButtonText}>Save to Diary</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2C2F3A',
    borderRadius: 16,
    width: width * 0.95,
    maxHeight: height * 0.9,
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginBottom: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    margin: 20,
    marginBottom: 0,
  },
  foodImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  confidenceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  confidenceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  foodCategory: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 8,
  },
  foodDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  servingSize: {
    fontSize: 14,
    color: '#8E8E93',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  additionalNutrition: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  additionalNutrient: {
    fontSize: 12,
    color: '#8E8E93',
  },
  ratingContainer: {
    gap: 12,
  },
  ratingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
  },
  insightGroup: {
    marginBottom: 16,
  },
  insightGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  allergenText: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  addToMealButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addToMealButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveToDiaryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveToDiaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
});
