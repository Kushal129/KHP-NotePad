import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true) // Default to dark mode
  const [theme, setTheme] = useState('default') // default, purple, green

  useEffect(() => {
    // Load theme preferences from localStorage
    const savedDarkMode = localStorage.getItem('darkMode')
    const savedTheme = localStorage.getItem('theme') || 'default'
    
    // If darkMode has never been set, default to true (dark mode)
    // Otherwise use the saved value
    setDarkMode(savedDarkMode === null ? true : savedDarkMode === 'true')
    setTheme(savedTheme)
    
    // Apply dark mode to document
    if (savedDarkMode === null || savedDarkMode === 'true') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Remove any existing theme classes first
    document.documentElement.classList.remove('theme-purple', 'theme-green')
    
    // Apply theme class
    if (savedTheme !== 'default') {
      document.documentElement.classList.add(`theme-${savedTheme}`)
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode
      localStorage.setItem('darkMode', newMode.toString())
      
      if (newMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      return newMode
    })
  }

  const changeTheme = (newTheme) => {
    // Remove all theme classes first
    document.documentElement.classList.remove('theme-purple', 'theme-green')
    
    // Add new theme class if not default
    if (newTheme !== 'default') {
      document.documentElement.classList.add(`theme-${newTheme}`)
    }
    
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const value = {
    darkMode,
    toggleDarkMode,
    theme,
    changeTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}