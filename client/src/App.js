// App.js
import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList';
import SubtaskForm from './components/SubtaskForm';
import TaskFilter from './components/TaskFilter';
import SubtaskList from './components/SubtaskList'; // Assuming you have a SubtaskList component
import UpdateTaskForm from './components/UpdateTaskForm';
import UpdateSubtaskForm from './components/UpdateSubtaskForm';
import TaskActions from './components/TaskActions';
import SubtaskActions from './components/SubtaskActions';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]); // Replace with your actual data fetching logic
  const [subtasks, setSubtasks] = useState([]); // Replace with your actual data fetching logic
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedSubtaskId, setSelectedSubtaskId] = useState(null);

  // Mock function to fetch tasks from API (replace with actual API call)
  const fetchTasks = () => {
    // Perform API call to fetch tasks
    // Update tasks state with the fetched tasks
    // setTasks([...fetchedTasks]);
  };

  // Mock function to fetch subtasks from API (replace with actual API call)
  const fetchSubtasks = () => {
    // Perform API call to fetch subtasks
    // Update subtasks state with the fetched subtasks
    // setSubtasks([...fetchedSubtasks]);
  };

  // Fetch tasks and subtasks on component mount
  useEffect(() => {
    fetchTasks();
    fetchSubtasks();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // Function to handle task creation
  const handleCreateTask = (newTask) => {
    // Perform API call to create task
    // Update tasks state with the new task
    // setTasks([...tasks, { id: tasks.length + 1, ...newTask }]);
  };

  // Function to handle subtask creation
  const handleCreateSubtask = (newSubtask) => {
    // Perform API call to create subtask
    // Update subtasks state with the new subtask
    // setSubtasks([...subtasks, { id: subtasks.length + 1, ...newSubtask }]);
  };

  // Function to handle task filtering
  const handleFilterTasks = (filters) => {
    // Perform API call to fetch filtered tasks
    // Update tasks state with the fetched tasks
    // setTasks([...filteredTasks]);
  };

  // Function to handle subtask filtering
  const handleFilterSubtasks = (taskId) => {
    // Perform API call to fetch subtasks for a specific task
    // Update subtasks state with the fetched subtasks
    // setSubtasks([...filteredSubtasks]);
  };

  // Function to handle task update
  const handleUpdateTask = (updatedTask) => {
    // Perform API call to update task
    // Update tasks state with the updated task
    // setTasks([...updatedTasks]);
  };

  // Function to handle subtask update
  const handleUpdateSubtask = (updatedSubtask) => {
    // Perform API call to update subtask
    // Update subtasks state with the updated subtask
    // setSubtasks([...updatedSubtasks]);
  };

  // Function to handle task deletion
  const handleDeleteTask = () => {
    // Perform API call to soft delete task
    // Update tasks state to remove the deleted task
    // setTasks([...remainingTasks]);
    setSelectedTaskId(null); // Clear the selected task after deletion
  };

  // Function to handle subtask deletion
  const handleDeleteSubtask = () => {
    // Perform API call to soft delete subtask
    // Update subtasks state to remove the deleted subtask
    // setSubtasks([...remainingSubtasks]);
    setSelectedSubtaskId(null); // Clear the selected subtask after deletion
  };

  return (
    <div className="container">
      <h1>Task Management App</h1>

      {/* Task creation form */}
      <TaskForm onSubmit={handleCreateTask} />

      {/* Subtask creation form */}
      <SubtaskForm taskId={selectedTaskId} onSubmit={handleCreateSubtask} />

      {/* Task and Subtask filters */}
      <TaskFilter onFilter={handleFilterTasks} />
      {/* Add SubtaskFilter component if needed */}
      
      {/* Display list of tasks */}
      <TaskList tasks={tasks} onSelectTask={setSelectedTaskId} />

      {/* Update Task form */}
      {selectedTaskId && (
        <UpdateTaskForm onUpdate={handleUpdateTask} />
      )}

      {/* Task actions */}
      {selectedTaskId && (
        <TaskActions onDelete={handleDeleteTask} onUpdate={handleUpdateTask} />
      )}

      {/* Display list of subtasks */}
      <SubtaskList subtasks={subtasks} onSelectSubtask={setSelectedSubtaskId} />

      {/* Update Subtask form */}
      {selectedSubtaskId && (
        <UpdateSubtaskForm onUpdate={handleUpdateSubtask} />
      )}

      {/* Subtask actions */}
      {selectedSubtaskId && (
        <SubtaskActions onDelete={handleDeleteSubtask} onUpdate={handleUpdateSubtask} />
      )}
    </div>
  );
};

export default App;
