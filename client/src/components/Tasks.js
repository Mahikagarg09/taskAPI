import React, { useState } from 'react';
import axios from 'axios'

export default function Tasks() {
  const [task, setTask] = useState({
    task_id: '',
    title: '',
    description: '',
    due_date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fetch the user ID from local storage
    const userId = localStorage.getItem('userId');

    // Add the user ID to the task object
    const taskWithUserId = { ...task, userId };

    try {
      // Make the POST request to your server
      const response = await axios.post('http://localhost:3000/api/tasks', taskWithUserId);
      // Handle the response as needed
      console.log('Task submitted:', response.data);
    } catch (error) {
      console.error(error);
      // Handle error response
    }
  };
  return (
    <div className="container mx-auto mt-8">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="task_id" className="block text-gray-700 text-sm font-bold mb-2">
            Task ID
          </label>
          <input
            type="text"
            id="task_id"
            name="task_id"
            value={task.task_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={task.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="due_date" className="block text-gray-700 text-sm font-bold mb-2">
            Due Date
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={task.due_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}
