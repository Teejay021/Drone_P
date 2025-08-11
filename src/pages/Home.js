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
    const timelineRef = useRef(null);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
        AOS.refresh();
    }, []);

    // Custom scroll animation for timeline
    useEffect(() => {
        const handleScroll = () => {
            const timelineItems = document.querySelectorAll('.timeline-item');
            const triggerBottom = window.innerHeight * 0.8;

            timelineItems.forEach((item) => {
                const itemTop = item.getBoundingClientRect().top;
                
                if (itemTop < triggerBottom) {
                    item.classList.add('show');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check on initial load

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Navbar />
            <div className={isDarkMode ? "home-container-dark" : "home-container-light"}>
                {/* Hero Section */}
                <div className="container mx-auto px-4 py-12">
                    <TypeWriterEffect />
                    {/* Drone Image with AOS Effect */}
                    <div className="my-10 text-center" data-aos="fade-up">
                        <img src={droneImage} alt="Drone" className="mx-auto" />
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="timeline-container" ref={timelineRef}>
                    <div className="timeline-header" data-aos="fade-up">
                        <h2 className={`text-4xl font-bold text-center mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Your Drone Journey
                        </h2>
                        <p className={`text-lg text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Scroll to explore each milestone in your drone adventure
                        </p>
                    </div>

                    <div className="timeline">
                        {/* Timeline Item 1 */}
                        <div className="timeline-item left" data-aos="fade-right">
                            <div className={`timeline-content ${isDarkMode ? 'timeline-content-dark' : 'timeline-content-light'}`}>
                                <div className="timeline-icon">
                                    <i className="fas fa-rocket"></i>
                                </div>
                                <h3 className="timeline-title">Project Initiation</h3>
                                <p className="timeline-description">
                                    Started the journey to build an innovative drone control system with modern web technologies
                                </p>
                                <div className="timeline-date">2024</div>
                            </div>
                        </div>

                        {/* Timeline Item 2 */}
                        <div className="timeline-item right" data-aos="fade-left">
                            <div className={`timeline-content ${isDarkMode ? 'timeline-content-dark' : 'timeline-content-light'}`}>
                                <div className="timeline-icon">
                                    <i className="fas fa-code"></i>
                                </div>
                                <h3 className="timeline-title">Frontend Development</h3>
                                <p className="timeline-description">
                                    Built responsive React components with Redux state management and Tailwind CSS styling
                                </p>
                                <div className="timeline-date">2024</div>
                            </div>
                        </div>

                        {/* Timeline Item 3 */}
                        <div className="timeline-item left" data-aos="fade-right">
                            <div className={`timeline-content ${isDarkMode ? 'timeline-content-dark' : 'timeline-content-light'}`}>
                                <div className="timeline-icon">
                                    <i className="fas fa-server"></i>
                                </div>
                                <h3 className="timeline-title">Backend Integration</h3>
                                <p className="timeline-description">
                                    Implemented Node.js server with MongoDB, AWS S3 integration, and session-based authentication
                                </p>
                                <div className="timeline-date">2024</div>
                            </div>
                        </div>

                        {/* Timeline Item 4 */}
                        <div className="timeline-item right" data-aos="fade-left">
                            <div className={`timeline-content ${isDarkMode ? 'timeline-content-dark' : 'timeline-content-light'}`}>
                                <div className="timeline-icon">
                                    <i className="fas fa-camera"></i>
                                </div>
                                <h3 className="timeline-title">Camera & Gallery</h3>
                                <p className="timeline-description">
                                    Added webcam capture functionality with image storage, favoriting, and filtering capabilities
                                </p>
                                <div className="timeline-date">2024</div>
                            </div>
                        </div>

                        {/* Timeline Item 5 */}
                        <div className="timeline-item left" data-aos="fade-right">
                            <div className={`timeline-content ${isDarkMode ? 'timeline-content-dark' : 'timeline-content-light'}`}>
                                <div className="timeline-icon">
                                    <i className="fas fa-gamepad"></i>
                                </div>
                                <h3 className="timeline-title">Custom Keybinds</h3>
                                <p className="timeline-description">
                                    Implemented personalized control mapping system for intuitive drone operation
                                </p>
                                <div className="timeline-date">2024</div>
                            </div>
                        </div>

                        {/* Timeline Item 6 */}
                        <div className="timeline-item right" data-aos="fade-left">
                            <div className={`timeline-content ${isDarkMode ? 'timeline-content-dark' : 'timeline-content-light'}`}>
                                <div className="timeline-icon">
                                    <i className="fas fa-moon"></i>
                                </div>
                                <h3 className="timeline-title">Dark Mode & UI</h3>
                                <p className="timeline-description">
                                    Enhanced user experience with modern design, dark mode support, and responsive layouts
                                </p>
                                <div className="timeline-date">2024</div>
                            </div>
                        </div>

                        {/* Timeline Item 7 */}
                        <div className="timeline-item left" data-aos="fade-right">
                            <div className={`timeline-content ${isDarkMode ? 'timeline-content-dark' : 'timeline-content-light'}`}>
                                <div className="timeline-icon">
                                    <i className="fas fa-cloud"></i>
                                </div>
                                <h3 className="timeline-title">Cloud Integration</h3>
                                <p className="timeline-description">
                                    Connected to AWS S3 for scalable image storage and cloud-based data management
                                </p>
                                <div className="timeline-date">2024</div>
                            </div>
                        </div>

                        {/* Timeline Item 8 */}
                        <div className="timeline-item right" data-aos="fade-left">
                            <div className={`timeline-content ${isDarkMode ? 'timeline-content-dark' : 'timeline-content-light'}`}>
                                <div className="timeline-icon">
                                    <i className="fas fa-rocket"></i>
                                </div>
                                <h3 className="timeline-title">Future Deployment</h3>
                                <p className="timeline-description">
                                    Preparing for real-world drone integration and advanced control features
                                </p>
                                <div className="timeline-date">2025</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
