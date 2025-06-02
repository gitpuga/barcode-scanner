const db = require("../models");
const List = db.lists;
const Ingredient = db.ingredients;
const Op = db.Sequelize.Op;

// Получить все списки пользователя
exports.getUserLists = async (req, res) => {
  try {
    const lists = await List.findAll({
      where: { user_id: req.user.user_id },
      include: [{ model: Ingredient }],
    });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Создать новый список
exports.create = async (req, res) => {
  try {
    // Проверка запроса
    if (!req.body.list_name) {
      return res.status(400).send({
        message: "Название списка не может быть пустым!",
      });
    }

    // Создание списка
    const list = await List.create({
      user_id: req.user.user_id,
      list_name: req.body.list_name,
    });

    // Добавление ингредиентов, если они есть
    if (req.body.ingredients && Array.isArray(req.body.ingredients)) {
      const ingredientRecords = req.body.ingredients.map((name) => ({
        list_id: list.list_id,
        ingredient_name: name,
      }));
      await Ingredient.bulkCreate(ingredientRecords);
    }

    // Получение списка с ингредиентами
    const listWithIngredients = await List.findOne({
      where: { list_id: list.list_id },
      include: [{ model: Ingredient }],
    });

    res.status(201).send(listWithIngredients);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Произошла ошибка при создании списка.",
    });
  }
};

// Получить один список
exports.findOne = async (req, res) => {
  try {
    const list = await List.findOne({
      where: {
        list_id: req.params.list_id,
        user_id: req.user.user_id,
      },
      include: [{ model: Ingredient }],
    });

    if (!list) {
      return res.status(404).send({
        message: "Список не найден.",
      });
    }

    res.send(list);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Произошла ошибка при получении списка.",
    });
  }
};

// Обновить список
exports.update = async (req, res) => {
  try {
    const list = await List.findOne({
      where: {
        list_id: req.params.list_id,
        user_id: req.user.user_id,
      },
    });

    if (!list) {
      return res.status(404).send({
        message: "Список не найден.",
      });
    }

    // Обновление названия списка
    if (req.body.list_name) {
      await list.update({ list_name: req.body.list_name });
    }

    // Обновление ингредиентов
    if (req.body.ingredients && Array.isArray(req.body.ingredients)) {
      // Удаляем старые ингредиенты
      await Ingredient.destroy({
        where: { list_id: list.list_id },
      });

      // Добавляем новые ингредиенты
      const ingredientRecords = req.body.ingredients.map((name) => ({
        list_id: list.list_id,
        ingredient_name: name,
      }));
      await Ingredient.bulkCreate(ingredientRecords);
    }

    // Получаем обновленный список с ингредиентами
    const updatedList = await List.findOne({
      where: { list_id: list.list_id },
      include: [{ model: Ingredient }],
    });

    res.send(updatedList);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Произошла ошибка при обновлении списка.",
    });
  }
};

// Удалить список
exports.delete = async (req, res) => {
  try {
    const list = await List.findOne({
      where: {
        list_id: req.params.list_id,
        user_id: req.user.user_id,
      },
    });

    if (!list) {
      return res.status(404).send({
        message: "Список не найден.",
      });
    }

    // Удаляем все ингредиенты списка
    await Ingredient.destroy({
      where: { list_id: list.list_id },
    });

    // Удаляем сам список
    await list.destroy();

    res.send({
      message: "Список успешно удален.",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Произошла ошибка при удалении списка.",
    });
  }
};

// Добавить ингредиенты в список
exports.addIngredients = async (req, res) => {
  try {
    const list = await List.findOne({
      where: {
        list_id: req.params.list_id,
        user_id: req.user.user_id,
      },
    });

    if (!list) {
      return res.status(404).send({
        message: "Список не найден.",
      });
    }

    if (!req.body.ingredients || !Array.isArray(req.body.ingredients)) {
      return res.status(400).send({
        message: "Необходимо указать массив ингредиентов.",
      });
    }

    const ingredientRecords = req.body.ingredients.map((name) => ({
      list_id: list.list_id,
      ingredient_name: name,
    }));
    await Ingredient.bulkCreate(ingredientRecords);

    const updatedList = await List.findOne({
      where: { list_id: list.list_id },
      include: [{ model: Ingredient }],
    });

    res.send(updatedList);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Произошла ошибка при добавлении ингредиентов.",
    });
  }
};

// Удалить ингредиент из списка
exports.deleteIngredient = async (req, res) => {
  try {
    const list = await List.findOne({
      where: {
        list_id: req.params.list_id,
        user_id: req.user.user_id,
      },
    });

    if (!list) {
      return res.status(404).send({
        message: "Список не найден.",
      });
    }

    const result = await Ingredient.destroy({
      where: {
        ingredient_id: req.params.ingredient_id,
        list_id: list.list_id,
      },
    });

    if (result === 0) {
      return res.status(404).send({
        message: "Ингредиент не найден.",
      });
    }

    res.send({
      message: "Ингредиент успешно удален.",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Произошла ошибка при удалении ингредиента.",
    });
  }
};
