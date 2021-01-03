const Sequalize = require("sequelize");
const { sequalize } = require("./database");

const UserModel = require("./user");
const CarModel = require("./car");

const models = {
  User: UserModel(sequalize, Sequalize.DataTypes),
  Car: CarModel(sequalize, Sequalize.DataTypes),
};

// loop through models and create associations
Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

module.exports = models;
