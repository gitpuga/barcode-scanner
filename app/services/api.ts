import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Базовый URL API - изменить на URL бэкенда
const API_URL = "https://backendapi.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Интерцептор запросов для включения токена аутентификации
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор ответов для обработки распространенных ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка специфических кодов ошибок
    if (error.response?.status === 401) {
      // Обработка ошибок авторизации (например, перенаправление на логин)
    }
    return Promise.reject(error);
  }
);

export default api;
