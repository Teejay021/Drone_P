import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import SettingForm from "./ControlsComponents/SettingForm";
import ControlPanel from "./ControlsComponents/ControlPanel";
import CameraFeed from "./ControlsComponents/CameraFeed";
import "./homePage.css";
import { useSelector } from 'react-redux';

function Control() {
    const [openSetting, setOpenSetting] = useState(false);
    const isDarkMode = useSelector((state) => state.nightToggle);

    function handleSettingClick() {
        setOpenSetting(!openSetting);
    }

    return (
        <>
            <Navbar />
            <div className={`relative ${isDarkMode ? 'home-container-dark' : 'home-container-light'}`}>
                <CameraFeed />
                <ControlPanel handleSettingClick={handleSettingClick} />
                {openSetting && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">

                        
                        <SettingForm handleSettingClick={handleSettingClick
                        } />
                    </div>
                )}
            </div>
        </>
    );
}

export default Control;
