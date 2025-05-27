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
    addedBy: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
  });

  Product.associate = function(models) {
    Product.belongsTo(models.User, {
      foreignKey: 'addedBy',
      as: 'user'
    });
  };

  return Product;
};
