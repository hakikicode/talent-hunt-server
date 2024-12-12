const express = require("express");
const applyMiddleware = require("./middlewares");
const { notFound, globalErrorHandler } = require("./middlewares/errorHandler");
const connectDB = require("./config/connectDB");

const rootRouter = require("./routes/rootRoutes");
const userRouter = require("./routes/userRoutes");
const contestRouter = require("./routes/contestRoutes");
const taskRouter = require("./routes/taskRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

require("dotenv").config();
const app = express();

// Apply Middlewares
applyMiddleware(app);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).send("App is running...");
});

// Routes
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/contests", contestRouter);
app.use("/tasks", taskRouter);
app.use("/api/v1/payments", paymentRoutes);

// Global Error Handling
app.all("*", notFound);
app.use(globalErrorHandler);

// Start Server
const port = process.env.PORT || 5000; // Define the port variable

const main = async () => {
  try {
    await connectDB(); // Connect to the database
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

main();

module.exports = app;
