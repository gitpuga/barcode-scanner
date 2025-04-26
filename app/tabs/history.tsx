import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHistory, HistoryItem } from "../context/HistoryContext";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { history, removeFromHistory, clearHistory, isLoading } = useHistory();

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

  const navigateToProduct = (item: HistoryItem) => {
    router.navigate({
      pathname: "/screens/scanned-item",
      params: {
        barcode: item.barcode,
        productName: item.productName,
        productImage: item.productImage,
      },
    });
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => navigateToProduct(item)}
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
      >
        <Ionicons name="trash-outline" size={20} color="#ff3b30" />
      </TouchableOpacity>
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
});
