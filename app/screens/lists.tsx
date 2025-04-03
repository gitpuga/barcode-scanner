import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ListsScreen() {
  const insets = useSafeAreaInsets();
  const [lists, setLists] = useState<string[]>(["Я", "Мама"]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");

  const handleAddList = () => {
    if (newListName.trim().length > 0) {
      setLists([...lists, newListName]);
      setNewListName("");
      setIsModalVisible(false);
    }
  };

  const handleSelectList = (list: string) => {
    router.push({
      pathname: "/screens/selected-list",
      params: { listName: list },
    });
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
        <Text style={styles.title}>Нежелательные ингредиенты</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={lists}
        keyExtractor={(item) => item}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleSelectList(item)}
          >
            <Text style={styles.listItemText}>{item}</Text>
          </TouchableOpacity>
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
              <Text style={styles.modalTitle}>Добавить новый список</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={newListName}
              onChangeText={setNewListName}
              placeholder="Введите название списка"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddList}>
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
  listItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  listItemText: {
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
