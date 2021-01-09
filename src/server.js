import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import jwt from "jsonwebtoken";

import schema from "./schema/index";
import resolvers from "./resolvers/index";
import models from "./models/index";

const app = express();

const getLoggedInUser = (req) => {
  const token = req.headers["x-auth-token"];
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error(error);
      throw new Error("Session expired!");
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: ({ req }) => ({
    models,
    secret: process.env.JWT_SECRET,
    authenticatedUser: getLoggedInUser(req),
  }),
});

server.applyMiddleware({ app });

app.use(cors());

app.listen(3000, () =>
  console.log("Apollo Graphql server is running on port 3000")
);
