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

// Функция для запроса информации о продукте по штрих-коду
const fetchProductInfo = async (barcode: string) => {
  try {
    const response = await fetch(`http://localhost:5000/api/products/barcode/${barcode}`);
    if (!response.ok) {
      throw new Error('Товар не найден');
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении данных о товаре:', error);
    console.log(barcode);
    throw error;
  }
};

// Функция для получения рекомендуемых товаров
const fetchRecommendedProducts = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/products?limit=2');
    if (!response.ok) {
      return [];
    }
    const products = await response.json();
    
    // Преобразуем данные в формат, ожидаемый компонентом
    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      image: product.photo ? `http://localhost:5000${product.photo}` : null
    })).slice(0, 2); // Ограничиваем до 2 товаров
  } catch (error) {
    console.error('Ошибка при получении рекомендуемых товаров:', error);
    return [];
  }
};

export default function ScannerScreen() {
  const insets = useSafeAreaInsets();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flashMode, setFlashMode] = useState<"off" | "torch">("off");
  const cameraRef = useRef<CameraView>(null);
  const { isAuthenticated } = useAuth();

  // Запрос разрешений камеры
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async (scanningResult: BarcodeScanningResult) => {
    if (!isAuthenticated) {
      alert('Пожалуйста, войдите в систему для сканирования товаров');
      router.navigate('/');
      return;
    }

    if (scanned || loading) return;
    
    setScanned(true);
    setLoading(true);

    try {
      // Запрос к API для получения информации о продукте
      const productInfo = await fetchProductInfo(scanningResult.data);
      
      // Получаем рекомендуемые товары (можно реализовать отдельный запрос)
      const recommendedProducts = await fetchRecommendedProducts();
      
      router.navigate({
        pathname: '/screens/scanned-item',
        params: { 
          barcode: productInfo.barcode,
          barcodeType: scanningResult.type,
          productName: productInfo.name,
          productImage: productInfo.photo ? `http://localhost:5000${productInfo.photo}` : null,
          composition: productInfo.ingredients || '',
          allergens: '',  // Это поле может не быть в вашей модели, но оно отображается на макете
          nutritionalValue: JSON.stringify(productInfo.nutritionalValue) || '',
          recommendedProducts: JSON.stringify(recommendedProducts)
        }
      });
    } catch (error) {
      Alert.alert(
        'Ошибка сканирования',
        'Не удалось получить информацию о товаре. Пожалуйста, попробуйте снова.',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    } finally {
      setLoading(false);
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
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: [
                "ean13", "ean8", "upc_a", "upc_e", 
                "code39", "code93", "code128", 
                "codabar", "itf14", "pdf417", "qr"
              ],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            //flash={flashMode}
            ref={cameraRef}
          >
            <View style={styles.overlay}>
              <View style={styles.scanArea}>
                <View style={styles.cornerTopLeft} />
                <View style={styles.cornerTopRight} />
                <View style={styles.cornerBottomLeft} />
                <View style={styles.cornerBottomRight} />
              </View>
              <Text style={styles.scanHint}>Наведите на штрих-код</Text>
            </View>
          </CameraView>
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

        <TouchableOpacity 
          style={styles.flashButton} 
          onPress={toggleFlash}
        >
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
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