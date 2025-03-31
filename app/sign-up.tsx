import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const handleSignUp = () => {
    // Логика регистрации
    router.push('/screens/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Повторите пароль"
        secureTextEntry
        value={password2}
        onChangeText={setPassword2}
      />
      <Button title="Зарегистрироваться" onPress={handleSignUp} />

      <Link href="/">
        <Text style={styles.link}>Уже есть аккаунт? Войти</Text>
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
