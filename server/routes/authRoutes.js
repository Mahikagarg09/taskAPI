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

router.get('/', (req, res) => {
  if (!req.cookies.token) {
    return res.redirect("/auth");
  }
//   res.setHeader("Content-type", "text/HTML");
//   res.write("<a href='/protected'><button>Protected</button></a>")
  res.end();
});

router.get('/login', (req, res) => {
  const token = req.cookies.token;
  if (token) {
    return res.redirect('/');
  }

//   res.setHeader('Content-Type', 'text/HTML');
//   res.write(`<h1>Login</h1>
//     <form method="post" action="/login">
//       <input type="text" name="email" placeholder="Email"/> </br> 
//       <input type="password" name="password" placeholder="Password"/> </br>
//       <button type="submit">Login</button>
//     </form>`);
  res.end();
});

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
        res.cookie('token', token, { maxAge: 3600000, httpOnly: true })
        res.json({ message: 'Login successful', token });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// router.get('/protected', (req, res) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.redirect('/login');
//   }

//   jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) {
//       return res.sendStatus(401);
//     }

//     const userEmail = decoded.user.email;
//     res.send(`Welcome, ${userEmail}! This is a protected route.`);
//   });
// });

module.exports = router;