import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    users: [User]
    user(id: ID!): User
    authenticatedUser: User
  }

  extend type Mutation {
    createUser(name: String!): User!
    removeUser(id: ID!): Boolean
    register(name: String!, username: String!, password: String!): Boolean!
    login(username: String!, password: String!): Token!
  }

  # password is not added in the User type because we don't want to reetrieve it in queries
  type User {
    id: ID!
    name: String!
    username: String!
    cars: [Car]
  }

  type Token {
    token: String!
  }
`;
