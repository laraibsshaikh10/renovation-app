import React from 'react';
import { Navigate } from 'react-router-dom'; // For redirection
import { useAuth } from '../contexts/authContext'; // To get currentUser and isLoggedIn
import { logOut } from '../config/auth'; // To log the user out

const Home = () => {
    const { currentUser, isLoggedIn } = useAuth(); // Use correct values from context

    // Handle logout
    const handleLogout = async () => {
        await logOut(); // Log the user out
    };

    if (!isLoggedIn) {
        return <Navigate to="/login" replace={true} />; // Redirect to login if the user is not logged in
    }

    // Ensure currentUser is defined before trying to access displayName or email
    const userDisplayName = currentUser ? currentUser.displayName || currentUser.email : 'User';

    return (
        <div className="container mt-5 pt-5 text-center">
            <h1 className="display-4 fw-bold">
                Hello, {userDisplayName}! You are now logged in.
            </h1>
            <button
                onClick={handleLogout}
                className="btn btn-danger mt-4"
            >
                Log Out
            </button>
        </div>
    );
};

export default Home;

