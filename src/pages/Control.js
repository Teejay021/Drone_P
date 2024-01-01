import Navbar from "../components/Navbar";
import SettingForm from "./ControlsComponents/SettingForm";
import ControlPanel from "./ControlsComponents/ControlPanel";
import CameraFeed from "./ControlsComponents/CameraFeed";
import "./homePage.css";
import { useSelector } from 'react-redux';
import { useState } from "react";





function Control (){

    const [openSetting,setOpenSetting] = useState(false);

    //The function gets called through ControlPanel by clicking on the setting Icon 

    function handleSettingClick(){

        setOpenSetting(!openSetting);
    }

    const isDarkMode = useSelector((state) => state.nightToggle);

    return(

        <>

            <Navbar />

            <div className= {isDarkMode ? "home-container-dark":"home-container-light"}>

                
                <CameraFeed />
                <ControlPanel handleSettingClick={ handleSettingClick} />

                {openSetting && <SettingForm />}

            </div>

            




        </>


    )

}

export default Control;