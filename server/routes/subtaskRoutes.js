const express = require('express');
const router = express.Router();
const Subtask = require('../models/subtaskModel');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

// Example route: Create a new subtask
router.post('/', async (req, res) => {
  try {
    const { title, task_id} = req.body;

    // Check if the referenced task exists
    const existingTask = await Task.findOne({ task_id: task_id });
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const newSubtask = new Subtask({
      title,
      task_id,
    });

    const savedSubtask = await newSubtask.save();
    res.json(savedSubtask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:userId/subtasks', async (req, res) => {
  try {
    const userId = req.params.userId;
    const task_id = req.query.task_id; // Extract task_id from query string

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let tasks;
    if (task_id) {
      // If task_id is provided, fetch subtasks only for that task
      tasks = await Task.find({ user: userId, task_id });
    } else {
      // Otherwise, fetch all tasks for the user
      tasks = await Task.find({ user: userId });
    }

    // Fetch subtasks for each task
    const allSubtasks = [];
    for (const task of tasks) {
      const subtasks = await Subtask.find({ task_id: task.task_id });
      allSubtasks.push({
        task_id: task.task_id,
        subtasks,
      });
    }

    res.json(allSubtasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
