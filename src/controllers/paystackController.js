const axios = require("axios");
require("dotenv").config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

exports.initiatePaystackPayment = async (req, res) => {
  const { email, amount } = req.body;

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: parseInt(amount * 100), // Amount in kobo (NGN)
        currency: "NGN",
        callback_url: `${process.env.CLIENT_URL}/payment-success`,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ status: "success", data: response.data.data });
  } catch (error) {
    console.error("Paystack Payment Error:", error.response?.data || error.message);
    res.status(500).json({ status: "fail", message: "Failed to initiate payment" });
  }
};
