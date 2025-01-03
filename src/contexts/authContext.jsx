import { useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";
import React from "react";
import { onAuthStateChanged } from "firebase/auth";

const UserAuthContext = React.createContext();

export const useAuth = () => {
  return useContext(UserAuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Renamed for clarity
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe; // Unsubscribe to prevent memory leaks
  }, []);

  const initializeUser = (user) => {
    if (user) {
      setCurrentUser(user); // You can also store additional details if needed (e.g., user.displayName)
      setIsLoggedIn(true);
    } else {
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
    setLoading(false); // After state update, stop loading
  };

  const value = {
    currentUser,
    isLoggedIn,
    loading,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {loading ? (
        <div>Loading...</div> // You can replace this with a loading spinner or anything else
      ) : (
        children
      )}
    </UserAuthContext.Provider>
  );
};

