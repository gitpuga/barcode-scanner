const axios = require("axios");
const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;
const List = require("../models/list.model");
const Ingredient = require("../models/ingredient.model");

// Создание и сохранение нового товара
exports.create = (req, res) => {
  // Проверка запроса
  if (!req.body.name || !req.body.barcode) {
    res.status(400).send({
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
  };

  // Сохранение товара в базе данных
  Product.create(product)
    .then((data) => {
      res.send(data);
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
exports.findOne = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Товар не найден",
      });
    }

    // Если пользователь аутентифицирован, проверка наличия нежелательных ингредиентов
    let unwantedIngredients = [];
    if (req.user) {
      const userLists = await List.findAll({
        where: { user_id: req.user.user_id },
        include: [{ model: Ingredient }],
      });

      const productIngredients = product.product_ingredients
        .toLowerCase()
        .split(",")
        .map((i) => i.trim());

      userLists.forEach((list) => {
        list.Ingredients.forEach((ingredient) => {
          const ingredientName = ingredient.ingredient_name.toLowerCase();
          if (productIngredients.some((pi) => pi.includes(ingredientName))) {
            unwantedIngredients.push({
              name: ingredient.ingredient_name,
              list_name: list.list_name,
            });
          }
        });
      });
    }

    res.json({
      ...product.toJSON(),
      unwanted_ingredients: unwantedIngredients,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Ошибка при получении товара",
    });
  }
};

// Получение товара по штрих-коду
exports.findByBarcode = async (req, res) => {
  try {
    const barcode = req.params.barcode;

    // Получение данных из API Open Food Facts
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,ingredients_text,ingredients,brands,code,nutriments,image_front_url`
    );

    if (!response.ok) {
      return res.status(404).json({
        message: `Не удалось найти товар с штрих-кодом=${barcode}.`,
      });
    }

    const data = await response.json();
    if (!data.product) {
      return res.status(404).json({
        message: `Не удалось найти товар с штрих-кодом=${barcode}.`,
      });
    }

    // Форматирование данных о товаре
    const product = {
      name: data.product.product_name || "Без названия",
      barcode: data.product.code,
      photo: data.product.image_front_url || null,
      ingredients: data.product.ingredients_text || "",
      nutritionalValue: {
        protein: data.product.nutriments?.proteins_100g
          ? `${data.product.nutriments.proteins_100g} г`
          : undefined,
        fat: data.product.nutriments?.fat_100g
          ? `${data.product.nutriments.fat_100g} г`
          : undefined,
        carbohydrates: data.product.nutriments?.carbohydrates_100g
          ? `${data.product.nutriments.carbohydrates_100g} г`
          : undefined,
        calories: data.product.nutriments?.energy_kcal_100g
          ? `${data.product.nutriments.energy_kcal_100g} ккал`
          : undefined,
      },
    };

    // Проверяем наличие нежелательных ингредиентов, если пользователь аутентифицирован
    let unwantedIngredients = [];
    if (req.user) {
      const userLists = await List.findAll({
        where: { user_id: req.user.user_id },
        include: [{ model: Ingredient }],
      });

      const productIngredients = product.ingredients
        ? product.ingredients
            .toLowerCase()
            .split(",")
            .map((i) => i.trim())
        : [];

      userLists.forEach((list) => {
        list.Ingredients.forEach((ingredient) => {
          const ingredientName = ingredient.ingredient_name.toLowerCase();
          if (productIngredients.some((pi) => pi.includes(ingredientName))) {
            unwantedIngredients.push({
              name: ingredient.ingredient_name,
              list_name: list.list_name,
            });
          }
        });
      });
    }

    res.json({
      ...product,
      unwanted_ingredients: unwantedIngredients,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Ошибка при получении товара",
    });
  }
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

// Проверка ингредиентов против списков нежелательных ингредиентов пользователя
exports.checkIngredients = async (req, res) => {
  try {
    if (!req.body.ingredients) {
      return res.status(400).json({
        message: "Необходимо указать ингредиенты для проверки.",
      });
    }

    const productIngredients = req.body.ingredients
      .toLowerCase()
      .split(",")
      .map((i) => i.trim());

    // Получаем списки нежелательных ингредиентов пользователя
    const userLists = await List.findAll({
      where: { user_id: req.user.user_id },
      include: [{ model: Ingredient }],
    });

    // Проверяем наличие нежелательных ингредиентов
    let unwantedIngredients = [];
    userLists.forEach((list) => {
      list.Ingredients.forEach((ingredient) => {
        const ingredientName = ingredient.ingredient_name.toLowerCase();
        if (productIngredients.some((pi) => pi.includes(ingredientName))) {
          unwantedIngredients.push({
            name: ingredient.ingredient_name,
            list_name: list.list_name,
          });
        }
      });
    });

    res.json({
      unwanted_ingredients: unwantedIngredients,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Ошибка при проверке ингредиентов",
    });
  }
};

// Получить информацию о продукте по штрихкоду
exports.getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    // Сначала проверяем, есть ли продукт в нашей базе
    let product = await Product.findOne({
      where: { barcode: barcode },
    });

    // Если продукта нет в нашей базе, получаем данные из Open Food Facts
    if (!product) {
      const response = await axios.get(
        `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,ingredients_text,ingredients,brands,code,nutriments,image_front_url`
      );

      if (!response.data.product) {
        return res.status(404).json({ message: "Товар не найден" });
      }

      const data = response.data.product;

      // Форматируем данные
      product = {
        barcode: data.code,
        name: data.product_name || "Без названия",
        photo: data.image_front_url || null,
        ingredients: data.ingredients_text || "",
        nutritionalValue: {
          protein: data.nutriments?.proteins_100g
            ? `${data.nutriments.proteins_100g} г`
            : undefined,
          fat: data.nutriments?.fat_100g
            ? `${data.nutriments.fat_100g} г`
            : undefined,
          carbohydrates: data.nutriments?.carbohydrates_100g
            ? `${data.nutriments.carbohydrates_100g} г`
            : undefined,
          calories: data.nutriments?.energy_kcal_100g
            ? `${data.nutriments.energy_kcal_100g} ккал`
            : undefined,
        },
      };

      // Сохраняем продукт в нашу базу для будущих запросов
      await Product.create(product);
    }

    // Проверяем ингредиенты на нежелательные
    const unwantedIngredients = await exports.checkIngredients(
      product.ingredients
    );

    // Получаем рекомендуемые продукты
    const recommendedProducts = await exports.getRecommendedProducts(
      product.barcode
    );

    return res.status(200).json({
      ...product,
      unwanted_ingredients: unwantedIngredients,
      recommended_products: recommendedProducts,
    });
  } catch (error) {
    console.error("Ошибка при получении данных о товаре:", error);
    return res
      .status(500)
      .json({ message: "Ошибка сервера при получении данных о товаре" });
  }
};

// Получить рекомендуемые продукты
exports.getRecommendedProducts = async (req, res) => {
  try {
    // Здесь должна быть логика получения рекомендуемых продуктов
    // Пока возвращаем пустой массив
    const recommendedProducts = [];

    return res.status(200).json({ recommended_products: recommendedProducts });
  } catch (error) {
    console.error("Ошибка при получении рекомендуемых продуктов:", error);
    return res.status(500).json({
      message: "Ошибка сервера при получении рекомендуемых продуктов",
    });
  }
};
