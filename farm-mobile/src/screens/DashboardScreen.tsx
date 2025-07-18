import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Card, FAB, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useAnimalStore } from '../stores/animalStore';
import { lightTheme, spacing, borderRadius } from '../constants/theme';

const screenWidth = Dimensions.get('window').width;

export const DashboardScreen: React.FC = () => {
  const { animals, loading } = useAnimalStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Statistics calculations
  const totalAnimals = animals.length;
  const maleAnimals = animals.filter(a => a.gender === 'Erkek').length;
  const femaleAnimals = animals.filter(a => a.gender === 'Dişi').length;
  const pregnantAnimals = animals.filter(a => a.status === 'Hamile').length;
  const sickAnimals = animals.filter(a => a.status === 'Hasta').length;

  // Chart data
  const genderData = [
    {
      name: 'Erkek',
      population: maleAnimals,
      color: '#8FBC8F',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Dişi',
      population: femaleAnimals,
      color: '#E07A5F',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ];

  const monthlyData = {
    labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(143, 188, 143, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(143, 188, 143, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: borderRadius.md,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#8FBC8F',
    },
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Çiftlik Asistanı</Text>
          <Text style={styles.subtitle}>Hoş geldiniz</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { backgroundColor: lightTheme.colors.primary }]}>
              <View style={styles.statContent}>
                <Ionicons name="paw" size={24} color="white" />
                <Text style={styles.statNumber}>{totalAnimals}</Text>
                <Text style={styles.statLabel}>Toplam Hayvan</Text>
              </View>
            </Card>
            
            <Card style={[styles.statCard, { backgroundColor: lightTheme.colors.secondary }]}>
              <View style={styles.statContent}>
                <Ionicons name="heart" size={24} color="white" />
                <Text style={styles.statNumber}>{pregnantAnimals}</Text>
                <Text style={styles.statLabel}>Hamile</Text>
              </View>
            </Card>
          </View>

          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { backgroundColor: lightTheme.colors.error }]}>
              <View style={styles.statContent}>
                <Ionicons name="medical" size={24} color="white" />
                <Text style={styles.statNumber}>{sickAnimals}</Text>
                <Text style={styles.statLabel}>Hasta</Text>
              </View>
            </Card>
            
            <Card style={[styles.statCard, { backgroundColor: lightTheme.colors.tertiary }]}>
              <View style={styles.statContent}>
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text style={styles.statNumber}>{animals.filter(a => a.status === 'Aktif').length}</Text>
                <Text style={styles.statLabel}>Sağlıklı</Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Charts */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Cinsiyet Dağılımı</Text>
          {totalAnimals > 0 ? (
            <PieChart
              data={genderData}
              width={screenWidth - 64}
              height={200}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 10]}
              absolute
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Henüz hayvan kaydı yok</Text>
            </View>
          )}
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Aylık Trend</Text>
          <LineChart
            data={monthlyData}
            width={screenWidth - 64}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card>

        {/* Recent Activities */}
        <Card style={styles.activityCard}>
          <Text style={styles.chartTitle}>Son Aktiviteler</Text>
          <View style={styles.activityItem}>
            <Ionicons name="add-circle" size={20} color={lightTheme.colors.primary} />
            <Text style={styles.activityText}>Yeni hayvan eklendi: TR-001</Text>
            <Text style={styles.activityTime}>2 saat önce</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="medical" size={20} color={lightTheme.colors.error} />
            <Text style={styles.activityText}>Sağlık kaydı güncellendi</Text>
            <Text style={styles.activityTime}>5 saat önce</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="nutrition" size={20} color={lightTheme.colors.secondary} />
            <Text style={styles.activityText}>Yem stoğu güncellendi</Text>
            <Text style={styles.activityTime}>1 gün önce</Text>
          </View>
        </Card>
      </ScrollView>

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
  scrollView: {
    flex: 1,
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
  },
  statsContainer: {
    paddingHorizontal: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    elevation: 3,
  },
  statContent: {
    padding: spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  chartCard: {
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightTheme.colors.onSurface,
    marginBottom: spacing.md,
  },
  chart: {
    borderRadius: borderRadius.md,
  },
  noDataContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: lightTheme.colors.onSurfaceVariant,
    fontSize: 16,
  },
  activityCard: {
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    elevation: 2,
    marginBottom: 100, // Space for FAB
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.outlineVariant,
  },
  activityText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 14,
    color: lightTheme.colors.onSurface,
  },
  activityTime: {
    fontSize: 12,
    color: lightTheme.colors.onSurfaceVariant,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: lightTheme.colors.primary,
  },
});