const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const Task = require('../models/taskModel');
const Subtask = require('../models/subtaskModel');
const User = require('../models/userModel');
const phone=process.env.PHONE

//----------------------------------CREATE TASK-------------------------------------------------------

router.post('/', async (req, res) => {
  try {
    const { task_id, title, description, due_date, userId } = req.body;

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
      task_id: task_id,
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

//--------------------------------------FETCH ALL TASKS------------------------------------------------------
router.get('/:userId/tasks', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { priority, due_date } = req.query;

    // Build a filter object based on provided parameters
    const filters = { user: userId, deleted_at: null };
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

//-------------------------------------UPDATE TASK--------------------------------------------------------
router.put('/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { due_date, status } = req.body;

    // Check if the task exists
    const task = await Task.findOne({ task_id: taskId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task due_date and status
    task.due_date = due_date || task.due_date; // Update due_date if provided
    task.status = status || task.status; // Update status if provided

    // Calculate priority based on the new due date
    const currentDate = new Date();
    const dueDate = new Date(task.due_date);
    const timeDifference = dueDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (daysDifference === 0) {
      task.priority = 0; // Due date is today
    } else if (daysDifference <= 2) {
      task.priority = 1; // Due date is between tomorrow and day after tomorrow
    } else if (daysDifference <= 4) {
      task.priority = 2; // Due date is between 3 and 4 days from now
    } else {
      task.priority = 3; // Due date is 5+ days from now
    }
    task.updated_at = new Date();
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

//----------------------------------------SOFT DELETE----------------------------------------------------

router.delete('/:taskId', async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { deleted_at: new Date() },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//-----------------------CALL-----------------------------------------------------------------------
async function initiateCall(user) {
  try {
    const call = await client.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: user.phone,
      // from: phone, // Your Twilio phone number
    });

    console.log(`Call initiated to ${user.email}, SID: ${call.sid}`);
  } catch (error) {
    console.error(`Error initiating call to ${user.email}: ${error.message}`);
  }
}

//----------------------------------CRON SCHEDULE------------------------------------------------------------
cron.schedule('* * * * *', async () => {
  try {
    console.log('Cron job started');

    const now = new Date();

    // Find overdue tasks with status not "DONE"
    const overdueTasks = await Task.find({
      due_date: { $lt: now },
      status: { $ne: 'DONE' },
    }).sort({ priority: 1 }); // Sort by priority ascending

    console.log(`Found ${overdueTasks.length} overdue tasks`);

    // Iterate through overdue tasks and initiate calls
    for (const task of overdueTasks) {
      const user = await User.findById(task.user);

      // Check if the user has a valid phone number
      if (user && user.phone) {
        console.log(`Initiating call for user: ${user.email}`);
        await initiateCall(user);
      } else {
        console.log(`User ${user.email} does not have a valid phone number. Skipping call.`);
      }

      // Update the task status to indicate that a call has been attempted
      await Task.findByIdAndUpdate(task._id, { status: 'IN_PROGRESS' });
      console.log(`Task status updated for task ID ${task.task_id}`);
    }

    console.log('Cron job completed');
  } catch (error) {
    console.error(`Cron job error: ${error.message}`);
  }
});

module.exports = router;


