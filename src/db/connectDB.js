const mongoose = require("mongoose");
require("dotenv").config();

const getConnectionString = () => {
  let connectionUrl;

  if (process.env.NODE_ENV === "development") {
    connectionUrl = process.env.DATABASE_LOCAL;
  } else {
    connectionUrl = process.env.DATABASE_PROD.replace(
      "<password>",
      process.env.DATABASE_PROD_PASSWORD
    );
  }

  return connectionUrl;
};

const connectDB = async () => {
  console.log("Connecting to MongoDB...");

  try {
    const connectionUrl = getConnectionString();

    // Set up the connection
    await mongoose.connect(connectionUrl, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed. Error: ", error.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
