// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbcon = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  // process.env.PG_DRIVER,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    // driver: process.env.PG_DRIVER,
  }
);

const testDbCon = async () => {
  try {
    await dbcon.authenticate();
    console.log(`✅ PostgreSQL Connected Successfully to ${process.env.PG_DATABASE}`);
  } catch (err) {
    console.error("❌ PostgreSQL Connection Failed:", err);
    process.exit(1);
  }

  return dbcon;
};

module.exports ={ testDbCon, dbcon}
