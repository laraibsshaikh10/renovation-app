import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { logOut } from '../config/auth';

const Header = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth(); // Use the `isLoggedIn` state from context

    // Handle logout
    const handleLogout = () => {
        logOut().then(() => {
            navigate('/login'); // Redirect to login page after logout
        });
    };

    return (
        <nav className="navbar navbar-light bg-light fixed-top border-bottom">
            <div className="container-fluid d-flex justify-content-between">
                {/* Add any logo or brand name here */}
                <Link className="navbar-brand" to="/">My App</Link>

                {/* Conditional rendering of Login/Logout links */}
                {isLoggedIn ? (
                    // <button
                    //     onClick={handleLogout}
                    //     className="btn btn-link text-decoration-none text-primary"
                    // >
                    //     Logout
                    // </button>
                    <button
                onClick={handleLogout}
                className="btn btn-danger mt-4"
            >
                Log Out
            </button>
                ) : (
                    <div>
                        <Link className="btn btn-link text-decoration-none text-primary" to="/login">
                            Login
                        </Link>
                        <Link className="btn btn-link text-decoration-none text-primary" to="/register">
                            Register New Account
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Header;
