import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  token: string;
}

class AuthService {
  async signUp(userData: SignUpData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/register", userData);

      // Сохранение токена
      await this.setToken(response.data.token);

      return response.data;
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      throw error;
    }
  }

  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);

      // Сохранение токена
      await this.setToken(response.data.token);

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

  async getCurrentUser(): Promise<AuthResponse["user"] | null> {
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
    await AsyncStorage.setItem("auth_token", token);
  }

  async setUserData(user: AuthResponse["user"]): Promise<void> {
    await AsyncStorage.setItem("user_data", JSON.stringify(user));
  }
}

export default new AuthService();
