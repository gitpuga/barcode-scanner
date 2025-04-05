# API Документация

## Аутентификация

### Регистрация пользователя

- **URL**: `/api/auth/signup`
- **Метод**: `POST`
- **Тело запроса**:
  ```json
  {
    "firstName": "Иван",
    "lastName": "Иванов",
    "email": "ivan@example.com",
    "password": "password123",
    "role": "user" // Опционально, по умолчанию "user"
  }
  ```
- **Успешный ответ**:
  ```json
  {
    "message": "Пользователь успешно зарегистрирован!",
    "user": {
      "id": 1,
      "firstName": "Иван",
      "lastName": "Иванов",
      "email": "ivan@example.com",
      "role": "user"
    }
  }
  ```

### Вход пользователя

- **URL**: `/api/auth/signin`
- **Метод**: `POST`
- **Тело запроса**:
  ```json
  {
    "email": "ivan@example.com",
    "password": "password123"
  }
  ```
- **Успешный ответ**:
  ```json
  {
    "id": 1,
    "firstName": "Иван",
    "lastName": "Иванов",
    "email": "ivan@example.com",
    "role": "user",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

## Пользователи

### Получение всех пользователей (только для админов)

- **URL**: `/api/users`
- **Метод**: `GET`
- **Заголовки**:
  ```
  Authorization: Bearer [token]
  ```
- **Успешный ответ**:
  ```json
  [
    {
      "id": 1,
      "firstName": "Иван",
      "lastName": "Иванов",
      "email": "ivan@example.com",
      "role": "user"
    },
    {
      "id": 2,
      "firstName": "Админ",
      "lastName": "Админов",
      "email": "admin@example.com",
      "role": "admin"
    }
  ]
  ```

### Получение пользователя по ID

- **URL**: `/api/users/:id`
- **Метод**: `GET`
- **Заголовки**:
  ```
  Authorization: Bearer [token]
  ```
- **Успешный ответ**:
  ```json
  {
    "id": 1,
    "firstName": "Иван",
    "lastName": "Иванов",
    "email": "ivan@example.com",
    "role": "user"
  }
  ```

### Обновление пользователя

- **URL**: `/api/users/:id`
- **Метод**: `PUT`
- **Заголовки**:
  ```
  Authorization: Bearer [token]
  ```
- **Тело запроса**:
  ```json
  {
    "firstName": "Иван",
    "lastName": "Петров",
    "password": "newpassword123" // Опционально
  }
  ```
- **Успешный ответ**:
  ```json
  {
    "message": "Пользователь успешно обновлен!"
  }
  ```

### Удаление пользователя (только для админов)

- **URL**: `/api/users/:id`
- **Метод**: `DELETE`
- **Заголовки**:
  ```
  Authorization: Bearer [token]
  ```
- **Успешный ответ**:
  ```json
  {
    "message": "Пользователь успешно удален!"
  }
  ```

## Товары

### Получение всех товаров

- **URL**: `/api/products`
- **Метод**: `GET`
- **Параметры запроса**:
  - `name` (опционально) - поиск по названию
- **Успешный ответ**:
  ```json
  [
    {
      "id": 1,
      "name": "Молоко",
      "barcode": "4600699500449",
      "photo": "/uploads/image-123456.jpg",
      "ingredients": "Молоко нормализованное",
      "nutritionalValue": {
        "protein": "3.2 г",
        "fat": "2.5 г",
        "carbohydrates": "4.7 г",
        "calories": "56 ккал"
      }
    },
    {
      "id": 2,
      "name": "Хлеб",
      "barcode": "4607025392408",
      "photo": "/uploads/image-234567.jpg",
      "ingredients": "Мука пшеничная, вода, соль, дрожжи",
      "nutritionalValue": {
        "protein": "8.1 г",
        "fat": "1.0 г",
        "carbohydrates": "50.1 г",
        "calories": "242 ккал"
      }
    }
  ]
  ```

### Получение товара по ID

- **URL**: `/api/products/:id`
- **Метод**: `GET`
- **Успешный ответ**:
  ```json
  {
    "id": 1,
    "name": "Молоко",
    "barcode": "4600699500449",
    "photo": "/uploads/image-123456.jpg",
    "ingredients": "Молоко нормализованное",
    "nutritionalValue": {
      "protein": "3.2 г",
      "fat": "2.5 г",
      "carbohydrates": "4.7 г",
      "calories": "56 ккал"
    }
  }
  ```

### Получение товара по штрихкоду

- **URL**: `/api/products/barcode/:barcode`
- **Метод**: `GET`
- **Успешный ответ**:
  ```json
  {
    "id": 1,
    "name": "Молоко",
    "barcode": "4600699500449",
    "photo": "/uploads/image-123456.jpg",
    "ingredients": "Молоко нормализованное",
    "nutritionalValue": {
      "protein": "3.2 г",
      "fat": "2.5 г",
      "carbohydrates": "4.7 г",
      "calories": "56 ккал"
    }
  }
  ```

### Создание нового товара (только для админов)

- **URL**: `/api/products`
- **Метод**: `POST`
- **Заголовки**:
  ```
  Authorization: Bearer [token]
  ```
- **Тело запроса**:
  ```json
  {
    "name": "Молоко",
    "barcode": "4600699500449",
    "photo": "/uploads/image-123456.jpg",
    "ingredients": "Молоко нормализованное",
    "nutritionalValue": {
      "protein": "3.2 г",
      "fat": "2.5 г",
      "carbohydrates": "4.7 г",
      "calories": "56 ккал"
    }
  }
  ```
- **Успешный ответ**:
  ```json
  {
    "id": 1,
    "name": "Молоко",
    "barcode": "4600699500449",
    "photo": "/uploads/image-123456.jpg",
    "ingredients": "Молоко нормализованное",
    "nutritionalValue": {
      "protein": "3.2 г",
      "fat": "2.5 г",
      "carbohydrates": "4.7 г",
      "calories": "56 ккал"
    }
  }
  ```

### Обновление товара (только для админов)

- **URL**: `/api/products/:id`
- **Метод**: `PUT`
- **Заголовки**:
  ```
  Authorization: Bearer [token]
  ```
- **Тело запроса**:
  ```json
  {
    "name": "Молоко пастеризованное",
    "ingredients": "Молоко нормализованное пастеризованное",
    "nutritionalValue": {
      "protein": "3.0 г",
      "fat": "2.5 г",
      "carbohydrates": "4.7 г",
      "calories": "54 ккал"
    }
  }
  ```
- **Успешный ответ**:
  ```json
  {
    "message": "Товар успешно обновлен."
  }
  ```

### Удаление товара (только для админов)

- **URL**: `/api/products/:id`
- **Метод**: `DELETE`
- **Заголовки**:
  ```
  Authorization: Bearer [token]
  ```
- **Успешный ответ**:
  ```json
  {
    "message": "Товар успешно удален."
  }
  ```

## Загрузка файлов

### Загрузка изображения продукта (только для админов)

- **URL**: `/api/upload/product-image`
- **Метод**: `POST`
- **Заголовки**:
  ```
  Authorization: Bearer [token]
  Content-Type: multipart/form-data
  ```
- **Тело запроса**:
  ```
  Form-data:
  image: [binary file]
  ```
- **Успешный ответ**:
  ```json
  {
    "message": "File uploaded successfully",
    "filename": "image-1681234567890-12345.jpg",
    "path": "/uploads/image-1681234567890-12345.jpg"
  }
  ```
