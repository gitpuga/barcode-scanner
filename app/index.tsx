import { Link } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добро пожаловать</Text>

      {/* Переход на экран входа */}
      <Link href="/auth/sign-in" asChild>
        <Button title="Войти" />
      </Link>

      {/* Переход на экран регистрации */}
      <Link href="/auth/sign-up" asChild>
        <Button title="Зарегистрироваться" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20
  }
});
