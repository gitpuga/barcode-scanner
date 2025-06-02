const controller = require("../controllers/product.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Получение всех товаров
  app.get("/api/products", controller.findAll);

  // Получение товара по ID
  app.get("/api/products/:id", controller.findOne);

  // Получение товара по штрихкоду
  app.get("/api/products/barcode/:barcode", controller.findByBarcode);

  // Получить информацию о продукте по штрихкоду
  app.get(
    "/api/products/barcode/:barcode",
    verifyToken,
    controller.getProductByBarcode
  );

  // Проверка ингредиентов на наличие в списках нежелательных
  app.post(
    "/api/products/check-ingredients",
    verifyToken,
    controller.checkIngredients
  );

  // Получить рекомендуемые продукты
  app.get(
    "/api/products/recommended",
    verifyToken,
    controller.getRecommendedProducts
  );

  // Создание нового товара
  app.post("/api/products", [verifyToken, isAdmin], controller.create);

  // Обновление товара (только для админов)
  app.put("/api/products/:id", [verifyToken, isAdmin], controller.update);

  // Удаление товара (только для админов)
  app.delete("/api/products/:id", [verifyToken, isAdmin], controller.delete);
};
