import { useState, useCallback } from 'react'

function FileDropZone({ children, onDrop, onDragActive, className }) {
  const [isDragActive, setIsDragActive] = useState(false)
  
  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
    if (onDragActive) onDragActive(true)
  }, [onDragActive])
  
  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (onDragActive) onDragActive(false)
  }, [onDragActive])
  
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])
  
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (onDragActive) onDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    
    // Only process text files
    files.forEach(file => {
      if (file.type.match('text.*') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (onDrop) onDrop(event.target.result)
        }
        reader.readAsText(file)
      }
    })
  }, [onDrop, onDragActive])
  
  return (
    <div
      className={`${className} ${isDragActive ? 'relative' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      
      {isDragActive && (
        <div className="absolute inset-0 bg-white dark:bg-dark-900 bg-opacity-90 dark:bg-opacity-90 flex items-center justify-center z-10">
          <div className="dropzone active max-w-md mx-auto">
            <div className="text-lg font-medium mb-2">Drop files here</div>
            <p className="text-gray-500 dark:text-gray-400">
              Drop text or markdown files to import their content
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileDropZone