import Sequalize from "sequelize";
import { sequalize } from "./database";

import UserModel from "./user";
import CarModel from "./car";

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

export default models;
