import { gql } from "apollo-server-express";

import userSchema from "./user";
import carSchema from "./car";

const defaultSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export default [defaultSchema, userSchema, carSchema];
