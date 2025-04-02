import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { useAuth } from "./context/AuthContext";

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const validate = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Валидация email
    if (!email.trim()) {
      errors.email = "Введите email";
    }

    // Валидация пароля
    if (!password) {
      errors.password = "Введите пароль";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    try {
      clearError();

      if (!validate()) return;

      await login({
        email,
        password,
      });
    } catch (err) {
      // Ошибка обрабатывается в контексте аутентификации
      console.log("Ошибка входа:", err);
    }
  };

  // Сообщение об ошибке, если произошла ошибка API
  if (error) {
    Alert.alert("Ошибка входа", error);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход в аккаунт</Text>

      <TextInput
        style={[
          styles.input,
          validationErrors.email ? styles.inputError : null,
        ]}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {validationErrors.email && (
        <Text style={styles.errorText}>{validationErrors.email}</Text>
      )}

      <TextInput
        style={[
          styles.input,
          validationErrors.password ? styles.inputError : null,
        ]}
        placeholder="Пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {validationErrors.password && (
        <Text style={styles.errorText}>{validationErrors.password}</Text>
      )}

      <TouchableOpacity
        style={[styles.loginButton, isLoading ? styles.disabledButton : null]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.loginButtonText}>Войти</Text>
        )}
      </TouchableOpacity>

      <Link href="/screens/sign-up">
        <Text style={styles.link}>Нет аккаунта? Зарегистрирутесь</Text>
      </Link>

      <View style={styles.socialContainer}>
        <Text style={styles.socialText}>Войти с помощью:</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("../assets/images/yandex.png")}
              style={styles.socialIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("../assets/images/vk.png")}
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
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    marginTop: -8,
  },
  loginButton: {
    backgroundColor: "#9e9e9e",
    borderRadius: 4,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  link: {
    color: "#666",
    marginTop: 14,
    textAlign: "center",
  },
  socialContainer: {
    marginTop: 40,
  },
  socialText: {
    textAlign: "center",
    marginBottom: 14,
    color: "#666",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "white",
  },
  socialIcon: {
    width: 44,
    height: 44,
  },
});
