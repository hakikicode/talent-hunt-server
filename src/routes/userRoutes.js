const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.route("/").get(userController.getAllUsers);

router.route("/:id").patch(userController.updateUser);

router
  .route("/:email")
  .get(userController.getUserByEmail)
  .post(userController.createUser);

module.exports = router;
