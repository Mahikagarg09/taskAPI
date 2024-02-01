const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  task_id: { type: String, required: true },
  status: { type: Number, enum: [0, 1], default: 0 }, // 0- Incomplete, 1- Complete
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date,default:null },
  deleted_at: { type: Date,default:null},
});

const Subtask = mongoose.model('Subtask', subtaskSchema);

module.exports = Subtask;
