import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sequalize } from "../models/database";

const createToken = (user, secret, expiresIn) => {
  const { id, name, username } = user;

  return jwt.sign({ id, name, username }, secret, { expiresIn });
};

const resolvers = {
  Query: {
    users: (_, args, { models }) => models.User.findAll(),
    user: (_, { id }, { models }) => models.User.findByPk(id),
    // me: (_, args, { me }) => me,
  },
  Mutation: {
    createUser: (_, { name }, { models }) => {
      const user = { name };
      return models.User.create(user);
    },
    removeUser: (_, { id }, { models }) => {
      return models.User.destroy({ where: { id } });
    },
    register: async (_, { name, username, password }, { models }) => {
      const user = { name, username, password };

      const registeredUser = await models.User.create(user);

      try {
        if (
          typeof registeredUser.id === "number" ||
          typeof registeredUser.id === "string"
        ) {
          return true;
        }
        return false;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    login: async (_, { username, password }, { models, secret }) => {
      // findOne({ where: ... }) => deprecated ; findOne({ where: username }) => not working
      // const user = await models.User.findOne({ where: username });
      // isPasswordValid is commented out because of the workaround for deprecation
      // const isPasswordValid = await user.validatePassword(
      //   password
      // );

      const user = await models.User.findAll({
        where: sequalize.where(sequalize.col("username"), username),
      });

      if (
        !user ||
        !(Array.isArray(user) && user.length > 0 && user[0].dataValues)
      ) {
        throw new Error("User not found!");
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user[0].dataValues.password
      );

      if (!isPasswordValid) {
        throw new Error("Password is not valid!");
      }

      return {
        token: createToken(user[0].dataValues, secret, "1m"),
      };
    },
  },

  User: {
    cars: (parent, _, { models }) => {
      return models.Car.findAll({ where: { userId: parent.id } });
    },
  },
};

export default resolvers;
