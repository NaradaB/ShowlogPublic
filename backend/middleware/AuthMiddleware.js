const { verify } = require("jsonwebtoken");
require("dotenv").config();

const confirmToken = (req, res, next) => {
  console.log("token " + req.header("accessToken"));
  const accessToken = req.header("accessToken");

  if (!accessToken) {
    return res.json({ error: "Not logged in" });
  }
  try {
    const validToken = verify(accessToken, process.env.HASH);

    req.token = validToken;

    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { confirmToken };
