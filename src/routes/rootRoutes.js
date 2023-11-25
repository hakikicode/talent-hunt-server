const express = require("express");
const authController = require("../controllers/authController");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.route("/jwt").post(authController.createToken);
router.route("/logout").get(authController.logout);
router
  .route("/create-payment-intend")
  .post(paymentController.createPaymentIntent);

module.exports = router;
