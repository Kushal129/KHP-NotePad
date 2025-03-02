import { useState } from 'react';
import { useNotes } from '../contexts/NotesContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FaBars, 
  FaMoon, 
  FaSun, 
  FaDownload, 
  FaFileExport, 
  FaKeyboard,
  FaEllipsisH,
  FaPalette,
  FaPlus,
  FaPencilAlt,
  FaDrawPolygon,
  FaGithub,
  FaQuestionCircle,
  FaCog
} from 'react-icons/fa';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

function Toolbar({ toggleSidebar }) {
  const { getActiveNote, createNote, createDrawing } = useNotes();
  const { darkMode, toggleDarkMode, theme, changeTheme } = useTheme();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  
  const activeNote = getActiveNote();
  
  const handleExportMarkdown = () => {
    if (!activeNote) return;
    
    const blob = new Blob([activeNote.content], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `${activeNote.title || 'untitled'}.md`);
    setShowExportMenu(false);
  };
  
  const handleExportTxt = () => {
    if (!activeNote) return;
    
    const blob = new Blob([activeNote.content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${activeNote.title || 'untitled'}.txt`);
    setShowExportMenu(false);
  };
  
  const handleExportPDF = () => {
    if (!activeNote) return;
    
    // Convert markdown to HTML
    const htmlContent = DOMPurify.sanitize(marked(activeNote.content));
    
    // Create a temporary div to render the HTML
    const element = document.createElement('div');
    element.className = 'markdown-body';
    element.innerHTML = htmlContent;
    document.body.appendChild(element);
    
    // Configure PDF options
    const options = {
      margin: [10, 10, 10, 10],
      filename: `${activeNote.title || 'untitled'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generate PDF
    html2pdf().set(options).from(element).save().then(() => {
      document.body.removeChild(element);
      setShowExportMenu(false);
    });
  };
  
  const handleKeyboardShortcuts = () => {
    // This will be handled in the App component
    const event = new KeyboardEvent('keydown', {
      key: '/',
      ctrlKey: true,
      bubbles: true
    });
    document.dispatchEvent(event);
  };
  
  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    setShowThemeMenu(false);
  };
  
  const handleCreateNote = () => {
    createNote();
    setShowNewMenu(false);
  };
  
  const handleCreateDrawing = () => {
    createDrawing();
    setShowNewMenu(false);
  };

  const openGitHub = () => {
    window.open('https://github.com/yourusername/khp-notepad', '_blank');
    setShowHelpMenu(false);
  };

  const openDocumentation = () => {
    window.open('https://khpnotepad.netlify.app/docs', '_blank');
    setShowHelpMenu(false);
  };
  
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
        
        <div className="ml-3 flex items-center">
          <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-500">KHP Notepad</span>
          <span className="ml-2 text-xs px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">v1.0</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative tooltip-container">
          <button
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="p-1.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white flex items-center"
            title="Create new"
          >
            <FaPlus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">New</span>
          </button>
          
          {showNewMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-800 rounded-md shadow-lg z-10 py-1 border border-gray-200 dark:border-dark-700">
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
        
        <div className="relative tooltip-container">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300"
            title="Change theme"
          >
            <FaPalette className="h-5 w-5" />
          </button>
          
          {showThemeMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-800 rounded-md shadow-lg z-10 py-1 border border-gray-200 dark:border-dark-700">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-dark-700">
                Color Themes
              </div>
              <button
                onClick={() => handleThemeChange('default')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center ${theme === 'default' ? 'font-medium' : ''}`}
              >
                <span className="w-4 h-4 rounded-full bg-primary-500 mr-2"></span>
                Default Blue
                {theme === 'default' && <span className="ml-auto text-primary-500">✓</span>}
              </button>
              <button
                onClick={() => handleThemeChange('purple')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center ${theme === 'purple' ? 'font-medium' : ''}`}
              >
                <span className="w-4 h-4 rounded-full bg-purple-500 mr-2"></span>
                Purple
                {theme === 'purple' && <span className="ml-auto text-primary-500">✓</span>}
              </button>
              <button
                onClick={() => handleThemeChange('green')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center ${theme === 'green' ? 'font-medium' : ''}`}
              >
                <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                Green
                {theme === 'green' && <span className="ml-auto text-primary-500">✓</span>}
              </button>
              <div className="border-t border-gray-200 dark:border-dark-700 mt-1 pt-1">
                <button
                  onClick={toggleDarkMode}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
                >
                  {darkMode ? (
                    <>
                      <FaSun className="h-4 w-4 mr-2 text-yellow-500" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <FaMoon className="h-4 w-4 mr-2 text-blue-500" />
                      Dark Mode
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        
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
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-800 rounded-md shadow-lg z-10 py-1 border border-gray-200 dark:border-dark-700">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-dark-700">
                Export Options
              </div>
              <button
                onClick={handleExportMarkdown}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
                disabled={!activeNote}
              >
                <FaDownload className="h-4 w-4 mr-2 text-gray-500" />
                Export as Markdown
              </button>
              <button
                onClick={handleExportTxt}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
                disabled={!activeNote}
              >
                <FaDownload className="h-4 w-4 mr-2 text-gray-500" />
                Export as TXT
              </button>
              <button
                onClick={handleExportPDF}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
                disabled={!activeNote}
              >
                <FaDownload className="h-4 w-4 mr-2 text-gray-500" />
                Export as PDF
              </button>
            </div>
          )}
        </div>
        
        <div className="relative tooltip-container">
          <button
            onClick={() => setShowHelpMenu(!showHelpMenu)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300"
            title="Help"
          >
            <FaQuestionCircle className="h-5 w-5" />
          </button>
          
          {showHelpMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-800 rounded-md shadow-lg z-10 py-1 border border-gray-200 dark:border-dark-700">
              <button
                onClick={handleKeyboardShortcuts}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
              >
                <FaKeyboard className="h-4 w-4 mr-2 text-gray-500" />
                Keyboard Shortcuts
              </button>
              <button
                onClick={openGitHub}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
              >
                <FaGithub className="h-4 w-4 mr-2 text-gray-500" />
                GitHub Repository
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Toolbar;