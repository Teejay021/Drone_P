import { useDispatch } from 'react-redux';
import { login } from '../store/index';
import userLogin from './userLogin'; // Adjust the path as needed

function LoginComponent () {
    const dispatch = useDispatch();

    const handleLogin = async (userData) => {
        const response = await userLogin(userData);

        if (response && response.status === 200) {
            dispatch(login(response.data.user));
            // Redirect here or perform other post-login actions
        } else if (response && response.error) {
            // Handle login failure
            console.error(response.error);
        }
    };

    // ... Your login form JSX

};

export default LoginComponent;
