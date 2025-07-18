import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Searchbar, FAB, Chip, Menu, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { AnimalCard } from '../components/AnimalCard';
import { useAnimalStore } from '../stores/animalStore';
import { Animal } from '../types';
import { lightTheme, spacing, borderRadius } from '../constants/theme';

export const AnimalsScreen: React.FC = () => {
  const { animals, deleteAnimal } = useAnimalStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Animal['status'] | 'Tümü'>('Tümü');
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const filteredAnimals = useMemo(() => {
    let filtered = animals;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (animal) =>
          animal.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          animal.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
          animal.breed.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== 'Tümü') {
      filtered = filtered.filter((animal) => animal.status === selectedStatus);
    }

    return filtered;
  }, [animals, searchQuery, selectedStatus]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleDeleteAnimal = (id: string) => {
    deleteAnimal(id);
  };

  const handleEditAnimal = (animal: Animal) => {
    // Navigate to edit screen
    console.log('Edit animal:', animal.id);
  };

  const handleAnimalPress = (animal: Animal) => {
    // Navigate to animal detail screen
    console.log('View animal:', animal.id);
  };

  const statusOptions: (Animal['status'] | 'Tümü')[] = [
    'Tümü',
    'Aktif',
    'Hamile',
    'Hasta',
    'Satıldı',
    'Öldü',
  ];

  const getStatusColor = (status: Animal['status'] | 'Tümü') => {
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

  const renderAnimalCard = ({ item }: { item: Animal }) => (
    <AnimalCard
      animal={item}
      onPress={() => handleAnimalPress(item)}
      onEdit={() => handleEditAnimal(item)}
      onDelete={() => handleDeleteAnimal(item.id)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Hayvanlar</Text>
      <Text style={styles.subtitle}>
        {filteredAnimals.length} hayvan listeleniyor
      </Text>

      <Searchbar
        placeholder="Küpe no, tür veya cins ara..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        iconColor={lightTheme.colors.primary}
      />

      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Durum:</Text>
        <View style={styles.chipContainer}>
          {statusOptions.map((status) => (
            <Chip
              key={status}
              mode={selectedStatus === status ? 'flat' : 'outlined'}
              selected={selectedStatus === status}
              onPress={() => setSelectedStatus(status)}
              style={[
                styles.filterChip,
                selectedStatus === status && {
                  backgroundColor: getStatusColor(status),
                },
              ]}
              textStyle={{
                color: selectedStatus === status ? 'white' : getStatusColor(status),
              }}
            >
              {status}
            </Chip>
          ))}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="paw" size={64} color={lightTheme.colors.outline} />
      <Text style={styles.emptyTitle}>Henüz hayvan yok</Text>
      <Text style={styles.emptySubtitle}>
        İlk hayvanınızı eklemek için + butonuna dokunun
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredAnimals}
        renderItem={renderAnimalCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // Navigate to add animal screen
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: lightTheme.colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: lightTheme.colors.onSurfaceVariant,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  searchbar: {
    marginBottom: spacing.lg,
    backgroundColor: lightTheme.colors.surface,
    elevation: 2,
  },
  filtersContainer: {
    marginBottom: spacing.md,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: lightTheme.colors.onSurface,
    marginBottom: spacing.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: lightTheme.colors.onSurface,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: lightTheme.colors.onSurfaceVariant,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: lightTheme.colors.primary,
  },
});