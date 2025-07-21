import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Alert,
} from 'react-native';
import { Searchbar, FAB, Chip, Menu, Divider, Button, Surface, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { AnimalCard } from '../components/AnimalCard';
import { useAnimalStore } from '../stores/animalStore';
import { usePerformance } from '../hooks/usePerformance';
import { Animal } from '../types';
import { lightTheme, spacing, borderRadius } from '../constants/theme';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const AnimalsScreen: React.FC = () => {
  const { 
    animals, 
    deleteAnimal, 
    bulkDeleteAnimals,
    getFilteredAnimals,
    searchQuery,
    selectedStatus,
    sortBy,
    sortOrder,
    setSearchQuery,
    setSelectedStatus,
    setSorting,
    getStatistics
  } = useAnimalStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  
  const { getMetrics } = usePerformance('AnimalsScreen');
  const statistics = getStatistics();

  const filteredAnimals = useMemo(() => getFilteredAnimals(), [getFilteredAnimals]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleDeleteAnimal = (id: string) => {
    Alert.alert(
      'Hayvanı Sil',
      'Bu hayvanı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: () => deleteAnimal(id)
        },
      ]
    );
  };

  const handleBulkDelete = () => {
    Alert.alert(
      'Seçili Hayvanları Sil',
      `${selectedAnimals.length} hayvanı silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: () => {
            bulkDeleteAnimals(selectedAnimals);
            setSelectedAnimals([]);
            setSelectionMode(false);
          }
        },
      ]
    );
  };

  const handleEditAnimal = (animal: Animal) => {
    // Navigate to edit screen
    console.log('Edit animal:', animal.id);
  };

  const handleAnimalPress = (animal: Animal) => {
    if (selectionMode) {
      handleAnimalSelect(animal.id);
      return;
    }
    // Navigate to animal detail screen
    console.log('View animal:', animal.id);
  };

  const handleAnimalSelect = (id: string) => {
    setSelectedAnimals(prev => 
      prev.includes(id) 
        ? prev.filter(animalId => animalId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedAnimals([]);
  };

  const selectAll = () => {
    setSelectedAnimals(filteredAnimals.map(animal => animal.id));
  };

  const deselectAll = () => {
    setSelectedAnimals([]);
  };

  const statusOptions: (Animal['status'] | 'Tümü')[] = [
    'Tümü',
    'Aktif',
    'Hamile',
    'Hasta',
    'Satıldı',
    'Öldü',
  ];

  const sortOptions = [
    { key: 'tagNumber', label: 'Küpe No' },
    { key: 'species', label: 'Tür' },
    { key: 'birthDate', label: 'Doğum Tarihi' },
    { key: 'status', label: 'Durum' },
  ];

  const getStatusColor = (status: Animal['status'] | 'Tümü') => {
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

  const renderAnimalCard = ({ item }: { item: Animal }) => (
    <Animated.View
      entering={FadeInDown.delay(100)}
      layout={Layout.springify()}
    >
      <AnimalCard
        animal={item}
        onPress={() => handleAnimalPress(item)}
        onEdit={() => handleEditAnimal(item)}
        onDelete={() => handleDeleteAnimal(item.id)}
        isSelected={selectedAnimals.includes(item.id)}
        onSelect={selectionMode ? () => handleAnimalSelect(item.id) : undefined}
      />
    </Animated.View>
  );

  const renderHeader = () => (
    <Animated.View entering={FadeInDown.delay(50)} style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>🐄 Hayvanlar</Text>
        <View style={styles.headerActions}>
          <IconButton
            icon={selectionMode ? "close" : "checkbox-multiple-marked"}
            onPress={toggleSelectionMode}
            iconColor={lightTheme.colors.primary}
          />
          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <IconButton
                icon="sort"
                onPress={() => setSortMenuVisible(true)}
                iconColor={lightTheme.colors.primary}
              />
            }
          >
            {sortOptions.map((option) => (
              <Menu.Item
                key={option.key}
                onPress={() => {
                  setSorting(option.key as any, sortOrder === 'asc' ? 'desc' : 'asc');
                  setSortMenuVisible(false);
                }}
                title={`${option.label} ${sortBy === option.key ? (sortOrder === 'asc' ? '↑' : '↓') : ''}`}
              />
            ))}
          </Menu>
        </View>
      </View>
      
      <Text style={styles.subtitle}>
        {filteredAnimals.length} / {statistics.total} hayvan
      </Text>

      {selectionMode && (
        <Surface style={styles.selectionBar} elevation={2}>
          <Text style={styles.selectionText}>
            {selectedAnimals.length} hayvan seçildi
          </Text>
          <View style={styles.selectionActions}>
            <Button mode="outlined" onPress={selectAll} compact>
              Tümünü Seç
            </Button>
            <Button mode="outlined" onPress={deselectAll} compact>
              Temizle
            </Button>
            <Button 
              mode="contained" 
              onPress={handleBulkDelete} 
              compact
              buttonColor={lightTheme.colors.error}
              disabled={selectedAnimals.length === 0}
            >
              Sil
            </Button>
          </View>
        </Surface>
      )}

      <Searchbar
        placeholder="Küpe no, tür veya cins ara..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        iconColor={lightTheme.colors.primary}
        inputStyle={styles.searchInput}
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
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              {status}
            </Chip>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <Animated.View entering={FadeInDown.delay(300)} style={styles.emptyContainer}>
      <Ionicons name="paw" size={80} color={lightTheme.colors.outline} />
      <Text style={styles.emptyTitle}>
        {searchQuery || selectedStatus !== 'Tümü' 
          ? 'Arama kriterlerine uygun hayvan bulunamadı' 
          : 'Henüz hayvan yok'
        }
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || selectedStatus !== 'Tümü'
          ? 'Filtreleri değiştirmeyi deneyin'
          : 'İlk hayvanınızı eklemek için + butonuna dokunun'
        }
      </Text>
    </Animated.View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={lightTheme.colors.background} />
      <View style={styles.container}>
        <AnimatedFlatList
          data={filteredAnimals}
          renderItem={renderAnimalCard}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[lightTheme.colors.primary]}
              tintColor={lightTheme.colors.primary}
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={8}
          getItemLayout={(data, index) => ({
            length: 120,
            offset: 120 * index,
            index,
          })}
        />

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => {
            // Navigate to add animal screen
          }}
          label="Hayvan Ekle"
        />
      </View>
    </>
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
    paddingTop: spacing.lg,
    backgroundColor: lightTheme.colors.surface,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
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
    fontWeight: '500',
  },
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: lightTheme.colors.primaryContainer,
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '600',
    color: lightTheme.colors.primary,
  },
  selectionActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  searchbar: {
    marginBottom: spacing.lg,
    backgroundColor: lightTheme.colors.surface,
    elevation: 2,
    borderRadius: borderRadius.lg,
  },
  searchInput: {
    fontSize: 16,
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
    borderRadius: borderRadius.lg,
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