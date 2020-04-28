require('dotenv').config();

module.exports = {
    "migrationDirectory": "migrations",
    "driver": "pg",
    "username": "build_tech",
    "connectionString": (process.env.NODE_ENV === 'test')
      ? process.env.TEST_DB_URL
      : process.env.DB_URL,
  }