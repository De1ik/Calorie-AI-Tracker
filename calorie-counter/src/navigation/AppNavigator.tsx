import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MainScreen from '../screens/MainScreen';
import FoodScreen from '../screens/FoodScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';

type RootTabParamList = {
  Home: { onLogout: () => void };
  Food: undefined;
  Progress: undefined;
  Chat: undefined;
  Settings: { onLogout: () => void };
};

const Tab = createBottomTabNavigator<RootTabParamList>();

interface AppNavigatorProps {
  onLogout: () => void;
}

export default function AppNavigator({ onLogout }: AppNavigatorProps) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1A1D29',
            borderTopColor: '#3A3A3A',
            borderTopWidth: 1,
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={24} 
                color={color} 
              />
            ),
          }}
        >
          {() => <MainScreen onLogout={onLogout} />}
        </Tab.Screen>
        
        <Tab.Screen
          name="Food"
          component={FoodScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "camera" : "camera-outline"} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
        
        <Tab.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "trending-up" : "trending-up-outline"} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
        
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "chatbubble" : "chatbubble-outline"} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
        
        <Tab.Screen
          name="Settings"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "settings" : "settings-outline"} 
                size={24} 
                color={color} 
              />
            ),
          }}
        >
          {() => <SettingsScreen onLogout={onLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
