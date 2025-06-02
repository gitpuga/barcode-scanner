const controller = require("../controllers/list.controller");
const { verifyToken } = require("../middleware/auth.middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Создать новый список
  app.post("/api/lists", verifyToken, controller.create);

  // Получить все списки пользователя
  app.get("/api/lists", verifyToken, controller.getUserLists);

  // Получить один список по ID
  app.get("/api/lists/:list_id", verifyToken, controller.findOne);

  // Обновить список по ID
  app.put("/api/lists/:list_id", verifyToken, controller.update);

  // Удалить список по ID
  app.delete("/api/lists/:list_id", verifyToken, controller.delete);

  // Добавить ингредиенты в список
  app.post(
    "/api/lists/:list_id/ingredients",
    verifyToken,
    controller.addIngredients
  );

  // Удалить ингредиент из списка
  app.delete(
    "/api/lists/:list_id/ingredients/:ingredient_id",
    verifyToken,
    controller.deleteIngredient
  );
};
