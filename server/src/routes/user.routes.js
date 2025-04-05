const controller = require("../controllers/user.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Получение всех пользователей (только для админов)
  app.get("/api/users", [verifyToken, isAdmin], controller.findAll);

  // Получение пользователя по ID
  app.get("/api/users/:id", [verifyToken], controller.findOne);

  // Обновление пользователя (пользователь может обновить только свой профиль)
  app.put("/api/users/:id", [verifyToken], controller.update);

  // Удаление пользователя (только для админов)
  app.delete("/api/users/:id", [verifyToken, isAdmin], controller.delete);
};
