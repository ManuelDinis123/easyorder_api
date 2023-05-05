const jwt = require("jsonwebtoken");
const jwtKey = "my_secret_key";

const verifyToken = async (req, res, next) => {
  let token = req.body.token;

  try {
    const decoded = jwt.verify(token, jwtKey);
    req.user = decoded;
    return next();
  } catch (err) {
    res.send("API Key missing");
  }
};

module.exports = verifyToken;