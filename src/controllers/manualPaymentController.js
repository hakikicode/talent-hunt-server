const { v4: uuidv4 } = require("uuid");
const ManualPayment = require("../models/manualPaymentModel");

exports.initiateManualPayment = async (req, res) => {
  const { userId, amount } = req.body;

  try {
    const paymentReference = uuidv4(); // Unique identifier for the payment

    const payment = new ManualPayment({
      userId,
      amount,
      paymentReference,
      status: "Pending",
    });

    await payment.save();

    res.status(200).json({
      status: "success",
      message: "Manual payment initiated. Please transfer to the provided bank details.",
      paymentReference,
    });
  } catch (error) {
    console.error("Manual Payment Error:", error.message);
    res.status(500).json({ status: "fail", message: "Failed to initiate manual payment" });
  }
};

exports.verifyManualPayment = async (req, res) => {
  const { paymentReference } = req.body;

  try {
    const payment = await ManualPayment.findOne({ paymentReference });

    if (!payment) {
      return res.status(404).json({ status: "fail", message: "Payment not found" });
    }

    payment.status = "Confirmed"; // Mark payment as confirmed
    await payment.save();

    res.status(200).json({ status: "success", message: "Payment confirmed successfully" });
  } catch (error) {
    console.error("Manual Payment Verification Error:", error.message);
    res.status(500).json({ status: "fail", message: "Failed to verify manual payment" });
  }
};
