import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function AddItemScreen() {
  const handleSave = () => {
    // Логика сохранения товара
  };
  const handlePhoto = () => {
    // Логика добавление фото
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добавление нового товара</Text>
      <Text>Загрузите фотографии товара. На них должны быть видны:{"\n"}- упаковка;{"\n"}- состав;{"\n"}- штрихкод.</Text>
      <Button title="Загрузить фото" onPress={handlePhoto} />
      <Button title="Добавить товар" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12
  }
});
