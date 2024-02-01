const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');
const User = require('../models/userModel');

// Define your task routes here
router.post('/', async (req, res) => {
  try {
    const { title, due_date, userId } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert the due_date to a Date object
    const dueDate = new Date(due_date);

    // Calculate priority based on due date
    const currentDate = new Date();
    const timeDifference = dueDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    let priority;
    if (daysDifference === 0) {
      priority = 0; // Due date is today
    } else if (daysDifference <= 2) {
      priority = 1; // Due date is between tomorrow and day after tomorrow
    } else if (daysDifference <= 4) {
      priority = 2; // Due date is between 3 and 4 days from now
    } else {
      priority = 3; // Due date is 5+ days from now
    }

    const newTask = new Task({
      title,
      due_date: dueDate, // Use the converted dueDate
      priority,
      user: userId, // Assign the user ID to the task
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
