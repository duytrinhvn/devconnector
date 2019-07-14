const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const User = require("../../config/models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");

// @route   GET api/auth
// @desc    Get user info
// @access  Public
router.get("/", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  try {
    res.json(user);
  } catch (error) {
    res.status(500).send();
  }
});

// @route   POST api/auth
// @desc    Login route
// @access  Public
router.post(
  "/",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;

      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid email or password" }] });
      }

      // Check if password is match
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid email or password" }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      // Return Json Web Token
      jwt.sign(
        payload,
        config.get("jwtToken"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
