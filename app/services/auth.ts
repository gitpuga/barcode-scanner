import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

// Типы данных
export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  accessToken: string;
}

class AuthService {
  async signUp(userData: SignUpData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/signup", userData);

      // Сохранение токена, только если он существует
      if (response.data && response.data.accessToken) {
        await this.setToken(response.data.accessToken);
      } else {
        console.warn("Токен авторизации отсутствует в ответе API");
      }

      // Сохранение данных пользователя
      if (response.data) {
        const user = {
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role,
        };
        await this.setUserData(user);
      }

      return response.data;
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      throw error;
    }
  }

  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/signin",
        credentials
      );

      // Сохранение токена, только если он существует
      if (response.data && response.data.accessToken) {
        await this.setToken(response.data.accessToken);
      } else {
        console.warn("Токен авторизации отсутствует в ответе API");
      }

      // Сохранение данных пользователя
      if (response.data) {
        const user = {
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role,
        };
        await this.setUserData(user);
      }

      return response.data;
    } catch (error) {
      console.error("Ошибка входа:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Удаление токена из хранилища
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("user_data");
    } catch (error) {
      console.error("Ошибка выхода:", error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<Omit<AuthResponse, "accessToken"> | null> {
    try {
      const userData = await AsyncStorage.getItem("user_data");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Ошибка получения текущего пользователя:", error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem("auth_token");
    return !!token;
  }

  private async setToken(token: string): Promise<void> {
    if (!token) {
      console.warn("Попытка сохранить пустой токен");
      return;
    }
    await AsyncStorage.setItem("auth_token", token);
  }

  async setUserData(user: Omit<AuthResponse, "accessToken">): Promise<void> {
    if (!user) {
      console.warn("Попытка сохранить пустые данные пользователя");
      return;
    }
    await AsyncStorage.setItem("user_data", JSON.stringify(user));
  }
}

const authService = new AuthService();
export default authService;
