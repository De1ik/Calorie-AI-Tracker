import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface WeightScreenProps {
  onNext: (weight: number) => void;
  onBack: () => void;
}

export default function WeightScreen({ onNext, onBack }: WeightScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [weight, setWeight] = useState('');

  const handleNext = () => {
    const weightNum = parseFloat(weight);
    if (weightNum >= 30 && weightNum <= 200) {
      onNext(weightNum);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Weight</Text>
        <Text style={styles.subtitle}>Enter your current weight in kilograms</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="70"
            keyboardType="numeric"
            maxLength={3}
          />
          <Text style={styles.inputLabel}>kg</Text>
        </View>

        <View style={styles.quickSelectContainer}>
          <Text style={styles.quickSelectTitle}>Common weights:</Text>
          <View style={styles.quickSelectButtons}>
            {[50, 60, 70, 80, 90, 100].map((w) => (
              <TouchableOpacity
                key={w}
                style={[
                  styles.quickSelectButton,
                  weight === w.toString() && styles.quickSelectButtonActive
                ]}
                onPress={() => setWeight(w.toString())}
              >
                <Text style={[
                  styles.quickSelectButtonText,
                  weight === w.toString() && styles.quickSelectButtonTextActive
                ]}>
                  {w}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.nextButton, !weight && styles.nextButtonDisabled]} 
            onPress={handleNext}
            disabled={!weight}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  input: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingVertical: 10,
    minWidth: 100,
    color: '#333',
  },
  inputLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  quickSelectContainer: {
    marginBottom: 40,
  },
  quickSelectTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  quickSelectButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  quickSelectButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quickSelectButtonActive: {
    backgroundColor: colors.primary,
    borderColor: '#007AFF',
  },
  quickSelectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  quickSelectButtonTextActive: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  backButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: colors.border,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
