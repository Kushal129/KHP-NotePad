import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import localforage from 'localforage'

const NotesContext = createContext()

export function useNotes() {
  return useContext(NotesContext)
}

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([])
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [openNoteIds, setOpenNoteIds] = useState([])
  const [categories, setCategories] = useState(['Personal', 'Work', 'Ideas'])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [lastSaved, setLastSaved] = useState(null)

  // Initialize notes from local storage
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const savedNotes = await localforage.getItem('notes')
        const savedOpenNotes = await localforage.getItem('openNoteIds')
        const savedActiveNote = await localforage.getItem('activeNoteId')
        const savedCategories = await localforage.getItem('categories')
        
        if (savedNotes) setNotes(savedNotes)
        if (savedOpenNotes) setOpenNoteIds(savedOpenNotes)
        if (savedActiveNote) setActiveNoteId(savedActiveNote)
        if (savedCategories) setCategories(savedCategories)
        
        // If no notes exist, create a welcome note
        if (!savedNotes || savedNotes.length === 0) {
          const welcomeNote = createWelcomeNote()
          setNotes([welcomeNote])
          setOpenNoteIds([welcomeNote.id])
          setActiveNoteId(welcomeNote.id)
        }
      } catch (error) {
        console.error('Error loading notes:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadNotes()
  }, [])

  // Save notes to local storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localforage.setItem('notes', notes)
      localforage.setItem('openNoteIds', openNoteIds)
      localforage.setItem('activeNoteId', activeNoteId)
      localforage.setItem('categories', categories)
      
      if (notes.length > 0) {
        setLastSaved(new Date())
      }
    }
  }, [notes, openNoteIds, activeNoteId, categories, isLoading])

  const createWelcomeNote = () => {
    return {
      id: uuidv4(),
      title: 'Welcome to ',
      content: `# Welcome to Your Next-Level ! 🚀

## Features

- **Real-time editing** with autosave
- **Markdown support** for rich text formatting
- **Dark mode & themes** for comfortable writing 🌙
- **Drag & drop** file upload
- **Keyboard shortcuts** for efficiency ⌨️
- **Local storage** for seamless access
- **Multi-tab notes** for better organization
- **Pin, search & categorize** notes 📌
- **Export** to PDF, TXT, and Markdown
- **Offline mode** support

## Keyboard Shortcuts

- **Ctrl/Cmd + B**: Toggle sidebar
- **Ctrl/Cmd + /**: Show all shortcuts
- **Ctrl/Cmd + S**: Save note
- **Ctrl/Cmd + N**: New note
- **Ctrl/Cmd + F**: Search notes

## Markdown Tips

You can use Markdown to format your notes:

### Text Formatting

*Italic text* or _italic text_
**Bold text** or __bold text__
~~Strikethrough text~~

### Lists

Unordered list:
- Item 1
- Item 2
  - Nested item

Ordered list:
1. First item
2. Second item

### Code

Inline code: \`const example = "code"\`

Code block:
\`\`\`javascript
function hello() {
  console.log("Hello world!");
}
\`\`\`

### Links and Images

[Link text](https://example.com)
![Alt text](image-url)

Enjoy writing! ✍️`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Personal',
      isPinned: false,
      isTrashed: false,
    }
  }

  const createNote = useCallback(() => {
    const newNote = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Personal',
      isPinned: false,
      isTrashed: false,
    }
    
    setNotes(prevNotes => [...prevNotes, newNote])
    setOpenNoteIds(prevIds => [...prevIds, newNote.id])
    setActiveNoteId(newNote.id)
    
    return newNote
  }, [])

  const getActiveNote = useCallback(() => {
    return notes.find(note => note.id === activeNoteId) || null
  }, [notes, activeNoteId])

  const updateNote = useCallback((id, updates) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id 
          ? { 
              ...note, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } 
          : note
      )
    )
  }, [])

  const deleteNote = useCallback((id) => {
    // Soft delete - move to trash
    updateNote(id, { isTrashed: true })
    
    // Remove from open tabs if it's open
    if (openNoteIds.includes(id)) {
      closeNote(id)
    }
  }, [openNoteIds, updateNote])

  const permanentlyDeleteNote = useCallback((id) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id))
    
    // Remove from open tabs if it's open
    if (openNoteIds.includes(id)) {
      closeNote(id)
    }
  }, [openNoteIds])

  const restoreNote = useCallback((id) => {
    updateNote(id, { isTrashed: false })
  }, [updateNote])

  const togglePinNote = useCallback((id) => {
    const note = notes.find(note => note.id === id)
    if (note) {
      updateNote(id, { isPinned: !note.isPinned })
    }
  }, [notes, updateNote])

  const openNote = useCallback((id) => {
    if (!openNoteIds.includes(id)) {
      setOpenNoteIds(prevIds => [...prevIds, id])
    }
    setActiveNoteId(id)
  }, [openNoteIds])

  const closeNote = useCallback((id) => {
    setOpenNoteIds(prevIds => prevIds.filter(noteId => noteId !== id))
    
    // If we're closing the active note, activate another open note if available
    if (activeNoteId === id) {
      const remainingIds = openNoteIds.filter(noteId => noteId !== id)
      if (remainingIds.length > 0) {
        setActiveNoteId(remainingIds[remainingIds.length - 1])
      } else {
        setActiveNoteId(null)
      }
    }
  }, [activeNoteId, openNoteIds])

  const addCategory = useCallback((category) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category])
    }
  }, [categories])

  const removeCategory = useCallback((category) => {
    // Don't remove if notes are using this category
    const isInUse = notes.some(note => note.category === category)
    if (!isInUse) {
      setCategories(prev => prev.filter(c => c !== category))
    }
    return !isInUse
  }, [notes, categories])

  const getOpenNotes = useCallback(() => {
    return openNoteIds
      .map(id => notes.find(note => note.id === id))
      .filter(Boolean)
  }, [notes, openNoteIds])

  const getFilteredNotes = useCallback(() => {
    if (!searchQuery) {
      return notes.filter(note => !note.isTrashed)
    }
    
    const query = searchQuery.toLowerCase()
    return notes.filter(note => 
      !note.isTrashed && 
      (note.title.toLowerCase().includes(query) || 
       note.content.toLowerCase().includes(query))
    )
  }, [notes, searchQuery])

  const getTrashedNotes = useCallback(() => {
    return notes.filter(note => note.isTrashed)
  }, [notes])

  const value = {
    notes,
    activeNoteId,
    openNoteIds,
    categories,
    isLoading,
    searchQuery,
    lastSaved,
    setSearchQuery,
    createNote,
    getActiveNote,
    updateNote,
    deleteNote,
    permanentlyDeleteNote,
    restoreNote,
    togglePinNote,
    openNote,
    closeNote,
    addCategory,
    removeCategory,
    getOpenNotes,
    getFilteredNotes,
    getTrashedNotes
  }

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  )
}