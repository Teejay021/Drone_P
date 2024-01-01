import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../store/index";
import { fetchKeybinds } from "../store/index";

export default function useUserLogin() {
    
    const dispatch = useDispatch();

    const userLogin = async (userData) => {
        try {
            const response = await axios.post("http://localhost:3002/login", userData);
            console.log("User data for login sent successfully", response.data);
            
            // Redirect or handle successful login here
            
            if (response.status === 200) {
                dispatch(login(response.data.user));
                fetchKeybinds(...userData); //Not sure about ...userData or userData.username
            }
            
        } catch (error) {
            
            
            console.error("Error logging in user:", error);

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

    return userLogin;
}
