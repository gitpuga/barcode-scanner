// app/screens/edit-profile.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSave = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert("Ошибка", "Имя, фамилия и email обязательны для заполнения");
      return;
    }

    // Проверка заполнения полей пароля
    if (isChangingPassword) {
      if (!password) {
        Alert.alert("Ошибка", "Введите новый пароль");
        return;
      }
      
      if (password.length < 6) {
        Alert.alert("Ошибка", "Пароль должен содержать не менее 6 символов");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Ошибка", "Пароли не совпадают");
        return;
      }
    }

    try {
      setIsUpdating(true);
      
      // Составляем данные для обновления, добавляя пароль только если он изменяется
      const updateData = {
        firstName,
        lastName,
        email,
        ...(isChangingPassword && password ? { password } : {})
      };
      
      await updateUser(updateData);
      Alert.alert("Успех", "Профиль успешно обновлен");
      router.back();
    } catch (error: any) {
      // Получаем сообщение об ошибке из разных возможных мест
      let errorMessage = "Не удалось обновить профиль";
      
      if (error?.response?.data?.message) {
        // Ошибка от API
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        // Ошибка JavaScript
        errorMessage = error.message;
      }
      
      if (errorMessage.includes("только свой профиль")) {
        errorMessage =
          "Доступ запрещен: вы можете обновлять только свой профиль";
      }
      
      Alert.alert("Ошибка", errorMessage);
      console.error("Ошибка обновления профиля:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Шапка с кнопкой назад */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Редактирование профиля</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Форма редактирования */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Имя</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Введите имя"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Фамилия</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Введите фамилию"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Введите email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Чекбокс для выбора смены пароля */}
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setIsChangingPassword(!isChangingPassword)}
          >
            <View style={[styles.checkbox, isChangingPassword && styles.checkboxChecked]}>
              {isChangingPassword && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Изменить пароль</Text>
          </TouchableOpacity>

          {/* Поля для смены пароля */}
          {isChangingPassword && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Новый пароль</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Введите новый пароль"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Подтвердите пароль</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Повторите новый пароль"
                  secureTextEntry
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isUpdating}
          >
            <Text style={styles.saveButtonText}>
              {isUpdating ? "Сохранение..." : "Сохранить изменения"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  form: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
