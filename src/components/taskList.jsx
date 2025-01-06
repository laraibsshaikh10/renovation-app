import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';


const TaskList = ({ tasks, onToggleTaskCompletion, onDeleteTask, onAddTask, projectId }) => {
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim()) {
      onAddTask(projectId, { id: uuidv4(), title: newTask, completed: false });  // Ensure task is passed as an object
      setNewTask("");
    }
  };
  
  
  return (
    <div className="mt-3 w-100">
      <h5>Tasks:</h5>
      
      {/* Input and button to add new task */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)} // Update state with the input value
        />
        <button
          onClick={handleAddTask}
          className="btn btn-primary mt-2"
        >
          Add Task
        </button>
      </div>

      {/* Task list */}
      {tasks && tasks.length > 0 ? (
        <ul className="list-group">
          {tasks.map((task) => (
            <li key={task.id} className="list-group-item d-flex justify-content-between align-items-left">
              <div>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTaskCompletion(projectId, task.id)}  // Toggle task completion
                />
                <span className={task.completed ? "text-decoration-line-through" : ""}>
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => onDeleteTask(projectId, task.id)}  // Delete task
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available for this project.</p>
      )}
    </div>
  );
};

export default TaskList;



