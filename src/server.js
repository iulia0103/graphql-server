import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";

import { config } from "dotenv";

import schema from "./schema/index";
import resolvers from "./resolvers/index";
import models from "./models/index";

// require("dotenv").config();
config();

const app = express();

// const me = models.users[0];

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    // me,
  },
});

server.applyMiddleware({ app });

app.use(cors());

app.listen(3000, () =>
  console.log("Apollo Graphql server is running on port 3000")
);
