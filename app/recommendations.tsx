import { View, Text, StyleSheet } from 'react-native';

export default function RecommendationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Рекомендации</Text>
      // Здесь  рекомендованные товары
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 }
});
