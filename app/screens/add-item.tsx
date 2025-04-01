import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function AddItemScreen() {
  const [photos, setPhotos] = useState([]);

  const handleSave = async () => {
    try {
      // Логика сохранения товара
      if (photos.length === 0) {
        throw new Error('Необходимо добавить фото товара');
      }
      // Сохранение данных
    } catch (error) {
      // Обработка ошибок
    }
  };

  const handlePhoto = async () => {
    try {
      // Логика добавления фото
      // setPhotos([...photos, newPhoto]);
    } catch (error) {
      // Обработка ошибок
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Добавление нового товара</Text>
        
        <View style={styles.photoSection}>
          <Text style={styles.instructions}>
            Загрузите фотографии товара. На них должны быть видны:
          </Text>
          <Text style={styles.requirement}>• упаковка</Text>
          <Text style={styles.requirement}>• состав</Text>
          <Text style={styles.requirement}>• штрихкод</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Загрузить фото" 
            onPress={handlePhoto}
          />
          <Button 
            title="Добавить товар"
            onPress={handleSave}
            disabled={photos.length === 0}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  photoSection: {
    marginBottom: 24,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 12,
  },
  requirement: {
    fontSize: 16,
    marginLeft: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12
  }
});
