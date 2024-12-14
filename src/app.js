const express = require("express");
const applyMiddleware = require("./middlewares");
const { notFound, globalErrorHandler } = require("./middlewares/errorHandler");
const connectDB = require("./config/connectDB");

const rootRouter = require("./routes/rootRoutes");
const userRouter = require("./routes/userRoutes");
const contestRouter = require("./routes/contestRoutes");
const taskRouter = require("./routes/taskRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

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
// Existing routes
app.use("/registrations", registrationRoutes);


// Global Error Handling
app.all("*", notFound);
app.use(globalErrorHandler);

// Export the app for index.js
module.exports = app;
