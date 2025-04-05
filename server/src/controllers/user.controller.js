const db = require("../models");
const User = db.users;
const bcrypt = require("bcryptjs");

// Получить всех пользователей из базы данных (с условием на основе роли)
exports.findAll = (req, res) => {
  User.findAll({
    attributes: { exclude: ["password"] }, // Исключаем пароль из ответа
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Не удалось получить пользователей. Возможно, база данных не подключена.",
      });
    });
};

// Найти пользователя по id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id, {
    attributes: { exclude: ["password"] }, // Исключаем пароль из ответа
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Не удалось найти пользователя с id=" + id,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Не удалось получить пользователя с id=" + id,
      });
    });
};

// Обновление пользователя по id
exports.update = (req, res) => {
  const id = req.params.id;

  // Проверяем, пытается ли пользователь обновить свой профиль или администратор обновляет чей-то профиль
  if (id != req.userId) {
    // Получаем роль пользователя
    User.findByPk(req.userId)
      .then((user) => {
        if (user.role !== "admin") {
          return res.status(403).send({
            message: "Вы можете обновлять только свой профиль!",
          });
        } else {
          proceedWithUpdate();
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Не удалось получить роль пользователя",
        });
      });
  } else {
    proceedWithUpdate();
  }

  function proceedWithUpdate() {
    // Если обновляется пароль, хешируем его
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 8);
    }

    User.update(req.body, {
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Пользователь успешно обновлен!",
          });
        } else {
          res.send({
            message: `Не удалось обновить пользователя с id=${id}. Возможно, пользователь не найден или req.body пуст!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: `Не удалось обновить пользователя с id=${id}. Возможно, пользователь не найден или req.body пуст!`,
        });
      });
  }
};

// Удалить пользователя с указанным id в запросе (только для администраторов)
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Пользователь успешно удален!",
        });
      } else {
        res.send({
          message: `Не удалось удалить пользователя с id=${id}. Возможно, пользователь не найден!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Не удалось удалить пользователя с id=${id}. Возможно, пользователь не найден!`,
      });
    });
};
