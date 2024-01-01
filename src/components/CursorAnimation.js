import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './CursorAnimation.css';

const CursorAnimation = () => {
  const [circles, setCircles] = useState(Array(20).fill({ x: 0, y: 0, scale: 0, opacity: 1 }));
  const isDarkMode = useSelector((state) => state.nightToggle);
  const navbarHeight = 60; // Adjust based on your navbar's actual height

  useEffect(() => {
    const handleMouseMove = (e) => {
      const isOverNavbar = e.clientY <= navbarHeight;
      const opacity = isOverNavbar ? 0 : 1; // Fully transparent over navbar

      setCircles(currentCircles => {
        return currentCircles.map((circle, index, arr) => {
          const nextCircle = index === 0 ? { ...circle, x: e.clientX, y: e.clientY } : arr[index - 1];
          return { 
            ...nextCircle,
            scale: (arr.length - index) / arr.length,
            opacity: opacity
          };
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {circles.map((circle, index) => (
        <div
          key={index}
          className="circle"
          style={{
            left: `${circle.x - 12}px`,
            top: `${circle.y - 12}px`,
            backgroundColor: isDarkMode ? 'white' : 'black',
            transform: `scale(${circle.scale})`,
            opacity: circle.opacity
          }}
        />
      ))}
    </>
  );
};

export default CursorAnimation;
