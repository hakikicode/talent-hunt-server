require("dotenv").config();

const config = {
  LOCAL_CLIENT: process.env.LOCAL_CLIENT_URL,
  CLIENT: process.env.CLIENT_URL,
};

module.exports = Object.freeze(config);
