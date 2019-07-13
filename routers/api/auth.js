const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get("/", authMiddleware, (req, res) => {
  res.send("Auth Route");
});

module.exports = router;
