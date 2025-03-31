import { View, Text, Button, StyleSheet } from 'react-native';

export default function SelectedListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выбранный список</Text>
      // Здесь список выбранных товаров
      <Button title="Удалить" onPress={() => {}} />
      <Button title="Добавить" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 }
});
