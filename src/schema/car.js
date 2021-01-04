import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    cars: [Car]
    car(id: ID!): Car
  }

  extend type Mutation {
    createCar(brand: String!, color: String!): Car!
    removeCar(id: ID!): Boolean
  }

  type Car {
    id: ID!
    brand: String!
    color: String!
    owner: User
  }
`;
