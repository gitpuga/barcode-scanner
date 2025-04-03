import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SelectedListScreen() {
  const insets = useSafeAreaInsets();
  const { listName } = useLocalSearchParams<{ listName: string }>();
  const [ingredients, setIngredients] = useState<string[]>([
    "Название ингредиента",
    "Название ингредиента",
    "Название ингредиента",
    "Название ингредиента",
    "Название ингредиента",
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");

  const handleAddIngredient = () => {
    if (newIngredient.trim().length > 0) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient("");
      setIsModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top : 16 },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{listName || "Список"}</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={ingredients}
        keyExtractor={(item, index) => `${item}-${index}`}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.ingredientItem}>
            <Text style={styles.ingredientText}>{item}</Text>
          </View>
        )}
      />

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Добавить новый ингредиент</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={newIngredient}
              onChangeText={setNewIngredient}
              placeholder="Введите название ингредиента"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddIngredient}
            >
              <Text style={styles.addButtonText}>Добавить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEEEE",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#DDDDDD",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  list: {
    flex: 1,
    padding: 10,
  },
  ingredientItem: {
    backgroundColor: "#DDDDDD",
    padding: 16,
    borderRadius: 4,
    marginBottom: 10,
  },
  ingredientText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  addButton: {
    width: "100%",
    height: 40,
    backgroundColor: "#CCCCCC",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#333333",
    justifyContent: "space-around",
    alignItems: "center",
  },
  footerTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footerTabText: {
    color: "#CCCCCC",
    fontSize: 14,
  },
  scannerTab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -15,
  },
  scannerTabText: {
    fontSize: 14,
    color: "#000000",
  },
});
