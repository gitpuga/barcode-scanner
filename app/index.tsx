import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // Здесь логика авторизации
    // При успешном входе переходим во вкладки
    router.push('/tabs/home');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
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
      
      <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
        <Text style={styles.loginButtonText}>Войти</Text>
      </TouchableOpacity>

      <Link href="/screens/sign-up">
        <Text style={styles.link}>Нет аккаунта? Зарегистрируйтесь!</Text>
      </Link>
      
      <View style={styles.socialContainer}>
        <Text style={styles.socialText}>Войти с помощью:</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Image 
              source={require('../assets/images/yandex.png')} 
              style={styles.socialIcon} 
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image 
              source={require('../assets/images/vk.png')} 
              style={styles.socialIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center',
    backgroundColor: '#e0e0e0'
  },
  title: { 
    fontSize: 18, 
    marginBottom: 24,
    color: '#666'
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    fontSize: 16
  },
  loginButton: {
    backgroundColor: '#9e9e9e',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
    marginTop: 8
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500'
  },
  link: { 
    color: '#666', 
    marginTop: 14, 
    textAlign: 'center' 
  },
  socialContainer: {
    marginTop: 40
  },
  socialText: {
    textAlign: 'center',
    marginBottom: 14,
    color: '#666'
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'white'
  },
  socialIcon: {
    width: 44,
    height: 44
  }
});
