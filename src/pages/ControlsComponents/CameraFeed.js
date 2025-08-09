import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import testPic from "../../images/droneImage.png";
import axios from "axios";

const CameraFeed = forwardRef(function CameraFeed (_props, ref) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [useWebcam, setUseWebcam] = useState(true);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

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

    useEffect(() => {
        if (!useWebcam) return;
        const start = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Webcam error:", err);
            }
        };
        start();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(t => t.stop());
            }
        };
    }, [useWebcam]);

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

    const captureAndUpload = async () => {
        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas) return;
            canvas.width = video.videoWidth || 1280;
            canvas.height = video.videoHeight || 720;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));

            const form = new FormData();
            form.append('image', blob, `frame-${Date.now()}.jpg`);
            await axios.post('http://localhost:3002/images', form, { withCredentials: true });
            alert('Captured and uploaded!');
        } catch (err) {
            console.error('Upload error:', err);
            alert('Failed to upload');
        }
    };

    useImperativeHandle(ref, () => ({
        captureAndUpload
    }));

    return (
        <div 
            className={`relative ${isFullscreen || isTheaterMode ? 'w-full h-screen' : 'w-3/5 h-[700px] mx-auto mt-24'}`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            {useWebcam ? (
                <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${isFullscreen || isTheaterMode ? '' : 'rounded-lg shadow-md'}`} />
            ) : (
                <img src={testPic} alt="Camera Feed" className={`w-full h-full object-cover ${isFullscreen || isTheaterMode ? '' : 'rounded-lg shadow-md'}`} />
            )}
            <canvas ref={canvasRef} className="hidden" />
            {(showControls || isTheaterMode) && (
                <div className="absolute bottom-0 right-0 p-2 transition-opacity ease-in-out duration-150 opacity-100">
                    <div className="flex gap-2">
                        <button className="bg-white/20 text-white px-3 py-2 rounded" onClick={() => setUseWebcam(v => !v)}>
                            {useWebcam ? 'Use Placeholder' : 'Use Webcam'}
                        </button>
                        {useWebcam && (
                            <button className="bg-green-600 text-white px-3 py-2 rounded" onClick={captureAndUpload}>
                                Capture & Upload
                            </button>
                        )}
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
});

export default CameraFeed;
