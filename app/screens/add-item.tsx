import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function AddItemScreen() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Необходимо разрешение на использование камеры');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        setPhotos([...photos, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Ошибка при съемке фото:', error);
      Alert.alert('Ошибка', 'Не удалось сделать фото');
    }
  };

  const handleSelectPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Необходимо разрешение на доступ к галерее');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        const newPhotos = result.assets.map(asset => asset.uri);
        setPhotos([...photos, ...newPhotos]);
      }
    } catch (error) {
      console.error('Ошибка при выборе фото:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать фото');
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handleSave = async () => {
    if (photos.length === 0) {
      Alert.alert('Ошибка', 'Необходимо добавить хотя бы одно фото товара');
      return;
    }

    try {
      setIsLoading(true);
      
      // Здесь будет запрос к вашему API
      // const formData = new FormData();
      // photos.forEach((uri, index) => {
      //   formData.append('photos', {
      //     uri,
      //     name: `photo_${index}.jpg`,
      //     type: 'image/jpeg'
      //   });
      // });
      // formData.append('userId', user?.id);
      
      // const response = await fetch('http://your-api.com/products', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      // Имитация запроса
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Успех', 'Товар успешно добавлен на модерацию');
      router.back();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      Alert.alert('Ошибка', 'Не удалось добавить товар');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Добавление нового товара</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Загрузите фотографии товара:</Text>
        <Text style={styles.requirement}>• с упоковкой</Text>
        <Text style={styles.requirement}>• с составом</Text>
        <Text style={styles.requirement}>• со штрих-кодом</Text>
      </View>

      {photos.length > 0 && (
        <View style={styles.photosContainer}>
          {photos.map((uri, index) => (
            <View key={index} style={styles.photoWrapper}>
              <Image source={{ uri }} style={styles.photo} />
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleRemovePhoto(index)}
              >
                <Ionicons name="close-circle" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.photoButton}
          onPress={handleTakePhoto}
        >
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.photoButtonText}>Сделать фото</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.photoButton}
          onPress={handleSelectPhoto}
        >
          <Ionicons name="image" size={24} color="white" />
          <Text style={styles.photoButtonText}>Выбрать из галереи</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.submitButton, isLoading && styles.disabledButton]}
        onPress={handleSave}
        disabled={isLoading}
      >
        {isLoading ? (
          <Text style={styles.submitButtonText}>Отправка...</Text>
        ) : (
          <Text style={styles.submitButtonText}>Добавить товар</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#000',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  requirement: {
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 8,
    color: '#666',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  photoWrapper: {
    width: '48%',
    height: 150,
    marginBottom: 10,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  photoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#90CAF9',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});