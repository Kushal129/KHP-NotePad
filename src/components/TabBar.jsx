import { useState } from 'react'
import { useNotes } from '../contexts/NotesContext'
import { useTheme } from '../contexts/ThemeContext'
import { 
  FaBars, 
  FaMoon, 
  FaSun, 
  FaDownload, 
  FaFileExport, 
  FaKeyboard,
  FaEllipsisH,
  FaPalette
} from 'react-icons/fa'
import { saveAs } from 'file-saver'
import html2pdf from 'html2pdf.js'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

function Toolbar({ toggleSidebar }) {
  const { getActiveNote } = useNotes()
  const { darkMode, toggleDarkMode, theme, changeTheme } = useTheme()
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  
  const activeNote = getActiveNote()
  
  const handleExportMarkdown = () => {
    if (!activeNote) return
    
    const blob = new Blob([activeNote.content], { type: 'text/markdown;charset=utf-8' })
    saveAs(blob, `${activeNote.title || 'untitled'}.md`)
    setShowExportMenu(false)
  }
  
  const handleExportTxt = () => {
    if (!activeNote) return
    
    const blob = new Blob([activeNote.content], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, `${activeNote.title || 'untitled'}.txt`)
    setShowExportMenu(false)
  }
  
  const handleExportPDF = () => {
    if (!activeNote) return
    
    // Convert markdown to HTML
    const htmlContent = DOMPurify.sanitize(marked(activeNote.content))
    
    // Create a temporary div to render the HTML
    const element = document.createElement('div')
    element.className = 'markdown-body'
    element.innerHTML = htmlContent
    document.body.appendChild(element)
    
    // Configure PDF options
    const options = {
      margin: [10, 10, 10, 10],
      filename: `${activeNote.title || 'untitled'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    
    // Generate PDF
    html2pdf().set(options).from(element).save().then(() => {
      document.body.removeChild(element)
      setShowExportMenu(false)
    })
  }
  
  const handleKeyboardShortcuts = () => {
    // This will be handled in the App component
    const event = new KeyboardEvent('keydown', {
      key: '/',
      ctrlKey: true,
      bubbles: true
    })
    document.dispatchEvent(event)
  }
  
  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme)
    setShowThemeMenu(false)
  }
  
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300"
          title="Toggle sidebar"
        >
          <FaBars className="h-5 w-5" />
        </button>
        
        <h1 className="ml-3 text-lg font-semibold">KHP Notepad</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative tooltip-container">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300"
            title="Change theme"
          >
            <FaPalette className="h-5 w-5" />
          </button>
          
          {showThemeMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-dark-800 rounded-md shadow-lg z-10 py-1 border border-gray-200 dark:border-dark-700">
              <button
                onClick={() => handleThemeChange('default')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center ${theme === 'default' ? 'font-medium' : ''}`}
              >
                <span className="w-4 h-4 rounded-full bg-primary-500 mr-2"></span>
                Default Blue
              </button>
              <button
                onClick={() => handleThemeChange('purple')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center ${theme === 'purple' ? 'font-medium' : ''}`}
              >
                <span className="w-4 h-4 rounded-full bg-purple-500 mr-2"></span>
                Purple
              </button>
              <button
                onClick={() => handleThemeChange('green')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center ${theme === 'green' ? 'font-medium' : ''}`}
              >
                <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                Green
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
        </button>
        
        <div className="relative tooltip-container">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300"
            title="Export"
            disabled={!activeNote}
          >
            <FaFileExport className="h-5 w-5" />
          </button>
          
          {showExportMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-dark-800 rounded-md shadow-lg z-10 py-1 border border-gray-200 dark:border-dark-700">
              <button
                onClick={handleExportMarkdown}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700"
                disabled={!activeNote}
              >
                Export as Markdown
              </button>
              <button
                onClick={handleExportTxt}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700"
                disabled={!activeNote}
              >
                Export as TXT
              </button>
              <button
                onClick={handleExportPDF}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700"
                disabled={!activeNote}
              >
                Export as PDF
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={handleKeyboardShortcuts}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300"
          title="Keyboard shortcuts"
        >
          <FaKeyboard className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default Toolbar