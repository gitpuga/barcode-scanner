import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HistoryItem {
  id: string;
  barcode: string;
  productName: string;
  productImage: string | null;
  timestamp: number;
}

interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => Promise<void>;
  clearHistory: () => Promise<void>;
  removeFromHistory: (id: string) => Promise<void>;
  isLoading: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory должен быть использован в HistoryProvider');
  }
  return context;
}

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загружает историю сканирования из хранилища на начальной загрузке приложения
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('scanHistory');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Ошибка загрузки истории из хранилища:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Сохраняет историю сканирования в хранилище при ее изменении
  useEffect(() => {
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem('scanHistory', JSON.stringify(history));
      } catch (error) {
        console.error('Ошибка сохранения истории в хранилище:', error);
      }
    };

    if (!isLoading) {
      saveHistory();
    }
  }, [history, isLoading]);

  const addToHistory = async (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now()
    };

    // Добавляет в начало массива (самые последние сначала)
    setHistory(prevHistory => [newItem, ...prevHistory]);
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('scanHistory');
      setHistory([]);
    } catch (error) {
      console.error('Ошибка очистки истории:', error);
    }
  };

  const removeFromHistory = async (id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory, removeFromHistory, isLoading }}>
      {children}
    </HistoryContext.Provider>
  );
} 

export default HistoryProvider;