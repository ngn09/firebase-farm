import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Chip, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Animal } from '../types';
import { lightTheme, spacing, borderRadius } from '../constants/theme';

interface AnimalCardProps {
  animal: Animal;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AnimalCard: React.FC<AnimalCardProps> = ({
  animal,
  onPress,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: Animal['status']) => {
    switch (status) {
      case 'Aktif':
        return lightTheme.colors.primary;
      case 'Hamile':
        return lightTheme.colors.secondary;
      case 'Hasta':
        return lightTheme.colors.error;
      case 'Satıldı':
        return lightTheme.colors.outline;
      case 'Öldü':
        return lightTheme.colors.error;
      default:
        return lightTheme.colors.outline;
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

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          {animal.imageUri ? (
            <Image source={{ uri: animal.imageUri }} style={styles.animalImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="paw" size={32} color={lightTheme.colors.outline} />
            </View>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Text style={styles.tagNumber}>{animal.tagNumber}</Text>
            <View style={styles.actions}>
              <IconButton
                icon="pencil"
                size={20}
                onPress={onEdit}
                iconColor={lightTheme.colors.primary}
              />
              <IconButton
                icon="delete"
                size={20}
                onPress={onDelete}
                iconColor={lightTheme.colors.error}
              />
            </View>
          </View>
          
          <Text style={styles.species}>{animal.species} - {animal.breed}</Text>
          <Text style={styles.details}>
            {animal.gender} • {calculateAge(animal.birthDate)}
          </Text>
          
          <View style={styles.footer}>
            <Chip
              mode="outlined"
              textStyle={{ color: getStatusColor(animal.status) }}
              style={[styles.statusChip, { borderColor: getStatusColor(animal.status) }]}
            >
              {animal.status}
            </Chip>
            {animal.weight && (
              <Text style={styles.weight}>{animal.weight} kg</Text>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: spacing.sm,
    elevation: 2,
    borderRadius: borderRadius.lg,
  },
  cardContent: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  imageContainer: {
    marginRight: spacing.md,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: lightTheme.colors.onSurface,
  },
  actions: {
    flexDirection: 'row',
  },
  species: {
    fontSize: 16,
    color: lightTheme.colors.primary,
    marginTop: spacing.xs,
  },
  details: {
    fontSize: 14,
    color: lightTheme.colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  statusChip: {
    height: 28,
  },
  weight: {
    fontSize: 14,
    fontWeight: '600',
    color: lightTheme.colors.onSurfaceVariant,
  },
});