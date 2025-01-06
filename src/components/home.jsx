import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import {
  createProject,
  getProjectsByUser,
  deleteProject,
  updateProjectDetails,
  addTaskToProject,
  updateTaskStatus,
  deleteTaskFromProject,
} from "../config/auth";
import { v4 as uuidv4 } from "uuid";
import { Navigate } from "react-router-dom";
import TaskList from "./taskList";

const Home = () => {
  const { currentUser, isLoggedIn } = useAuth();
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectTasks, setNewProjectTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [viewingProject, setViewingProject] = useState(null);

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
    if (!newProjectTitle.trim()) {
      alert("Project title is required!");
      return;
    }
    const newProjectId = await createProject(
      currentUser.uid,
      newProjectTitle,
      newProjectDescription
    );

    const taskObjects = newProjectTasks
      .filter((task) => task.trim()) // Avoid empty tasks
      .map((task) => ({ id: uuidv4(), title: task.trim(), completed: false })); // Create task objects

    for (const task of taskObjects) {
      await addTaskToProject(newProjectId, task);
    }

    setNewProjectTitle("");
    setNewProjectDescription("");
    setNewTask("");
    setNewProjectTasks([]);
    const updatedProjects = await getProjectsByUser(currentUser.uid);
    setProjects(updatedProjects);
  };

  const handleAddInitialTask = () => {
    if (newTask.trim()) {
      setNewProjectTasks([...newProjectTasks, newTask.trim()]);
      setNewTask("");
    }
  };

  const handleDeleteInitialTask = (index) => {
    setNewProjectTasks(newProjectTasks.filter((_, i) => i !== index));
  };

  const handleSaveEdit = async (projectId) => {
    try {
      const updatedProject = {
        title: editedTitle,
        description: editedDescription,
      };
      await updateProjectDetails(projectId, updatedProject);
      setEditingProject(null);
      const updatedProjects = await getProjectsByUser(currentUser.uid);
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error saving project edit:", error);
    }
  };

  const handleAddTaskInEdit = async (projectId, task) => {
    if (task && task.title.trim()) {
      try {
        await addTaskToProject(projectId, task); // Task already has id, title, and completed properties
        const updatedProjects = await getProjectsByUser(currentUser.uid);
        setProjects(updatedProjects);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const handleToggleTaskCompletion = async (projectId, taskId) => {
    try {
      const project = projects.find((project) => project.id === projectId);
      const task = project.tasks.find((task) => task.id === taskId);
      await updateTaskStatus(projectId, taskId, !task.completed);
      const updatedProjects = await getProjectsByUser(currentUser.uid);
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const handleDeleteTask = async (projectId, taskId) => {
    try {
      await deleteTaskFromProject(projectId, taskId);
      const updatedProjects = await getProjectsByUser(currentUser.uid);
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <div className="container mt-5 pt-5 text-center">
      <h1 className="display-4 fw-bold">
        Welcome, {currentUser.displayName || currentUser.email}!
      </h1>
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
        <div className="d-flex">
          <input
            type="text"
            placeholder="Add an initial task"
            className="form-control mt-2"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            className="btn btn-secondary mt-2 ms-2"
            onClick={handleAddInitialTask}
          >
            Add Task
          </button>
        </div>
        <ul className="list-group mt-2">
          {newProjectTasks.map((task, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {task}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteInitialTask(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button className="btn btn-primary mt-3" onClick={handleCreateProject}>
          Create Project
        </button>
      </div>

      <div className="mt-5">
        <h3>My Projects</h3>
        <ul className="list-group">
          {projects.map((project) => (
            <li
              key={project.id}
              className="list-group-item d-flex flex-column justify-content-between p-3"
            >
              <div className="mb-3 text-start">
                {editingProject === project.id ? (
                  <div>
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                    />
                    <TaskList
                      tasks={project.tasks}
                      onToggleTaskCompletion={handleToggleTaskCompletion}
                      onDeleteTask={handleDeleteTask}
                      onAddTask={(projectId, task) =>
                        handleAddTaskInEdit(projectId, task)
                      }
                      projectId={project.id}
                    />
                  </div>
                ) : (
                  <div>
                    <strong>Title:</strong> {project.title}
                    <br />
                    <strong>Description:</strong> {project.description}
                  </div>
                )}
              </div>
              <div className="mt-3 d-flex">
                {editingProject === project.id ? (
                  <>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => handleSaveEdit(project.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditingProject(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => {
                        setEditingProject(project.id);
                        setEditedTitle(project.title);
                        setEditedDescription(project.description);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-info me-2"
                      onClick={() => setViewingProject(project.id)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this project?"
                          )
                        ) {
                          deleteProject(project.id)
                            .then(() => {
                              const updatedProjects = projects.filter(
                                (p) => p.id !== project.id
                              );
                              setProjects(updatedProjects); // Update the state after deletion
                            })
                            .catch((error) => {
                              console.error("Error deleting project:", error);
                            });
                        }
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
              {viewingProject === project.id && (
                <div className="mt-3 text-start">
                  <h5>Project Details</h5>
                  <p>
                    <strong>Title:</strong> {project.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {project.description}
                  </p>
                  <h6>Tasks:</h6>
                  <ul className="list-group">
                    {project.tasks.map((task) => (
                      <li key={task.id} className="list-group-item">
                        {task.title} -{" "}
                        {task.completed ? "Completed" : "Pending"}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="btn btn-secondary mt-2"
                    onClick={() => setViewingProject(null)}
                  >
                    Close
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
