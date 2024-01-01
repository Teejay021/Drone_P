import { useDispatch, useSelector } from 'react-redux';
import { nightMode } from '../store';
import { useEffect } from 'react';

function DarkModeToggle() {

  const dispatch = useDispatch();

  const isDarkMode = useSelector((state) => state.nightToggle);

  useEffect(() => {
    // Updating the class on the html element
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);


  const handleToggle = () => {
    dispatch(nightMode()); // Dispatch the action to toggle night mode
  };

  // Adjusted toggle indicator style
  const toggleIndicatorStyle = {
    content: '""',
    position: 'absolute',
    transition: '0.3s',
    width: '24px',  // Size of the circle
    height: '24px',  // Size of the circle
    top: '3px',  // Centering vertically
    left: isDarkMode ? 'calc(100% - 27px)' : '3px', // Moves right when dark mode is on
    background: isDarkMode ? 'linear-gradient(180deg, #777, #3a3a3a)' : 'linear-gradient(180deg, #ffcc89, #d8860b)',
    borderRadius: '50%', // Fully rounded
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  };

  return (
    <>
      <input 
        type="checkbox" 
        id="darkmode-toggle" 
        className="w-0 h-0 invisible" 
        checked={isDarkMode}
        onChange={handleToggle}
      />
      <label 
        htmlFor="darkmode-toggle" 
        className="inline-block cursor-pointer relative transition duration-300"
        style={{
          width: '50px', // Width of the toggle
          height: '30px', // Height of the toggle
          background: isDarkMode ? '#242424' : '#ebebeb',
          boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.4), inset 0px -2px 4px rgba(255, 255, 255, 0.4)',
          borderRadius: '30px',
        }}
      >
        <span className="absolute block" style={toggleIndicatorStyle}></span>
      </label>
    </>
  );
}

export default DarkModeToggle;
