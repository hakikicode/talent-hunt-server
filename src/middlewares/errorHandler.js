const notFound = (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on the server`);
  error.status = 404;
  next(error);
};

const globalErrorHandler = (err, _req, res, _next) => {
  res.status(err.status || 500).json({
    status: "fail",
    message: err.message,
  });
};

module.exports = { notFound, globalErrorHandler };
