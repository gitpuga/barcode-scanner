const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Определяем папку для сохранения загруженных файлов
const uploadDir = path.join(__dirname, "../../uploads");

// Создаем директорию, если она не существует
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Конфигурация хранилища для multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Фильтр файлов - принимаем только изображения
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Неверный тип файла. Допустимы только JPEG, JPG, PNG и GIF файлы."
      ),
      false
    );
  }
};

// Ограничиваем размер файла до 5MB
const maxSize = 5 * 1024 * 1024;

// Инициализируем multer
const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter,
});

module.exports = upload;
