require('dotenv').config({ path: '../../.env' });
const { Sequelize } = require("sequelize");


// cek apakah env terbaca
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_DIALECT:', process.env.DB_DIALECT);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
  }
);

// tes koneksi
sequelize.authenticate()
  .then(() => {
    console.log("Database connected...");
    if (process.env.DB_SYNC === "true") {
      console.log("Syncing database...");
      sequelize.sync({ force:false }) // pakai force:true pertama kali
        .then(() => console.log("Database synchronized."))
        .catch(err => console.error("Error syncing database:", err));
    }
  })
  .catch(err => console.error("Error connecting to database:", err));

module.exports = sequelize;
