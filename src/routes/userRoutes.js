const express = require("express");
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");

const router = express.Router();

router
  .route("/:email")
  .get(userController.getUserByEmail)
  .post(userController.createUser);

router.use(verifyToken, verifyRole("admin"));

router.route("/").get(userController.getAllUsers);
router.route("/:id").patch(userController.updateUser);

module.exports = router;
