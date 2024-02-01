const express = require('express');
const router = express.Router();
const Subtask = require('../models/subtaskModel');
const Task = require('../models/taskModel');

// Example route: Create a new subtask
router.post('/', async (req, res) => {
  try {
    const { title, task_id} = req.body;

    // Check if the referenced task exists
    const existingTask = await Task.findById(task_id);
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

// Add more routes as needed

module.exports = router;
