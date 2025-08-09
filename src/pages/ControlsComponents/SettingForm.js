import "../userForm.css"; 
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setKeybinds } from "../../store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faGamepad, faArrowUp, faArrowDown, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import {useGetKeybindsQuery, useUpdateKeybindsMutation} from "../../store/index";

export default function SettingForm({ handleSettingClick }) {
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [activeInput, setActiveInput] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const modalRef = useRef(null);

    const dispatch = useDispatch();
    
    const {data:currentKeybinds, isLoading, isError} = useGetKeybindsQuery();
    const [updateKeybinds, {
        data: updateResult,
        isLoading: isUpdating,
        isSuccess: updateSuccess,
        isError: updateError,
        error: updateErrorObj
    }] = useUpdateKeybindsMutation();

    // Handle successful updates
    useEffect(() => {
        if (updateSuccess) {
            setSuccessMessage(isResetting ? "Keybinds reset to default!" : "Keybinds updated successfully!");
            setTimeout(() => setSuccessMessage(''), 3000);
            setIsResetting(false);
        }
    }, [updateSuccess, isResetting]);

    // Handle update errors
    useEffect(() => {
        if (updateError) {
            const errorMsg = updateErrorObj?.data?.message || "Failed to update keybinds";
            setError(errorMsg);
            setTimeout(() => setError(''), 5000);
        }
    }, [updateError, updateErrorObj]);

    const username = useSelector((state) => state.user.username);

    const [newKeybind, setNewKeybind] = useState(null);

    // Show settings after component mounts
    useEffect(() => {
        const timer = setTimeout(() => setShowSettings(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (currentKeybinds && !isLoading) {
          setNewKeybind(currentKeybinds);
        }
      }, [currentKeybinds, isLoading]);    

    useEffect(() => {
        if(!activeInput) return;

        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();

            setNewKeybind(prev => ({
                ...prev,
                [activeInput]: key
            }));
            setActiveInput(null);
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);

    }, [activeInput]);

    const handleKeyPress = (e, keyType) => {
        e.preventDefault();
        const key = e.key.toLowerCase();
        
        // Prevent duplicate keys
        const allKeys = Object.values(newKeybind);
        if (allKeys.includes(key) && newKeybind[keyType] !== key) {
            setError('This key is already assigned to another control!');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setNewKeybind(prev => ({
            ...prev,
            [keyType]: key
        }));
        setActiveInput(null);
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
        if (typeof key !== 'string') return '';

        return keyMap[key.toLowerCase()] || key.toUpperCase();
    };

    async function handleFormSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
      
        try {
          await updateKeybinds({ username, keybinds: newKeybind }).unwrap();
          setTimeout(() => handleSettingClick(), 1500);
        } catch (err) {
          // Error is handled by useEffect above
        }
      }
      
      async function handleReset() {
        const defaultKeybinds = {
          leftMotorForward: "w",
          leftMotorBackward: "s",
          rightMotorForward: "i",
          rightMotorBackward: "k"
        };
      
        setIsResetting(true);
        try {
          await updateKeybinds({ username, keybinds: defaultKeybinds }).unwrap();
          // reflect them locally
          setNewKeybind(defaultKeybinds);
        } catch (err) {
          setIsResetting(false);
          // Error is handled by useEffect above
        }
      }
    const closeSettings = () => {
        setShowSettings(false);
        setTimeout(() => handleSettingClick(), 300);
    };

    const handleBackdropClick = (e) => {
        // Check if the click is outside the modal content
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            closeSettings();
        }
    };

    // Don't render until we have keybind data from backend
    if (!newKeybind || isLoading) {
        return (
            <>
                {/* Backdrop */}
                <div 
                    className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 z-40 ${
                        showSettings ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={handleBackdropClick}
                />

                {/* Loading Modal */}
                <div 
                    className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
                        showSettings ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                >
                    <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-8 max-w-md w-full mx-4">
                        <div className="flex items-center justify-center space-x-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <span className="text-lg font-semibold text-gray-700">
                                {isLoading ? "Loading your keybinds..." : "No keybinds found"}
                            </span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 z-40 ${
                    showSettings ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={handleBackdropClick}
            />

            {/* Settings Modal */}
            <div 
                className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
                    showSettings ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
            >
                <div 
                    ref={modalRef}
                    className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                >
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <FontAwesomeIcon icon={faGamepad} className="text-2xl text-indigo-500" />
                            <h1 className="text-3xl font-bold text-black-500">Drone Controls</h1>
                        </div>
                        <button
                            onClick={closeSettings}
                            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-white/20"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-xl" />
                        </button>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {successMessage}
                        </div>
                    )}

                    {/* Keybind Configuration */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Left Motor Controls */}
                            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <FontAwesomeIcon icon={faArrowUp} className="mr-2 text-green-500" />
                                    Left Motor
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-800 mb-2">
                                            Forward
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setActiveInput('leftMotorForward')}
                                            className={`w-full p-3 text-center rounded-lg border-2 transition-all ${
                                                activeInput === 'leftMotorForward'
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-300 bg-white/50 text-gray-700 hover:border-indigo-300'
                                            }`}
                                        >
                                            {activeInput === 'leftMotorForward' ? 'Press any key...' : getKeyDisplay(newKeybind.leftMotorForward)}
                                        </button>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-800 mb-2">
                                            Backward
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setActiveInput('leftMotorBackward')}
                                            className={`w-full p-3 text-center rounded-lg border-2 transition-all ${
                                                activeInput === 'leftMotorBackward'
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-300 bg-white/50 text-gray-700 hover:border-indigo-300'
                                            }`}
                                        >
                                            {activeInput === 'leftMotorBackward' ? 'Press any key...' : getKeyDisplay(newKeybind.leftMotorBackward)}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Motor Controls */}
                            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <FontAwesomeIcon icon={faArrowDown} className="mr-2 text-blue-500" />
                                    Right Motor
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-800 mb-2">
                                            Forward
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setActiveInput('rightMotorForward')}
                                            className={`w-full p-3 text-center rounded-lg border-2 transition-all ${
                                                activeInput === 'rightMotorForward'
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-300 bg-white/50 text-gray-700 hover:border-indigo-300'
                                            }`}
                                        >
                                            {activeInput === 'rightMotorForward' ? 'Press any key...' : getKeyDisplay(newKeybind.rightMotorForward)}
                                        </button>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-800 mb-2">
                                            Backward
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setActiveInput('rightMotorBackward')}
                                            className={`w-full p-3 text-center rounded-lg border-2 transition-all ${
                                                activeInput === 'rightMotorBackward'
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-300 bg-white/50 text-gray-700 hover:border-indigo-300'
                                            }`}
                                        >
                                            {activeInput === 'rightMotorBackward' ? 'Press any key...' : getKeyDisplay(newKeybind.rightMotorBackward)}
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
                                type="submit"
                                onClick={handleFormSubmit}
                                disabled={isUpdating}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FontAwesomeIcon icon={faSave} />
                                <span>{isUpdating ? "Saving..." : "Save Keybinds"}</span>
                            </button>
                            
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={isUpdating}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FontAwesomeIcon icon={faRotateLeft} />
                                <span>{isUpdating ? "Resetting..." : "Reset to Default"}</span>
                            </button>
                            
                            <button
                                type="button"
                                onClick={closeSettings}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    );
}


