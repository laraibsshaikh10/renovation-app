import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { logIn, logInWithGoogle } from "../config/auth";
import { useAuth } from '../contexts/authContext';

const Login = () => {
    const { isLoggedIn } = useAuth();  // Use isLoggedIn from context

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            await logIn(email, password).catch(err => {
                setIsSigningIn(false);
                setErrorMessage(err.message);
            });
        }
    };

    const onGoogleSignIn = (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            logInWithGoogle().catch(err => {
                setIsSigningIn(false);
                setErrorMessage(err.message);
            });
        }
    };

    // If already logged in, redirect to home page
    if (isLoggedIn) {
        return <Navigate to="/home" replace={true} />;
    }

    return (
        <div>
            <main className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <div className="card p-4 shadow-lg w-100" style={{ maxWidth: '400px' }}>
                    <div className="card-body">
                        <h3 className="text-center mb-4">Welcome Back</h3>
                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label fw-bold">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label fw-bold">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {errorMessage && (
                                <div className="alert alert-danger py-2">{errorMessage}</div>
                            )}
                            <button
                                type="submit"
                                disabled={isSigningIn}
                                className={`btn btn-primary w-100 ${isSigningIn ? 'disabled' : ''}`}
                            >
                                {isSigningIn ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>
                        <p className="text-center mt-3">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-decoration-none fw-bold">Sign up</Link>
                        </p>
                        <div className="text-center my-3">
                            <hr />
                            <span className="bg-white px-2">OR</span>
                        </div>
                        <button
                            disabled={isSigningIn}
                            onClick={onGoogleSignIn}
                            className={`btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 ${isSigningIn ? 'disabled' : ''}`}
                        >
                            <svg className="me-2" width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0)">
                                    <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                                    <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                                    <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                                    <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                                </g>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect width="48" height="48" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            {isSigningIn ? 'Signing In...' : 'Continue with Google'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
