const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');
const Subtask = require('../models/subtaskModel');
const User = require('../models/userModel');

// Define your task routes here
router.post('/', async (req, res) => {
  try {
    const {task_id, title,description, due_date, userId } = req.body;

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
      task_id : task_id,
      title,
      description,
      due_date: dueDate, 
      user: userId, 
      priority,
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:userId/tasks', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { priority, due_date } = req.query;

    // Build a filter object based on provided parameters
    const filters = { user: userId };
    if (priority) {
      filters.priority = priority;
    }
    if (due_date) {
      filters.due_date = due_date;
    }

    // Find tasks based on filters
    const filteredTasks = await Task.find(filters);

    // Check if there are tasks matching the filters
    if (!filteredTasks || filteredTasks.length === 0) {
      return res.status(404).json({ message: 'No matching tasks found for the user' });
    }

    res.json(filteredTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { due_date, status } = req.body;

    // Check if the task exists
    const task =  await Task.findOne({ task_id: taskId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task due_date and status
    task.due_date = due_date || task.due_date; // Update due_date if provided
    task.status = status || task.status; // Update status if provided
    const updatedTask = await task.save();

    // If the status is changed to "DONE," update subtasks' status to 1
    if (status === 'DONE') {
      await Subtask.updateMany({ task_id: taskId }, { status: 1 });
    }

    // If the status is changed to "TODO," update subtasks' status to 0
    if (status === 'TODO') {
      await Subtask.updateMany({ task_id: taskId }, { status: 0 });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
