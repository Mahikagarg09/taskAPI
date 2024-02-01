// Tasks.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './TaskList';

const Tasks = () => {
  const [newtask, createnewTask] = useState(false);
  const [task, setTask] = useState({
    task_id: '',
    title: '',
    description: '',
    due_date: '',
  });

  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:3000/api/tasks/${userId}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    const taskWithUserId = { ...task, userId };

    try {
      const response = await axios.post('http://localhost:3000/api/tasks', taskWithUserId);
      console.log('Task submitted:', response.data);

      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error(error);
    }

    setTask({
      task_id: '',
      title: '',
      description: '',
      due_date: '',
    });
    createnewTask(false);
  };

  return (
    <div className="container mx-auto mt-8">
      {newtask ? (
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
      ) : (
        <div className='flex items-center justify-center mt-20'>
          <button
            type="click"
            className="bg-black text-white px-6 py-4 text-lg rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:border-blue-300"
            onClick={() => createnewTask(true)}
          >
            Create new Task
          </button>
        </div>
      )}
      <TaskList tasks={tasks} />
    </div>
  );
};

export default Tasks;
