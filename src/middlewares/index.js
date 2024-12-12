const cors = require("cors");
const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const applyMiddleware = (app) => {
  const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:5173",
      "https://kwaratalentsharvest.com.ng",
      "https://kwaratalentsharvest.vercel.app/",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined")); // Production-friendly logging
  }
};

module.exports = applyMiddleware;