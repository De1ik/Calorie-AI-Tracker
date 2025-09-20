import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface WeightHeightScreenProps {
  onNext: (weight: number, height: number) => void;
  onBack: () => void;
}

export default function WeightHeightScreen({ onNext, onBack }: WeightHeightScreenProps) {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
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

  const handleNext = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    
    if (weightNum > 0 && heightNum > 0) {
      onNext(weightNum, heightNum);
    }
  };

  const isNextEnabled = weight && height && parseFloat(weight) > 0 && parseFloat(height) > 0;

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
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
            <Text style={styles.progressText}>Step 2 of 4</Text>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Your measurements</Text>
          <Text style={styles.subtitle}>
            Help us calculate your daily calorie needs
          </Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          {/* Weight Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Ionicons name="scale" size={24} color="#4CAF50" />
              <Text style={styles.inputLabel}>Weight</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="70"
                placeholderTextColor="#8E8E93"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                maxLength={6}
              />
              <Text style={styles.inputUnit}>kg</Text>
            </View>
            <Text style={styles.inputHint}>Enter your current weight</Text>
          </View>

          {/* Height Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Ionicons name="resize" size={24} color="#4CAF50" />
              <Text style={styles.inputLabel}>Height</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="175"
                placeholderTextColor="#8E8E93"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                maxLength={6}
              />
              <Text style={styles.inputUnit}>cm</Text>
            </View>
            <Text style={styles.inputHint}>Enter your height in centimeters</Text>
          </View>
        </View>

        {/* BMI Calculator */}
        {weight && height && parseFloat(weight) > 0 && parseFloat(height) > 0 && (
          <Animated.View style={styles.bmiContainer}>
            <View style={styles.bmiCard}>
              <Text style={styles.bmiTitle}>Your BMI</Text>
              <Text style={styles.bmiValue}>
                {((parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1))}
              </Text>
              <Text style={styles.bmiCategory}>
                {(() => {
                  const bmi = parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2);
                  if (bmi < 18.5) return 'Underweight';
                  if (bmi < 25) return 'Normal weight';
                  if (bmi < 30) return 'Overweight';
                  return 'Obese';
                })()}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              isNextEnabled && styles.nextButtonEnabled
            ]}
            onPress={handleNext}
            disabled={!isNextEnabled}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.nextButtonText,
              isNextEnabled && styles.nextButtonTextEnabled
            ]}>
              Continue
            </Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={isNextEnabled ? '#FFFFFF' : '#8E8E93'}
            />
          </TouchableOpacity>
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
  inputSection: {
    flex: 1,
    gap: height * 0.04,
  },
  inputContainer: {
    backgroundColor: '#2C2F3A',
    borderRadius: width * 0.04,
    padding: width * 0.05,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  inputLabel: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: width * 0.03,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1D29',
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.04,
    paddingVertical: 4,
    marginBottom: height * 0.01,
  },
  input: {
    flex: 1,
    fontSize: width * 0.06,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingVertical: height * 0.02,
  },
  inputUnit: {
    fontSize: width * 0.04,
    color: '#8E8E93',
    fontWeight: '500',
    marginLeft: width * 0.02,
  },
  inputHint: {
    fontSize: width * 0.035,
    color: '#8E8E93',
  },
  bmiContainer: {
    marginBottom: height * 0.025,
  },
  bmiCard: {
    backgroundColor: '#2C2F3A',
    borderRadius: width * 0.04,
    padding: width * 0.05,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  bmiTitle: {
    fontSize: width * 0.04,
    color: '#8E8E93',
    marginBottom: height * 0.01,
  },
  bmiValue: {
    fontSize: width * 0.08,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: height * 0.005,
  },
  bmiCategory: {
    fontSize: width * 0.035,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  buttonContainer: {
    paddingBottom: height * 0.025,
  },
  nextButton: {
    backgroundColor: '#2C2F3A',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.06,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  nextButtonEnabled: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  nextButtonText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#8E8E93',
    marginRight: width * 0.02,
  },
  nextButtonTextEnabled: {
    color: '#FFFFFF',
  },
});
