> [!Note]
> В разработке
# Приложение SafeScan

<img src="https://github.com/user-attachments/assets/7a1ed16d-4998-41ec-9875-4236715445a9" width="250">
<img src="https://github.com/user-attachments/assets/4aa2a592-e94c-4aa9-8e52-32df06bbcce5" width="250">
<img src="https://github.com/user-attachments/assets/ccf300bc-8d96-4e8a-82cc-8ae95816a489" width="250">
<img src="https://github.com/user-attachments/assets/7f691686-15e9-452c-a878-64a839e8fe65" width="250">
<img src="https://github.com/user-attachments/assets/5f4e8a60-9cc9-4955-8f26-838b8efaa45f" width="250">
<img src="https://github.com/user-attachments/assets/8fed1c97-4092-49fe-a867-a0e000c5a463" width="250">
<img src="https://github.com/user-attachments/assets/1b29382f-c3e4-4bf8-8733-d90861599e40" width="250">
<img src="https://github.com/user-attachments/assets/152656ed-d86a-4ae8-b5b8-f2b97cdae693" width="250">
<img src="https://github.com/user-attachments/assets/1001b8df-a3e5-4373-b45d-604d46bb6082" width="250">
<img src="https://github.com/user-attachments/assets/1d5bc38e-0601-48dd-9edb-30b827f8f42b" width="250">

# Функционал приложения:
- Сканирование штрих-кодов продуктов.

- Создание списка нежелательных ингредиентов.
- Вывод информации о составе продукта с выделением опасных компонентов.
- Рекомендации безопасных аналогов.

# Используемые технологии

## Фронтэнд:

- **React Native**     - кроссплатформенный фреймворк
- **TypeScript**       - язык программирования
- **Expo**             - экосистема инструментов
- **Expo Router**      - маршрутизация
- **React Navigation** - навигация

### [📄 Документация AUTH](AUTH_README.md)
### [📄 Документация API](server/API.md)

## Бэкэнд

- **Node.js**          - программная платформа
- **Express.js**       - фреймворк web-приложений для Node.js
- **PostgreSQL**       - свободная объектно-реляционная система управления базами данных
- **Sequelize ORM**    - современный ORM для TypeScript and Node.js
- **JWT**              - это открытый стандарт для создания токенов доступа

### API Эндпоинты

#### Аутентификация

- `POST /api/auth/signup` - Регистрация пользователя
- `POST /api/auth/signin` - Вход пользователя

#### Пользователи

- `GET /api/users` - Получение всех пользователей (только для админов)
- `GET /api/users/:id` - Получение пользователя по ID
- `PUT /api/users/:id` - Обновление пользователя
- `DELETE /api/users/:id` - Удаление пользователя (только для админов)

#### Товары

- `GET /api/products` - Получение всех товаров
- `GET /api/products/:id` - Получение товара по ID
- `GET /api/products/barcode/:barcode` - Получение товара по штрихкоду
- `POST /api/products` - Создание нового товара
- `PUT /api/products/:id` - Обновление товара (только для админов)
- `DELETE /api/products/:id` - Удаление товара (только для админов)

#### Загрузка файлов

- `POST /api/upload/product-image` - Загрузка изображения продукта (только для админов)

### База данных

База данных содержит следующие таблицы:

1. `users` - Пользователи системы
   - id (PK)
   - firstName
   - lastName
   - email
   - password (хешированный)
   - role

2. `products` - Товары
   - id (PK)
   - name
   - barcode
   - photo (путь к файлу)
   - ingredients
   - nutritionalValue (JSON)

3. `lists` - Товары
   - id (PK)
   - user_id
   - list_name
   - createdAt
   - updatedAt

3. `ingredients` - Товары
   - id (PK)
   - list_id
   - ingredient_name
   - createdAt
   - updatedAt

# Структура проекта
  ```
barcode-scanner/
    app/
        layout.tsx                     # Корневой layout для всего приложения
        index.tsx                      # Экран авторизации
        tabs/
            layout.tsx                 # Layout для нижней навигации
            home.tsx                   # Главная
            scanner.tsx                # Сканер штрихкодов
            history.tsx                # История просканированных товаров
        screens/
            scanned-item.tsx           # Отсканированный товар
            item-applications.tsx      # Заявки на добавления товаров
            awards.tsx                 # Награды
            sign-up.tsx                # Экран регистрации
            add-item.tsx               # Добавление товара
            lists.tsx                  # Списки нежелательных ингредиентов
            selected-list.tsx          # Выбранный список
            recommendations.tsx        # Рекомендованные товары
        assets/
            fonts/                     # Шрифты
            images/                    # Изображения
    server/                            # Серверная часть приложения
        .env                           # Переменные окружения
        nodemon.json                   # Конфигурация для nodemon
        package.json                   # Зависимости и скрипты для сервера
        src/
            config/                    # Конфигурация
                db.config.js           # Настройки подключения к базе данных
            controllers/               # Контроллеры для обработки запросов
                auth.controller.js     # Аутентификация и регистрация
                product.controller.js  # Управление товарами
                user.controller.js     # Управление пользователями
            middleware/                # Промежуточные обработчики
                auth.middleware.js     # Аутентификация и авторизация
                upload.middleware.js   # Загрузка файлов
            models/                    # Модели базы данных
                index.js               # Инициализация моделей
                product.model.js       # Модель товара
                user.model.js          # Модель пользователя
            routes/                    # Маршруты API
                auth.routes.js         # Маршруты аутентификации
                product.routes.js      # Маршруты товаров
                upload.routes.js       # Маршруты загрузки файлов
                user.routes.js         # Маршруты пользователей
            index.js                   # Главный файл сервера
    ...
  ```
# Инструкция по развертыванию

## Фронтэнд

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

## Бэкэнд

1. Установите зависимости:
   
    ```
    npm install
2. Создайте базу данных PostgreSQL с именем `barcode_scanner`
3. Настройте файл `.env` с необходимыми переменными окружения:

    ```
    PORT=5000
    DB_HOST=localhost
    DB_USER=postgres
    DB_PASSWORD=пароль_бд
    DB_NAME=barcode_scanner
    JWT_SECRET=секретный_ключ
    JWT_EXPIRES_IN=86400 # 24 часа
4. Запустите сервер:
   
    ```
    npm run dev
