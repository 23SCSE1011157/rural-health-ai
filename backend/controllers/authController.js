const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER

const registerUser = async (req, res) => {

  try {

    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists"
      });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({

      username,
      password: hashedPassword,
      role

    });

    res.status(201).json({

      success: true,
      message: "User Registered Successfully",
      user

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

    const token = jwt.sign(

      {
        id: user._id,
        role: user.role
      },

      "secretkey",

      {
        expiresIn: "1d"
      }

    );

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