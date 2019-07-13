const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if token not exist
  if (!token) res.status(401).json({ msg: "No token, access denied" });

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtToken"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token invalid" });
  }
};
