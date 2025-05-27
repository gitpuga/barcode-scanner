import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Замените localhost на IP-адрес вашего компьютера в той же сети, что и устройство
// Например: "http://192.168.1.100:5000/api"
const API_URL = "http://localhost:5000/api"; // 10.0.2.2 - специальный IP для Android-эмулятора, указывающий на localhost машины

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

/////
/*
async function uploadProduct(data: {
  name?: string;
  barcode: string;
  ingredients?: string;
  nutritionalValue?: object;
  photos: any[]; // Массив файлов
}) {
  const formData = new FormData();
  
  // Добавляем файлы
  data.photos.forEach((photo, i) => {
    formData.append('photos', {
      uri: photo.uri,
      name: `product_${Date.now()}_${i}.jpg`,
      type: 'image/jpeg'
    } as any);
  });

  // Добавляем остальные данные
  formData.append('barcode', data.barcode);
  if (data.name) formData.append('name', data.name);
  if (data.ingredients) formData.append('ingredients', data.ingredients);
  if (data.nutritionalValue) {
    formData.append('nutritionalValue', JSON.stringify(data.nutritionalValue));
  }

  return api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
*/
/////

export default api;