const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  console.log("Connecting to MongoDB...");

  try {
    // Get the connection string for the production environment
    const connectionUrl = process.env.DATABASE_PROD;

    if (!connectionUrl) {
      throw new Error("DATABASE_PROD is not defined in environment variables.");
    }

    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed. Error: ", error.message);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
