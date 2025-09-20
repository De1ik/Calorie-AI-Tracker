import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { chatService } from '../services/chat/chatService';
import { ENV, isOpenAIMode } from '../config/environment';

export const ChatTestComponent = () => {
  const [testMessage, setTestMessage] = useState('Can I eat a donut today?');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testChat = async () => {
    setIsLoading(true);
    try {
      console.log('Testing chat with message:', testMessage);
      const result = await chatService.generateResponse(testMessage);
      setResponse(result);
    } catch (error) {
      console.error('Chat test error:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const forceOpenAI = () => {
    chatService.forceOpenAIMode();
    Alert.alert('OpenAI Mode', 'Forced OpenAI mode enabled. Try sending a message now.');
  };

  const showConfig = () => {
    Alert.alert(
      'Current Configuration',
      `MODE: ${ENV.MODE}\nOpenAI Mode: ${isOpenAIMode()}\nAPI Key Available: ${!!ENV.OPENAI_API_KEY}\nAPI Key Length: ${ENV.OPENAI_API_KEY ? ENV.OPENAI_API_KEY.length : 0}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Test Component</Text>
      
      <View style={styles.configContainer}>
        <Text style={styles.configText}>MODE: {ENV.MODE}</Text>
        <Text style={styles.configText}>OpenAI Mode: {isOpenAIMode() ? 'YES' : 'NO'}</Text>
        <Text style={styles.configText}>API Key: {ENV.OPENAI_API_KEY ? 'Available' : 'Missing'}</Text>
      </View>

      <TextInput
        style={styles.input}
        value={testMessage}
        onChangeText={setTestMessage}
        placeholder="Enter test message..."
        multiline
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={testChat} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Testing...' : 'Test Chat'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={forceOpenAI}>
          <Text style={styles.buttonText}>Force OpenAI</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={showConfig}>
          <Text style={styles.buttonText}>Show Config</Text>
        </TouchableOpacity>
      </View>

      {response ? (
        <View style={styles.responseContainer}>
          <Text style={styles.responseTitle}>Response:</Text>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1A1D29',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  configContainer: {
    backgroundColor: '#2C2F3A',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  configText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#2C2F3A',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  responseContainer: {
    backgroundColor: '#2C2F3A',
    padding: 15,
    borderRadius: 8,
  },
  responseTitle: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  responseText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ChatTestComponent;
