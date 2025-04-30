const express = require('express');
const router = express.Router();
const User = require('../modals/User.js');  // Corrected path

// Route to get all users (excluding the current user if needed)
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Modify this query as needed
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
