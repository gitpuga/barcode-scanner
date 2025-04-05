# Система аутентификации

## Интеграция с API

Система аутентификации подключается к RESTful API бэкенда с использованием axios. Конечные точки API:

- `POST /api/auth/signup` - Для регистрации пользователя
- `POST /api/auth/signin` - Для входа пользователя

## Функции безопасности

- Безопасная обработка паролей (хеширование с помощью bcryptjs на бэкенде)
- Аутентификация по JWT-токену
- Валидация форм для безопасности и UX
- Сохранение токена между перезапусками приложения

## Формат запросов и ответов API

### Регистрация (POST /api/auth/signup)

Запрос:

```json
{
  "firstName": "Иван",
  "lastName": "Иванов",
  "email": "ivan@example.com",
  "password": "password123"
}
```

Ответ:

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

### Вход (POST /api/auth/signin)

Запрос:

```json
{
  "email": "ivan@example.com",
  "password": "password123"
}
```

Ответ:

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
