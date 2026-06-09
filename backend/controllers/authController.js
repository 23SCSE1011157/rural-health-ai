const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );
};

// REGISTER

const registerUser = async (req, res) => {

  try {

    const { fullName, email, username, password, role } = req.body;

    if (!fullName || !email || !username || !password) {

      return res.status(400).json({
        success: false,
        message: "Full name, email, username, and password are required"
      });

    }

    if (!emailPattern.test(email)) {

      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });

    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { username: normalizedUsername }
      ]
    });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message:
          existingUser.email === normalizedEmail
            ? "Email already exists"
            : "Username already exists"
      });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({

      fullName: fullName.trim(),
      email: normalizedEmail,
      username: normalizedUsername,
      password: hashedPassword,
      role

    });

    res.status(201).json({

      success: true,
      message: "User Registered Successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.role
      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

// LOGIN

const loginUser = async (req, res) => {

  try {

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: "Invalid Password"
      });

    }

    const token = createToken(user);

    res.json({

      success: true,
      token,
      role: user.role

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

module.exports = {
  registerUser,
  loginUser
};
