import React from 'react';
import TaskList from './taskList';

const Project = ({ project, onEdit, onDelete, onToggleTaskCompletion, onDeleteTask, handleToggleTaskCompletion, handleDeleteTask, handleAddTaskInEdit }) => {
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            onDelete(project.id);
        }
    };

    return (
        <li className="list-group-item">
            <h5>{project.title}</h5>
            <p>{project.description}</p>
             
            <button onClick={() => onEdit(project.id)} className="btn btn-warning">Edit</button>
            <button onClick={handleDelete} className="btn btn-danger">Delete</button>
        </li>
    );
};

export default Project;



