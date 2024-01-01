import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import defaultUpArrow from '../../images/upArrow.png';
import activeUpArrow from '../../images/white-upArrow.png'; 
import defaultDownArrow from '../../images/downArrow.png';
import activeDownArrow from '../../images/white-downArrow.png';

function Controller({ isLocked, motor }) {
    const [position, setPosition] = useState('default');
    const keybind = useSelector((state) => state.keybind);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isLocked) {
                const forwardKey = motor === 'left' ? keybind.leftMotorForward : keybind.rightMotorForward;
                const backwardKey = motor === 'left' ? keybind.leftMotorBackward : keybind.rightMotorBackward;

                if (event.key.toLowerCase() === forwardKey.toLowerCase()) {
                    setPosition('up');
                } else if (event.key.toLowerCase() === backwardKey.toLowerCase()) {
                    setPosition('down');
                }
            }
        };

        const handleKeyUp = (event) => {
            if (!isLocked) {
                setPosition('default');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isLocked, keybind, motor]);

    const circleClass = () => {
        switch (position) {
            case 'up':
                return 'translate-y-[-90%]';
            case 'down':
                return 'translate-y-[90%]';
            default:
                return 'translate-y-0';
        }
    };

    const upArrow = position === 'up' ? activeUpArrow : defaultUpArrow;
    const downArrow = position === 'down' ? activeDownArrow : defaultDownArrow;

    return (
        <div className="relative flex justify-center items-center w-[180px] h-[180px] md:w-[120px] md:h-[120px] rounded-full bg-gradient-to-l from-black to-gray-900 mb-4 md:mb-0">
            <div className="absolute w-[115px] h-[115px] md:w-[75px] md:h-[75px] rounded-full bg-gradient-to-l from-gray-700 to-gray-800"></div>
            <div className="absolute w-[60px] h-[60px] md:w-[40px] md:h-[40px] rounded-full bg-gray-400"></div>
            <div className={`absolute w-[45px] h-[45px] md:w-[30px] md:h-[30px] rounded-full bg-gray-300 transition-transform duration-150 ease-in-out ${circleClass()}`}></div>
            <img src={upArrow} alt="Up Arrow" className="absolute top-3 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            <img src={downArrow} alt="Down Arrow" className="absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-1/2" />
        </div>
    );
}

export default Controller;
