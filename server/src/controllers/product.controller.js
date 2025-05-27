const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;

// Создание и сохранение нового товара
exports.create = (req, res) => {
  // Проверка запроса
  if (!req.body.name || !req.body.barcode) {
    res.status(400).send({
      success: false,
      message: "Имя и штрих-код не могут быть пустыми!",
    });
    return;
  }

  // Создание товара
  const product = {
    name: req.body.name,
    barcode: req.body.barcode,
    photo: req.body.photo,
    ingredients: req.body.ingredients,
    nutritionalValue: req.body.nutritionalValue || {},
    addedBy: req.userId,
    status: 'pending'
  };

  // Сохранение товара в базе данных
  ////const createdProduct = await Product.create(product);

  Product.create(product)
    .then((data) => {
      res.send(data);//????
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Не удалось создать товар. Возможно, база данных не подключена.",
      });
    });
};

// Получение всех товаров из базы данных
exports.findAll = (req, res) => {
  const name = req.query.name;
  const condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Product.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Не удалось получить товары. Возможно, база данных не подключена.",
      });
    });
};

// Получение одного товара по id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Product.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Не удалось найти товар с id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Не удалось получить товар с id=${id}.`,
      });
    });
};

// Получение товара по штрих-коду
exports.findByBarcode = (req, res) => {
  const barcode = req.params.barcode;

  Product.findOne({ where: { barcode: barcode } })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Не удалось найти товар с штрих-кодом=${barcode}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Не удалось получить товар с штрих-кодом=${barcode}.`,
      });
    });
};

// Обновление товара по id
exports.update = (req, res) => {
  const id = req.params.id;

  Product.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Товар успешно обновлен.",
        });
      } else {
        res.send({
          message: `Не удалось обновить товар с id=${id}. Возможно, товар не найден или req.body пуст!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Не удалось обновить товар с id=${id}. Возможно, товар не найден или req.body пуст!`,
      });
    });
};

// Удаление товара по id
exports.delete = (req, res) => {
  const id = req.params.id;

  Product.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Товар успешно удален.",
        });
      } else {
        res.send({
          message: `Не удалось удалить товар с id=${id}. Возможно, товар не найден!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Не удалось удалить товар с id=${id}. Возможно, товар не найден!`,
      });
    });
};
