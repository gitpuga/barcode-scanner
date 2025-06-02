import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraView, Camera, BarcodeScanningResult } from "expo-camera";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "../context/HistoryContext";
import { useIsFocused } from "@react-navigation/native";
import { getProductByBarcode } from "../services/api";

// Функция для получения рекомендуемых товаров (просто случайные продукты из Open Food Facts)
const fetchRecommendedProducts = async () => {
  try {
    // Получаем продукты из популярной категории (например, "snacks")
    const response = await fetch(
      "https://world.openfoodfacts.org/category/snacks.json?fields=products.product_name,products.image_front_url,products.code&sort_by=unique_scans_n&page_size=10"
    );
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    const products = data.products || [];
    // Преобразуем данные в ожидаемый формат
    return products
      .filter((product: any) => product.product_name)
      .slice(0, 2)
      .map((product: any) => ({
        id: product.code,
        name: product.product_name,
        image: product.image_front_url || null,
      }));
  } catch (error) {
    console.error("Ошибка при получении рекомендуемых товаров:", error);
    return [];
  }
};

export default function ScannerScreen() {
  const insets = useSafeAreaInsets();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flashMode, setFlashMode] = useState<"off" | "torch">("off");
  const [isCameraVisible, setIsCameraVisible] = useState(true);
  const cameraRef = useRef<CameraView>(null);
  const { isAuthenticated } = useAuth();
  const { addToHistory } = useHistory();
  const isFocused = useIsFocused();

  // Запрос разрешений камеры
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (isFocused) {
      setScanned(false);
      setIsCameraVisible(false);
      setTimeout(() => setIsCameraVisible(true), 100);
    }
  }, [isFocused]);

  const handleBarCodeScanned = async (
    scanningResult: BarcodeScanningResult
  ) => {
    if (!isAuthenticated) {
      alert("Пожалуйста, войдите в систему для сканирования товаров");
      router.navigate("/");
      return;
    }

    if (scanned || loading) return;

    setScanned(true);
    setLoading(true);

    try {
      // Получаем информацию о продукте через наш API
      const productInfo = await getProductByBarcode(scanningResult.data);

      // Сохраняем продукт в историю
      addToHistory({
        barcode: productInfo.barcode,
        productName: productInfo.name,
        productImage: productInfo.photo,
      });

      router.navigate({
        pathname: "/screens/scanned-item",
        params: {
          barcode: productInfo.barcode,
          barcodeType: scanningResult.type,
          productName: productInfo.name,
          productImage: productInfo.photo,
          composition: productInfo.ingredients || "",
          unwanted_ingredients: JSON.stringify(
            productInfo.unwanted_ingredients || []
          ),
          nutritionalValue: JSON.stringify(productInfo.nutritionalValue) || "",
          recommendedProducts: JSON.stringify(
            productInfo.recommended_products || []
          ),
        },
      });
      setIsCameraVisible(false);
      setTimeout(() => setIsCameraVisible(true), 100);
    } catch (error) {
      Alert.alert(
        "Ошибка сканирования",
        "Не удалось получить информацию о товаре. Пожалуйста, попробуйте снова.",
        [{ text: "OK", onPress: () => setScanned(false) }]
      );
    } finally {
      setLoading(false);
      setScanned(false);
    }
  };

  const toggleFlash = () => {
    setFlashMode(flashMode === "off" ? "torch" : "off");
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
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
        <Text style={styles.permissionText}>Нет доступа к камере</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
          }}
        >
          <Text style={styles.permissionButtonText}>Запросить разрешение</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Шапка с кнопкой назад */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top : 20 },
        ]}
      >
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Сканер</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Камера и область сканирования */}
      <View style={styles.cameraContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Анализируем продукт...</Text>
          </View>
        ) : (
          <>
            {isCameraVisible && (
              <CameraView
                style={styles.camera}
                facing="back"
                barcodeScannerSettings={{
                  barcodeTypes: [
                    "ean13",
                    "ean8",
                    "upc_a",
                    "upc_e",
                    "code39",
                    "code93",
                    "code128",
                    "codabar",
                    "itf14",
                    "pdf417",
                    "qr",
                  ],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                //flash={flashMode}
                ref={cameraRef}
              />
            )}
            <View style={[styles.overlay, StyleSheet.absoluteFill]}>
              <View style={styles.scanArea}>
                <View style={styles.cornerTopLeft} />
                <View style={styles.cornerTopRight} />
                <View style={styles.cornerBottomLeft} />
                <View style={styles.cornerBottomRight} />
              </View>
              <Text style={styles.scanHint}>Наведите на штрих-код</Text>
            </View>
          </>
        )}
      </View>

      {/* Нижняя панель с кнопками */}
      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 },
        ]}
      >
        <TouchableOpacity style={styles.footerButton} onPress={openGallery}>
          <Ionicons name="images-outline" size={28} color="white" />
          <Text style={styles.footerButtonText}>Галерея</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
          <Ionicons
            name={flashMode === "torch" ? "flash" : "flash-outline"}
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backButton: {
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  placeholder: {
    width: 40,
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
  },
  scanArea: {
    width: 250,
    height: 250,
    position: "relative",
    marginBottom: 30,
  },
  scanHint: {
    color: "white",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
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
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerButton: {
    alignItems: "center",
    padding: 10,
  },
  footerButtonText: {
    color: "white",
    marginTop: 5,
    fontSize: 12,
  },
  flashButton: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "white",
    marginTop: 20,
    fontSize: 16,
  },
  permissionText: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#2980b9",
    padding: 15,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
