import axios from 'axios';
import React, { useEffect, useState } from 'react';

const SubTasks = ({ taskId }) => {
    const [subtasks, setSubtasks] = useState([]);

    useEffect(() => {
        const fetchSubtasks = async () => {
            try {
                const user_id = localStorage.getItem('userId');
                const task_id = taskId;

                const response = await axios.get(`http://localhost:3000/api/subtasks/${user_id}/subtasks`, { params: { task_id } });
                const data = response.data;
                console.log(data)
                setSubtasks(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSubtasks();
    }, [taskId]);


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
                        <tr key={sub._id}>
                            <td className="py-2 px-4 border-b text-center">{sub.title}</td>
                            <td className="py-2 px-4 border-b text-center">{sub.status}</td>
                            <td className="py-2 px-4 border-b text-center">
                                <button
                                    // onClick={() => handleEditClick(task._id)}
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubTasks;
