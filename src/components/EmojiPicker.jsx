import { useState, useRef, useEffect } from 'react';
import { FaSmile } from 'react-icons/fa';
import EmojiPickerReact from 'emoji-picker-react';

function EmojiPicker({ onEmojiSelect }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  
  const togglePicker = () => {
    setShowPicker(!showPicker);
  };
  
  const handleEmojiClick = (emojiData) => {
    onEmojiSelect(emojiData.emoji);
    setShowPicker(false);
  };
  
  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={togglePicker}
        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 transition-colors"
        title="Insert emoji"
      >
        <FaSmile className="h-4 w-4" />
      </button>
      
      {showPicker && (
        <div className="absolute z-50 top-full right-0 mt-1">
          <EmojiPickerReact
            onEmojiClick={handleEmojiClick}
            searchDisabled={false}
            skinTonesDisabled
            width={300}
            height={400}
            previewConfig={{ showPreview: false }}
            theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
          />
        </div>
      )}
    </div>
  );
}

export default EmojiPicker;