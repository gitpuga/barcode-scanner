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
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getListById,
  addIngredientsToList,
  deleteIngredientFromList,
  updateList,
  deleteList,
} from "../services/api";

interface Ingredient {
  ingredient_id: number;
  ingredient_name: string;
}

interface List {
  list_id: number;
  list_name: string;
  ingredients: Ingredient[];
}

export default function SelectedListScreen() {
  const insets = useSafeAreaInsets();
  const { listId, listName } = useLocalSearchParams<{
    listId: string;
    listName: string;
  }>();
  const [list, setList] = useState<List | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadList = async () => {
    try {
      setLoading(true);
      const data = await getListById(Number(listId));
      setList(data);
      setNewListName(data.list_name);
    } catch (e: any) {
      setError("Ошибка загрузки списка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, [listId]);

  const handleAddIngredient = async () => {
    if (newIngredient.trim().length > 0 && list) {
      try {
        setLoading(true);
        await addIngredientsToList(list.list_id, [newIngredient]);
        setNewIngredient("");
        setIsAddModalVisible(false);
        await loadList();
      } catch (e: any) {
        Alert.alert("Ошибка", "Не удалось добавить ингредиент");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteIngredient = async (ingredientId: number) => {
    if (list) {
      try {
        setLoading(true);
        await deleteIngredientFromList(list.list_id, ingredientId);
        await loadList();
      } catch (e: any) {
        Alert.alert("Ошибка", "Не удалось удалить ингредиент");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateListName = async () => {
    if (newListName.trim().length > 0 && list) {
      try {
        setLoading(true);
        await updateList(list.list_id, newListName);
        setIsEditModalVisible(false);
        await loadList();
      } catch (e: any) {
        Alert.alert("Ошибка", "Не удалось обновить название списка");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteList = async () => {
    if (list) {
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
                await deleteList(list.list_id);
                router.back();
              } catch (e: any) {
                Alert.alert("Ошибка", "Не удалось удалить список");
                setLoading(false);
              }
            },
          },
        ]
      );
    }
  };

  if (loading && !list) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadList}>
          <Text style={styles.retryButtonText}>Повторить</Text>
        </TouchableOpacity>
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
        <Text style={styles.title}>{list?.list_name || "Список"}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => setIsEditModalVisible(true)}
            style={styles.headerButton}
          >
            <Ionicons name="pencil" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteList}
            style={styles.headerButton}
          >
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsAddModalVisible(true)}
            style={styles.headerButton}
          >
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={list?.ingredients || []}
        keyExtractor={(item) => item.ingredient_id.toString()}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.ingredientItem}>
            <Text style={styles.ingredientText}>{item.ingredient_name}</Text>
            <TouchableOpacity
              onPress={() => handleDeleteIngredient(item.ingredient_id)}
              style={styles.deleteButton}
            >
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Нет ингредиентов в списке</Text>
        }
      />

      {/* Модальное окно добавления ингредиента */}
      <Modal
        transparent={true}
        visible={isAddModalVisible}
        animationType="fade"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Добавить новый ингредиент</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
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

      {/* Модальное окно редактирования названия списка */}
      <Modal
        transparent={true}
        visible={isEditModalVisible}
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Редактировать список</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={newListName}
              onChangeText={setNewListName}
              placeholder="Введите новое название списка"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleUpdateListName}
            >
              <Text style={styles.addButtonText}>Сохранить</Text>
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
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: 16,
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
  ingredientItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ingredientText: {
    fontSize: 16,
    flex: 1,
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
