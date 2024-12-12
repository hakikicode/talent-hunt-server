const express = require("express");
const router = express.Router();
const { createPaymentIntent } = require("../controllers/paymentController");
const { initiatePaystackPayment } = require("../controllers/paystackController");
const {
  initiateManualPayment,
  verifyManualPayment,
} = require("../controllers/manualPaymentController");

// Stripe Payment
router.post("/stripe/create-payment-intent", createPaymentIntent);

// Paystack Payment
router.post("/paystack/initiate-payment", initiatePaystackPayment);

// Manual Bank Transfer
router.post("/manual/initiate-payment", initiateManualPayment);
router.post("/manual/verify-payment", verifyManualPayment);

module.exports = router;
