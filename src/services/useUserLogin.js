import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../store/index";
import { fetchKeybinds } from "../store/index";
import { useLazyGetKeybindsQuery } from "../store/index";

export default function useUserLogin() {
    
    const dispatch = useDispatch();

    const [triggerGetKeybinds, { data, isLoading, isError }] = useLazyGetKeybindsQuery();

    const userLogin = async (userData) => {
        try {
            const response = await axios.post("http://localhost:3002/login", userData, {
                withCredentials: true
            });
            console.log("User data for login sent successfully", response.data);
            
            if (response.status === 200) {
                const user = response.data.user;
                dispatch(login(user));
                triggerGetKeybinds();

                return { success: true, user: user };
            }
            
        } catch (error) {
            console.error("Error logging in user:", error);

            if (error.response) {
                console.error("Error data:", error.response.data);
                console.error("Error status:", error.response.status);
                console.error("Error headers:", error.response.headers);
                
                // Return the error message from the server
                return { 
                    success: false, 
                    error: error.response.data.error || "Login failed. Please check your credentials." 
                };
            } else if (error.request) {
                console.error("Error request:", error.request);
                return { 
                    success: false, 
                    error: "Network error. Please check your connection." 
                };
            } else {
                console.error("Error message:", error.message);
                return { 
                    success: false, 
                    error: "An unexpected error occurred." 
                };
            }
        }
    };

    return userLogin;
}
