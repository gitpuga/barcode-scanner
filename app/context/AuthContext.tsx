import React, { createContext, useContext, useState, useEffect } from "react";
import { router } from "expo-router";
import authService, {
  SignUpData,
  LoginData,
  AuthResponse,
} from "../services/auth";

interface AuthContextType {
  user: AuthResponse["user"] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signUp: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    const checkAuthStatus = async () => {
      try {
        const isAuth = await authService.isAuthenticated();
        if (isAuth) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Ошибка проверки авторизации:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signUp = async (data: SignUpData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Проверка совпадения паролей (это также должно проверяться в UI)
      if (data.password !== data.password) {
        throw new Error("Пароли не совпадают");
      }

      const response = await authService.signUp(data);
      setUser(response.user);
      await authService.setUserData(response.user);
      setIsAuthenticated(true);
      router.replace("/tabs/home");
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Ошибка при регистрации";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(data);
      setUser(response.user);
      await authService.setUserData(response.user);
      setIsAuthenticated(true);
      router.replace("/tabs/home");
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Ошибка при входе";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/");
    } catch (err: any) {
      console.error("Ошибка выхода:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    error,
    signUp,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
};
