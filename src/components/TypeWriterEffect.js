import React from 'react';
import { Typewriter } from 'react-simple-typewriter';

function TypewriterEffect () {
  return (
    <div className="pt-12 mx-auto text-center text-black dark:text-white text-5xl">
      <Typewriter
        words={['Exploring New Heights', 'Innovation Takes Flight', 'Elevate Your Perspective']}
        loop
        cursor
        cursorStyle='|'
        typeSpeed={70}
        deleteSpeed={50}
        delaySpeed={1000}
        className="text-black dark:text-white"
      />
    </div>
  );
};

export default TypewriterEffect;
