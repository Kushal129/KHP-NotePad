import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotesProvider } from './contexts/NotesContext';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Toolbar from './components/Toolbar';
import TabBar from './components/TabBar';
import StatusBar from './components/StatusBar';
import WelcomeScreen from './components/WelcomeScreen';
import ShortcutHelp from './components/ShortcutHelp';
import './App.css';

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setIsFirstVisit(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setShowSidebar(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeWelcomeScreen = () => {
    setIsFirstVisit(false);
  };

  return (
    <ThemeProvider>
      <NotesProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <div className="flex flex-col h-screen bg-white dark:bg-dark-900 text-dark-900 dark:text-white">
                <Toolbar toggleSidebar={() => setShowSidebar(prev => !prev)} />

                <div className="flex flex-1 overflow-hidden">
                  {showSidebar && (
                    <Sidebar className="w-64 border-r border-gray-200 dark:border-dark-700" />
                  )}

                  <div className="flex-1 flex flex-col overflow-hidden">
                    <TabBar />
                    <Editor />
                  </div>
                </div>

                <StatusBar />

                {showShortcuts && (
                  <ShortcutHelp onClose={() => setShowShortcuts(false)} />
                )}

                {isFirstVisit && (
                  <WelcomeScreen onClose={closeWelcomeScreen} />
                )}
              </div>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </NotesProvider>
    </ThemeProvider>
  );
}

export default App;
