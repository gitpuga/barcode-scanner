import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RecommendedProduct {
  id: string;
  name: string;
  image: string;
}

interface NutritionalValue {
  protein?: string;
  fat?: string;
  carbohydrates?: string;
  calories?: string;
  [key: string]: string | undefined;
}

export default function ScannedItemScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  
  const {
    productName,
    productImage,
    composition = '',
    allergens = '',
    barcode
  } = params;

  // Разбор пищевой ценности из строки JSON
  let nutritionalValue: NutritionalValue = {};
  try {
    if (params.nutritionalValue) {
      nutritionalValue = JSON.parse(params.nutritionalValue as string);
    }
  } catch (error) {
    console.error('Ошибка при разборе данных о пищевой ценности:', error);
  }

  // Разбор рекомендуемых продуктов из строки JSON
  const recommendedProducts: RecommendedProduct[] = [];
  try {
    if (params.recommendedProducts) {
      const parsed = JSON.parse(params.recommendedProducts as string);
      if (Array.isArray(parsed)) {
        parsed.forEach(item => recommendedProducts.push(item));
      }
    }
  } catch (error) {
    console.error('Ошибка при разборе данных о рекомендуемых продуктах:', error);
  }

  const goBack = () => {
    router.back();
  };

  const openScanner = () => {
    router.push('/tabs/scanner');
  };

  // Форматирование пищевой ценности
  const formatNutritionalValue = () => {
    if (!nutritionalValue || Object.keys(nutritionalValue).length === 0) {
      return 'Нет данных';
    }

    return Object.entries(nutritionalValue)
      .map(([key, value]) => {
        // Форматируем ключи для отображения
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
        return `${formattedKey}: ${value}`;
      })
      .join('\n');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Хэдер с кнопкой назад */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{productName as string || 'Название товара'}</Text>
        </View>

        {/* Изображение продукта */}
        <View style={styles.imageContainer}>
          {productImage ? (
            <Image source={{ uri: productImage as string }} style={styles.productImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>ФОТО</Text>
              <Ionicons name="checkmark-circle" size={24} color="black" style={styles.checkmark} />
            </View>
          )}
        </View>
        
        {/* Детали продукта */}
        <View style={styles.detailsContainer}>
          {/* Состав */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Состав:</Text>
            <Text style={styles.sectionContent}>{composition as string}</Text>
          </View>
          
          {/* Нежелательные продукты */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Нежелательные продукты:</Text>
            <Text style={styles.sectionContent}>{allergens as string}</Text>
          </View>
          
          {/* Пищевая ценность */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Пищевая ценность:</Text>
            <Text style={styles.sectionContent}>{formatNutritionalValue()}</Text>
          </View>
          
          {/* Рекомендуемые товары */}
          {recommendedProducts.length > 0 && (
            <View style={styles.recommendedSection}>
              <Text style={styles.sectionTitle}>Рекомендуемые товары</Text>
              <View style={styles.recommendedProducts}>
                {recommendedProducts.map((product, index) => (
                  <View key={index} style={styles.recommendedItem}>
                    {product.image ? (
                      <Image source={{ uri: product.image }} style={styles.recommendedImage} />
                    ) : (
                      <View style={styles.recommendedPlaceholder}>
                        <Text>ФОТО</Text>
                      </View>
                    )}
                    <Text style={styles.recommendedName} numberOfLines={2}>
                      {product.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Нижняя кнопка сканера */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
        <View style={styles.scannerButtonContainer}>
          <TouchableOpacity style={styles.scannerButton} onPress={openScanner}>
            <Text style={styles.scannerButtonText}>Сканер</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    marginBottom: 70, // Пространство для нижней панели
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  imageContainer: {
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  detailsContainer: {
    padding: 16,
  },
  detailSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#333',
  },
  recommendedSection: {
    marginTop: 8,
  },
  recommendedProducts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  recommendedItem: {
    width: '48%',
    marginBottom: 16,
  },
  recommendedImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendedPlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendedName: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f5f5f5',
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  scannerButtonContainer: {
    alignItems: 'center',
  },
  scannerButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  scannerButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
  