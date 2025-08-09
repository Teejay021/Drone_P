import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setKeybinds } from '../store/slices/keybindSlice';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faGamepad, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function Setting() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const currentKeybinds = useSelector((state) => state.keybind);

  const [keybinds, setKeybindsLocal] = useState({
    leftMotorForward: currentKeybinds.leftMotorForward,
    leftMotorBackward: currentKeybinds.leftMotorBackward,
    rightMotorForward: currentKeybinds.rightMotorForward,
    rightMotorBackward: currentKeybinds.rightMotorBackward
  });

  const [activeInput, setActiveInput] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: { pathname: '/setting' } } });
    }
  }, [isLoggedIn, navigate]);

  // Show settings after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setShowSettings(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyPress = (e, keyType) => {
    e.preventDefault();
    const key = e.key.toLowerCase();
    
    // Prevent duplicate keys
    const allKeys = Object.values(keybinds);
    if (allKeys.includes(key) && keybinds[keyType] !== key) {
      setMessage({ text: 'This key is already assigned to another control!', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }

    setKeybindsLocal(prev => ({
      ...prev,
      [keyType]: key
    }));
    setActiveInput(null);
  };

  const handleSave = () => {
    dispatch(setKeybinds(keybinds));
    setMessage({ text: 'Keybinds saved successfully!', type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleReset = () => {
    const defaultKeybinds = {
      leftMotorForward: "w",
      leftMotorBackward: "s",
      rightMotorForward: "i",
      rightMotorBackward: "k"
    };
    setKeybindsLocal(defaultKeybinds);
    setMessage({ text: 'Keybinds reset to default!', type: 'info' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const closeSettings = () => {
    setShowSettings(false);
    setTimeout(() => navigate(-1), 300);
  };

  const getKeyDisplay = (key) => {
    const keyMap = {
      ' ': 'Space',
      'arrowup': '↑',
      'arrowdown': '↓',
      'arrowleft': '←',
      'arrowright': '→',
      'enter': 'Enter',
      'shift': 'Shift',
      'ctrl': 'Ctrl',
      'alt': 'Alt',
      'tab': 'Tab',
      'escape': 'Esc'
    };
    return keyMap[key] || key.toUpperCase();
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Navbar />
      
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          showSettings ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeSettings}
      />

      {/* Settings Modal */}
      <div 
        className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
          showSettings ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faGamepad} className="text-2xl text-indigo-500" />
              <h1 className="text-3xl font-bold text-gray-800">Drone Controls</h1>
            </div>
            <button
              onClick={closeSettings}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-white/20"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' :
              message.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' :
              'bg-blue-100 border border-blue-400 text-blue-700'
            }`}>
              {message.text}
            </div>
          )}

          {/* Keybind Configuration */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Motor Controls */}
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faArrowUp} className="mr-2 text-green-500" />
                  Left Motor
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Forward
                    </label>
                    <button
                      onClick={() => setActiveInput('leftMotorForward')}
                      className={`w-full p-3 text-center rounded-lg border-2 transition-all ${
                        activeInput === 'leftMotorForward'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 bg-white/50 text-gray-700 hover:border-indigo-300'
                      }`}
                    >
                      {activeInput === 'leftMotorForward' ? 'Press any key...' : getKeyDisplay(keybinds.leftMotorForward)}
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Backward
                    </label>
                    <button
                      onClick={() => setActiveInput('leftMotorBackward')}
                      className={`w-full p-3 text-center rounded-lg border-2 transition-all ${
                        activeInput === 'leftMotorBackward'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 bg-white/50 text-gray-700 hover:border-indigo-300'
                      }`}
                    >
                      {activeInput === 'leftMotorBackward' ? 'Press any key...' : getKeyDisplay(keybinds.leftMotorBackward)}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Motor Controls */}
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faArrowDown} className="mr-2 text-blue-500" />
                  Right Motor
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Forward
                    </label>
                    <button
                      onClick={() => setActiveInput('rightMotorForward')}
                      className={`w-full p-3 text-center rounded-lg border-2 transition-all ${
                        activeInput === 'rightMotorForward'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 bg-white/50 text-gray-700 hover:border-indigo-300'
                      }`}
                    >
                      {activeInput === 'rightMotorForward' ? 'Press any key...' : getKeyDisplay(keybinds.rightMotorForward)}
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Backward
                    </label>
                    <button
                      onClick={() => setActiveInput('rightMotorBackward')}
                      className={`w-full p-3 text-center rounded-lg border-2 transition-all ${
                        activeInput === 'rightMotorBackward'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 bg-white/50 text-gray-700 hover:border-indigo-300'
                      }`}
                    >
                      {activeInput === 'rightMotorBackward' ? 'Press any key...' : getKeyDisplay(keybinds.rightMotorBackward)}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50/50 backdrop-blur-sm rounded-xl p-4 border border-blue-200/30">
              <h4 className="font-semibold text-blue-800 mb-2">How to configure:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Click on any control button to set a new key</li>
                <li>• Press any key on your keyboard to assign it</li>
                <li>• Each key can only be assigned to one control</li>
                <li>• Use arrow keys, letters, numbers, or special keys</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <FontAwesomeIcon icon={faSave} />
                <span>Save Keybinds</span>
              </button>
              
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Reset to Default
              </button>
              
              <button
                onClick={closeSettings}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Key Listener */}
      {activeInput && (
        <div
          className="fixed inset-0 z-60"
          onKeyDown={(e) => handleKeyPress(e, activeInput)}
          tabIndex={-1}
          autoFocus
        />
      )}
    </>
  );
}





