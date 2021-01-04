import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    users: [User]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    createUser(name: String!): User!
    removeUser(id: ID!): Boolean
  }

  type User {
    id: ID!
    name: String!
    cars: [Car]
  }
`;
