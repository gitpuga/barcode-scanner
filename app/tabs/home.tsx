import { Link } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.profileContainer}>
          <Ionicons name="person-circle-outline" size={32} color="black" />
          {isAuthenticated && user ? (
            <Text style={styles.profileName}>
              {user.firstName} {user.lastName}
            </Text>
          ) : (
            <Text style={styles.profileName}>Гость</Text>
          )}
          <Link href="/screens/profile" asChild>
            <TouchableOpacity>
              <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
          </Link>
        </View>

        <Link href="/screens/lists" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Нежелательные ингредиенты</Text>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </TouchableOpacity>
        </Link>

        <Link href="/screens/add-item" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Добавление нового товара</Text>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </TouchableOpacity>
        </Link>

        <Link href="/screens/item-applications" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>
              Заявки на добавление товаров
            </Text>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </TouchableOpacity>
        </Link>

        <View style={styles.photoContainer}>
          <View style={styles.photoBox}>
            <Ionicons name="time-outline" size={32} color="black" />
            <Text style={styles.photoText}>ФОТО</Text>
            <Text style={styles.photoDate}>Заявка от ДД.ММ.ГГГГ</Text>
          </View>

          <View style={styles.photoBox}>
            <Ionicons name="time-outline" size={32} color="black" />
            <Text style={styles.photoText}>ФОТО</Text>
            <Text style={styles.photoDate}>Заявка от ДД.ММ.ГГГГ</Text>
          </View>
        </View>

        <Link href="/screens/awards" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Награды</Text>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.disableAdsButton}>
          <Text style={styles.disableAdsText}>Отключить рекламу</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flex: 1,
    paddingTop: 40,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 1,
  },
  profileName: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    marginBottom: 1,
  },
  menuItemText: {
    fontSize: 16,
  },
  photoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  photoBox: {
    width: "48%",
    backgroundColor: "white",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
  },
  photoText: {
    fontWeight: "bold",
    marginVertical: 10,
  },
  photoDate: {
    fontSize: 12,
    color: "#666",
  },
  disableAdsButton: {
    backgroundColor: "#999",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 20,
  },
  disableAdsText: {
    color: "white",
    fontWeight: "bold",
  },
});
