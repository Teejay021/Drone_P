import { useDispatch } from "react-redux";
import { login } from "../store/index";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

const useUserRegister = () => {
    const [registerError, setRegisterError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userRegister = async (userData) => {
        try {
            const response = await axios.post("http://localhost:3002/register", userData);
            console.log("User data for register sent successfully", response.data);
            
            if (response.status === 200) {
                
                dispatch(login({

                    username: response.data.user.username,
                    image: null,
        
                }));

                navigate("/control"); // Redirect to "/control" after successful registration
            }
        } catch (error) {
            
            console.error("Error registering user:", error);
            // Handle the error by displaying an error on the form
            setRegisterError(error.response.data);
        }
    };

    return { userRegister, error: registerError };
};

export default useUserRegister;