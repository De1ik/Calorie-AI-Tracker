import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';

interface HeightScreenProps {
  onNext: (height: number) => void;
  onBack: () => void;
}

export default function HeightScreen({ onNext, onBack }: HeightScreenProps) {
  const [height, setHeight] = useState('');

  const handleNext = () => {
    const heightNum = parseFloat(height);
    if (heightNum >= 100 && heightNum <= 250) {
      onNext(heightNum);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Height</Text>
        <Text style={styles.subtitle}>Enter your current height in centimeters</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            placeholder="170"
            keyboardType="numeric"
            maxLength={3}
          />
          <Text style={styles.inputLabel}>cm</Text>
        </View>

        <View style={styles.quickSelectContainer}>
          <Text style={styles.quickSelectTitle}>Common heights:</Text>
          <View style={styles.quickSelectButtons}>
            {[150, 160, 170, 180, 190, 200].map((h) => (
              <TouchableOpacity
                key={h}
                style={[
                  styles.quickSelectButton,
                  height === h.toString() && styles.quickSelectButtonActive
                ]}
                onPress={() => setHeight(h.toString())}
              >
                <Text style={[
                  styles.quickSelectButtonText,
                  height === h.toString() && styles.quickSelectButtonTextActive
                ]}>
                  {h}
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
            style={[styles.nextButton, !height && styles.nextButtonDisabled]} 
            onPress={handleNext}
            disabled={!height}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quickSelectButtonActive: {
    backgroundColor: '#007AFF',
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
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#e9ecef',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
