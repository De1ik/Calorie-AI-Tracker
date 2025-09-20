import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const sampleMessages: Message[] = [
  {
    id: '1',
    text: "Hello! I'm your AI nutrition assistant. I can help you analyze your eating patterns, suggest meal plans, and provide personalized nutrition advice. What would you like to know?",
    isUser: false,
    timestamp: new Date(),
  },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText.trim()),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('calorie') || lowerInput.includes('calories')) {
      return "Based on your current weight and activity level, I recommend aiming for 1,200-1,500 calories per day for weight loss. Focus on nutrient-dense foods like lean proteins, vegetables, and whole grains. Would you like me to create a sample meal plan for you?";
    }
    
    if (lowerInput.includes('protein') || lowerInput.includes('protein')) {
      return "For optimal health and muscle maintenance, aim for 0.8-1.2g of protein per kg of body weight. That's about 56-84g of protein daily for your current weight. Great sources include chicken breast, fish, eggs, Greek yogurt, and legumes.";
    }
    
    if (lowerInput.includes('meal') || lowerInput.includes('food')) {
      return "Here's a balanced meal suggestion: Grilled chicken breast (150g) with quinoa (1/2 cup) and steamed broccoli. This provides about 350 calories, 35g protein, 30g carbs, and 8g fat. Would you like more meal ideas?";
    }
    
    if (lowerInput.includes('weight') || lowerInput.includes('lose')) {
      return "To lose weight safely, aim for a 500-calorie deficit per day, which should result in about 1 pound of weight loss per week. Combine this with regular exercise and focus on whole, unprocessed foods. Remember, consistency is key!";
    }
    
    if (lowerInput.includes('exercise') || lowerInput.includes('workout')) {
      return "For your fitness goals, I recommend a combination of cardio (30-45 minutes, 3-4 times per week) and strength training (2-3 times per week). Start with activities you enjoy like walking, cycling, or bodyweight exercises.";
    }
    
    return "That's a great question! I'd be happy to help you with that. Could you provide a bit more detail about what specific aspect of nutrition or fitness you'd like to discuss? I can help with meal planning, calorie tracking, exercise recommendations, and more.";
  };

  const quickQuestions = [
    "What should I eat today?",
    "How many calories do I need?",
    "Best protein sources?",
    "Meal prep ideas?",
    "Exercise recommendations?",
  ];

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userMessageText : styles.aiMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime,
          item.isUser ? styles.userMessageTime : styles.aiMessageTime
        ]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.aiAvatar}>
            <Ionicons name="bulb" size={20} color="#4CAF50" />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Nutrition Assistant</Text>
            <Text style={styles.headerSubtitle}>Online • Ready to help</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.typingBubble}>
            <Text style={styles.typingText}>AI is typing...</Text>
          </View>
        </View>
      )}

      {/* Quick Questions */}
      {messages.length === 1 && (
        <View style={styles.quickQuestionsContainer}>
          <Text style={styles.quickQuestionsTitle}>Quick Questions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickQuestionButton}
                onPress={() => setInputText(question)}
              >
                <Text style={styles.quickQuestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask me anything about nutrition..."
          placeholderTextColor="#8E8E93"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, inputText.trim() === '' && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={inputText.trim() === ''}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D29',
  },
  header: {
    backgroundColor: '#2C2F3A',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#4CAF50',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#4CAF50',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#2C2F3A',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiMessageTime: {
    color: '#8E8E93',
  },
  typingContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  typingBubble: {
    backgroundColor: '#2C2F3A',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  typingText: {
    color: '#8E8E93',
    fontSize: 14,
    fontStyle: 'italic',
  },
  quickQuestionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  quickQuestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  quickQuestionButton: {
    backgroundColor: '#2C2F3A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  quickQuestionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#2C2F3A',
    borderTopWidth: 1,
    borderTopColor: '#3A3A3A',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1A1D29',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#3A3A3A',
  },
});
