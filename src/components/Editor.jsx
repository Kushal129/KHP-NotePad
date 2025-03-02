import { useState, useEffect, useRef, useCallback } from 'react'
import { useNotes } from '../contexts/NotesContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FaMarkdown, FaEye } from 'react-icons/fa'
import FileDropZone from './FileDropZone'
import EmojiPicker from './EmojiPicker'

const AUTOSAVE_DELAY = 1000 // 1 second

function Editor() {
  const { 
    getActiveNote, 
    updateNote, 
    activeNoteId 
  } = useNotes()
  
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [viewMode, setViewMode] = useState('edit') // 'edit', 'preview', 'split'
  const [isDropActive, setIsDropActive] = useState(false)
  const textareaRef = useRef(null)
  const autosaveTimerRef = useRef(null)
  
  const activeNote = getActiveNote()

  // Load note content when active note changes
  useEffect(() => {
    if (activeNote) {
      setContent(activeNote.content)
      setTitle(activeNote.title)
    } else {
      setContent('')
      setTitle('')
    }
  }, [activeNote])

  // Autosave functionality
  const saveChanges = useCallback(() => {
    if (activeNoteId) {
      updateNote(activeNoteId, { 
        content, 
        title 
      })
    }
  }, [activeNoteId, content, title, updateNote])

  // Set up autosave
  useEffect(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current)
    }
    
    if (activeNoteId) {
      autosaveTimerRef.current = setTimeout(saveChanges, AUTOSAVE_DELAY)
    }
    
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }
    }
  }, [content, title, activeNoteId, saveChanges])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveChanges()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [saveChanges])

  // Handle content change
  const handleContentChange = (e) => {
    setContent(e.target.value)
  }

  // Handle title change
  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }

  // Toggle view mode
  const toggleViewMode = (mode) => {
    setViewMode(mode)
  }

  // Handle file drop
  const handleFileDrop = (fileContent) => {
    setContent(prev => prev + '\n\n' + fileContent)
  }

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      
      const newContent = content.substring(0, start) + emoji + content.substring(end)
      setContent(newContent)
      
      // Set cursor position after the inserted emoji
      setTimeout(() => {
        textareaRef.current.selectionStart = start + emoji.length
        textareaRef.current.selectionEnd = start + emoji.length
        textareaRef.current.focus()
      }, 0)
    } else {
      setContent(prev => prev + emoji)
    }
  }

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-dark-800 p-4">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">No note selected</h3>
          <p className="mt-2 text-gray-400 dark:text-gray-500">Select a note from the sidebar or create a new one</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Title input */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-dark-700">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title"
          className="w-full text-xl font-medium bg-transparent border-0 focus:ring-0 focus:outline-none"
        />
      </div>
      
      {/* Toolbar */}
      <div className="flex items-center px-4 py-1 border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
        <div className="flex space-x-2">
          <button 
            onClick={() => toggleViewMode('edit')}
            className={`p-1.5 rounded ${viewMode === 'edit' ? 'bg-gray-200 dark:bg-dark-700' : 'hover:bg-gray-200 dark:hover:bg-dark-700'}`}
            title="Edit mode"
          >
            <FaMarkdown className="h-4 w-4" />
          </button>
          <button 
            onClick={() => toggleViewMode('preview')}
            className={`p-1.5 rounded ${viewMode === 'preview' ? 'bg-gray-200 dark:bg-dark-700' : 'hover:bg-gray-200 dark:hover:bg-dark-700'}`}
            title="Preview mode"
          >
            <FaEye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => toggleViewMode('split')}
            className={`p-1.5 rounded ${viewMode === 'split' ? 'bg-gray-200 dark:bg-dark-700' : 'hover:bg-gray-200 dark:hover:bg-dark-700'}`}
            title="Split view"
          >
            <div className="flex h-4 w-4">
              <div className="w-1/2 border-r border-current"></div>
              <div className="w-1/2"></div>
            </div>
          </button>
          
          <div className="ml-2 border-l border-gray-300 dark:border-dark-600 pl-2">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </div>
        </div>
        
        <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
          Last edited: {new Date(activeNote.updatedAt).toLocaleString()}
        </div>
      </div>
      
      {/* Editor area */}
      <FileDropZone 
        onDrop={handleFileDrop} 
        onDragActive={setIsDropActive}
        className="flex-1 overflow-hidden"
      >
        <div className={`h-full ${isDropActive ? 'opacity-50' : ''}`}>
          {viewMode === 'edit' && (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing..."
              className="editor-textarea"
            />
          )}
          
          {viewMode === 'preview' && (
            <div className="h-full overflow-auto p-4">
              <div className="markdown-body">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={tomorrow}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          )}
          
          {viewMode === 'split' && (
            <div className="flex h-full">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                placeholder="Start writing..."
                className="w-1/2 editor-textarea border-r border-gray-200 dark:border-dark-700"
              />
              <div className="w-1/2 h-full overflow-auto p-4">
                <div className="markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={tomorrow}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </FileDropZone>
    </div>
  )
}

export default Editor