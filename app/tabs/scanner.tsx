import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Имитация запроса разрешений камеры
  useEffect(() => {
    setHasPermission(true); // В реальном приложении здесь должен быть настоящий запрос
  }, []);

  const handleScan = () => {
    Alert.alert("Сканирование", "Товар успешно отсканирован", [{ text: "OK" }]);
  };

  const toggleFlash = () => {
    Alert.alert("Вспышка", "Вспышка включена/выключена");
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      Alert.alert(
        "Изображение выбрано",
        "Обработка изображений из галереи будет реализована в следующей версии"
      );
    }
  };

  const goBack = () => {
    router.back();
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Запрос доступа к камере...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Нет доступа к камере</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => setHasPermission(true)}
        >
          <Text style={styles.permissionButtonText}>Запросить разрешение</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#333" />
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Сканер</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.cameraContainer}>
        {/* Имитация камеры */}
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={openGallery}>
          <Ionicons name="images-outline" size={24} color="black" />
          <Text style={styles.footerButtonText}>Галерея</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
          <View style={styles.scanButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={toggleFlash}>
          <Ionicons name="flash-outline" size={24} color="black" />
          <Text style={styles.footerButtonText}>Вспышка</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#999",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  placeholder: {
    width: 40,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#888",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    position: "relative",
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "white",
    borderTopLeftRadius: 10,
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "white",
    borderTopRightRadius: 10,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "white",
    borderBottomLeftRadius: 10,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "white",
    borderBottomRightRadius: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },
  footerButton: {
    alignItems: "center",
  },
  footerButtonText: {
    color: "black",
    marginTop: 5,
    fontSize: 12,
  },
  scanButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  scanButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  permissionButton: {
    backgroundColor: "#2980b9",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  permissionButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
