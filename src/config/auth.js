import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { db } from "./firebase";  // Ensure db is initialized for Firestore
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, query, where, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';  // Import uuid for generating unique task IDs

// User Authentication
export const signUp = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  // Optionally add user to Firestore if needed
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

// Project Management
export const createProject = async (userId, title, description) => {
  const projectRef = collection(db, 'projects');
  const newProject = {
    title,
    description,
    createdBy: userId,
    tasks: [],
    collaborators: [],
    createdAt: new Date().toISOString(),
  };
  await addDoc(projectRef, newProject);
};

export const getProjectsByUser = async (userId) => {
  const projectRef = collection(db, 'projects');
  const q = query(projectRef, where('createdBy', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteProject = async (projectId) => {
  const projectDocRef = doc(db, 'projects', projectId);
  await deleteDoc(projectDocRef);
};

// Task Management
export const addTaskToProject = async (projectId, task) => {
  try {
    const taskWithId = { ...task, id: uuidv4() };  // Add a unique ID to each task
    const projectRef = doc(db, "projects", projectId);
    const currentProject = (await getDoc(projectRef)).data();
    const updatedTasks = [...currentProject.tasks, taskWithId];  // Add task with ID to tasks array
    
    await updateDoc(projectRef, { tasks: updatedTasks });
  } catch (error) {
    console.error("Error adding task to project:", error);
  }
};

export const updateTaskStatus = async (projectId, taskId, completed) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    const currentProject = (await getDoc(projectRef)).data();
    const updatedTasks = currentProject.tasks.map(task =>
      task.id === taskId ? { ...task, completed } : task
    );
    
    await updateDoc(projectRef, { tasks: updatedTasks });
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

export const deleteTaskFromProject = async (projectId, taskId) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    const currentProject = (await getDoc(projectRef)).data();
    const updatedTasks = currentProject.tasks.filter(task => task.id !== taskId);
    
    await updateDoc(projectRef, { tasks: updatedTasks });
  } catch (error) {
    console.error("Error deleting task from project:", error);
  }
};

// Update Project Details (new function)
export const updateProjectDetails = async (projectId, updatedDetails) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, updatedDetails);
  } catch (error) {
    console.error("Error updating project details:", error);
  }
};





// export const logOut = () => {
//   return auth.signOut();
// };

// export const doPasswordReset = (email) => {
//   return sendPasswordResetEmail(auth, email);
// };

// export const doPasswordChange = (password) => {
//   return updatePassword(auth.currentUser, password);
// };

// export const doSendEmailVerification = () => {
//   return sendEmailVerification(auth.currentUser, {
//     url: `${window.location.origin}/home`,
//   });
// };