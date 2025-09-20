import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface SportActivityScreenProps {
  onNext: (sportActivity: string) => void;
  onBack: () => void;
}

const sportFrequencyOptions = [
  { id: 'none', name: 'No Sports', description: '0 times per week', icon: 'close-circle' },
  { id: 'light', name: 'Light Activity', description: '1-3 times per week', icon: 'walk' },
  { id: 'moderate', name: 'Moderate Activity', description: '4-5 times per week', icon: 'fitness' },
  { id: 'high', name: 'High Activity', description: '5+ times per week', icon: 'flame' },
];

export default function SportActivityScreen({ onNext, onBack }: SportActivityScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');
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

  const handleFrequencySelect = (frequencyId: string) => {
    setSelectedFrequency(frequencyId);
    // Add a small delay for better UX
    setTimeout(() => {
      onNext(frequencyId);
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
              <View style={[styles.progressFill, { width: '75%' }]} />
            </View>
            <Text style={styles.progressText}>Step 3 of 4</Text>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>How often do you do sports?</Text>
          <Text style={styles.subtitle}>
            Choose your sport activity frequency
          </Text>
        </View>

        {/* Frequency Options */}
        <View style={styles.optionsContainer}>
          {sportFrequencyOptions.map((option, index) => (
            <Animated.View
              key={option.id}
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
                  selectedFrequency === option.id && styles.optionSelected,
                ]}
                onPress={() => handleFrequencySelect(option.id)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionIconContainer,
                    selectedFrequency === option.id && styles.optionIconContainerSelected
                  ]}>
                    <Ionicons
                      name={option.icon as any}
                      size={width * 0.08}
                      color={selectedFrequency === option.id ? colors.text : colors.primary}
                    />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={[
                      styles.optionTitle,
                      selectedFrequency === option.id && styles.optionTitleSelected
                    ]}>
                      {option.name}
                    </Text>
                    <Text style={styles.optionDescription}>
                      {option.description}
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
    marginBottom: height * 0.06,
  },
  optionWrapper: {
    marginBottom: height * 0.02,
  },
  option: {
    backgroundColor: colors.card,
    borderRadius: width * 0.05,
    padding: width * 0.05,
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
    width: width * 0.16,
    height: width * 0.16,
    borderRadius: width * 0.08,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.05,
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
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: colors.text,
    marginBottom: height * 0.005,
  },
  optionTitleSelected: {
    color: colors.primary,
  },
  optionDescription: {
    fontSize: width * 0.035,
    color: colors.textSecondary,
    lineHeight: width * 0.05,
  },
});
