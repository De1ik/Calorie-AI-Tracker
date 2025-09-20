import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProgressRecordItemProps {
  record: {
    id: string;
    date: string;
    weight?: number;
    steps?: number;
    calories?: number;
    imageUri?: string;
    weightChange?: number;
    notes?: string;
  };
  onEdit: (record: any) => void;
  onPhotoPress: (imageUri: string) => void;
  hidePhotos?: boolean;
}

export const ProgressRecordItem: React.FC<ProgressRecordItemProps> = ({
  record,
  onEdit,
  onPhotoPress,
  hidePhotos = false,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
    };
  };

  const formatWeightChange = (change: number) => {
    const isPositive = change >= 0;
    return {
      text: `${isPositive ? '+' : ''}${change.toFixed(1)} kg`,
      color: isPositive ? '#FF3B30' : '#4CAF50',
      icon: isPositive ? 'trending-up' : 'trending-down',
    };
  };

  const getMetricIcon = (type: 'weight' | 'calories' | 'steps') => {
    const icons = {
      weight: { name: 'scale', color: '#4CAF50' },
      calories: { name: 'flame', color: '#FF9800' },
      steps: { name: 'walk', color: '#2196F3' },
    };
    return icons[type];
  };

  const formatMetricValue = (type: 'weight' | 'calories' | 'steps', value: number) => {
    switch (type) {
      case 'weight':
        return `${value} kg`;
      case 'calories':
        return `${value.toLocaleString()} cal`;
      case 'steps':
        return `${value.toLocaleString()}`;
      default:
        return value.toString();
    }
  };

  const dateInfo = formatDate(record.date);
  const weightChangeInfo = record.weightChange !== undefined ? formatWeightChange(record.weightChange) : null;

  return (
    <View style={styles.container}>
      {/* Compact Header */}
      <View style={styles.header}>
        <View style={styles.dateSection}>
          <Text style={styles.dateText}>
            {dateInfo.weekday}, {dateInfo.month} {dateInfo.day}
          </Text>
          {record.notes && (
            <Text style={styles.notesText} numberOfLines={1}>
              {record.notes}
            </Text>
          )}
        </View>

        <View style={styles.actionsContainer}>
          {record.imageUri && !hidePhotos && (
            <TouchableOpacity
              style={styles.photoButton}
              onPress={() => onPhotoPress(record.imageUri!)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: record.imageUri }} style={styles.photoThumbnail} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(record)}
            activeOpacity={0.7}
          >
            <Ionicons name="create" size={16} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Compact Metrics */}
      <View style={styles.metricsContainer}>
        {record.weight && (
          <View style={styles.metricItem}>
            <Ionicons 
              name={getMetricIcon('weight').name as any} 
              size={14} 
              color={getMetricIcon('weight').color} 
            />
            <Text style={styles.metricValue}>
              {formatMetricValue('weight', record.weight)}
            </Text>
            {weightChangeInfo && (
              <Text style={[styles.weightChangeText, { color: weightChangeInfo.color }]}>
                {weightChangeInfo.text}
              </Text>
            )}
          </View>
        )}

        {(record.calories || 0) > 0 && (
          <View style={styles.metricItem}>
            <Ionicons 
              name={getMetricIcon('calories').name as any} 
              size={14} 
              color={getMetricIcon('calories').color} 
            />
            <Text style={styles.metricValue}>
              {formatMetricValue('calories', record.calories || 0)}
            </Text>
          </View>
        )}

        {record.steps && (
          <View style={styles.metricItem}>
            <Ionicons 
              name={getMetricIcon('steps').name as any} 
              size={14} 
              color={getMetricIcon('steps').color} 
            />
            <Text style={styles.metricValue}>
              {formatMetricValue('steps', record.steps)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C2F3A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateSection: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  notesText: {
    fontSize: 11,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  photoButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoThumbnail: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1A1D29',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1D29',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  weightChangeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
