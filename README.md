> [!Note]
> В разработке
# Сканер штрих-кодов (*временное название*)

## Функционал приложения:
- Сканирование штрих-кодов продуктов.
- Создание списка нежелательных ингредиентов.
- Вывод информации о составе продукта с выделением опасных компонентов.
- Рекомендации безопасных аналогов.

## Используемые технологии

### Фронтэнд:

- **React Native**     - кроссплатформенный фреймворк
- **TypeScript**       - язык программирования
- **Expo**             - экосистема инструментов
- **Expo Router**      - маршрутизация
- **React Navigation** - навигация

### Бэкэнд

...

## Структура проекта
  ```
  barcode-scanner/
    app/
      _layout.tsx               # Корневой layout для всего приложения
      index.tsx                 # Главный экран (Экран авторизации)
      tabs/
        _layout.tsx             # Layout для нижней навигации
        home.tsx                # Главная
        scanner.tsx             # Сканер штрихкодов
        history.tsx             # История просканированных товаров
      screens/
        scanned-item.tsx        # Отсканированный товар
        item-applications.tsx   # Заявки на добавления товаров
        awards.tsx              # Награды
        sign-up.tsx             # Экран регистрации
        add-item.tsx            # Добавление товара
        lists.tsx               # Списки нежелательных ингредиентов
        selected-list.tsx       # Выбранный список
        recommendations.tsx     # Рекомендованные товары
    assets/
      fonts/                    # Шрифты
      images/                   # Изображения
    ...
  ```
## Инструкция по развертыванию

1. Убедитесь, что у вас установлен **Node.js** и **Expo CLI**:
   
    ```
    npm install -g expo-cli
2. Клонируйте репозиторий:
   
    ```
    git clone https://github.com/gitpuga/barcode-scanner
    cd barcode-scanner
3. Установите зависимости:
   
    ```
    npm install
4. Запустите Expo:
   
    ```
    npm run (android/ios/web...)
5. Откройте приложение на устройстве через Expo Go или эмулятор.
