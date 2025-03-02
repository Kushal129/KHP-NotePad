# KHP Notepad

A next-level online notepad application built with React.js and Tailwind CSS.

## Live Demo

Visit [https://khpnotepad.netlify.app/](https://khpnotepad.netlify.app/) to see the application in action.

## Features

- **Real-time editing with autosave**
  - Notes are automatically saved as you type
  - Last saved timestamp is displayed in the status bar

- **Markdown support & rich text formatting**
  - Full Markdown syntax support with preview mode
  - Split-screen view to see changes in real-time
  - Syntax highlighting for code blocks

- **Dark mode & theming options**
  - Toggle between light and dark modes
  - Multiple color themes (Blue, Purple, Green)
  - Responsive design that works on all devices

- **Emoji picker**
  - Insert emojis directly into your notes
  - Organized by categories with search functionality

- **Drag & drop file upload**
  - Drag and drop text or markdown files directly into the editor
  - Visual feedback during drag operations

- **Keyboard shortcuts for efficiency**
  - Comprehensive keyboard shortcuts for common actions
  - Shortcut help dialog (Ctrl/Cmd + /)

- **Local storage for seamless access**
  - All notes are saved to browser storage
  - Persistent across sessions

- **Multi-tab notes for better organization**
  - Open multiple notes in tabs
  - Easily switch between open notes

- **Pin, search & categorize notes**
  - Pin important notes to the top
  - Search through all notes
  - Organize notes by categories

- **Export to PDF, TXT, and Markdown**
  - Export your notes in multiple formats
  - Preserve formatting in exports

- **Offline mode support**
  - Works completely offline
  - No internet connection required

## Technologies Used

- React.js
- Tailwind CSS
- React Markdown
- LocalForage for storage
- File-Saver for exports
- HTML2PDF for PDF generation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Kushal129/KHP-Notepad.git
cd KHP-Notepad
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All the open-source libraries used in this project