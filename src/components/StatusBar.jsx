import { useNotes } from '../contexts/NotesContext'

function StatusBar() {
  const { notes, lastSaved } = useNotes()
  
  const activeNotes = notes.filter(note => !note.isTrashed).length
  const trashedNotes = notes.filter(note => note.isTrashed).length
  
  return (
    <div className="flex items-center justify-between px-4 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700">
      <div>
        {activeNotes} notes • {trashedNotes} in trash
      </div>
      <div>
        {lastSaved ? `Last saved: ${new Date(lastSaved).toLocaleTimeString()}` : 'All changes saved'}
      </div>
    </div>
  )
}

export default StatusBar