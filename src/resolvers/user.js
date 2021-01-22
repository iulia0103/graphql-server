import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sequalize } from "../models/database";
import * as path from "path";
import { v2 as cloudinary } from "cloudinary";
import { GraphQLScalarType } from "graphql";

const createToken = (user, secret, expiresIn) => {
  const { id, name, username } = user;

  return jwt.sign({ id, name, username }, secret, { expiresIn });
};

const resolvers = {
  Query: {
    users: (_, args, { models }) => models.User.findAll(),
    user: (_, { id }, { models }) => models.User.findByPk(id),
  },
  Mutation: {
    createUser: (_, { name }, { models, authenticatedUser }) => {
      if (!authenticatedUser) {
        throw new Error("Not authenticated!");
      }

      const user = { name };

      return models.User.create(user);
    },
    removeUser: (_, { id }, { models, authenticatedUser }) => {
      if (!authenticatedUser) {
        throw new Error("Not authenticated!");
      }

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
        token: createToken(user[0].dataValues, secret, "60m"),
      };
    },
    uploadImage: async (_, { filename }, { models, authenticatedUser }) => {
      if (!authenticatedUser) {
        throw new Error("Not authenticated!");
      }

      const mainDir = path.dirname(require.main.filename);
      const file = `${mainDir}/dummyData/uploads/${filename}`;

      try {
        const photo = await cloudinary.uploader.upload(file);

        await models.User.update(
          {
            photo: `${photo.public_id}.${photo.format}`,
          },
          {
            where: { username: authenticatedUser.username },
          }
        );

        return `${photo.public_id}.${photo.format}`;
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  User: {
    cars: (parent, _, { models }) => {
      return models.Car.findAll({ where: { userId: parent.id } });
    },
    photo: (parent, { options }) => {
      //custom rezolver to override original value
      if (!parent.photo) {
        return null;
      }

      let cloudinaryOptions;

      if (options) {
        const [width, thumbnail] = options;

        cloudinaryOptions = {
          quality: "auto",
          fetch_format: "auto",
          width,
          ...(thumbnail && { crop: "thumbnail", gravity: "face" }),
          secure: true,
        };
      }
      return cloudinary.url(parent.photo, cloudinaryOptions);
    },
  },

  CloudinaryOptions: new GraphQLScalarType({
    name: "CloudinaryOptions",
    parseValue(value) {
      // value from the client
      return value;
    },
    serialize(value) {
      // value sent to the client
      return value;
    },
    parseLiteral(ast) {
      // string format
      console.log("ast", ast);
      return ast.value.split(",");
    },
  }),
};

export default resolvers;
