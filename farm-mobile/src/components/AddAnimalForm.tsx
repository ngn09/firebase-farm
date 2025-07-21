import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  Pressable,
  StatusBar,
} from 'react-native';
import {
  TextInput,
  Button,
  Surface,
  SegmentedButtons,
  Menu,
  HelperText,
  ProgressBar,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAnimalStore } from '../stores/animalStore';
import { usePerformance } from '../hooks/usePerformance';
import { Animal } from '../types';
import { lightTheme, spacing, borderRadius } from '../constants/theme';
import Toast from 'react-native-toast-message';

const animalSchema = z.object({
  tagNumber: z.string().min(1, 'Küpe numarası gerekli'),
  species: z.string().min(1, 'Tür seçimi gerekli'),
  breed: z.string().min(1, 'Cins gerekli'),
  gender: z.enum(['Erkek', 'Dişi']),
  birthDate: z.string().min(1, 'Doğum tarihi gerekli'),
  status: z.enum(['Aktif', 'Hamile', 'Hasta', 'Satıldı', 'Öldü']),
  weight: z.number().optional(),
  notes: z.string().optional(),
});

type AnimalFormData = z.infer<typeof animalSchema>;

interface AddAnimalFormProps {
  onClose: () => void;
}

export const AddAnimalForm: React.FC<AddAnimalFormProps> = ({ onClose }) => {
  const { addAnimal } = useAnimalStore();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [speciesMenuVisible, setSpeciesMenuVisible] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { getMetrics } = usePerformance('AddAnimalForm');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    trigger,
  } = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      tagNumber: '',
      species: '',
      breed: '',
      gender: 'Dişi',
      birthDate: '',
      status: 'Aktif',
      weight: undefined,
      notes: '',
    },
  });

  const watchedValues = watch();
  const totalSteps = 3;
  const progress = (currentStep + 1) / totalSteps;

  const speciesOptions = [
    'İnek',
    'Koyun',
    'Keçi',
    'Tavuk',
    'At',
    'Eşek',
    'Manda',
    'Diğer',
  ];

  const statusOptions: Animal['status'][] = [
    'Aktif',
    'Hamile',
    'Hasta',
    'Satıldı',
    'Öldü',
  ];

  const pickImage = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'İzin Gerekli',
        'Fotoğraf seçmek için galeri erişim izni gerekli.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      exif: false,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const takePhoto = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'İzin Gerekli',
        'Fotoğraf çekmek için kamera erişim izni gerekli.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      exif: false,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const showImageOptions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Fotoğraf Seç',
      'Nasıl fotoğraf eklemek istiyorsunuz?',
      [
        { text: 'Kamera', onPress: takePhoto },
        { text: 'Galeri', onPress: pickImage },
        { text: 'İptal', style: 'cancel' },
      ]
    );
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof AnimalFormData)[] = [];
    
    switch (currentStep) {
      case 0:
        fieldsToValidate = ['tagNumber', 'species', 'breed'];
        break;
      case 1:
        fieldsToValidate = ['gender', 'birthDate', 'status'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const onSubmit = (data: AnimalFormData) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      addAnimal({
        ...data,
        imageUri: imageUri || undefined,
      });

      Toast.show({
        type: 'success',
        text1: 'Başarılı!',
        text2: `${data.tagNumber} başarıyla eklendi.`,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      reset();
      setImageUri(null);
      setCurrentStep(0);
      onClose();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hata!',
        text2: 'Hayvan eklenirken bir hata oluştu.',
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderDetailsInfo();
      case 2:
        return renderAdditionalInfo();
      default:
        return null;
    }
  };

  const renderBasicInfo = () => (
    <Animated.View entering={SlideInRight.delay(100)} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>📝 Temel Bilgiler</Text>
      
      <Controller
        control={control}
        name="tagNumber"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Küpe Numarası *"
              value={value}
              onChangeText={onChange}
              error={!!errors.tagNumber}
              style={styles.input}
              mode="outlined"
              placeholder="TR-001"
              left={<TextInput.Icon icon="tag" />}
            />
            <HelperText type="error" visible={!!errors.tagNumber}>
              {errors.tagNumber?.message}
            </HelperText>
          </View>
        )}
      />

      <Controller
        control={control}
        name="species"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Menu
              visible={speciesMenuVisible}
              onDismiss={() => setSpeciesMenuVisible(false)}
              anchor={
                <TextInput
                  label="Tür *"
                  value={value}
                  onFocus={() => setSpeciesMenuVisible(true)}
                  error={!!errors.species}
                  style={styles.input}
                  mode="outlined"
                  right={<TextInput.Icon icon="chevron-down" />}
                  left={<TextInput.Icon icon="paw" />}
                  showSoftInputOnFocus={false}
                />
              }
            >
              {speciesOptions.map((species) => (
                <Menu.Item
                  key={species}
                  onPress={() => {
                    onChange(species);
                    setSpeciesMenuVisible(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  title={species}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={!!errors.species}>
              {errors.species?.message}
            </HelperText>
          </View>
        )}
      />

      <Controller
        control={control}
        name="breed"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Cins *"
              value={value}
              onChangeText={onChange}
              error={!!errors.breed}
              style={styles.input}
              mode="outlined"
              placeholder="Holstein, Simental..."
              left={<TextInput.Icon icon="dna" />}
            />
            <HelperText type="error" visible={!!errors.breed}>
              {errors.breed?.message}
            </HelperText>
          </View>
        )}
      />
    </Animated.View>
  );

  const renderDetailsInfo = () => (
    <Animated.View entering={SlideInRight.delay(100)} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>🔍 Detay Bilgiler</Text>
      
      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.segmentLabel}>Cinsiyet *</Text>
            <SegmentedButtons
              value={value}
              onValueChange={(newValue) => {
                onChange(newValue);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              buttons={[
                { 
                  value: 'Dişi', 
                  label: 'Dişi',
                  icon: 'gender-female',
                },
                { 
                  value: 'Erkek', 
                  label: 'Erkek',
                  icon: 'gender-male',
                },
              ]}
              style={styles.segmentedButtons}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="birthDate"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Doğum Tarihi *"
              value={value}
              onChangeText={onChange}
              error={!!errors.birthDate}
              style={styles.input}
              mode="outlined"
              placeholder="YYYY-MM-DD"
              left={<TextInput.Icon icon="calendar" />}
            />
            <HelperText type="error" visible={!!errors.birthDate}>
              {errors.birthDate?.message}
            </HelperText>
          </View>
        )}
      />

      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Menu
              visible={statusMenuVisible}
              onDismiss={() => setStatusMenuVisible(false)}
              anchor={
                <TextInput
                  label="Durum *"
                  value={value}
                  onFocus={() => setStatusMenuVisible(true)}
                  error={!!errors.status}
                  style={styles.input}
                  mode="outlined"
                  right={<TextInput.Icon icon="chevron-down" />}
                  left={<TextInput.Icon icon="heart-pulse" />}
                  showSoftInputOnFocus={false}
                />
              }
            >
              {statusOptions.map((status) => (
                <Menu.Item
                  key={status}
                  onPress={() => {
                    onChange(status);
                    setStatusMenuVisible(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  title={status}
                />
              ))}
            </Menu>
          </View>
        )}
      />
    </Animated.View>
  );

  const renderAdditionalInfo = () => (
    <Animated.View entering={SlideInRight.delay(100)} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>📷 Ek Bilgiler</Text>
      
      {/* Image Section */}
      <Pressable style={styles.imageContainer} onPress={showImageOptions}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.animalImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="camera" size={32} color={lightTheme.colors.outline} />
            <Text style={styles.imageText}>Fotoğraf Ekle</Text>
          </View>
        )}
      </Pressable>

      <Controller
        control={control}
        name="weight"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Ağırlık (kg)"
              value={value?.toString() || ''}
              onChangeText={(text) => onChange(text ? parseFloat(text) : undefined)}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              placeholder="0"
              left={<TextInput.Icon icon="scale" />}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              label="Notlar"
              value={value}
              onChangeText={onChange}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder="Hayvan hakkında ek bilgiler..."
              left={<TextInput.Icon icon="note-text" />}
            />
          </View>
        )}
      />
    </Animated.View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={lightTheme.colors.background} />
      <View style={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(50)} style={styles.header}>
          <Text style={styles.title}>🐄 Yeni Hayvan Ekle</Text>
          <ProgressBar 
            progress={progress} 
            color={lightTheme.colors.primary}
            style={styles.progressBar}
          />
          <Text style={styles.stepIndicator}>
            Adım {currentStep + 1} / {totalSteps}
          </Text>
        </Animated.View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Surface style={styles.card} elevation={2}>
            <View style={styles.cardContent}>
              {renderStep()}
            </View>
          </Surface>
        </ScrollView>

        {/* Navigation Buttons */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.navigationContainer}>
          <View style={styles.buttonContainer}>
            {currentStep > 0 && (
              <Button
                mode="outlined"
                onPress={prevStep}
                style={[styles.button, styles.backButton]}
                icon="chevron-left"
              >
                Geri
              </Button>
            )}
            
            <Button
              mode="outlined"
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
            >
              İptal
            </Button>
            
            {currentStep < totalSteps - 1 ? (
              <Button
                mode="contained"
                onPress={nextStep}
                style={[styles.button, styles.nextButton]}
                icon="chevron-right"
                contentStyle={styles.nextButtonContent}
              >
                İleri
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={[styles.button, styles.submitButton]}
                icon="check"
              >
                Kaydet
              </Button>
            )}
          </View>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: lightTheme.colors.surface,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: lightTheme.colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: spacing.sm,
  },
  stepIndicator: {
    fontSize: 14,
    color: lightTheme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: spacing.md,
    borderRadius: borderRadius.lg,
  },
  cardContent: {
    padding: spacing.lg,
  },
  stepContainer: {
    minHeight: 400,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: lightTheme.colors.onSurface,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  animalImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: lightTheme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: lightTheme.colors.outline,
    borderStyle: 'dashed',
  },
  imageText: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: lightTheme.colors.outline,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: lightTheme.colors.surface,
  },
  segmentLabel: {
    fontSize: 16,
    color: lightTheme.colors.onSurface,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  segmentedButtons: {
    backgroundColor: lightTheme.colors.surface,
  },
  navigationContainer: {
    backgroundColor: lightTheme.colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    borderRadius: borderRadius.md,
  },
  backButton: {
    borderColor: lightTheme.colors.outline,
  },
  cancelButton: {
    borderColor: lightTheme.colors.outline,
  },
  nextButton: {
    backgroundColor: lightTheme.colors.primary,
  },
  nextButtonContent: {
    flexDirection: 'row-reverse',
  },
  submitButton: {
    backgroundColor: lightTheme.colors.primary,
  },
});