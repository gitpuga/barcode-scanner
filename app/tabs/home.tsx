import { Link } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Главная</Text>

      <Link href="/screens/lists" asChild>
        <Button title="Нежелательные ингредиенты" />
      </Link>

      <Link href="/screens/add-item" asChild>
        <Button title="Добавление нового товара" />
      </Link>

      <Link href="/screens/item-applications" asChild>
        <Button title="Заявки на добавление товаров" />
      </Link> 

      <Link href="/screens/awards" asChild>
        <Button title="Награды" />
      </Link>

      <Button title="Отключение рекламы" />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 }
});
