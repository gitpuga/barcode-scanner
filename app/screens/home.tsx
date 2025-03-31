import { Link } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Главная</Text>

      <Link href="/add-item" asChild>
        <Button title="Добавить товар" />
      </Link>

      <Link href="/selected-list" asChild>
        <Button title="Выбранный список" />
      </Link>

      <Link href="/restrictions" asChild>
        <Button title="Ограничения" />
      </Link>

      <Link href="/recommendations" asChild>
        <Button title="Рекомендации" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 }
});
