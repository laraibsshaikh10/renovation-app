import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { signUp } from '../config/auth';

const Register = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();  // Use isLoggedIn from context

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
            setIsRegistering(true);
            if (password !== confirmPassword) {
                setErrorMessage("Passwords do not match");
                setIsRegistering(false);
                return;
            }
            try {
                await signUp(email, password);
                navigate('/home');
            } catch (err) {
                setErrorMessage(err.message);
                setIsRegistering(false);
            }
        }
    };

    // If already logged in, redirect to home page
    if (isLoggedIn) {
        return <Navigate to="/home" replace={true} />;
    }

    return (
        <>
            <main className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <div className="card p-4 shadow-lg w-100" style={{ maxWidth: '400px' }}>
                    <div className="card-body">
                        <h3 className="text-center mb-4">Create a New Account</h3>
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
                                    disabled={isRegistering}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label fw-bold">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isRegistering}
                                />
                            </div>
                            {errorMessage && (
                                <div className="alert alert-danger">{errorMessage}</div>
                            )}
                            <button
                                type="submit"
                                className={`btn btn-primary w-100 ${isRegistering ? 'disabled' : ''}`}
                            >
                                {isRegistering ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </form>
                        <p className="text-center mt-3">
                            Already have an account?{' '}
                            <Link to="/login" className="fw-bold text-decoration-none">Continue</Link>
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Register;

