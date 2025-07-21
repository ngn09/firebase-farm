import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Card, Chip, IconButton, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Animal } from '../types';
import { lightTheme, spacing, borderRadius } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimalCardProps {
  animal: Animal;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const AnimalCard: React.FC<AnimalCardProps> = ({
  animal,
  onPress,
  onEdit,
  onDelete,
  isSelected = false,
  onSelect,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const borderWidth = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    borderWidth: borderWidth.value,
    borderColor: lightTheme.colors.primary,
  }));

  React.useEffect(() => {
    borderWidth.value = withTiming(isSelected ? 2 : 0, { duration: 200 });
  }, [isSelected, borderWidth]);

  const getStatusColor = (status: Animal['status']) => {
    switch (status) {
      case 'Aktif':
        return '#4CAF50';
      case 'Hamile':
        return '#FF9800';
      case 'Hasta':
        return '#F44336';
      case 'Satıldı':
        return '#9E9E9E';
      case 'Öldü':
        return '#424242';
      default:
        return lightTheme.colors.outline;
    }
  };

  const getStatusIcon = (status: Animal['status']) => {
    switch (status) {
      case 'Aktif': return 'checkmark-circle';
      case 'Hamile': return 'heart';
      case 'Hasta': return 'medical';
      case 'Satıldı': return 'cash';
      case 'Öldü': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + 
                       (today.getMonth() - birth.getMonth());
    
    if (ageInMonths < 12) {
      return `${ageInMonths} ay`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      return `${years} yaş ${months} ay`;
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
    opacity.value = withTiming(0.8);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1);
  };

  return (
    <AnimatedPressable
      style={[styles.card, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={onSelect}
    >
      <Surface style={styles.cardSurface} elevation={2}>
        <View style={styles.cardContent}>
          {onSelect && (
            <View style={styles.selectionIndicator}>
              <IconButton
                icon={isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={20}
                onPress={onSelect}
                iconColor={isSelected ? lightTheme.colors.primary : lightTheme.colors.outline}
              />
            </View>
          )}
          
          <View style={styles.imageContainer}>
            {animal.imageUri ? (
              <Image source={{ uri: animal.imageUri }} style={styles.animalImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="paw" size={32} color={lightTheme.colors.outline} />
              </View>
            )}
            
            {/* Status indicator overlay */}
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(animal.status) }]}>
              <Ionicons 
                name={getStatusIcon(animal.status)} 
                size={12} 
                color="white" 
              />
            </View>
          </View>
        
          <View style={styles.infoContainer}>
            <View style={styles.header}>
              <Text style={styles.tagNumber}>{animal.tagNumber}</Text>
              <View style={styles.actions}>
                <IconButton
                  icon="pencil"
                  size={18}
                  onPress={onEdit}
                  iconColor={lightTheme.colors.primary}
                />
                <IconButton
                  icon="delete"
                  size={18}
                  onPress={onDelete}
                  iconColor={lightTheme.colors.error}
                />
              </View>
            </View>
          
            <Text style={styles.species}>{animal.species} - {animal.breed}</Text>
            <View style={styles.detailsRow}>
              <Ionicons name="male-female" size={14} color={lightTheme.colors.onSurfaceVariant} />
              <Text style={styles.details}>
                {animal.gender} • {calculateAge(animal.birthDate)}
              </Text>
            </View>
          
            <View style={styles.footer}>
              <Chip
                mode="flat"
                icon={getStatusIcon(animal.status)}
                textStyle={{ 
                  color: 'white',
                  fontSize: 12,
                  fontWeight: '600'
                }}
                style={[styles.statusChip, { backgroundColor: getStatusColor(animal.status) }]}
              >
                {animal.status}
              </Chip>
              {animal.weight && (
                <View style={styles.weightContainer}>
                  <Ionicons name="scale" size={14} color={lightTheme.colors.onSurfaceVariant} />
                  <Text style={styles.weight}>{animal.weight} kg</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Surface>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  cardSurface: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: spacing.md,
    position: 'relative',
  },
  selectionIndicator: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    zIndex: 1,
  },
  imageContainer: {
    marginRight: spacing.md,
    position: 'relative',
  },
  animalImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: lightTheme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: lightTheme.colors.outline,
    borderStyle: 'dashed',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  infoContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tagNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: lightTheme.colors.onSurface,
  },
  actions: {
    flexDirection: 'row',
    marginRight: -spacing.sm,
  },
  species: {
    fontSize: 14,
    color: lightTheme.colors.primary,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  details: {
    fontSize: 12,
    color: lightTheme.colors.onSurfaceVariant,
    marginLeft: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  statusChip: {
    height: 24,
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weight: {
    fontSize: 12,
    fontWeight: '600',
    color: lightTheme.colors.onSurfaceVariant,
    marginLeft: spacing.xs,
  },
});