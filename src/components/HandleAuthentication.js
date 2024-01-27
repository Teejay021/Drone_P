import { useDispatch } from 'react-redux';
import { login } from '../store/index';
import { loginWithGoogle, loginWithFacebook, loginWithGithub } from "../services/authentication";

export const HandleAuthentication = () => {
    const dispatch = useDispatch();

    const handleLogin = async (loginFunction) => {
        const data = await loginFunction();
        if (data && data.user && data.token) {

            console.log(data.user);
            
            dispatch(login(data.user));
            // Handle successful login
        } else if (data && data.error) {
            // Handle failed login
        }
    };

    return {
        handleLoginWithGoogle: () => handleLogin(loginWithGoogle),
        handleLoginWithFacebook: () => handleLogin(loginWithFacebook),
        handleLoginWithGithub: () => handleLogin(loginWithGithub)
    };
};