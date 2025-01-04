import React from 'react';

const Project = ({ project, onEdit, onDelete }) => {
    const handleDelete = () => {
        const confirmation = window.confirm("Are you sure you want to delete this project?");
        if (confirmation) {
            onDelete(project.id); // Use project.id or project.ProjectID, as appropriate.
        }
    };

    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <strong>{project.title}</strong>
                <p>{project.description}</p>
            </div>
            <div>
                <button onClick={() => onEdit(project.id)} className="btn btn-warning me-2">
                    Edit
                </button>
                <button onClick={handleDelete} className="btn btn-danger">
                    Delete
                </button>
            </div>
        </li>
    );
};

export default Project;
