const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();

// Настройка CORS
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
  })
);

// Парсинг JSON запросов
app.use(express.json());

// Парсинг urlencoded запросов
app.use(express.urlencoded({ extended: true }));

// Простой маршрут для проверки
app.get("/", (req, res) => {
  res.json({ message: "API SafeScan" });
});

// Подключение маршрутов
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/product.routes")(app);
require("./routes/upload.routes")(app);

// Настройка базы данных
const db = require("./models");

// В режиме разработки можно сбросить и пересоздать базу
if (process.env.NODE_ENV === "development" && process.env.DB_RESET === "true") {
  db.sequelize.sync({ force: true }).then(() => {
    console.log("База данных была сброшена и синхронизирована.");
  });
} else {
  // В обычном режиме просто синхронизируем модели
  db.sequelize.sync().then(() => {
    console.log("База данных синхронизирована.");
  });
}

// Установка порта и запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}.`);
});
