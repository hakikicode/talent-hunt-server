const express = require("express");
const connectDB = require("./db/connectDB");
const applyMiddleware = require("./middlewares");
const { notFound, globalErrorHandler } = require("./middlewares/errorHandler");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

applyMiddleware(app);

// Health check
app.get("/health", (req, res) => {
  res.send("App is running...");
});

// Global error handling
app.all("*", notFound);
app.use(globalErrorHandler);

const main = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

main();
