import React, { useState, useEffect } from 'react';
import testPic from "../../images/droneImage.png";

function CameraFeed () {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [showControls, setShowControls] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setIsFullscreen(false);
                setShowControls(false); // Hide controls when exiting fullscreen
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
            setShowControls(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    const toggleTheaterMode = () => {
        setIsTheaterMode(!isTheaterMode);
        setShowControls(true);
    };

    return (
        <div 
            className={`relative ${isFullscreen || isTheaterMode ? 'w-full h-screen' : 'w-3/5 h-[700px] mx-auto mt-24'}`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <img src={testPic} alt="Camera Feed" className={`w-full h-full object-cover ${isFullscreen || isTheaterMode ? '' : 'rounded-lg shadow-md'}`} />
            {(showControls || isTheaterMode) && (
                <div className="absolute bottom-0 right-0 p-2 transition-opacity ease-in-out duration-150 opacity-100">
                    <div className="flex gap-2">
                        <button className="bg-transparent border-none text-white h-11 w-11 text-xl" onClick={toggleTheaterMode}>
                            {/* SVG for Theater Mode Toggle */}
                            {isTheaterMode ? (
                                // SVG for theater mode active
                                <svg className="wide" viewBox="0 0 24 24">
                                    
                                    <path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"/>
                                </svg>
                            ) : (
                                // SVG for theater mode inactive
                                <svg className="tall" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"/>
                                </svg>
                            )}
                        </button>
                        <button className="bg-transparent border-none text-white h-11 w-11 text-xl" onClick={toggleFullscreen}>
                            {/* SVG for Fullscreen Toggle */}
                            {isFullscreen ? (
                                <svg className="close" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                                </svg>
                            ) : (
                                <svg className="open" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraFeed;
