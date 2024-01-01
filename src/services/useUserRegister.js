import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../store/index";


export default async function useUserRegister (userData){

    const dispatch = useDispatch();

    const userRegister = async (userData) => {
        try {
            const response = await axios.post("http://localhost:3002/register", userData);
            console.log("User data for register sent successfully", response.data);
            
            // Redirect or handle successful login here
            if (response.status === 200) {
                
                dispatch(login(response.data.user));

            }
        } catch (error) {
            console.error("Error registering in user:", error);

            if (error.response) {
                console.error("Error data:", error.response.data);
                console.error("Error status:", error.response.status);
                console.error("Error headers:", error.response.headers);
            } else if (error.request) {
                console.error("Error request:", error.request);
            } else {
                console.error("Error message:", error.message);
            }

            
        }
    };

    return userRegister;
}

