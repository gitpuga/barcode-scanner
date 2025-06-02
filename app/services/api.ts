import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Замените localhost на IP-адрес вашего компьютера в той же сети, что и устройство
// Например: "http://192.168.1.100:5000/api"
const API_URL = "http://192.168.1.23:5000/api"; // 10.0.2.2 - специальный IP для Android-эмулятора, указывающий на localhost машины

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

// Получить все списки пользователя
export const fetchUserLists = async () => {
  const response = await api.get("/lists");
  return response.data;
};

// Создать новый список
export const createUserList = async (list_name: string) => {
  const response = await api.post("/lists", { list_name });
  return response.data;
};

// Получить список по ID
export const getListById = async (listId: number) => {
  const response = await api.get(`/lists/${listId}`);
  return response.data;
};

// Обновить список
export const updateList = async (listId: number, list_name: string) => {
  const response = await api.put(`/lists/${listId}`, { list_name });
  return response.data;
};

// Удалить список
export const deleteList = async (listId: number) => {
  const response = await api.delete(`/lists/${listId}`);
  return response.data;
};

// Добавить ингредиенты в список
export const addIngredientsToList = async (
  listId: number,
  ingredients: string[]
) => {
  const response = await api.post(`/lists/${listId}/ingredients`, {
    ingredients,
  });
  return response.data;
};

// Удалить ингредиент из списка
export const deleteIngredientFromList = async (
  listId: number,
  ingredientId: number
) => {
  const response = await api.delete(
    `/lists/${listId}/ingredients/${ingredientId}`
  );
  return response.data;
};

// Получить информацию о продукте по штрихкоду
export const getProductByBarcode = async (barcode: string) => {
  const response = await api.get(`/products/barcode/${barcode}`);
  return response.data;
};

export default api;
