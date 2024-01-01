import { setKeybinds } from "../index";
import axios from 'axios';


export const fetchKeybinds = (userId) => async (dispatch) => {

    try {

        const response = await axios.get(`/api/keybinds/${userId}`);

        if (response.status === 200) {

            dispatch(setKeybinds(response.data));
        }
    } catch (error) {

        console.error("Error fetching user's keybinds:", error);

    }
};