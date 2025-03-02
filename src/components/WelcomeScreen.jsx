import { FaTimes, FaMarkdown, FaMoon, FaFolder, FaDrawPolygon } from 'react-icons/fa';

function WelcomeScreen({ onClose }) {
  const features = [
    {
      icon: <FaMarkdown className="h-6 w-6 text-primary-500" />,
      title: 'Markdown Support',
      description: 'Write in Markdown and see the formatted preview in real-time.'
    },
    {
      icon: <FaMoon className="h-6 w-6 text-primary-500" />,
      title: 'Dark Mode',
      description: 'Switch between light and dark themes for comfortable writing any time of day.'
    },
    {
      icon: <FaDrawPolygon className="h-6 w-6 text-primary-500" />,
      title: 'Drawing Tools',
      description: 'Create sketches, diagrams, and illustrations directly in your notes.'
    },
    {
      icon: <FaFolder className="h-6 w-6 text-primary-500" />,
      title: 'Organization',
      description: 'Categorize, pin, and search your notes for quick access.'
    }
  ];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-3xl w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-xl font-semibold">Welcome to KHP Notepad</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-lg mb-6">
            Your next-level notepad with all the features you need for a distraction-free writing and drawing experience.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex p-4 rounded-lg border border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                <div className="mr-4">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center">
                <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-dark-600 rounded text-sm font-mono mr-2">
                  Ctrl/Cmd + /
                </kbd>
                <span className="text-sm">Show all shortcuts</span>
              </div>
              <div className="flex items-center">
                <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-dark-600 rounded text-sm font-mono mr-2">
                  Ctrl/Cmd + B
                </kbd>
                <span className="text-sm">Toggle sidebar</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;