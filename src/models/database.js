import Sequalize from "sequelize";

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

export const sequalize = new Sequalize(dbName, dbUser, dbPass, {
  dialect: "postgres",
  define: {
    timestamps: false,
  },
});
