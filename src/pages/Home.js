import React, { useEffect, useRef, useState } from 'react';
import Navbar from "../components/Navbar";
import TypeWriterEffect from "../components/TypeWriterEffect";
import droneImage from "../images/droneImage.png";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "./homePage.css";
import { useSelector } from 'react-redux';


function Home() {

    const isDarkMode = useSelector((state) => state.nightToggle);

    useEffect(() => {
        AOS.init();
        AOS.refresh();
        
      }, []);
    
      
    return (
        <>
            <Navbar />
            <div className= {isDarkMode ? "home-container-dark":"home-container-light"}>


                <div className="container mx-auto px-4 py-12">
                    <TypeWriterEffect />
                    {/* Drone Image with AOS Effect */}
                    <div className="my-10 text-center" data-aos="fade-up">
                        <img src={droneImage} alt="Drone" className="mx-auto" />
                    </div>

                </div>
                <div className="container mx-auto px-4 py-12">

                    {/* Grid Layout */}

                    <div className="grid grid-cols-3 gap-x-8 mt-24">

                        {/* Left Column Items */}
                        
                        <div>
                            <div data-aos="fade-right" className="p-4 bg-white shadow-lg mb-52">
                                <p>Content 1</p>
                            </div>
                            <div data-aos="fade-right" className="p-4 bg-white shadow-lg mt-72">
                                <p>Content 3</p>
                            </div>
                        </div>

                        {/* Right Column Items */}

                        <div className="col-start-3">

                            <div data-aos="fade-left" className="p-4 bg-white shadow-lg mb-72 mt-52">
                                <p>Content 2</p>
                            </div>
                            <div data-aos="fade-left" className="p-4 bg-white shadow-lg">
                                <p>Content 4</p>
                            </div>
                            <div data-aos="fade-left" className="p-4 bg-white shadow-lg mt-52">
                                <p>Content 5</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </>
    );
    
    
}

export default Home;
