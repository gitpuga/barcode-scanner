import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function RestrictionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ограничения</Text>
      <ScrollView>
        <Text>- Без глютена</Text>
        <Text>- Без сахара</Text>
        <Text>- Веган</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 }
});
