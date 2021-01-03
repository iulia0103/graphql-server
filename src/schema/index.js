const { gql } = require("apollo-server-express");

const userSchema = require("./user");
const carSchema = require("./car");

const defaultSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

module.exports = [defaultSchema, userSchema, carSchema];
