const { signToken } = require("../utils/genarateToken");

exports.createToken = async (req, res) => {
  const user = req.body;
  console.log("I need a new jwt", user);
  const token = signToken(user);
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .send({ success: true });
};

exports.logout = async (req, res) => {
  try {
    res
      .clearCookie("token", {
        maxAge: 0,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .send({ success: true });
    console.log("Logout successful");
  } catch (err) {
    res.status(500).send(err);
  }
};
