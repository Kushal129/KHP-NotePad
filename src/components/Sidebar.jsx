import { useState, useRef } from 'react';
import { useNotes } from '../contexts/NotesContext';
import { 
  FaPlus, 
  FaSearch, 
  FaTrash, 
  FaThumbtack, 
  FaFolder,
  FaPencilAlt,
  FaDrawPolygon,
  FaEllipsisH,
  FaEdit,
  FaArchive,
  FaStar,
  FaTag,
  FaFilter
} from 'react-icons/fa';
import { MdOutlineCategory } from 'react-icons/md';

function Sidebar() {
  const { 
    createNote,
    createDrawing, 
    getFilteredNotes, 
    getTrashedNotes,
    openNote, 
    togglePinNote,
    deleteNote,
    restoreNote,
    permanentlyDeleteNote,
    categories,
    searchQuery,
    setSearchQuery,
    addCategory
  } = useNotes();
  
  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'trash', 'categories'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [sortBy, setSortBy] = useState('updated'); // 'updated', 'created', 'title'
  const [filterType, setFilterType] = useState('all'); // 'all', 'notes', 'drawings'
  
  const categoryInputRef = useRef(null);
  
  const notes = getFilteredNotes();
  const trashedNotes = getTrashedNotes();
  
  // Apply sorting
  const sortedNotes = [...notes].sort((a, b) => {
    if (sortBy === 'updated') {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    } else if (sortBy === 'created') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  
  // Apply filtering
  const filteredNotes = sortedNotes.filter(note => {
    if (filterType === 'all') return true;
    if (filterType === 'notes') return note.type === 'note';
    if (filterType === 'drawings') return note.type === 'drawing';
    return true;
  });
  
  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);
  
  const categoryFilteredNotes = selectedCategory 
    ? filteredNotes.filter(note => note.category === selectedCategory)
    : filteredNotes;
  
  const displayedNotes = selectedCategory ? categoryFilteredNotes : filteredNotes;
  const displayedPinnedNotes = displayedNotes.filter(note => note.isPinned);
  const displayedUnpinnedNotes = displayedNotes.filter(note => !note.isPinned);
  
  const handleCreateNote = () => {
    createNote();
    setShowNewMenu(false);
  };
  
  const handleCreateDrawing = () => {
    createDrawing();
    setShowNewMenu(false);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleNoteClick = (id) => {
    openNote(id);
  };
  
  const handlePinClick = (e, id) => {
    e.stopPropagation();
    togglePinNote(id);
  };
  
  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    deleteNote(id);
  };
  
  const handleRestoreClick = (e, id) => {
    e.stopPropagation();
    restoreNote(id);
  };
  
  const handlePermanentDeleteClick = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this note?')) {
      permanentlyDeleteNote(id);
    }
  };
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };
  
  const handleAddCategory = () => {
    setShowCategoryInput(true);
    setTimeout(() => {
      categoryInputRef.current?.focus();
    }, 0);
  };
  
  const handleCategoryInputKeyDown = (e) => {
    if (e.key === 'Enter' && newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowCategoryInput(false);
    } else if (e.key === 'Escape') {
      setShowCategoryInput(false);
      setNewCategoryName('');
    }
  };
  
  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    setShowFilterMenu(false);
  };
  
  const handleFilterTypeChange = (filterOption) => {
    setFilterType(filterOption);
    setShowFilterMenu(false);
  };
  
  const renderNoteItem = (note, inTrash = false) => (
    <div 
      key={note.id}
      onClick={() => handleNoteClick(note.id)}
      className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded cursor-pointer group transition-colors"
    >
      <div className="mr-2">
        {note.type === 'drawing' ? (
          <FaDrawPolygon className="h-4 w-4 text-purple-500 dark:text-purple-400" />
        ) : (
          <FaPencilAlt className="h-4 w-4 text-primary-500 dark:text-primary-400" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{note.title || 'Untitled Note'}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {new Date(note.updatedAt).toLocaleDateString()} · {note.category}
        </div>
      </div>
      
      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {inTrash ? (
          <>
            <button 
              onClick={(e) => handleRestoreClick(e, note.id)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              title="Restore"
            >
              <FaPlus className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={(e) => handlePermanentDeleteClick(e, note.id)}
              className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              title="Delete permanently"
            >
              <FaTrash className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={(e) => handlePinClick(e, note.id)}
              className={`p-1 ${note.isPinned ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              title={note.isPinned ? 'Unpin' : 'Pin'}
            >
              <FaThumbtack className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={(e) => handleDeleteClick(e, note.id)}
              className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              title="Move to trash"
            >
              <FaTrash className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
  
  return (
    <div className="h-full flex flex-col bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-700">
      {/* Search and create */}
      <div className="p-3 border-b border-gray-200 dark:border-dark-700">
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-100 dark:bg-dark-800 border-0 rounded-md focus:ring-1 focus:ring-primary-500"
          />
          <FaSearch className="absolute left-2.5 top-2.5 text-gray-400 dark:text-gray-500" />
          
          <div className="absolute right-2.5 top-2.5">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              title="Filter options"
            >
              <FaFilter className="h-4 w-4" />
            </button>
            
            {showFilterMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-800 rounded-md shadow-lg z-10 py-1 border border-gray-200 dark:border-dark-700">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-dark-700">
                  Sort By
                </div>
                <button
                  onClick={() => handleSortChange('updated')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
                >
                  Last Updated
                  {sortBy === 'updated' && <span className="ml-auto text-primary-500">✓</span>}
                </button>
                <button
                  onClick={() => handleSortChange('created')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
                >
                  Date Created
                  {sortBy === 'created' && <span className="ml-auto text-primary-500">✓</span>}
                </button>
                <button
                  onClick={() => handleSortChange('title')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
                >
                  Title
                  {sortBy === 'title' && <span className="ml-auto text-primary-500">✓</span>}
                </button>
                
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-t border-b border-gray-200 dark:border-dark-700 mt-1">
                  Filter Type
                </div>
                <button
                  onClick={() => handleFilterTypeChange('all')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
                >
                  All Items
                  {filterType === 'all' && <span className="ml-auto text-primary-500">✓</span>}
                </button>
                <button
                  onClick={() => handleFilterTypeChange('notes')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
                >
                  Notes Only
                  {filterType === 'notes' && <span className="ml-auto text-primary-500">✓</span>}
                </button>
                <button
                  onClick={() => handleFilterTypeChange('drawings')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
                >
                  Drawings Only
                  {filterType === 'drawings' && <span className="ml-auto text-primary-500">✓</span>}
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="w-full flex items-center justify-center py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
          >
            <FaPlus className="mr-1.5" />
            Create New
          </button>
          
          {showNewMenu && (
            <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-dark-800 rounded-md shadow-lg z-10 py-1 border border-gray-200 dark:border-dark-700">
              <button
                onClick={handleCreateNote}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
              >
                <FaPencilAlt className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
                New Note
              </button>
              <button
                onClick={handleCreateDrawing}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
              >
                <FaDrawPolygon className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                New Drawing
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-dark-700">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'notes' ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' : 'text-gray-500 dark:text-gray-400'}`}
        >
          Notes
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'categories' ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' : 'text-gray-500 dark:text-gray-400'}`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab('trash')}
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'trash' ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' : 'text-gray-500 dark:text-gray-400'}`}
        >
          Trash
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'notes' && (
          <div className="p-2">
            {selectedCategory && (
              <div className="mb-2 px-2 py-1 bg-gray-100 dark:bg-dark-800 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <MdOutlineCategory className="mr-1.5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">{selectedCategory}</span>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Clear
                </button>
              </div>
            )}
            
            {displayedPinnedNotes.length > 0 && (
              <div className="mb-2">
                <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
                  <FaStar className="h-3 w-3 mr-1 text-yellow-500" />
                  Pinned
                </div>
                {displayedPinnedNotes.map(note => renderNoteItem(note))}
              </div>
            )}
            
            {displayedUnpinnedNotes.length > 0 && (
              <div>
                {displayedPinnedNotes.length > 0 && (
                  <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Notes
                  </div>
                )}
                {displayedUnpinnedNotes.map(note => renderNoteItem(note))}
              </div>
            )}
            
            {displayedNotes.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="mb-2">No notes found</div>
                <button
                  onClick={handleCreateNote}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-md text-sm hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                >
                  Create a new note
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'categories' && (
          <div className="p-2">
            <div className="flex justify-between items-center px-2 py-1 mb-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Categories
              </div>
              <button
                onClick={handleAddCategory}
                className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                + Add
              </button>
            </div>
            
            {showCategoryInput && (
              <div className="px-2 mb-2">
                <input
                  ref={categoryInputRef}
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={handleCategoryInputKeyDown}
                  placeholder="New category name..."
                  className="w-full px-2 py-1 text-sm bg-gray-100 dark:bg-dark-800 border-0 rounded-md focus:ring-1 focus:ring-primary-500"
                  autoFocus
                />
                <div className="text-xs text-gray-500 mt-1">
                  Press Enter to save, Esc to cancel
                </div>
              </div>
            )}
            
            {categories.map(category => (
              <div 
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`flex items-center p-2 rounded cursor-pointer transition-colors ${selectedCategory === category ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'hover:bg-gray-100 dark:hover:bg-dark-800'}`}
              >
                <FaFolder className={`mr-2 ${selectedCategory === category ? 'text-primary-500 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                <span className="flex-1">{category}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {notes.filter(note => note.category === category).length}
                </span>
              </div>
            ))}
            
            {categories.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No categories found
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'trash' && (
          <div className="p-2">
            <div className="flex justify-between items-center px-2 py-1 mb-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
                <FaTrash className="h-3 w-3 mr-1" />
                Trash
              </div>
              {trashedNotes.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to permanently delete all items in the trash?')) {
                      trashedNotes.forEach(note => permanentlyDeleteNote(note.id));
                    }
                  }}
                  className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Empty Trash
                </button>
              )}
            </div>
            
            {trashedNotes.length > 0 ? (
              trashedNotes.map(note => renderNoteItem(note, true))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Trash is empty
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;