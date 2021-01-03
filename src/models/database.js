const Sequalize = require("sequelize");

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const sequalize = new Sequalize(dbName, dbUser, dbPass, {
  dialect: "postgres",
  define: {
    timestamps: false,
  },
});

module.exports = { sequalize };
