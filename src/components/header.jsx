import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { logOut } from '../config/auth';

const Header = () => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();

    return (
        <nav className="navbar navbar-light bg-light fixed-top border-bottom">
            <div className="container-fluid d-flex justify-content-center">
                {userLoggedIn ? (
                    <button
                        onClick={() => {
                            logOut().then(() => {
                                navigate('/login');
                            });
                        }}
                        className="btn btn-link text-decoration-none text-primary">
                        Logout
                    </button>
                ) : (
                    <>
                        <Link className="btn btn-link text-decoration-none text-primary" to="/login">
                            Login
                        </Link>
                        <Link className="btn btn-link text-decoration-none text-primary" to="/register">
                            Register New Account
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Header;
