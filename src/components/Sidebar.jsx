import { useState } from 'react'
import { useNotes } from '../contexts/NotesContext'
import { FaPlus, FaSearch, FaTrash, FaThumbtack, FaFolder } from 'react-icons/fa'
import { MdOutlineCategory } from 'react-icons/md'

function Sidebar() {
  const { 
    createNote, 
    getFilteredNotes, 
    getTrashedNotes,
    openNote, 
    togglePinNote,
    deleteNote,
    restoreNote,
    permanentlyDeleteNote,
    categories,
    searchQuery,
    setSearchQuery
  } = useNotes()
  
  const [activeTab, setActiveTab] = useState('notes') // 'notes', 'trash', 'categories'
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  const notes = getFilteredNotes()
  const trashedNotes = getTrashedNotes()
  
  const pinnedNotes = notes.filter(note => note.isPinned)
  const unpinnedNotes = notes.filter(note => !note.isPinned)
  
  const filteredNotes = selectedCategory 
    ? notes.filter(note => note.category === selectedCategory)
    : notes
  
  const handleCreateNote = () => {
    createNote()
  }
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }
  
  const handleNoteClick = (id) => {
    openNote(id)
  }
  
  const handlePinClick = (e, id) => {
    e.stopPropagation()
    togglePinNote(id)
  }
  
  const handleDeleteClick = (e, id) => {
    e.stopPropagation()
    deleteNote(id)
  }
  
  const handleRestoreClick = (e, id) => {
    e.stopPropagation()
    restoreNote(id)
  }
  
  const handlePermanentDeleteClick = (e, id) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to permanently delete this note?')) {
      permanentlyDeleteNote(id)
    }
  }
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category)
  }
  
  const renderNoteItem = (note, inTrash = false) => (
    <div 
      key={note.id}
      onClick={() => handleNoteClick(note.id)}
      className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded cursor-pointer group"
    >
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
  )
  
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
        </div>
        
        <button
          onClick={handleCreateNote}
          className="w-full flex items-center justify-center py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
        >
          <FaPlus className="mr-1.5" />
          New Note
        </button>
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
            
            {pinnedNotes.length > 0 && (
              <div className="mb-2">
                <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pinned
                </div>
                {pinnedNotes.map(note => renderNoteItem(note))}
              </div>
            )}
            
            {unpinnedNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Other Notes
                  </div>
                )}
                {unpinnedNotes.map(note => renderNoteItem(note))}
              </div>
            )}
            
            {notes.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No notes found
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'categories' && (
          <div className="p-2">
            {categories.map(category => (
              <div 
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`flex items-center p-2 rounded cursor-pointer ${selectedCategory === category ? 'bg-gray-200 dark:bg-dark-700' : 'hover:bg-gray-100 dark:hover:bg-dark-800'}`}
              >
                <FaFolder className="mr-2 text-gray-500 dark:text-gray-400" />
                <span>{category}</span>
                <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                  {notes.filter(note => note.category === category).length}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'trash' && (
          <div className="p-2">
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
  )
}

export default Sidebar