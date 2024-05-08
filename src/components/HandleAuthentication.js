import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/index';
import { loginWithGoogle, loginWithFacebook, loginWithGithub } from "../services/authentication";

export const HandleAuthentication = () => {
    const dispatch = useDispatch();
    const [error, setError] = useState(null);

    const handleLogin = async (loginFunction) => {
        try {
            const data = await loginFunction();
            if (data && data.user && data.token) {
                console.log(data.user);
                dispatch(login(data.user));
                // Handle successful login
            } else if (data && data.error) {
                setError(data.error); // Set error state for frontend display
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('An error occurred during login.'); // Set generic error message
        }
    };


    return {
        handleLoginWithGoogle: () => handleLogin(loginWithGoogle),
        handleLoginWithFacebook: () => handleLogin(loginWithFacebook),
        handleLoginWithGithub: () => handleLogin(loginWithGithub),
        error, // Include error state in return object
    };
};
