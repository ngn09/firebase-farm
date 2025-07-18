import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  SegmentedButtons,
  Menu,
  Divider,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAnimalStore } from '../stores/animalStore';
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

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
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

  const speciesOptions = [
    'İnek',
    'Koyun',
    'Keçi',
    'Tavuk',
    'Domuz',
    'At',
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
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
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
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
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

  const onSubmit = (data: AnimalFormData) => {
    try {
      addAnimal({
        ...data,
        imageUri: imageUri || undefined,
      });

      Toast.show({
        type: 'success',
        text1: 'Başarılı!',
        text2: `${data.tagNumber} başarıyla eklendi.`,
      });

      reset();
      setImageUri(null);
      onClose();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hata!',
        text2: 'Hayvan eklenirken bir hata oluştu.',
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.title}>Yeni Hayvan Ekle</Text>

          {/* Image Section */}
          <TouchableOpacity style={styles.imageContainer} onPress={showImageOptions}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.animalImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="camera" size={32} color={lightTheme.colors.outline} />
                <Text style={styles.imageText}>Fotoğraf Ekle</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="tagNumber"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Küpe Numarası *"
                  value={value}
                  onChangeText={onChange}
                  error={!!errors.tagNumber}
                  style={styles.input}
                  mode="outlined"
                  placeholder="TR-001"
                />
              )}
            />
            {errors.tagNumber && (
              <Text style={styles.errorText}>{errors.tagNumber.message}</Text>
            )}

            <Controller
              control={control}
              name="species"
              render={({ field: { onChange, value } }) => (
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
                      }}
                      title={species}
                    />
                  ))}
                </Menu>
              )}
            />
            {errors.species && (
              <Text style={styles.errorText}>{errors.species.message}</Text>
            )}

            <Controller
              control={control}
              name="breed"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Cins *"
                  value={value}
                  onChangeText={onChange}
                  error={!!errors.breed}
                  style={styles.input}
                  mode="outlined"
                  placeholder="Holstein, Simental..."
                />
              )}
            />
            {errors.breed && (
              <Text style={styles.errorText}>{errors.breed.message}</Text>
            )}

            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <View style={styles.segmentContainer}>
                  <Text style={styles.segmentLabel}>Cinsiyet *</Text>
                  <SegmentedButtons
                    value={value}
                    onValueChange={onChange}
                    buttons={[
                      { value: 'Dişi', label: 'Dişi' },
                      { value: 'Erkek', label: 'Erkek' },
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
                <TextInput
                  label="Doğum Tarihi *"
                  value={value}
                  onChangeText={onChange}
                  error={!!errors.birthDate}
                  style={styles.input}
                  mode="outlined"
                  placeholder="YYYY-MM-DD"
                />
              )}
            />
            {errors.birthDate && (
              <Text style={styles.errorText}>{errors.birthDate.message}</Text>
            )}

            <Controller
              control={control}
              name="weight"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Ağırlık (kg)"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(text ? parseFloat(text) : undefined)}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="numeric"
                  placeholder="0"
                />
              )}
            />

            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
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
                      }}
                      title={status}
                    />
                  ))}
                </Menu>
              )}
            />

            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Notlar"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  placeholder="Hayvan hakkında ek bilgiler..."
                />
              )}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
              labelStyle={styles.cancelButtonText}
            >
              İptal
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={[styles.button, styles.submitButton]}
              labelStyle={styles.submitButtonText}
            >
              Kaydet
            </Button>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  card: {
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    elevation: 2,
  },
  cardContent: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: lightTheme.colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
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
  formContainer: {
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: lightTheme.colors.surface,
  },
  segmentContainer: {
    marginBottom: spacing.md,
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
  errorText: {
    color: lightTheme.colors.error,
    fontSize: 12,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
    marginLeft: spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    borderRadius: borderRadius.md,
  },
  cancelButton: {
    borderColor: lightTheme.colors.outline,
  },
  cancelButtonText: {
    color: lightTheme.colors.onSurfaceVariant,
  },
  submitButton: {
    backgroundColor: lightTheme.colors.primary,
  },
  submitButtonText: {
    color: 'white',
  },
});