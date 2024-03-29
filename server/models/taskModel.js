const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task_id: { type: String, required: true },
  title: { type: String, required: true },
  description:{ type: String, required: true },
  due_date: { type: Date, required: true },
  priority: { type: Number, required: true },
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' },
  deleted_at: { type: Date, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
