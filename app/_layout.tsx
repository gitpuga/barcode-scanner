import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './context/AuthContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        {/* Stack рендерит нужный экран в зависимости от пути */}
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
