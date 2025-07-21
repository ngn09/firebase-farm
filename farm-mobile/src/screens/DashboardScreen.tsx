import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Card, FAB, Chip, Surface, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { VictoryChart, VictoryLine, VictoryPie, VictoryTheme, VictoryArea } from 'victory-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAnimalStore } from '../stores/animalStore';
import { usePerformance } from '../hooks/usePerformance';
import { lightTheme, spacing, borderRadius } from '../constants/theme';

const screenWidth = Dimensions.get('window').width;

export const DashboardScreen: React.FC = () => {
  const { animals, loading, getStatistics } = useAnimalStore();
  const [refreshing, setRefreshing] = useState(false);
  const { getMetrics } = usePerformance('DashboardScreen');

  const statistics = getStatistics();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Chart data for Victory
  const genderData = [
    {
      x: 'Erkek',
      y: statistics.byGender.Erkek,
    },
    {
      x: 'Dişi',
      y: statistics.byGender.Dişi,
    },
  ];

  const monthlyData = [
    { x: 'Oca', y: 20 },
    { x: 'Şub', y: 45 },
    { x: 'Mar', y: 28 },
    { x: 'Nis', y: 80 },
    { x: 'May', y: 99 },
    { x: 'Haz', y: 43 },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={lightTheme.colors.background} />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[lightTheme.colors.primary]}
              tintColor={lightTheme.colors.primary}
            />
          }
        >
          {/* Header */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
            <Text style={styles.title}>🐄 Çiftlik Asistanı</Text>
            <Text style={styles.subtitle}>Hoş geldiniz! {statistics.total} hayvanınız var</Text>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.quickActions}>
            <Button
              mode="contained"
              icon="plus"
              onPress={() => {}}
              style={styles.quickActionButton}
              labelStyle={styles.quickActionLabel}
            >
              Hayvan Ekle
            </Button>
            <Button
              mode="outlined"
              icon="medical"
              onPress={() => {}}
              style={styles.quickActionButton}
              labelStyle={styles.quickActionLabel}
            >
              Sağlık Kaydı
            </Button>
          </Animated.View>

          {/* Stats Cards */}
          <Animated.View entering={FadeInDown.delay(300)}>
            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                <Surface style={[styles.statCard, { backgroundColor: lightTheme.colors.primary }]} elevation={3}>
                  <View style={styles.statContent}>
                    <Ionicons name="paw" size={28} color="white" />
                    <Text style={styles.statNumber}>{statistics.total}</Text>
                    <Text style={styles.statLabel}>Toplam Hayvan</Text>
                  </View>
                </Surface>
                
                <Surface style={[styles.statCard, { backgroundColor: '#FF9800' }]} elevation={3}>
                  <View style={styles.statContent}>
                    <Ionicons name="heart" size={28} color="white" />
                    <Text style={styles.statNumber}>{statistics.byStatus.Hamile}</Text>
                    <Text style={styles.statLabel}>Hamile</Text>
                  </View>
                </Surface>
              </View>
            
              <View style={styles.statsRow}>
                <Surface style={[styles.statCard, { backgroundColor: '#F44336' }]} elevation={3}>
                  <View style={styles.statContent}>
                    <Ionicons name="medical" size={28} color="white" />
                    <Text style={styles.statNumber}>{statistics.byStatus.Hasta}</Text>
                    <Text style={styles.statLabel}>Hasta</Text>
                  </View>
                </Surface>
                
                <Surface style={[styles.statCard, { backgroundColor: '#4CAF50' }]} elevation={3}>
                  <View style={styles.statContent}>
                    <Ionicons name="checkmark-circle" size={28} color="white" />
                    <Text style={styles.statNumber}>{statistics.byStatus.Aktif}</Text>
                    <Text style={styles.statLabel}>Sağlıklı</Text>
                  </View>
                </Surface>
              </View>
            </View>
          </Animated.View>

          {/* Charts */}
          <Animated.View entering={FadeInDown.delay(400)}>
            <Surface style={styles.chartCard} elevation={2}>
              <Text style={styles.chartTitle}>📊 Cinsiyet Dağılımı</Text>
              {statistics.total > 0 ? (
                <VictoryPie
                  data={genderData}
                  width={screenWidth - 64}
                  height={200}
                  theme={VictoryTheme.material}
                  colorScale={[lightTheme.colors.primary, lightTheme.colors.secondary]}
                  innerRadius={50}
                  labelRadius={({ innerRadius }) => innerRadius as number + 40 }
                  labelComponent={<Text style={styles.chartLabel} />}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Ionicons name="bar-chart" size={48} color={lightTheme.colors.outline} />
                  <Text style={styles.noDataText}>Henüz hayvan kaydı yok</Text>
                </View>
              )}
            </Surface>

            <Surface style={styles.chartCard} elevation={2}>
              <Text style={styles.chartTitle}>📈 Aylık Trend</Text>
              <VictoryChart
                theme={VictoryTheme.material}
                width={screenWidth - 64}
                height={200}
                padding={{ left: 50, top: 20, right: 50, bottom: 50 }}
              >
                <VictoryArea
                  data={monthlyData}
                  style={{
                    data: { fill: lightTheme.colors.primary, fillOpacity: 0.3, stroke: lightTheme.colors.primary, strokeWidth: 2 }
                  }}
                  animate={{
                    duration: 1000,
                    onLoad: { duration: 500 }
                  }}
                />
              </VictoryChart>
            </Surface>
          </Animated.View>

          {/* Recent Activities */}
          <Animated.View entering={FadeInDown.delay(500)}>
            <Surface style={styles.activityCard} elevation={2}>
              <Text style={styles.chartTitle}>🕒 Son Aktiviteler</Text>
              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: lightTheme.colors.primary }]}>
                  <Ionicons name="add-circle" size={16} color="white" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>Yeni hayvan eklendi: TR-001</Text>
                  <Text style={styles.activityTime}>2 saat önce</Text>
                </View>
              </View>
              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: '#F44336' }]}>
                  <Ionicons name="medical" size={16} color="white" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>Sağlık kaydı güncellendi</Text>
                  <Text style={styles.activityTime}>5 saat önce</Text>
                </View>
              </View>
              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: '#FF9800' }]}>
                  <Ionicons name="nutrition" size={16} color="white" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>Yem stoğu güncellendi</Text>
                  <Text style={styles.activityTime}>1 gün önce</Text>
                </View>
              </View>
            </Surface>
          </Animated.View>
        </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: lightTheme.colors.surface,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    marginBottom: spacing.md,
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
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
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
  },
  statContent: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    marginTop: spacing.xs,
    textAlign: 'center',
    fontWeight: '600',
  },
  chartCard: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightTheme.colors.onSurface,
    marginBottom: spacing.md,
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: lightTheme.colors.onSurface,
  },
  noDataContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: lightTheme.colors.onSurfaceVariant,
    fontSize: 16,
    marginTop: spacing.md,
  },
  activityCard: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: 100, // Space for FAB
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.outlineVariant,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: lightTheme.colors.onSurface,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: lightTheme.colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: lightTheme.colors.primary,
  },
});
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