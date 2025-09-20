// Example usage of the Chat Service
import { chatService } from './chatService';

// Example of how to use the chat service
export const testChatService = async () => {
  console.log('Testing Chat Service...');
  
  try {
    // Test predefined responses (MODE=1)
    console.log('Testing predefined responses...');
    const response1 = await chatService.generateResponse("Can I eat a donut today?");
    console.log('Response 1:', response1);
    
    const response2 = await chatService.generateResponse("How many calories do I need?");
    console.log('Response 2:', response2);
    
    const response3 = await chatService.generateResponse("What should I eat for breakfast?");
    console.log('Response 3:', response3);
    
    console.log('Chat service test completed successfully!');
  } catch (error) {
    console.error('Error testing chat service:', error);
  }
};

// Example of setting up OpenAI mode
export const setupOpenAIMode = (apiKey: string) => {
  console.log('Setting up OpenAI mode...');
  chatService.setApiKey(apiKey);
  console.log('OpenAI mode configured');
};

// Example of switching to mock mode
export const switchToMockMode = () => {
  console.log('Switching to mock mode...');
  chatService.setMockMode(true);
  console.log('Mock mode enabled');
};
