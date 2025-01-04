import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { createProject, getProjectsByUser, deleteProject } from '../config/auth';
import { Navigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Home = () => {
    const { currentUser, isLoggedIn } = useAuth();
    const [projects, setProjects] = useState([]);
    const [newProjectTitle, setNewProjectTitle] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [editingProject, setEditingProject] = useState(null); // Track project being edited
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

    useEffect(() => {
        if (currentUser) {
            const fetchProjects = async () => {
                const projectsList = await getProjectsByUser(currentUser.uid);
                setProjects(projectsList);
            };
            fetchProjects();
        }
    }, [currentUser]);

    const handleCreateProject = async () => {
        if (!newProjectTitle) {
            alert("Project title is required!");
            return;
        }
        await createProject(currentUser.uid, newProjectTitle, newProjectDescription);
        setNewProjectTitle('');
        setNewProjectDescription('');
        const updatedProjects = await getProjectsByUser(currentUser.uid);
        setProjects(updatedProjects);
    };

    // Function to update the project in Firestore
    const updateProject = async (projectId, title, description) => {
        const projectRef = doc(db, "projects", projectId);
        await updateDoc(projectRef, {
            title: title,
            description: description
        });
    };

    const handleEditProject = (project) => {
        // Set project details for editing
        setEditingProject(project.id);
        setEditedTitle(project.title);
        setEditedDescription(project.description);
    };

    const handleSaveEdit = async (projectId) => {
        if (!editedTitle) {
            alert("Title is required!");
            return;
        }
        await updateProject(projectId, editedTitle, editedDescription);
        const updatedProjects = await getProjectsByUser(currentUser.uid);
        setProjects(updatedProjects);
        setEditingProject(null); // Exit edit mode
    };

    const handleDeleteProject = async (projectId) => {
        await deleteProject(projectId);
        const updatedProjects = await getProjectsByUser(currentUser.uid);
        setProjects(updatedProjects);
    };

    if (!isLoggedIn) {
        return <Navigate to="/login" replace={true} />;
    }

    return (
        <div className="container mt-5 pt-5 text-center">
            <h1 className="display-4 fw-bold">Welcome, {currentUser.displayName || currentUser.email}!</h1>
            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Project Title"
                    className="form-control"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                />
                <textarea
                    placeholder="Project Description"
                    className="form-control mt-2"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                />
                <button className="btn btn-primary mt-3" onClick={handleCreateProject}>
                    Create Project
                </button>
            </div>
            <div className="mt-5">
                <h3>My Projects</h3>
                <ul className="list-group">
                    {projects.map((project) => (
                        <li key={project.id} className="list-group-item d-flex flex-column justify-content-between p-3" style={{ height: '300px' }}>
                            <div className="mb-3 flex-grow-1 text-start">
                                {editingProject === project.id ? (
                                    // Show editable form when in edit mode
                                    <div>
                                        <div className="mb-2">
                                            <label htmlFor={`title-${project.id}`} className="form-label"><strong>Project Title </strong></label>
                                            <input
                                                type="text"
                                                id={`title-${project.id}`}
                                                className="form-control"
                                                value={editedTitle}
                                                onChange={(e) => setEditedTitle(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor={`description-${project.id}`} className="form-label"> <strong> Project Description </strong></label>
                                            <textarea
                                                id={`description-${project.id}`}
                                                className="form-control"
                                                value={editedDescription}
                                                onChange={(e) => setEditedDescription(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="mb-2">
                                            <strong>Project Title:</strong>
                                            <p>{project.title}</p>
                                        </div>
                                        <div>
                                            <strong>Project Description:</strong>
                                            <p>{project.description}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="d-flex justify-content-between w-100 mt-3">
                                {editingProject !== project.id && (
                                    // Buttons when not in edit mode
                                    <div className="d-flex">
                                        <button
                                            onClick={() => handleEditProject(project)}
                                            className="btn btn-warning me-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProject(project.id)}
                                            className="btn btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                                {editingProject === project.id && (
                                    // Buttons when in edit mode
                                    <div className="d-flex justify-content-between w-100">
                                        <button
                                            onClick={() => handleSaveEdit(project.id)}
                                            className="btn btn-success me-2"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProject(project.id)}
                                            className="btn btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Home;






