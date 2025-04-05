const express = require("express");
const multer = require("multer");
const upload = require("../middleware/upload.middleware");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const path = require("path");

module.exports = function (app) {
  // Маршрут для загрузки изображения продукта (только для админов)
  app.post(
    "/api/upload/product-image",
    [verifyToken, isAdmin, upload.single("image")],
    (req, res) => {
      if (!req.file) {
        return res.status(400).send({ message: "Пожалуйста, загрузите файл!" });
      }

      // Возвращаем путь к загруженному файлу
      const relativePath = `/uploads/${path.basename(req.file.path)}`;
      res.status(200).send({
        message: "Файл успешно загружен",
        filename: req.file.filename,
        path: relativePath,
      });
    }
  );

  // Обработка ошибок multer
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send({
          message: "Размер файла не может быть больше 5MB!",
        });
      }
      return res.status(400).send({
        message: `Ошибка Multer: ${err.message}`,
      });
    }

    if (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
    next();
  });

  // Настройка статического пути для доступа к загруженным файлам
  app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));
};
