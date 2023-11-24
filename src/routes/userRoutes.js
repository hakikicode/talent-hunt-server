const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.route("/").get(userController.getAllUsers);

router
  .route("/:email")
  .get(userController.getUserByEmail)
  .put(userController.createUser);

module.exports = router;
