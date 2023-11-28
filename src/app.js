const express = require("express");
const applyMiddleware = require("./middlewares");
const { notFound, globalErrorHandler } = require("./middlewares/errorHandler");

const rootRouter = require("./routes/rootRoutes");
const userRouter = require("./routes/userRoutes");
const contestRouter = require("./routes/contestRoutes");
const taskRouter = require("./routes/taskRoutes");

require("dotenv").config();
const app = express();

applyMiddleware(app);

// Health check
app.get("/health", (req, res) => {
  res.send("App is running...");
});

// Routes
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/contests", contestRouter);
app.use("/tasks", taskRouter);

// Global error handling
app.all("*", notFound);
app.use(globalErrorHandler);

// const main = async () => {
//   await connectDB();
//   app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//   });
// };

// main();

module.exports = app;
