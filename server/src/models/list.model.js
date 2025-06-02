module.exports = (sequelize, Sequelize) => {
  const List = sequelize.define("list", {
    list_id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    list_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return List;
};
