// taskModel.js

const mongoose = require('mongoose');
const subtaskSchema = require('./subtaskModel');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  due_date: { type: Date, required: true },
  priority: { type: Number, required: true },
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' },
  deleted_at: { type: Date },
  subtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subtask' }],
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
