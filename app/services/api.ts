import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000/api";

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
      console.log("Ошибка авторизации, необходимо войти заново");
      // Здесь можно добавить редирект на страницу логина
    }
    return Promise.reject(error);
  }
);

export default api;
