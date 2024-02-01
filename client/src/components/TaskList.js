// TaskList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
    const [editableTaskId, setEditableTaskId] = useState(null);
    const [tasks, setTasks] = useState([]);

    // Fetch tasks with useEffect
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:3000/api/tasks/${userId}/tasks`);
                setTasks(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTasks();
    }, []); // Empty dependency array ensures it runs only once on mount

    const handleEditClick = (taskId) => {
        setEditableTaskId(taskId);
    };

    const handleCancelClick = () => {
        setEditableTaskId(null);
    };

    const handleUpdateClick = async (taskId, newDueDate, newStatus) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/tasks/${taskId}`, {
                due_date: newDueDate,
                status: newStatus,
            });
    
            // Update the local state with the updated task
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task._id === taskId ? response.data : task))
            );
    
            setEditableTaskId(null); // Move this line inside the try block
        } catch (error) {
            console.error(error);
        }
    };
    
    const handleDueDateChange = (taskId, newDueDate) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === taskId ? { ...task, due_date: newDueDate } : task
            )
        );
    };
    
    const handleStatusChange = (taskId, newStatus) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === taskId ? { ...task, status: newStatus } : task
            )
        );
    };

    return (
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
                        <th className="py-2 px-4 border-b text-center">OPTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task._id} className={editableTaskId === task._id ? "bg-gray-200" : "hover:bg-gray-100"}>
                            <td className="py-2 px-4 border-b text-center">{task.task_id}</td>
                            <td className="py-2 px-4 border-b text-center">{task.title}</td>
                            <td className="py-2 px-4 border-b text-center">{task.description}</td>
                            <td className="py-2 px-4 border-b text-center">
                            {editableTaskId === task._id ? (
                                <input
                                    type="date"
                                    value={task.due_date}
                                    onChange={(e) => handleDueDateChange(task._id,e.target.value)}
                                    className="border border-gray-300 px-2 py-1 rounded-md"
                                />
                            ) : (
                                new Date(task.due_date).toLocaleDateString()
                            )}
                            </td>
                            <td className="py-2 px-4 border-b text-center">{task.priority}</td>
                            <td className="py-2 px-4 border-b text-center">
                            {editableTaskId === task._id ? (
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task._id,e.target.value)}
                                    className="border border-gray-300 px-2 py-1 rounded-md"
                                >
                                    <option value="TODO">TODO</option>
                                    <option value="DONE">DONE</option>
                                </select>
                            ) : (
                                task.status
                            )}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                {editableTaskId === task._id ? (
                                    <>
                                        <button
                                            onClick={() => handleUpdateClick(task._id, task.due_date, task.status)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300 mr-2"
                                        >
                                            Done
                                        </button>
                                        <button
                                            onClick={handleCancelClick}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:border-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleEditClick(task._id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 mr-2"
                                    >
                                        Update
                                    </button>
                                )}
                            </td>       
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default TaskList;
