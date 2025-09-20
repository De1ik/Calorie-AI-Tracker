import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../database/schema';

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
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
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
                      color={selectedGender === gender.key ? '#FFFFFF' : '#4CAF50'}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D29',
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: height * 0.06,
    paddingBottom: height * 0.03,
  },
  backButton: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: '#2C2F3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.04,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2C2F3A',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  progressText: {
    fontSize: width * 0.03,
    color: '#8E8E93',
    fontWeight: '500',
  },
  titleSection: {
    marginBottom: height * 0.05,
    paddingTop: height * 0.02,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#8E8E93',
    lineHeight: width * 0.06,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: height * 0.01,
  },
  optionWrapper: {
    marginBottom: height * 0.01,
  },
  option: {
    backgroundColor: '#2C2F3A',
    borderRadius: width * 0.05,
    padding: height * 0.025,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: height * 0.1,
    justifyContent: 'center',
  },
  optionSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#2C2F3A',
  },
  optionIconContainer: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  optionIconContainerSelected: {
    backgroundColor: '#4CAF50',
  },
  optionTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  optionTitleSelected: {
    color: '#4CAF50',
  },
});
