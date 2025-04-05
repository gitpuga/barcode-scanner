module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    barcode: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    photo: {
      type: Sequelize.STRING, // Путь к файлу изображения
      allowNull: true,
    },
    ingredients: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    nutritionalValue: {
      type: Sequelize.JSONB, // JSON формат для хранения пищевой ценности
      allowNull: true,
      defaultValue: {},
    },
  });

  return Product;
};
