const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('\nERROR: Missing DATABASE_URL environment variable.');
  console.error('Add a .env file from .env.example and set DATABASE_URL, e.g.:');
  console.error("  DATABASE_URL=postgres://dbuser:dbpass@localhost:5432/taskdb\n");
  // exit so the process doesn't fail later with an obscure Sequelize error
  process.exit(1);
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
