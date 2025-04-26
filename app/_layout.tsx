import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './context/AuthContext';
import { HistoryProvider } from './context/HistoryContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <HistoryProvider>
          {/* Stack рендерит нужный экран в зависимости от пути */}
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
        </HistoryProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
