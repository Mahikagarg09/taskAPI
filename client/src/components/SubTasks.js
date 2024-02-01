import axios from 'axios';
import React, { useEffect, useState } from 'react';

const SubTasks = ({ taskId }) => {
    const [subtasks, setSubtasks] = useState([]);
    const [editablesubTaskId, setEditablesubTaskId] = useState(null);
    const [originalsubTasks, setOriginalsubTasks] = useState([]);

    useEffect(() => {
        const fetchSubtasks = async () => {
            try {
                const user_id = localStorage.getItem('userId');
                const task_id = taskId;

                const response = await axios.get(`http://localhost:3000/api/subtasks/${user_id}/subtasks`, { params: { task_id } });
                const data = response.data;
                setSubtasks(data);
                setOriginalsubTasks(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSubtasks();
    }, [taskId]);

    const handleEditClick = (subtaskId) => {
        setEditablesubTaskId(subtaskId)
    };

    const handleCancelClick = () => {
        setEditablesubTaskId(null);
        setSubtasks(originalsubTasks)
    };


    const handleUpdateClick = async (subtaskId, newStatus) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/subtasks/${subtaskId}`, {
                status: newStatus,
            });

            // Update the local state with the updated task
            setSubtasks((prevTasks) =>
                prevTasks.map((subtask) => (subtask._id === subtaskId ? response.data : subtask))
            );

            setEditablesubTaskId(null); // Move this line inside the try block
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusChange = (subtaskId, newStatus) => {
        setSubtasks((prevsubTasks) =>
            prevsubTasks.map((subtask) =>
                subtask._id === subtaskId ? { ...subtask, status: newStatus } : subtask
            )
        );
    };

    // const handleDeleteClick = async (taskId) => {
    //     try {
    //         // Make a DELETE request to delete the task on the server
    //         await axios.delete(`http://localhost:3000/api/tasks/${taskId}`);

    //         // Update the local state to remove the deleted task
    //         setTasks((prevTasks) =>
    //             prevTasks.filter((task) => task._id !== taskId)
    //         );

    //         setEditableTaskId(null); // Reset the editable task ID
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };


    return (
        <div className="container mx-auto my-8 px-10">
            <h2 className="text-2xl font-bold mb-4">All Subtasks for task {taskId}</h2>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-center">Title</th>
                        <th className="py-2 px-4 border-b text-center">Status</th>
                        <th className="py-2 px-4 border-b text-center">Options</th>
                    </tr>
                </thead>
                <tbody>
                    {subtasks.map((sub) => (
                        <tr key={sub._id} className={editablesubTaskId === sub._id ? "bg-gray-200" : "hover:bg-gray-100"}>
                            <td className="py-2 px-4 border-b text-center">{sub.title}</td>
                            <td className="py-2 px-4 border-b text-center">
                            {editablesubTaskId === sub._id ? (
                                <select
                                    value={sub.status}
                                    onChange={(e) => handleStatusChange(sub._id, e.target.value)}
                                    className="border border-gray-300 px-2 py-1 rounded-md"
                                >
                                    <option value="0">0-incomplete</option>
                                    <option value="1">1-complete</option>
                                </select>
                            ) : (
                                sub.status
                            )}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                {editablesubTaskId=== sub._id ? (
                                    <>
                                        <button
                                            onClick={() => handleUpdateClick(sub._id, sub.status)}
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
                                    <>
                                        <button
                                            onClick={() => handleEditClick(sub._id)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 mr-2"
                                        >
                                            Update
                                        </button>
                                        <button
                                            // onClick={() => handleDeleteClick(task._id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300 mr-2"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubTasks;
