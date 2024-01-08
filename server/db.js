const pgp = require("pg-promise")();

const dbConfig = {
  host: "localhost",
  port: 5432,
  database: "blogdb",
  user: "postgres",
  password: "123",
};

const db = pgp(dbConfig);

module.exports = db;