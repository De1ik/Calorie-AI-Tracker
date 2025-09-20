import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { database } from '../database/database';
import { User } from '../database/schema';

interface SettingsScreenProps {
  onLogout: () => void;
}

export default function SettingsScreen({ onLogout }: SettingsScreenProps) {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [waterReminders, setWaterReminders] = useState(true);

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await database.getUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? This will clear all your data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await database.clearUser();
              onLogout();
            } catch (error) {
              console.error('Error clearing user data:', error);
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete all your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: handleLogout
        }
      ]
    );
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightComponent?: React.ReactNode
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon as any} size={20} color="#4CAF50" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Ionicons name="chevron-forward" size={20} color="#8E8E93" />}
    </TouchableOpacity>
  );

  const renderProfileSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Profile</Text>
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Ionicons name="person" size={24} color="#4CAF50" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {user?.gender === 'male' ? 'Male' : user?.gender === 'female' ? 'Female' : 'Other'} User
          </Text>
          <Text style={styles.profileDetails}>
            {user?.height}cm • {user?.weight}kg • {user?.sportActivity} activity level
          </Text>
          <Text style={styles.profileGoal}>
            Goal: {user?.goal === 'increase' ? 'Increase Weight' : 
                   user?.goal === 'decrease' ? 'Decrease Weight' : 'Maintain Weight'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderPreferencesSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.sectionContent}>
        {renderSettingItem(
          'notifications',
          'Push Notifications',
          'Get reminders and updates',
          undefined,
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#3A3A3A', true: '#4CAF50' }}
            thumbColor={notifications ? '#FFFFFF' : '#8E8E93'}
          />
        )}
        
        {renderSettingItem(
          'moon',
          'Dark Mode',
          'Use dark theme',
          undefined,
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#3A3A3A', true: '#4CAF50' }}
            thumbColor={darkMode ? '#FFFFFF' : '#8E8E93'}
          />
        )}
        
        {renderSettingItem(
          'water',
          'Water Reminders',
          'Remind me to drink water',
          undefined,
          <Switch
            value={waterReminders}
            onValueChange={setWaterReminders}
            trackColor={{ false: '#3A3A3A', true: '#4CAF50' }}
            thumbColor={waterReminders ? '#FFFFFF' : '#8E8E93'}
          />
        )}
      </View>
    </View>
  );

  const renderDataSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Data & Privacy</Text>
      <View style={styles.sectionContent}>
        {renderSettingItem(
          'download',
          'Export Data',
          'Download your data as CSV',
          () => Alert.alert('Export Data', 'Feature coming soon!')
        )}
        
        {renderSettingItem(
          'cloud-upload',
          'Backup Data',
          'Sync data to cloud',
          () => Alert.alert('Backup Data', 'Feature coming soon!')
        )}
        
        {renderSettingItem(
          'shield-checkmark',
          'Privacy Policy',
          'Read our privacy policy',
          () => Alert.alert('Privacy Policy', 'Feature coming soon!')
        )}
      </View>
    </View>
  );

  const renderSupportSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Support</Text>
      <View style={styles.sectionContent}>
        {renderSettingItem(
          'help-circle',
          'Help Center',
          'Get help and support',
          () => Alert.alert('Help Center', 'Feature coming soon!')
        )}
        
        {renderSettingItem(
          'mail',
          'Contact Us',
          'Send feedback or report issues',
          () => Alert.alert('Contact Us', 'Feature coming soon!')
        )}
        
        {renderSettingItem(
          'star',
          'Rate App',
          'Rate us on the App Store',
          () => Alert.alert('Rate App', 'Feature coming soon!')
        )}
      </View>
    </View>
  );

  const renderAccountSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.sectionContent}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Ionicons name="trash" size={20} color="#FF3B30" />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your app preferences</Text>
        </View>

        {renderProfileSection()}
        {renderPreferencesSection()}
        {renderDataSection()}
        {renderSupportSection()}
        {renderAccountSection()}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Calorie Tracker v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D29',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#2C2F3A',
    borderRadius: 16,
    overflow: 'hidden',
  },
  profileCard: {
    backgroundColor: '#2C2F3A',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  profileGoal: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 12,
    fontWeight: '500',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 12,
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#8E8E93',
  },
});
