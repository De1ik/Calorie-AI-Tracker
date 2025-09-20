import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Modal, TextInput, Alert, Image, FlatList, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { LineChart } from 'react-native-chart-kit';
import { database } from '../database/database';
import { WeightEntry, StepsEntry, UserPreferences } from '../database/schema';
import { ProgressRecordItem } from '../components/ProgressRecordItem';

const { width } = Dimensions.get('window');

type TimePeriod = 'week' | 'month' | '3months' | 'year';
type DataType = 'weight' | 'calories' | 'steps' | 'all';
type ViewMode = 'graph' | 'list';

interface ProgressData {
  date: string;
  weight?: number;
  calories?: number;
  steps?: number;
  imageUri?: string;
}

export default function ProgressScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('week');
  const [selectedDataType, setSelectedDataType] = useState<DataType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [stepsEntries, setStepsEntries] = useState<StepsEntry[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newSteps, setNewSteps] = useState('');
  const [weightNotes, setWeightNotes] = useState('');
  const [weightImageUri, setWeightImageUri] = useState<string>('');
  const [recordType, setRecordType] = useState<'weight' | 'steps'>('weight');
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [editWeight, setEditWeight] = useState('');
  const [editSteps, setEditSteps] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editImageUri, setEditImageUri] = useState<string>('');
  const [averageCalories, setAverageCalories] = useState<number>(0);
  const [averageSteps, setAverageSteps] = useState<number>(0);
  const [showPointInfo, setShowPointInfo] = useState(false);
  const [pointInfo, setPointInfo] = useState<{date: string, value: number, type: string} | null>(null);

  const periods: { key: TimePeriod; label: string }[] = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: '3months', label: '3 Months' },
    { key: 'year', label: 'Year' },
  ];

  const dataTypes: { key: DataType; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: 'analytics' },
    { key: 'weight', label: 'Weight', icon: 'scale' },
    { key: 'calories', label: 'Calories', icon: 'flame' },
    { key: 'steps', label: 'Steps', icon: 'walk' },
  ];


  useEffect(() => {
    loadProgressData();
  }, [selectedPeriod, selectedDataType]);

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const preferences = await database.getUserPreferences();
      if (preferences) {
        setUserPreferences(preferences);
        // Don't automatically set period and data type from preferences
        // Let user make their own selections
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const loadProgressData = async () => {
    try {
      const { startDate, endDate } = getDateRange(selectedPeriod);
      
      if (selectedDataType === 'all') {
        // Load all data types
        const [weightData, caloriesData, stepsData] = await Promise.all([
          database.getWeightEntries(startDate, endDate),
          database.getMealEntriesForDateRange(startDate, endDate), // Use new method for date range
          database.getProgressData('steps', startDate, endDate),
        ]);

        // Combine data
        const combinedData: ProgressData[] = [];
        const allDates = new Set([
          ...weightData.map(w => w.date),
          ...caloriesData.map(c => c.date),
          ...stepsData.map(s => s.date),
        ]);

        allDates.forEach(date => {
          const weight = weightData.find(w => w.date === date);
          const calories = caloriesData.filter(c => c.date === date).reduce((sum, c) => sum + c.calories, 0);
          const steps = stepsData.find(s => s.date === date);

          combinedData.push({
            date,
            weight: weight?.weight,
            calories: calories || 0,
            steps: (steps as any)?.steps,
            imageUri: weight?.imageUri,
          });
        });

        setProgressData(combinedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } else {
        const data = await database.getProgressData(selectedDataType as 'weight' | 'calories' | 'steps', startDate, endDate);
        setProgressData(data);
      }

      // Load weight and steps entries for recent data
      const weekWeightEntries = await database.getWeightEntriesForWeek();
      const weekStepsEntries = await database.getStepsEntriesForWeek();
      setWeightEntries(weekWeightEntries);
      setStepsEntries(weekStepsEntries);

      // Calculate averages
      await calculateAverages();
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  const calculateAverages = async () => {
    try {
      const { startDate, endDate } = getDateRange(selectedPeriod);
      
      // Calculate average calories
      const mealEntries = await database.getMealEntriesForDateRange(startDate, endDate);
      if (mealEntries.length > 0) {
        const dailyCalories = mealEntries.reduce((acc, entry) => {
          if (!acc[entry.date]) {
            acc[entry.date] = 0;
          }
          acc[entry.date] += entry.calories;
          return acc;
        }, {} as Record<string, number>);
        
        const dailyValues = Object.values(dailyCalories);
        const totalCalories = dailyValues.reduce((sum, calories) => sum + calories, 0);
        setAverageCalories(Math.round(totalCalories / dailyValues.length));
      } else {
        setAverageCalories(0);
      }

      // Calculate average steps
      const stepsData = await database.getProgressData('steps', startDate, endDate);
      if (stepsData.length > 0) {
        const totalSteps = stepsData.reduce((sum, entry) => sum + (entry as any).steps, 0);
        setAverageSteps(Math.round(totalSteps / stepsData.length));
      } else {
        setAverageSteps(0);
      }
    } catch (error) {
      console.error('Error calculating averages:', error);
      setAverageCalories(0);
      setAverageSteps(0);
    }
  };

  const handleChartPointPress = (data: any) => {
    if (data && data.index !== undefined) {
      const chartData = selectedDataType === 'all' ? progressData : progressData.filter(d => d[selectedDataType as keyof ProgressData] !== undefined);
      const pointData = chartData[data.index];
      
      if (pointData) {
        let value = 0;
        let type = '';
        
        if (selectedDataType === 'all') {
          // For "all" view, show the first non-zero value
          if (pointData.weight && pointData.weight > 0) {
            value = pointData.weight;
            type = 'Weight';
          } else if (pointData.calories && pointData.calories > 0) {
            value = pointData.calories;
            type = 'Calories';
          } else if (pointData.steps && pointData.steps > 0) {
            value = pointData.steps;
            type = 'Steps';
          }
        } else {
          if (selectedDataType === 'weight') {
            value = pointData.weight || 0;
            type = 'Weight';
          } else if (selectedDataType === 'calories') {
            value = pointData.calories || 0;
            type = 'Calories';
          } else if (selectedDataType === 'steps') {
            value = pointData.steps || 0;
            type = 'Steps';
          }
        }
        
        setPointInfo({
          date: pointData.date,
          value: value,
          type: type
        });
        setShowPointInfo(true);
      }
    }
  };


  const getDateRange = (period: TimePeriod) => {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    let startDate: string;

    switch (period) {
      case 'week':
        // Get start of current week (Monday)
        const dayOfWeek = today.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, so 6 days to Monday
        const startOfWeek = new Date(today.getTime() - daysToMonday * 24 * 60 * 60 * 1000);
        startDate = startOfWeek.toISOString().split('T')[0];
        break;
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        startDate = monthAgo.toISOString().split('T')[0];
        break;
      case '3months':
        const threeMonthsAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        startDate = threeMonthsAgo.toISOString().split('T')[0];
        break;
      case 'year':
        const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
        startDate = yearAgo.toISOString().split('T')[0];
        break;
      default:
        startDate = endDate;
    }

    return { startDate, endDate };
  };

  const getCurrentWeight = () => {
    const latestWeight = weightEntries[0];
    return latestWeight?.weight || 0;
  };

  const getWeightChange = () => {
    if (weightEntries.length < 2) return 0;
    const latest = weightEntries[0]?.weight || 0;
    const previous = weightEntries[1]?.weight || 0;
    return latest - previous;
  };

  const getTotalSteps = () => {
    const stepsData = progressData.filter(d => d.steps !== undefined);
    return stepsData.reduce((sum, day) => sum + (day.steps || 0), 0);
  };

  const getCombinedDataList = () => {
    const combinedData: (ProgressData & { id: string; weightChange?: number; notes?: string })[] = [];
    const allDates = new Set([
      ...weightEntries.map(w => w.date),
      ...stepsEntries.map(s => s.date),
      ...progressData.map(p => p.date),
    ]);

    allDates.forEach(date => {
      const weight = weightEntries.find(w => w.date === date);
      const steps = stepsEntries.find(s => s.date === date);
      const calories = progressData.filter(p => p.date === date).reduce((sum, p) => sum + (p.calories || 0), 0);

      // Calculate weight change compared to previous record
      const sortedWeightEntries = weightEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const currentIndex = sortedWeightEntries.findIndex(w => w.date === date);
      const previousWeight = currentIndex > 0 ? sortedWeightEntries[currentIndex - 1].weight : null;
      const weightChange = previousWeight && weight ? weight.weight - previousWeight : null;

      combinedData.push({
        id: date,
        date,
        weight: weight?.weight,
        steps: steps?.steps,
        calories: calories || 0,
        imageUri: weight?.imageUri,
        weightChange: weightChange || undefined,
        notes: weight?.notes,
      });
    });

    return combinedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const openEditModal = (record: any) => {
    setEditingRecord(record);
    setEditWeight(record.weight?.toString() || '');
    setEditSteps(record.steps?.toString() || '');
    setEditNotes(record.notes || '');
    setEditImageUri(record.imageUri || '');
    setShowEditModal(true);
  };

  const saveEditRecord = async () => {
    if (!editingRecord) return;

    try {
      const today = editingRecord.date;
      
      // Update weight entry if weight exists
      if (editWeight) {
        const weightEntry = weightEntries.find(w => w.date === today);
        if (weightEntry) {
          await database.updateWeightEntry(weightEntry.id, {
            weight: parseFloat(editWeight),
            imageUri: editImageUri || undefined,
            notes: editNotes || undefined,
          });
        }
      }

      // Update steps entry if steps exists
      if (editSteps) {
        const stepsEntry = stepsEntries.find(s => s.date === today);
        if (stepsEntry) {
          await database.updateStepsEntry(stepsEntry.id, {
            steps: parseInt(editSteps),
          });
        }
      }

      setShowEditModal(false);
      setEditingRecord(null);
      loadProgressData();
      Alert.alert('Success', 'Record updated successfully');
    } catch (error) {
      console.error('Error updating record:', error);
      Alert.alert('Error', 'Failed to update record');
    }
  };

  const deleteRecord = async () => {
    if (!editingRecord) return;

    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const today = editingRecord.date;
              
              // Delete weight entry
              const weightEntry = weightEntries.find(w => w.date === today);
              if (weightEntry) {
                await database.deleteWeightEntry(weightEntry.id);
              }

              // Delete steps entry
              const stepsEntry = stepsEntries.find(s => s.date === today);
              if (stepsEntry) {
                await database.deleteStepsEntry(stepsEntry.id);
              }

              setShowEditModal(false);
              setEditingRecord(null);
              loadProgressData();
              Alert.alert('Success', 'Record deleted successfully');
            } catch (error) {
              console.error('Error deleting record:', error);
              Alert.alert('Error', 'Failed to delete record');
            }
          },
        },
      ]
    );
  };

  const deletePhoto = async () => {
    if (!editingRecord) return;

    try {
      const weightEntry = weightEntries.find(w => w.date === editingRecord.date);
      if (weightEntry) {
        await database.updateWeightEntry(weightEntry.id, {
          weight: weightEntry.weight,
          imageUri: undefined,
          notes: weightEntry.notes,
        });
      }

      setEditImageUri('');
      loadProgressData();
      Alert.alert('Success', 'Photo deleted successfully');
    } catch (error) {
      console.error('Error deleting photo:', error);
      Alert.alert('Error', 'Failed to delete photo');
    }
  };

  const takeWeightPhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setWeightImageUri(result.assets[0].uri);
    }
  };

  const pickWeightPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Gallery permission is required to select photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setWeightImageUri(result.assets[0].uri);
    }
  };

  const saveRecord = async () => {
    if (recordType === 'weight' && !newWeight) {
      Alert.alert('Error', 'Please enter your weight');
      return;
    }
    if (recordType === 'steps' && !newSteps) {
      Alert.alert('Error', 'Please enter your steps');
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const userId = await database.getCurrentUserId();
      if (!userId) throw new Error('No user ID found');
      
      if (recordType === 'weight') {
        await database.saveWeightEntry({
          userId,
          weight: parseFloat(newWeight),
          imageUri: weightImageUri || undefined,
          notes: weightNotes || undefined,
          date: today,
        });
      } else {
        await database.saveStepsEntry({
          userId,
          steps: parseInt(newSteps),
          date: today,
        });
      }

      setNewWeight('');
      setNewSteps('');
      setWeightNotes('');
      setWeightImageUri('');
      setShowAddRecordModal(false);
      loadProgressData();
      Alert.alert('Success', `${recordType === 'weight' ? 'Weight' : 'Steps'} entry saved successfully`);
    } catch (error) {
      console.error('Error saving record:', error);
      Alert.alert('Error', `Failed to save ${recordType} entry`);
    }
  };

  const toggleHidePhotos = async () => {
    try {
      const userId = await database.getCurrentUserId();
      if (!userId) throw new Error('No user ID found');
      
      const newPreferences = {
        userId,
        hidePhotos: !userPreferences?.hidePhotos,
        defaultGraphType: 'line' as 'line' | 'bar' | 'area',
        defaultTimePeriod: selectedPeriod,
        defaultDataType: selectedDataType === 'all' ? 'weight' : selectedDataType as 'weight' | 'calories' | 'steps',
      };

      await database.saveUserPreferences(newPreferences);
      setUserPreferences(prev => prev ? { ...prev, hidePhotos: !prev.hidePhotos } : null);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const renderProgressCard = (title: string, value: string, change: string, icon: string, color: string) => (
    <View style={styles.progressCard}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon as any} size={24} color={color} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={[styles.cardChange, { color: change.startsWith('+') ? '#4CAF50' : '#FF3B30' }]}>
        {change}
      </Text>
    </View>
  );

  const renderChart = () => {
    if (progressData.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            {selectedDataType === 'all' ? 'Progress Overview' : `${dataTypes.find(d => d.key === selectedDataType)?.label} Trend`}
          </Text>
          <View style={styles.emptyChart}>
            <Ionicons name="analytics" size={48} color="#8E8E93" />
            <Text style={styles.emptyChartText}>No data available</Text>
          </View>
        </View>
      );
    }

    const getChartData = () => {
      if (selectedDataType === 'all') {
        return progressData;
      }
      return progressData.filter(d => d[selectedDataType as keyof ProgressData] !== undefined);
    };

    const chartData = getChartData();
    
    if (chartData.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            {selectedDataType === 'all' ? 'Progress Overview' : `${dataTypes.find(d => d.key === selectedDataType)?.label} Trend`}
          </Text>
          <View style={styles.emptyChart}>
            <Ionicons name="analytics" size={48} color="#8E8E93" />
            <Text style={styles.emptyChartText}>No data available</Text>
          </View>
        </View>
      );
    }

    // Prepare data for LineChart
    const labels = chartData.map(d => {
      const date = new Date(d.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    let lineChartData;
    
    if (selectedDataType === 'all') {
      // Show all metrics on the same chart with different colors
      const weightData = chartData.map(d => d.weight || 0);
      const caloriesData = chartData.map(d => d.calories || 0);
      const stepsData = chartData.map(d => d.steps || 0);
      
      lineChartData = {
        labels: labels.slice(-7), // Show last 7 data points
        datasets: [
          {
            data: weightData.slice(-7),
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green for weight
            strokeWidth: 2,
            withDots: true,
            withScrollableDotFill: '#4CAF50',
            withScrollableDotStroke: '#4CAF50',
            withInnerLines: false,
            withOuterLines: false,
            withVerticalLines: false,
            withHorizontalLines: false,
            withShadow: false,
          },
          {
            data: caloriesData.slice(-7),
            color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`, // Orange for calories
            strokeWidth: 2,
            withDots: true,
            withScrollableDotFill: '#FF9800',
            withScrollableDotStroke: '#FF9800',
            withInnerLines: false,
            withOuterLines: false,
            withVerticalLines: false,
            withHorizontalLines: false,
            withShadow: false,
          },
          {
            data: stepsData.slice(-7),
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // Blue for steps
            strokeWidth: 2,
            withDots: true,
            withScrollableDotFill: '#2196F3',
            withScrollableDotStroke: '#2196F3',
            withInnerLines: false,
            withOuterLines: false,
            withVerticalLines: false,
            withHorizontalLines: false,
            withShadow: false,
          },
        ],
      };
    } else {
      // Show single metric with specific color
      const data = chartData.map(d => {
        if (selectedDataType === 'weight') return d.weight || 0;
        if (selectedDataType === 'calories') return d.calories || 0;
        if (selectedDataType === 'steps') return d.steps || 0;
        return 0;
      });
      
      // Get specific color for each data type
      let color = 'rgba(76, 175, 80, 1)'; // Default green
      if (selectedDataType === 'calories') color = 'rgba(255, 152, 0, 1)'; // Orange
      if (selectedDataType === 'steps') color = 'rgba(33, 150, 243, 1)'; // Blue
      
      lineChartData = {
        labels: labels.slice(-7), // Show last 7 data points
        datasets: [
          {
            data: data.slice(-7),
            color: (opacity = 1) => color.replace('1)', `${opacity})`),
            strokeWidth: 2,
          },
        ],
      };
    }

    const chartConfig = {
      backgroundColor: colors.card,
      backgroundGradientFrom: '#2C2F3A',
      backgroundGradientTo: '#2C2F3A',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      // Only apply global dot props when not showing all data types
      ...(selectedDataType !== 'all' && {
        propsForDots: {
          r: '6',
          strokeWidth: '2',
          stroke: selectedDataType === 'calories' ? '#FF9800' : selectedDataType === 'steps' ? '#2196F3' : '#4CAF50',
          fill: selectedDataType === 'calories' ? '#FF9800' : selectedDataType === 'steps' ? '#2196F3' : '#4CAF50',
        },
      }),
      propsForBackgroundLines: {
        strokeDasharray: '5,5',
        stroke: 'rgba(255, 255, 255, 0.2)',
        strokeWidth: 1,
      },
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          {selectedDataType === 'all' ? 'Progress Overview' : `${dataTypes.find(d => d.key === selectedDataType)?.label} Trend`}
        </Text>
        
        {/* Legend for "all" view */}
        {selectedDataType === 'all' && (
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>Weight</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.legendText}>Calories</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
              <Text style={styles.legendText}>Steps</Text>
            </View>
          </View>
        )}
        
        <View style={styles.chartWrapper}>
          <LineChart
            data={lineChartData}
            width={width - 80}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots={true}
            withShadow={false}
            withScrollableDot={false}
            withInnerLines={true}
            withOuterLines={true}
            withVerticalLines={true}
            withHorizontalLines={true}
            onDataPointClick={handleChartPointPress}
          />
        </View>
      </View>
    );
  };

  const recentData = showFullHistory ? weightEntries : weightEntries.slice(0, 7);
  const combinedDataList = getCombinedDataList();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress Tracking</Text>
          <Text style={styles.subtitle}>Monitor your fitness journey</Text>
        </View>

        {/* Add Record Section */}
        <View style={styles.addRecordSection}>
          <View style={styles.addRecordHeader}>
            <Text style={styles.sectionTitle}>Quick Add</Text>
            <Text style={styles.sectionSubtitle}>Add new data points</Text>
          </View>
          <View style={styles.addRecordButtons}>
            <TouchableOpacity 
              style={[styles.addRecordButton, styles.weightButton]} 
              onPress={() => {
                setRecordType('weight');
                setShowAddRecordModal(true);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.addRecordIconContainer}>
                <Ionicons name="scale" size={24} color={colors.primary} />
              </View>
              <Text style={styles.addRecordButtonText}>Weight</Text>
              <Text style={styles.addRecordButtonSubtext}>Track progress</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.addRecordButton, styles.stepsButton]} 
              onPress={() => {
                setRecordType('steps');
                setShowAddRecordModal(true);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.addRecordIconContainer}>
                <Ionicons name="walk" size={24} color={colors.secondary} />
              </View>
              <Text style={styles.addRecordButtonText}>Steps</Text>
              <Text style={styles.addRecordButtonSubtext}>Daily activity</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsHeader}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.sectionSubtitle}>Your progress summary</Text>
          </View>
          <View style={styles.cardsContainer}>
            {renderProgressCard(
              'Current Weight',
              `${getCurrentWeight()} kg`,
              `${getWeightChange() > 0 ? '+' : ''}${getWeightChange().toFixed(1)} kg`,
              'scale',
              '#4CAF50'
            )}
            
            {renderProgressCard(
              'Avg Calories',
              `${averageCalories} cal`,
              'This period',
              'flame',
              '#FF9800'
            )}
            
            {renderProgressCard(
              'Avg Steps',
              `${averageSteps.toLocaleString()}`,
              'This period',
              'walk',
              '#2196F3'
            )}
          </View>
        </View>


        {/* View Toggle */}
        <View style={styles.viewToggleSection}>
          <Text style={styles.sectionTitle}>View Options</Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[
                styles.viewToggleButton,
                viewMode === 'graph' && styles.viewToggleButtonActive
              ]}
              onPress={() => setViewMode('graph')}
            >
              <Ionicons name="analytics" size={20} color={viewMode === 'graph' ? '#FFFFFF' : '#8E8E93'} />
              <Text style={[
                styles.viewToggleButtonText,
                viewMode === 'graph' && styles.viewToggleButtonTextActive
              ]}>
                Graph View
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.viewToggleButton,
                viewMode === 'list' && styles.viewToggleButtonActive
              ]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons name="list" size={20} color={viewMode === 'list' ? '#FFFFFF' : '#8E8E93'} />
              <Text style={[
                styles.viewToggleButtonText,
                viewMode === 'list' && styles.viewToggleButtonTextActive
              ]}>
                List View
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Graph View */}
        {viewMode === 'graph' && (
          <>
            {/* Period Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodContainer}>
              {periods.map((period) => (
                <TouchableOpacity
                  key={period.key}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period.key && styles.periodButtonActive
                  ]}
                  onPress={() => setSelectedPeriod(period.key)}
                >
                  <Text style={[
                    styles.periodButtonText,
                    selectedPeriod === period.key && styles.periodButtonTextActive
                  ]}>
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Data Type Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dataTypeContainer}>
              {dataTypes.map((dataType) => (
                <TouchableOpacity
                  key={dataType.key}
                  style={[
                    styles.dataTypeButton,
                    selectedDataType === dataType.key && styles.dataTypeButtonActive
                  ]}
                  onPress={() => setSelectedDataType(dataType.key)}
                >
                  <Ionicons name={dataType.icon as any} size={16} color={selectedDataType === dataType.key ? '#FFFFFF' : '#8E8E93'} />
                  <Text style={[
                    styles.dataTypeButtonText,
                    selectedDataType === dataType.key && styles.dataTypeButtonTextActive
                  ]}>
                    {dataType.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Chart */}
            {renderChart()}
          </>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <View style={styles.listViewContainer}>
            <View style={styles.listViewHeader}>
              <View style={styles.listViewTitleContainer}>
                <Text style={styles.listViewTitle}>Progress History</Text>
                <Text style={styles.listViewSubtitle}>
                  {combinedDataList.length} records found
                </Text>
              </View>
              <TouchableOpacity onPress={toggleHidePhotos} style={styles.hidePhotosButton}>
                <Ionicons 
                  name={userPreferences?.hidePhotos ? "eye-off" : "eye"} 
                  size={18} 
                  color={colors.primary} 
                />
                <Text style={styles.hidePhotosText}>
                  {userPreferences?.hidePhotos ? 'Show Photos' : 'Hide Photos'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.listContentContainer}>
              {combinedDataList.map((item, index) => (
                <View key={item.id}>
                  <ProgressRecordItem
                    record={item}
                    onEdit={openEditModal}
                    onPhotoPress={(imageUri) => {
                      setSelectedPhoto(imageUri);
                      setShowPhotoModal(true);
                    }}
                    hidePhotos={userPreferences?.hidePhotos}
                  />
                  {index < combinedDataList.length - 1 && <View style={styles.listSeparator} />}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add Record Modal */}
      <Modal
        visible={showAddRecordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddRecordModal(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add {recordType === 'weight' ? 'Weight' : 'Steps'} Entry</Text>
            
            {recordType === 'weight' ? (
              <>
                <TextInput
                  style={styles.weightInput}
                  placeholder="Enter weight (kg)"
                  placeholderTextColor="#8E8E93"
                  value={newWeight}
                  onChangeText={setNewWeight}
                  keyboardType="numeric"
                />
                
                <TextInput
                  style={styles.notesInput}
                  placeholder="Notes (optional)"
                  placeholderTextColor="#8E8E93"
                  value={weightNotes}
                  onChangeText={setWeightNotes}
                  multiline
                />
                
                <View style={styles.photoButtonsContainer}>
                  <TouchableOpacity style={styles.photoButton} onPress={takeWeightPhoto}>
                    <Ionicons name="camera" size={20} color={colors.primary} />
                    <Text style={styles.photoButtonText}>Take Photo</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.photoButton} onPress={pickWeightPhoto}>
                    <Ionicons name="images" size={20} color={colors.primary} />
                    <Text style={styles.photoButtonText}>From Gallery</Text>
                  </TouchableOpacity>
                </View>
                
                {weightImageUri && (
                  <Image source={{ uri: weightImageUri }} style={styles.previewImage} />
                )}
              </>
            ) : (
              <TextInput
                style={styles.weightInput}
                placeholder="Enter steps"
                placeholderTextColor="#8E8E93"
                value={newSteps}
                onChangeText={setNewSteps}
                keyboardType="numeric"
              />
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={() => setShowAddRecordModal(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveModalButton}
                onPress={saveRecord}
              >
                <Text style={styles.saveModalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Record</Text>
            
            <View style={styles.editForm}>
              <View style={styles.editField}>
                <Text style={styles.editFieldLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.editInput}
                  placeholder="Enter weight"
                  placeholderTextColor="#8E8E93"
                  value={editWeight}
                  onChangeText={setEditWeight}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.editField}>
                <Text style={styles.editFieldLabel}>Steps</Text>
                <TextInput
                  style={styles.editInput}
                  placeholder="Enter steps"
                  placeholderTextColor="#8E8E93"
                  value={editSteps}
                  onChangeText={setEditSteps}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.editField}>
                <Text style={styles.editFieldLabel}>Notes</Text>
                <TextInput
                  style={styles.editNotesInput}
                  placeholder="Enter notes"
                  placeholderTextColor="#8E8E93"
                  value={editNotes}
                  onChangeText={setEditNotes}
                  multiline
                />
              </View>
              
              <View style={styles.editField}>
                <Text style={styles.editFieldLabel}>Photo</Text>
                <View style={styles.editPhotoContainer}>
                  {editImageUri ? (
                    <View style={styles.editPhotoPreview}>
                      <Image source={{ uri: editImageUri }} style={styles.editPreviewImage} />
                      <TouchableOpacity 
                        style={styles.deletePhotoButton}
                        onPress={deletePhoto}
                      >
                        <Ionicons name="trash" size={16} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.editPhotoButtons}>
                      <TouchableOpacity style={styles.editPhotoButton} onPress={takeWeightPhoto}>
                        <Ionicons name="camera" size={20} color={colors.primary} />
                        <Text style={styles.editPhotoButtonText}>Take Photo</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={styles.editPhotoButton} onPress={pickWeightPhoto}>
                        <Ionicons name="images" size={20} color={colors.primary} />
                        <Text style={styles.editPhotoButtonText}>From Gallery</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            <View style={styles.editModalButtons}>
              <TouchableOpacity
                style={styles.deleteRecordButton}
                onPress={deleteRecord}
              >
                <Ionicons name="trash" size={16} color="#FFFFFF" />
                <Text style={styles.deleteRecordButtonText}>Delete Record</Text>
              </TouchableOpacity>
              
              <View style={styles.editModalActionButtons}>
                <TouchableOpacity
                  style={styles.cancelModalButton}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={styles.cancelModalButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.saveModalButton}
                  onPress={saveEditRecord}
                >
                  <Text style={styles.saveModalButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Photo Modal */}
      <Modal
        visible={showPhotoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.photoModalOverlay}>
          <TouchableOpacity 
            style={styles.photoModalCloseArea}
            onPress={() => setShowPhotoModal(false)}
          >
            <Image source={{ uri: selectedPhoto }} style={styles.fullScreenImage} />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Point Info Modal */}
      <Modal
        visible={showPointInfo}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPointInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pointInfoModal}>
            <View style={styles.pointInfoHeader}>
              <Text style={styles.pointInfoTitle}>Data Point</Text>
              <TouchableOpacity onPress={() => setShowPointInfo(false)}>
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            
            {pointInfo && (
              <View style={styles.pointInfoContent}>
                <View style={styles.pointInfoRow}>
                  <Text style={styles.pointInfoLabel}>Date:</Text>
                  <Text style={styles.pointInfoValue}>
                    {new Date(pointInfo.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </View>
                
                <View style={styles.pointInfoRow}>
                  <Text style={styles.pointInfoLabel}>Type:</Text>
                  <Text style={styles.pointInfoValue}>{pointInfo.type}</Text>
                </View>
                
                <View style={styles.pointInfoRow}>
                  <Text style={styles.pointInfoLabel}>Value:</Text>
                  <Text style={[
                    styles.pointInfoValue,
                    { color: pointInfo.type === 'Calories' ? '#FF9800' : 
                             pointInfo.type === 'Steps' ? '#2196F3' : '#4CAF50' }
                  ]}>
                    {pointInfo.type === 'Steps' ? pointInfo.value.toLocaleString() : 
                     pointInfo.type === 'Weight' ? `${pointInfo.value} kg` : 
                     `${pointInfo.value} cal`}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  addRecordSection: {
    marginBottom: 24,
  },
  addRecordHeader: {
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  addRecordButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addRecordButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weightButton: {
    borderColor: colors.primary,
  },
  stepsButton: {
    borderColor: colors.secondary,
  },
  addRecordIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  addRecordButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  addRecordButtonSubtext: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  statsSection: {
    marginBottom: 24,
  },
  statsHeader: {
    marginBottom: 16,
  },
  viewToggleSection: {
    marginBottom: 20,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
    marginTop: 12,
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
  viewToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewToggleButtonActive: {
    backgroundColor: colors.primary,
  },
  viewToggleButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  viewToggleButtonTextActive: {
    color: colors.text,
  },
  listViewContainer: {
    flex: 1,
    marginBottom: 20,
  },
  listViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  listViewTitleContainer: {
    flex: 1,
  },
  listViewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  listViewSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  listSeparator: {
    height: 4,
  },
  chartWrapper: {
    alignItems: 'center',
    marginTop: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  periodContainer: {
    marginBottom: 16,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
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
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: colors.text,
  },
  dataTypeContainer: {
    marginBottom: 20,
  },
  dataTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
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
  dataTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  dataTypeButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  dataTypeButtonTextActive: {
    color: colors.text,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  progressCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  cardChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  emptyChart: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 12,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarFill: {
    width: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  recentDataContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  hidePhotosButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hidePhotosText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 4,
  },
  dataItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
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
  dataDate: {
    marginBottom: 8,
  },
  dataDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  dataNotes: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  dataContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataValues: {
    alignItems: 'flex-start',
  },
  dataValueNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 2,
  },
  dataValueLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dataImageContainer: {
    marginLeft: 12,
  },
  dataImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 8,
  },
  showMoreText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointInfoModal: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 350,
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
  pointInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pointInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  pointInfoContent: {
    gap: 15,
  },
  pointInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointInfoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  pointInfoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  weightInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  photoButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoButtonText: {
    color: colors.text,
    fontSize: 12,
    marginTop: 4,
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelModalButton: {
    backgroundColor: colors.textSecondary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelModalButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  saveModalButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveModalButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  photoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoModalCloseArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  fullScreenImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
  editForm: {
    marginBottom: 20,
  },
  editField: {
    marginBottom: 16,
  },
  editFieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  editInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
  },
  editNotesInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editPhotoContainer: {
    marginTop: 8,
  },
  editPhotoPreview: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  editPreviewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deletePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editPhotoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editPhotoButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
  },
  editPhotoButtonText: {
    color: colors.text,
    fontSize: 12,
    marginTop: 4,
  },
  editModalButtons: {
    gap: 16,
  },
  deleteRecordButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteRecordButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  editModalActionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
});
