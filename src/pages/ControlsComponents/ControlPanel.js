import Controller from "./Controller";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock, faCamera, faGear } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from "react";




function ControlPanel ({handleSettingClick}) {



    
    const [isLock, setIsLock] = useState (false);
    
    function handleLock(){
        
        setIsLock(!isLock);

        // prevent scrolling and activate listetning to user's clicks to move the circle if they keybind is matching
    }

    useEffect(() => {
        // Update body overflow based on isLock state
        document.body.style.overflow = isLock ? "hidden" : "auto";
    }, [isLock]);
    
    return (

        <div className="flex flex-col md:flex-row justify-around items-center h-[500px] mt-4 mx-auto mb-12 w-3/5">

        <Controller isLocked={isLock} motor="left" />

        {/* Triangle layout for icons */}
        <div className="flex flex-col items-center justify-center mt-8 md:mt-0">

            <div className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out cursor-pointer mb-6">
                {isLock ? (
                    <FontAwesomeIcon onClick={handleLock} icon={faLock} size="xl" />
                ) : (
                    <FontAwesomeIcon onClick={handleLock} icon={faUnlock} size="xl" />
                )}
            </div>

            <div className="flex">
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out cursor-pointer mr-4">
                    <FontAwesomeIcon icon={faCamera} size="xl" />
                </div>

                <div className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out cursor-pointer ml-4">
                    <FontAwesomeIcon onClick={handleSettingClick} icon={faGear} size="xl" />
                </div>

            </div>

        </div>

        <Controller isLocked={isLock} motor="right" />

        
    </div>
    );
};

export default ControlPanel;
