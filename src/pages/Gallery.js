import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faShare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Navbar from "../components/Navbar";
import testImageUrl from "../images/test.jpg";
import './Gallery.css'; // Import the CSS for styles and animations

function Gallery () {

  
  const [likes, setLikes] = useState({});
  const [selectedImages, setSelectedImages] = useState({});

  // Function to toggle likes
  const toggleLike = (id, e) => {
    e.stopPropagation(); // Prevent image selection
    setLikes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Function to share an image
  const shareImage = (id, e) => {
    e.stopPropagation();
    console.log(`Shared image ${id}`);
    // Implement share functionality
  };

  // Function to delete an image
  const deleteImage = (id, e) => {
    e.stopPropagation();
    console.log(`Deleted image ${id}`);
    // Implement delete functionality
  };

  // Function to create random bubbles
  const createBubbles = () => {
    const bubbles = [];
    const bubbleCount = Math.floor(Math.random() * 15) + 5; // Random number of bubbles between 5 and 20

    for (let i = 0; i < bubbleCount; i++) {
      const size = Math.floor(Math.random() * 80) + 20; // Random size between 20px and 100px
      const left = Math.floor(Math.random() * 100); // Random horizontal position
      bubbles.push({ size, left });
    }

    return bubbles;
  };

  const bubbles = createBubbles();

  return (
    <>
      <Navbar />

      <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-900 dark:to-black min-h-screen overflow-hidden relative">
        {/* Bubble Background */}
        <div className="bubble-background">
          {bubbles.map((bubble, index) => (
            <div
              key={index}
              className="bubble"
              style={{
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                left: `${bubble.left}%`,
              }}
            ></div>
          ))}
        </div>

        {/* Profile header section */}
        <div
          className="h-40 flex items-end justify-center z-10"
          style={{ backgroundImage: `url(${testImageUrl})`, backgroundSize: 'cover' }}
        >
          <img
            src={testImageUrl}
            alt="Profile"
            className="rounded-full border-4 border-white h-24 w-24 -mb-12"
          />
        </div>

        {/* Increased spacing between profile header and gallery */}
        <div className="mt-20"></div>

        {/* Gallery of images */}
        <div className="container mx-auto px-4 pt-8 pb-8 z-10 mt-36">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14">
            {new Array(12).fill(null).map((_, index) => (
              <div key={index} className="relative group">
                <img
                  src={testImageUrl}
                  alt={`Gallery item ${index + 1}`}
                  className="w-full h-auto object-cover cursor-pointer rounded-lg shadow"
                />
                <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className={`mr-2 ${likes[index] ? 'text-blue-600' : 'text-gray-500'}`} onClick={(e) => toggleLike(index, e)}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </button>
                  <button className="text-gray-500 hover:text-black mr-2" onClick={(e) => shareImage(index, e)}>
                    <FontAwesomeIcon icon={faShare} />
                  </button>
                  <button className="text-gray-500 hover:text-black" onClick={(e) => deleteImage(index, e)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;
