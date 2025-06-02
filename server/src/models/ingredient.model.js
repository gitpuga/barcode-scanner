module.exports = (sequelize, Sequelize) => {
  const Ingredient = sequelize.define("ingredient", {
    ingredient_id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    list_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: "lists",
        key: "list_id",
      },
    },
    ingredient_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Ingredient;
};
