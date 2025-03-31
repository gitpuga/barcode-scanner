// app/auth/sign-in.tsx
import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // здесь логика авторизации
    // При успешном входе переходим во вкладки
    router.push('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>
      <TextInput
        style={styles.input}
        placeholder="Email или телефон"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Войти" onPress={handleSignIn} />

      <Link href="/auth/sign-up">
        <Text style={styles.link}>Нет аккаунта? Зарегистрируйтесь</Text>
      </Link>
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
  },
  link: { color: 'blue', marginTop: 8, textAlign: 'center' }
});
