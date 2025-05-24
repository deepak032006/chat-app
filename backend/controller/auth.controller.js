const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../modals/auth.modal.js');
const path = require('path');

const BASE_URL = process.env.NODE_ENV === "development" ? 'http://localhost:5000' : "/api";




const register = async (req, res) => {
  const { username, email, password } = req.body;
  const avatar = req.file ? `/avatars/${req.file.filename}` : null;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
      },
      token
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { register, login };
