import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchUserLists, createUserList, deleteList } from "../services/api";

interface List {
  list_id: number;
  list_name: string;
  ingredients: any[];
}

export default function ListsScreen() {
  const insets = useSafeAreaInsets();
  const [lists, setLists] = useState<List[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLists = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserLists();
      setLists(data);
    } catch (e: any) {
      setError("Ошибка загрузки списков");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const handleAddList = async () => {
    if (newListName.trim().length > 0) {
      try {
        setLoading(true);
        const newList = await createUserList(newListName);
        setLists([...lists, newList]);
        setNewListName("");
        setIsModalVisible(false);
      } catch (e: any) {
        Alert.alert("Ошибка", "Не удалось создать список");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteList = async (listId: number) => {
    Alert.alert(
      "Подтверждение",
      "Вы уверены, что хотите удалить этот список?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteList(listId);
              setLists(lists.filter((list) => list.list_id !== listId));
            } catch (e: any) {
              Alert.alert("Ошибка", "Не удалось удалить список");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSelectList = (list: List) => {
    router.push({
      pathname: "/screens/selected-list",
      params: { listId: list.list_id.toString(), listName: list.list_name },
    });
  };

  if (loading && lists.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

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

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadLists}>
            <Text style={styles.retryButtonText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => item.list_id.toString()}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <TouchableOpacity
                style={styles.listItemContent}
                onPress={() => handleSelectList(item)}
              >
                <Text style={styles.listItemText}>{item.list_name}</Text>
                <Text style={styles.ingredientCount}>
                  {item.ingredients.length} ингредиентов
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteList(item.list_id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Нет списков. Нажмите + чтобы создать новый список.
            </Text>
          }
        />
      )}

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Создать новый список</Text>
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
              <Text style={styles.addButtonText}>Создать</Text>
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
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
    flex: 1,
  },
  list: {
    flex: 1,
    padding: 10,
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  listItemContent: {
    flex: 1,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  ingredientCount: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  deleteButton: {
    marginLeft: 10,
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
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#CCCCCC",
    padding: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
