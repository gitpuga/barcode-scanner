import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHistory, HistoryItem } from "../context/HistoryContext";
import * as SecureStore from "expo-secure-store";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { history, removeFromHistory, clearHistory, isLoading } = useHistory();
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const navigateToProduct = async (item: HistoryItem) => {
    setIsLoadingProduct(true);
    try {
      // Получение данных о товаре из API Open Food Facts
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${item.barcode}?fields=product_name,ingredients_text,ingredients,brands,code,nutriments,image_front_url`
      );

      if (!response.ok) {
        throw new Error("Не удалось получить информацию о товаре");
      }

      const data = await response.json();
      if (!data.product) {
        throw new Error("Товар не найден");
      }

      // Проверка наличия нежелательных ингредиентов
      let unwantedIngredients = [];
      try {
        const serverResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/products/check-ingredients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
          },
          body: JSON.stringify({
            ingredients: data.product.ingredients_text || "",
          }),
        });
        
        if (serverResponse.ok) {
          const serverData = await serverResponse.json();
          unwantedIngredients = serverData.unwanted_ingredients;
        }
      } catch (error) {
        console.error("Ошибка при проверке нежелательных ингредиентов:", error);
      }

      // Форматирование пищевой ценности
      const nutritionalValue = {
        protein: data.product.nutriments?.proteins_100g
          ? `${data.product.nutriments.proteins_100g} г`
          : undefined,
        fat: data.product.nutriments?.fat_100g
          ? `${data.product.nutriments.fat_100g} г`
          : undefined,
        carbohydrates: data.product.nutriments?.carbohydrates_100g
          ? `${data.product.nutriments.carbohydrates_100g} г`
          : undefined,
        calories: data.product.nutriments?.energy_kcal_100g
          ? `${data.product.nutriments.energy_kcal_100g} ккал`
          : undefined,
      };

      router.navigate({
        pathname: "/screens/scanned-item",
        params: {
          barcode: item.barcode,
          productName: item.productName,
          productImage: item.productImage,
          composition: data.product.ingredients_text || "",
          unwanted_ingredients: JSON.stringify(unwantedIngredients),
          nutritionalValue: JSON.stringify(nutritionalValue),
          recommendedProducts: JSON.stringify([]),
        },
      });
    } catch (error) {
      console.error("Ошибка при получении данных о товаре:", error);
      Alert.alert("Ошибка", "Не удалось получить информацию о товаре");
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => navigateToProduct(item)}
      disabled={isLoadingProduct}
    >
      <View style={styles.historyContent}>
        {item.productImage ? (
          <Image
            source={{ uri: item.productImage }}
            style={styles.productImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>ФОТО</Text>
          </View>
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.productName}
          </Text>
          <Text style={styles.scanDate}>{formatDate(item.timestamp)}</Text>
          <Text style={styles.barcode}>Штрих-код: {item.barcode}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeFromHistory(item.id)}
        disabled={isLoadingProduct}
      >
        <Ionicons
          name="trash-outline"
          size={20}
          color={isLoadingProduct ? "#ccc" : "#ff3b30"}
        />
      </TouchableOpacity>
      {isLoadingProduct && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>История сканирований</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Очистить</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>
            У вас еще нет истории сканирований
          </Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.navigate("/tabs/scanner")}
          >
            <Text style={styles.scanButtonText}>Сканировать товар</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: "#ff3b30",
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
  },
  historyItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  historyContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: 12,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  scanDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  barcode: {
    fontSize: 12,
    color: "#666",
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  scanButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
