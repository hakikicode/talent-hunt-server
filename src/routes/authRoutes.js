const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/jwt").post(authController.createToken);
router.route("/logout").get(authController.logout);

module.exports = router;
