// import the Sequelize constructor from the library  
require("dotenv").config();
const Sequelize = require("sequelize");

// Connects to database either on Heroku or locally
const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: "localhost",
        dialect: "mysql",
        dialectOptions: {
          decimalNumbers: true,
        },
      }
    );

// Checks the connection to the database
const checkAuthenticity = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// runs the checkAuthenticity function
checkAuthenticity();

// exports the sequelize connection
module.exports = sequelize;
