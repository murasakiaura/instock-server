require("dotenv").config(); // Load environment variables from .env

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1",
      database: process.env.DB_LOCAL_DBNAME,
      user: process.env.DB_LOCAL_USER,
      password: process.env.DB_LOCAL_PASSWORD,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
