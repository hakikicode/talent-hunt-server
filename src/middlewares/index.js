const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const { LOCAL_CLIENT, CLIENT } = require("../config/defaults");

const applyMiddleware = (app) => {
  const corsOptions = {
    origin: [LOCAL_CLIENT, CLIENT],
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan("dev"));
};

module.exports = applyMiddleware;
