import { FaTimes } from 'react-icons/fa'

function ShortcutHelp({ onClose }) {
  const shortcuts = [
    { key: 'Ctrl/Cmd + B', description: 'Toggle sidebar' },
    { key: 'Ctrl/Cmd + /', description: 'Show keyboard shortcuts' },
    { key: 'Ctrl/Cmd + S', description: 'Save current note' },
    { key: 'Ctrl/Cmd + N', description: 'Create new note' },
    { key: 'Ctrl/Cmd + F', description: 'Search notes' },
    { key: 'Ctrl/Cmd + E', description: 'Export current note' },
    { key: 'Ctrl/Cmd + D', description: 'Toggle dark mode' },
    { key: 'Ctrl/Cmd + P', description: 'Print current note' },
    { key: 'Ctrl/Cmd + H', description: 'Toggle markdown cheatsheet' },
    { key: 'Ctrl/Cmd + Tab', description: 'Switch between notes' },
  ]
  
  const markdownShortcuts = [
    { syntax: '# Text', description: 'Heading 1' },
    { syntax: '## Text', description: 'Heading 2' },
    { syntax: '**Text**', description: 'Bold text' },
    { syntax: '*Text*', description: 'Italic text' },
    { syntax: '~~Text~~', description: 'Strikethrough' },
    { syntax: '- Item', description: 'Unordered list' },
    { syntax: '1. Item', description: 'Ordered list' },
    { syntax: '[Link](url)', description: 'Hyperlink' },
    { syntax: '![Alt](url)', description: 'Image' },
    { syntax: '`code`', description: 'Inline code' },
    { syntax: '```js\ncode\n```', description: 'Code block' },
    { syntax: '> Text', description: 'Blockquote' },
    { syntax: '---', description: 'Horizontal rule' },
    { syntax: '| Header | Header |', description: 'Table' },
  ]
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium mb-2">Application Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center py-1">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-dark-700 rounded text-sm font-mono mr-2">
                  {shortcut.key}
                </kbd>
                <span>{shortcut.description}</span>
              </div>
            ))}
          </div>
          
          <h3 className="text-lg font-medium mb-2">Markdown Syntax</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {markdownShortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center py-1">
                <code className="px-2 py-1 bg-gray-100 dark:bg-dark-700 rounded text-sm font-mono mr-2 min-w-[100px]">
                  {shortcut.syntax}
                </code>
                <span>{shortcut.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShortcutHelp