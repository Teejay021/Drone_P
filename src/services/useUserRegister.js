import { useDispatch } from "react-redux";
import { login } from "../store/index";
import axios from "axios";

const useUserRegister = () => {
    const dispatch = useDispatch();

    const userRegister = async (userData) => {
        try {
            const response = await axios.post("http://localhost:3002/register", userData);
            console.log("User data for register sent successfully", response.data);
            
            if (response.status === 200) {
                dispatch(login(response.data.user));
            }
        } catch (error) {
            console.error("Error registering user:", error);
            // Handle the error by displaying an error on the form
        }
    };

    return userRegister;
};

export default useUserRegister;
