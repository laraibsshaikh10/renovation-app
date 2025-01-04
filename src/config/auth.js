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
import { collection, addDoc, getDocs, doc, deleteDoc, query, where } from "firebase/firestore";

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