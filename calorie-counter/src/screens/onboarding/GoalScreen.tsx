import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { User } from '../../database/schema';

const { width, height } = Dimensions.get('window');

interface GoalScreenProps {
  onNext: (goal: User['goal']) => void;
  onBack: () => void;
}

const goals = [
  { 
    key: 'increase' as const, 
    title: 'Increase Weight', 
    description: 'Gain healthy weight and build muscle',
    icon: 'trending-up',
    color: '#FF9800'
  },
  { 
    key: 'decrease' as const, 
    title: 'Decrease Weight', 
    description: 'Lose weight safely and sustainably',
    icon: 'trending-down',
    color: '#4CAF50'
  },
  { 
    key: 'maintain' as const, 
    title: 'Maintain Weight', 
    description: 'Keep your current healthy weight',
    icon: 'remove',
    color: '#2196F3'
  },
];

export default function GoalScreen({ onNext, onBack }: GoalScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [selectedGoal, setSelectedGoal] = useState<User['goal'] | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGoalSelect = (goal: User['goal']) => {
    setSelectedGoal(goal);
    // Add a small delay for better UX
    setTimeout(() => {
      onNext(goal);
    }, 200);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
            <Text style={styles.progressText}>Step 4 of 4</Text>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>What's your goal?</Text>
          <Text style={styles.subtitle}>
            Choose your primary fitness objective
          </Text>
        </View>

        {/* Goal Options */}
        <View style={styles.optionsContainer}>
          {goals.map((goal, index) => (
            <Animated.View
              key={goal.key}
              style={[
                styles.optionWrapper,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: Animated.add(
                        slideAnim,
                        new Animated.Value(index * 20)
                      ),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedGoal === goal.key && styles.optionSelected,
                ]}
                onPress={() => handleGoalSelect(goal.key)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionIconContainer,
                    { backgroundColor: `${goal.color}20` },
                    selectedGoal === goal.key && { backgroundColor: goal.color }
                  ]}>
                    <Ionicons
                      name={goal.icon as any}
                      size={32}
                      color={selectedGoal === goal.key ? colors.text : goal.color}
                    />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={[
                      styles.optionTitle,
                      selectedGoal === goal.key && { color: goal.color }
                    ]}>
                      {goal.title}
                    </Text>
                    <Text style={styles.optionDescription}>
                      {goal.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: height * 0.08,
    paddingBottom: height * 0.03,
  },
  backButton: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.04,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: width * 0.03,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  titleSection: {
    marginBottom: height * 0.015,
    paddingTop: height * 0.01,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: '700',
    color: colors.text,
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: colors.textSecondary,
    lineHeight: width * 0.06,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: height * 0.02,
    marginBottom: height * 0.105,
  },
  optionWrapper: {
    marginBottom: height * 0.015,
  },
  option: {
    backgroundColor: colors.card,
    borderRadius: width * 0.05,
    padding: width * 0.04,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.04,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: colors.text,
    marginBottom: height * 0.005,
  },
  optionDescription: {
    fontSize: width * 0.035,
    color: colors.textSecondary,
    lineHeight: width * 0.05,
  },
});
