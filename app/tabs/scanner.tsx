import { View, Text, StyleSheet } from 'react-native';

export default function ScannerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Сканер</Text>
      // Реализовать логику сканирования
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' }
});
