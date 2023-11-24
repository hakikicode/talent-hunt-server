const express = require("express");
const connectDB = require("./db/connectDB");
const applyMiddleware = require("./middlewares");
const { notFound, globalErrorHandler } = require("./middlewares/errorHandler");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const contestRouter = require("./routes/contestRoutes");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

applyMiddleware(app);

// Health check
app.get("/health", (req, res) => {
  res.send("App is running...");
});

// Routes
app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/contests", contestRouter);

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
