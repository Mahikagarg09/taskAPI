// TaskList.js
import React from 'react';

const TaskList = ({ tasks }) => (
  <div className="container mx-auto my-8 px-10">
    <h2 className="text-2xl font-bold mb-4">All Tasks</h2>
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b text-center">TASK ID</th>
          <th className="py-2 px-4 border-b text-center">TITLE</th>
          <th className="py-2 px-4 border-b text-center">DESCRIPTION</th>
          <th className="py-2 px-4 border-b text-center">DUE DATE</th>
          <th className="py-2 px-4 border-b text-center">PRIORITY</th>
          <th className="py-2 px-4 border-b text-center">STATUS</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task._id} className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b text-center">{task.task_id}</td>
            <td className="py-2 px-4 border-b text-center">{task.title}</td>
            <td className="py-2 px-4 border-b text-center">{task.description}</td>
            <td className="py-2 px-4 border-b text-center">{new Date(task.due_date).toLocaleDateString()}</td>
            <td className="py-2 px-4 border-b text-center">{task.priority}</td>
            <td className="py-2 px-4 border-b text-center">{task.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TaskList;
