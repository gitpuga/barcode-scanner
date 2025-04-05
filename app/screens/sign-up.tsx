import { useState } from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function SignUpScreen() {
  const { signUp, isLoading, error, clearError } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const validate = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!firstName.trim()) errors.firstName = "Введите имя";
    if (!lastName.trim()) errors.lastName = "Введите фамилию";

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "Введите email";
    } else if (!emailRegex.test(email)) {
      errors.email = "Введите корректный email";
    }

    // Валидация пароля
    if (!password) {
      errors.password = "Введите пароль";
    } else if (password.length < 6) {
      errors.password = "Пароль должен содержать минимум 6 символов";
    }

    if (password !== password2) {
      errors.password2 = "Пароли не совпадают";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async () => {
    try {
      clearError();

      if (!validate()) return;

      await signUp({
        firstName,
        lastName,
        email,
        password,
      });
    } catch (err) {
      // Ошибка обрабатывается в контексте аутентификации
      console.log("Ошибка регистрации:", err);
    }
  };

  // Сообщение об ошибке, если произошла ошибка API
  if (error) {
    Alert.alert("Ошибка регистрации", error);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Регистрация</Text>

      <TextInput
        style={[
          styles.input,
          validationErrors.firstName ? styles.inputError : null,
        ]}
        placeholder="Имя"
        value={firstName}
        onChangeText={setFirstName}
      />
      {validationErrors.firstName && (
        <Text style={styles.errorText}>{validationErrors.firstName}</Text>
      )}

      <TextInput
        style={[
          styles.input,
          validationErrors.lastName ? styles.inputError : null,
        ]}
        placeholder="Фамилия"
        value={lastName}
        onChangeText={setLastName}
      />
      {validationErrors.lastName && (
        <Text style={styles.errorText}>{validationErrors.lastName}</Text>
      )}

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

      <TextInput
        style={[
          styles.input,
          validationErrors.password2 ? styles.inputError : null,
        ]}
        placeholder="Повторите пароль"
        secureTextEntry
        value={password2}
        onChangeText={setPassword2}
      />
      {validationErrors.password2 && (
        <Text style={styles.errorText}>{validationErrors.password2}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.registerButton,
          isLoading ? styles.disabledButton : null,
        ]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.registerButtonText}>Зарегистрироваться</Text>
        )}
      </TouchableOpacity>

      <Link href="/">
        <Text style={styles.link}>Уже есть аккаунт? Войти</Text>
      </Link>

      <View style={styles.socialContainer}>
        <Text style={styles.socialText}>Войти с помощью:</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("../../assets/images/yandex.png")}
              style={styles.socialIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("../../assets/images/vk.png")}
              style={styles.socialIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 12,
  },
  registerButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 30,
  },
  socialContainer: {
    alignItems: "center",
  },
  socialText: {
    marginBottom: 10,
    color: "#666",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
});
