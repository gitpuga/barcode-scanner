const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Импорт моделей
db.users = require("./user.model.js")(sequelize, Sequelize);
db.products = require("./product.model.js")(sequelize, Sequelize);
db.lists = require("./list.model.js")(sequelize, Sequelize);
db.ingredients = require("./ingredient.model.js")(sequelize, Sequelize);

// Установка связей
db.users.hasMany(db.lists, { foreignKey: "user_id" });
db.lists.belongsTo(db.users, { foreignKey: "user_id" });

db.lists.hasMany(db.ingredients, { foreignKey: "list_id" });
db.ingredients.belongsTo(db.lists, { foreignKey: "list_id" });

module.exports = db;
