import { useNotes } from '../contexts/NotesContext';
import { FaTimes, FaPencilAlt, FaDrawPolygon } from 'react-icons/fa';

function TabBar() {
  const { 
    getOpenNotes, 
    activeNoteId, 
    openNote, 
    closeNote,
    activeTab,
    setActiveTab
  } = useNotes();
  
  const openNotes = getOpenNotes();
  
  const handleTabClick = (id) => {
    openNote(id);
  };
  
  const handleCloseTab = (e, id) => {
    e.stopPropagation();
    closeNote(id);
  };
  
  const handleTabChange = (note, tab) => {
    if (note.id === activeNoteId) {
      setActiveTab(tab);
    }
  };
  
  if (openNotes.length === 0) {
    return null;
  }
  
  return (
    <div className="flex overflow-x-auto bg-gray-100 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
      {openNotes.map((note) => (
        <div 
          key={note.id}
          className={`flex items-center min-w-0 ${note.id === activeNoteId ? 'bg-white dark:bg-dark-900' : 'bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700'}`}
        >
          <div
            onClick={() => handleTabClick(note.id)}
            className="flex items-center px-3 py-2 cursor-pointer"
          >
            <span className="truncate max-w-[150px]">{note.title || 'Untitled'}</span>
          </div>
          
          {note.id === activeNoteId && note.type !== 'drawing' && (
            <div className="flex border-r border-gray-200 dark:border-dark-700">
              <button
                onClick={() => handleTabChange(note, 'editor')}
                className={`px-2 py-1 ${activeTab === 'editor' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'hover:bg-gray-200 dark:hover:bg-dark-700'}`}
                title="Text editor"
              >
                <FaPencilAlt className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleTabChange(note, 'drawing')}
                className={`px-2 py-1 ${activeTab === 'drawing' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'hover:bg-gray-200 dark:hover:bg-dark-700'}`}
                title="Drawing canvas"
              >
                <FaDrawPolygon className="h-3 w-3" />
              </button>
            </div>
          )}
          
          <button
            onClick={(e) => handleCloseTab(e, note.id)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-full mx-1"
            title="Close tab"
          >
            <FaTimes className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default TabBar;