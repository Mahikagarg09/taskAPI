const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('../models/userModel'); // Import the User model
const Task = require('../models/taskModel');

const secretKey = "secret";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

router.post('/register', async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Calculate priority based on existing users
    const usersCount = await User.countDocuments();
    const priority = usersCount + 1;

    // Create a new user with priority
    const newUser = new User({
      email,
      password,
      phone,
      priority,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    // If no token, redirect to the login page
    return res.redirect("/auth");
  }

  // Verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      // If token verification fails, redirect to the login page
      return res.redirect("/auth");
    }

    // Token is valid, you can proceed with rendering the main route or performing other actions
    // For example, you can extract user information from the decoded token
    const userEmail = decoded.user.email;

    // Render or send a response for authenticated users
    res.send(`Welcome, ${userEmail}! This is the main route.`);
  });
});

router.get('/login', (req, res) => {
  const token = req.cookies.token;
  if (token) {
    return res.redirect('/');
  }

  // Render your login form or any login-related content
  res.end();
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    jwt.sign({ user }, secretKey, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        res.sendStatus(500);
      } else {
        // Set the token in the response header
        res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
        res.json({ message: 'Login successful', token });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
