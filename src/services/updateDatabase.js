import axios from "axios";


 async function updateDatabase({username, keybinds}){


    try{


        const response = await axios.post(`http://localhost:3002/updateDatabase/${username}`, keybinds);

        // we need to return a status for the backend to turn false or true for the laoding button

        if (response.status === 200) {

            return { success: true };
        } 
        
        else {
            return { success: false, error: "Update failed with status code: " + response.status };
        }
        

    } catch (error){

        console.error("Error updating user's keybinds on the database", error);

        return { success: false, error: "An error occurred while updating keybinds" };
        
    }




}

export default updateDatabase;