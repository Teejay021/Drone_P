import "../userForm.css"; 
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { Button } from "@material-tailwind/react";
import { setKeybinds } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import updateDatabase from "../../services/updateDatabase";


export default function SettingForm({handleSettingClick}) {

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const currentKeybinds = useSelector((state) => state.keybind.keybind);
    const username = useSelector((state) => state.userSlice.username);

  const[newKeybind, setNewKeybind] = useState({

    leftMotorForward:"",
    leftMotorBackward:"",

    rightMotorForward:"",
    rightMotorBackward:""

  });

  

  


  async function handleFormSubmit (e){
    e.preventDefault();

    setIsLoading(true);

    setError(""); // Clear previous errors

    setSuccessMessage(""); // Clear previous success messages


    dispatch(setKeybinds(newKeybind));

    const result = await updateDatabase({ username, newKeybind });

    setIsLoading(false);

    if (result.success) {
        setSuccessMessage("Keybinds updated successfully!");
    } else {
        setError(result.error);
    }



  }

  function handleFormChange(e){

    setNewKeybind({

      ...newKeybind, [e.target.name]: e.target.value

    })

  }

  function handleReset (){


    setNewKeybind(currentKeybinds);
  }


  return (


    <>
      

        
        
        


            <div className="bg-white/30 backdrop-blur-sm p-8 rounded-lg shadow-lg w-96">
                <form className="space-y-7 mt-4" action="#" method="POST" onSubmit={handleFormSubmit}>
            
                    <div>

                        <label htmlFor="leftMotorForward" className="block text-sm font-medium leading-6 text-gray-900">
                            Left Motor Forward
                        </label>

                        <div className="mt-2">

                            <input
                            onChange={handleFormChange}
                            value={newKeybind.leftMotorForward}
                            id="leftMotorForward"
                            name="leftMotorForward"
                            type="text"
                            // autoComplete="email" we should use the keybinds slice values for autoComplete 
                            required
                            className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />

                        </div>
                    </div>

                    <div>
                    
                        <div className="flex items-center justify-between">

                            <label htmlFor="leftMotorBackward" className="block text-sm font-medium leading-6 text-gray-900">
                            Left Motor Backward
                            </label>

                        </div>

                        <div className="mt-2">
                        
                            <input
                            onChange={handleFormChange}
                            value={newKeybind.leftMotorBackward}
                            id="leftMotorBackward"
                            name="leftMotorBackward"
                            type="text"
                            // autoComplete="current-password"
                            required
                            className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />

                        </div>



                    </div>

                    <div>

                        <label htmlFor="rightMotorForward" className="block text-sm font-medium leading-6 text-gray-900">
                            Right Motor Forward
                        </label>

                        <div className="mt-2">

                            <input
                            onChange={handleFormChange}
                            value={newKeybind.rightMotorForward}
                            id="rightMotorForward"
                            name="rightMotorForward"
                            type="text"
                            // autoComplete="email"
                            required
                            className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />

                        </div>
                    </div>

                    <div>
                        <label htmlFor="rightMotorBackward" className="block text-sm font-medium leading-6 text-gray-900">
                            Right Motor Backward
                        </label>
                        <div className="mt-2">

                            <input
                            onChange={handleFormChange}
                            value={newKeybind.rightMotorBackward}
                            id="rightMotorBackward"
                            name="rightMotorBackward"
                            type="text"
                            // autoComplete="email"
                            required
                            className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />

                        </div>
                        
                    </div>


                    <div className="flex justify-center space-x-4">

                        {/* for the submit button we need to use a variable so put in laoding value so when we are updating the database and store we go to loading and when it's succesfull we turn it to false */}

                        <Button size="md" variant="outlined"  onClick={handleReset}>reset</Button>

                        <Button type="submit" size="md" color="green" onClick={handleSettingClick}   loading={isLoading} >Apply</Button>



                    </div>

                    {error && <div className="text-red-600 text-center mt-4">{error}</div>}
                    {successMessage && <div className="text-green-600 text-center mt-4">{successMessage}</div>}



                </form>

            
            </div>
        
    </>
  );
}


