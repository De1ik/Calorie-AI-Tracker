import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailyAnalysisResponse } from '../services/dailyAnalysis/types';

interface DailyAnalysisModalProps {
  visible: boolean;
  onClose: () => void;
  analysisResult: DailyAnalysisResponse | null;
}

const { width, height } = Dimensions.get('window');

export default function DailyAnalysisModal({
  visible,
  onClose,
  analysisResult,
}: DailyAnalysisModalProps) {
  console.log('DailyAnalysisModal rendered with:', { visible, analysisResult });
  
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
              {analysisResult?.error || 'Unable to analyze your daily progress. Please try again.'}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={onClose}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  const { 
    timeContext, 
    nutritionalAnalysis, 
    activityAnalysis, 
    healthInsights, 
    mealRecommendations,
    personalizedAdvice,
    dailyGoal,
    motivationMessage,
    confidence 
  } = analysisResult.data;

  const renderScoreCircle = (score: number, label: string, color: string) => (
    <View style={styles.scoreContainer}>
      <View style={[styles.scoreCircle, { borderColor: color }]}>
        <Text style={[styles.scoreText, { color }]}>{score}</Text>
      </View>
      <Text style={styles.scoreLabel}>{label}</Text>
    </View>
  );

  const renderInsightItem = (icon: string, text: string, color: string) => (
    <View style={styles.insightItem}>
      <Ionicons name={icon as any} size={16} color={color} />
      <Text style={styles.insightText}>{text}</Text>
    </View>
  );

  const renderMealSuggestion = (suggestion: any, index: number) => (
    <View style={styles.mealSuggestion}>
      <View style={styles.mealSuggestionHeader}>
        <Text style={styles.mealSuggestionName}>{suggestion.name}</Text>
        <Text style={styles.mealSuggestionCalories}>{suggestion.calories} cal</Text>
      </View>
      <View style={styles.mealSuggestionMacros}>
        <Text style={styles.mealSuggestionMacro}>P: {suggestion.protein}g</Text>
        <Text style={styles.mealSuggestionMacro}>C: {suggestion.carbs}g</Text>
        <Text style={styles.mealSuggestionMacro}>F: {suggestion.fat}g</Text>
      </View>
      <Text style={styles.mealSuggestionReasoning}>{suggestion.reasoning}</Text>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Daily Analysis</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            {/* Time Context */}
            <View style={styles.section}>
              <View style={styles.timeContextContainer}>
                <Ionicons name="time" size={20} color="#4CAF50" />
                <Text style={styles.timeContextText}>
                  {timeContext.timeOfDay.replace('_', ' ').toUpperCase()} • {timeContext.mealPeriod.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
              {timeContext.hoursUntilNextMeal > 0 && (
                <Text style={styles.nextMealText}>
                  Next meal in ~{timeContext.hoursUntilNextMeal} hours
                </Text>
              )}
            </View>

            {/* Overall Score */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today's Performance</Text>
              <View style={styles.scoresContainer}>
                {renderScoreCircle(healthInsights.overallScore, 'Overall', '#4CAF50')}
                {renderScoreCircle(nutritionalAnalysis.micronutrientScore, 'Nutrition', '#FF9800')}
                {renderScoreCircle(activityAnalysis.movementScore, 'Activity', '#2196F3')}
              </View>
            </View>

            {/* Nutritional Analysis */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutrition Summary</Text>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutritionalAnalysis.totalCalories}</Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutritionalAnalysis.totalProtein}g</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutritionalAnalysis.totalCarbs}g</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutritionalAnalysis.totalFat}g</Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
              </View>
              
              {/* Macro Balance */}
              <View style={styles.macroBalanceContainer}>
                <Text style={styles.macroBalanceTitle}>Macro Balance</Text>
                <View style={styles.macroBalanceBars}>
                  <View style={styles.macroBalanceItem}>
                    <Text style={styles.macroBalanceLabel}>Protein</Text>
                    <View style={styles.macroBalanceBar}>
                      <View style={[styles.macroBalanceFill, { width: `${nutritionalAnalysis.macroBalance.proteinPercentage}%`, backgroundColor: '#4CAF50' }]} />
                    </View>
                    <Text style={styles.macroBalanceValue}>{nutritionalAnalysis.macroBalance.proteinPercentage}%</Text>
                  </View>
                  <View style={styles.macroBalanceItem}>
                    <Text style={styles.macroBalanceLabel}>Carbs</Text>
                    <View style={styles.macroBalanceBar}>
                      <View style={[styles.macroBalanceFill, { width: `${nutritionalAnalysis.macroBalance.carbsPercentage}%`, backgroundColor: '#FF9800' }]} />
                    </View>
                    <Text style={styles.macroBalanceValue}>{nutritionalAnalysis.macroBalance.carbsPercentage}%</Text>
                  </View>
                  <View style={styles.macroBalanceItem}>
                    <Text style={styles.macroBalanceLabel}>Fat</Text>
                    <View style={styles.macroBalanceBar}>
                      <View style={[styles.macroBalanceFill, { width: `${nutritionalAnalysis.macroBalance.fatPercentage}%`, backgroundColor: '#2196F3' }]} />
                    </View>
                    <Text style={styles.macroBalanceValue}>{nutritionalAnalysis.macroBalance.fatPercentage}%</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Activity Analysis */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activity Summary</Text>
              <View style={styles.activityContainer}>
                <View style={styles.activityItem}>
                  <Ionicons name="walk" size={20} color="#4CAF50" />
                  <Text style={styles.activityText}>
                    {activityAnalysis.stepsProgress.toFixed(0)}% of step goal
                  </Text>
                </View>
                <View style={styles.activityItem}>
                  <Ionicons name="flame" size={20} color="#FF9800" />
                  <Text style={styles.activityText}>
                    {activityAnalysis.calorieBurn} calories burned
                  </Text>
                </View>
                <View style={styles.activityItem}>
                  <Ionicons name="trending-up" size={20} color="#2196F3" />
                  <Text style={styles.activityText}>
                    {activityAnalysis.activityLevel} activity level
                  </Text>
                </View>
              </View>
            </View>

            {/* Health Insights */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Health Insights</Text>
              
              {healthInsights.strengths.length > 0 && (
                <View style={styles.insightGroup}>
                  <Text style={styles.insightGroupTitle}>Strengths</Text>
                  {healthInsights.strengths.map((strength, index) => 
                    <View key={index}>
                      {renderInsightItem('checkmark-circle', strength, '#4CAF50')}
                    </View>
                  )}
                </View>
              )}

              {healthInsights.areasForImprovement.length > 0 && (
                <View style={styles.insightGroup}>
                  <Text style={styles.insightGroupTitle}>Areas for Improvement</Text>
                  {healthInsights.areasForImprovement.map((area, index) => 
                    <View key={index}>
                      {renderInsightItem('arrow-up-circle', area, '#FF9800')}
                    </View>
                  )}
                </View>
              )}

              {healthInsights.recommendations.length > 0 && (
                <View style={styles.insightGroup}>
                  <Text style={styles.insightGroupTitle}>Recommendations</Text>
                  {healthInsights.recommendations.map((recommendation, index) => 
                    <View key={index}>
                      {renderInsightItem('bulb', recommendation, '#2196F3')}
                    </View>
                  )}
                </View>
              )}

              {healthInsights.encouragements.length > 0 && (
                <View style={styles.insightGroup}>
                  <Text style={styles.insightGroupTitle}>Encouragements</Text>
                  {healthInsights.encouragements.map((encouragement, index) => 
                    <View key={index}>
                      {renderInsightItem('heart', encouragement, '#E91E63')}
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Meal Recommendations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Meal Recommendations</Text>
              
              <View style={styles.nextMealContainer}>
                <Text style={styles.nextMealTitle}>
                  Next: {mealRecommendations.nextMeal.type.charAt(0).toUpperCase() + mealRecommendations.nextMeal.type.slice(1)}
                </Text>
                <Text style={styles.nextMealReasoning}>{mealRecommendations.nextMeal.reasoning}</Text>
                
                {mealRecommendations.nextMeal.suggestions.map((suggestion, index) => 
                  <View key={index}>
                    {renderMealSuggestion(suggestion, index)}
                  </View>
                )}
              </View>

              <View style={styles.foodAdditionsContainer}>
                <Text style={styles.foodAdditionsTitle}>Food Additions</Text>
                <View style={styles.foodAdditionsRow}>
                  <View style={styles.foodAdditionsColumn}>
                    <Text style={styles.foodAdditionsSubtitle}>Add More:</Text>
                    {mealRecommendations.foodAdditions.needed.map((food, index) => (
                      <Text key={index} style={styles.foodAdditionsItem}>• {food}</Text>
                    ))}
                  </View>
                  <View style={styles.foodAdditionsColumn}>
                    <Text style={styles.foodAdditionsSubtitle}>Avoid:</Text>
                    {mealRecommendations.foodAdditions.avoid.map((food, index) => (
                      <Text key={index} style={styles.foodAdditionsItem}>• {food}</Text>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.hydrationContainer}>
                <View style={styles.hydrationHeader}>
                  <Ionicons name="water" size={20} color="#2196F3" />
                  <Text style={styles.hydrationTitle}>Hydration</Text>
                  <View style={[
                    styles.hydrationStatus, 
                    { backgroundColor: mealRecommendations.hydration.status === 'good' ? '#4CAF50' : 
                                       mealRecommendations.hydration.status === 'needs_improvement' ? '#FF9800' : '#FF3B30' }
                  ]}>
                    <Text style={styles.hydrationStatusText}>
                      {mealRecommendations.hydration.status.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.hydrationRecommendation}>{mealRecommendations.hydration.recommendation}</Text>
              </View>
            </View>

            {/* Personalized Advice */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personalized Advice</Text>
              <Text style={styles.personalizedAdvice}>{personalizedAdvice}</Text>
            </View>

            {/* Daily Goal */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today's Goal</Text>
              <Text style={styles.dailyGoal}>{dailyGoal}</Text>
            </View>

            {/* Motivation Message */}
            <View style={styles.section}>
              <View style={styles.motivationContainer}>
                <Ionicons name="star" size={24} color="#FFD700" />
                <Text style={styles.motivationMessage}>{motivationMessage}</Text>
              </View>
            </View>

            {/* Confidence Badge */}
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceText}>{confidence}% confident</Text>
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
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  timeContextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeContextText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 8,
  },
  nextMealText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  macroBalanceContainer: {
    marginTop: 16,
  },
  macroBalanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  macroBalanceBars: {
    gap: 8,
  },
  macroBalanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  macroBalanceLabel: {
    fontSize: 12,
    color: '#8E8E93',
    width: 50,
  },
  macroBalanceBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#3A3A3A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  macroBalanceFill: {
    height: '100%',
    borderRadius: 4,
  },
  macroBalanceValue: {
    fontSize: 12,
    color: '#FFFFFF',
    width: 35,
    textAlign: 'right',
  },
  activityContainer: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityText: {
    fontSize: 14,
    color: '#FFFFFF',
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
  nextMealContainer: {
    marginBottom: 16,
  },
  nextMealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  nextMealReasoning: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  mealSuggestion: {
    backgroundColor: '#1A1D29',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  mealSuggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealSuggestionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  mealSuggestionCalories: {
    fontSize: 12,
    color: '#4CAF50',
  },
  mealSuggestionMacros: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  mealSuggestionMacro: {
    fontSize: 12,
    color: '#8E8E93',
  },
  mealSuggestionReasoning: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  foodAdditionsContainer: {
    marginBottom: 16,
  },
  foodAdditionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  foodAdditionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  foodAdditionsColumn: {
    flex: 1,
  },
  foodAdditionsSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  foodAdditionsItem: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  hydrationContainer: {
    backgroundColor: '#1A1D29',
    borderRadius: 8,
    padding: 12,
  },
  hydrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  hydrationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  hydrationStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hydrationStatusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  hydrationRecommendation: {
    fontSize: 12,
    color: '#8E8E93',
  },
  personalizedAdvice: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  dailyGoal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'center',
  },
  motivationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1D29',
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  motivationMessage: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  confidenceContainer: {
    alignItems: 'center',
    padding: 16,
  },
  confidenceText: {
    fontSize: 12,
    color: '#8E8E93',
    backgroundColor: '#1A1D29',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
