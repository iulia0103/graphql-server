const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");

require("dotenv").config();

const app = express();

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const models = require("./models");
// const me = models.users[0];

const server = new ApolloServer({
  typeDefs,
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
