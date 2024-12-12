const notFound = (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on this server`);
  error.status = 404;
  next(error);
};

const globalErrorHandler = (err, _req, res, _next) => {
  const statusCode = err.status || 500;

  const response = {
    status: "fail",
    message: err.message || "An error occurred",
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack; // Include stack trace in development mode
  }

  res.status(statusCode).json(response);
};

module.exports = { notFound, globalErrorHandler };
