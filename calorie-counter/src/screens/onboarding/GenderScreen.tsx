import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../database/schema';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface GenderScreenProps {
  onNext: (gender: User['gender']) => void;
  onBack: () => void;
}

const genders = [
  { key: 'male' as const, title: 'Male', icon: 'man' },
  { key: 'female' as const, title: 'Female', icon: 'woman' },
  { key: 'other' as const, title: 'Other', icon: 'person' },
];

export default function GenderScreen({ onNext, onBack }: GenderScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [selectedGender, setSelectedGender] = useState<User['gender'] | null>(null);
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

  const handleGenderSelect = (gender: User['gender']) => {
    setSelectedGender(gender);
    // Add a small delay for better UX
    setTimeout(() => {
      onNext(gender);
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
            <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '25%' }]} />
            </View>
            <Text style={styles.progressText}>Step 1 of 4</Text>
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>What's your gender?</Text>
            <Text style={styles.subtitle}>
              This helps us personalize your experience
            </Text>
          </View>

          {/* Gender Options */}
          <View style={styles.optionsContainer}>
            {genders.map((gender, index) => (
              <Animated.View
                key={gender.key}
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
                    selectedGender === gender.key && styles.optionSelected,
                  ]}
                  onPress={() => handleGenderSelect(gender.key)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.optionIconContainer,
                    selectedGender === gender.key && styles.optionIconContainerSelected
                  ]}>
                    <Ionicons
                      name={gender.icon as any}
                      size={width * 0.08}
                      color={selectedGender === gender.key ? colors.text : colors.primary}
                    />
                  </View>
                  <Text style={[
                    styles.optionTitle,
                    selectedGender === gender.key && styles.optionTitleSelected
                  ]}>
                    {gender.title}
                  </Text>
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
    marginBottom: height * 0.002,
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
    marginBottom: height * 0.025,
  },
  optionWrapper: {
    marginBottom: height * 0.02,
  },
  option: {
    backgroundColor: colors.card,
    borderRadius: width * 0.05,
    padding: height * 0.025,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: height * 0.1,
    justifyContent: 'center',
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
  optionIconContainer: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.015,
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
  optionIconContainerSelected: {
    backgroundColor: colors.primary,
  },
  optionTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: colors.text,
  },
  optionTitleSelected: {
    color: colors.primary,
  },
});
