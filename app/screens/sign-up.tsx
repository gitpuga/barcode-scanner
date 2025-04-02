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
    <View style={styles.container}>
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
    fontSize: 18,
    marginBottom: 24,
    color: "#666",
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
  registerButton: {
    backgroundColor: "#9e9e9e",
    borderRadius: 4,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
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
