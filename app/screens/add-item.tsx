import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function AddItemScreen() {
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSave = () => {
    // Логика сохранения товара
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добавление товара</Text>
      <TextInput
        style={styles.input}
        placeholder="Название"
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Бренд"
        value={brand}
        onChangeText={setBrand}
      />
      <TextInput
        style={styles.input}
        placeholder="Количество"
        value={quantity}
        onChangeText={setQuantity}
      />
      <Button title="Сохранить" onPress={handleSave} />
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
