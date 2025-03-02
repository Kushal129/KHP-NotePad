import { useState, useRef, useEffect } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { SketchPicker } from 'react-color';
import { 
  FaPencilAlt, 
  FaEraser, 
  FaUndo, 
  FaRedo, 
  FaTrash, 
  FaSave, 
  FaPalette, 
  FaPlus, 
  FaMinus,
  FaImage,
  FaSquare,
  FaCircle,
  FaLayerGroup,
} from 'react-icons/fa';
import { useNotes } from '../contexts/NotesContext';

function DrawingCanvas() {
  const { activeNoteId, saveDrawingData } = useNotes();
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [eraserWidth, setEraserWidth] = useState(40); // Increased default eraser size
  const [mode, setMode] = useState('pen'); // 'pen', 'eraser', 'shape'
  const [shape, setShape] = useState('freehand'); // 'freehand', 'rectangle', 'circle', 'line'
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [layers, setLayers] = useState([{ id: 1, name: 'Layer 1', visible: true, locked: false }]);
  const [activeLayer, setActiveLayer] = useState(1);
  const [canvasBackground, setCanvasBackground] = useState('#ffffff');
  const [canvasSize, setCanvasSize] = useState({ width: '100%', height: '100%' });
  const [zoomLevel, setZoomLevel] = useState(100);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Predefined colors palette
  const colorPalette = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#00ffff', '#ff00ff', '#ff9900', '#9900ff',
    '#795548', '#607d8b', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688',
    '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107',
    '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b'
  ];

  // Auto-save drawing data
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (canvasRef.current && activeNoteId) {
        canvasRef.current.exportImage('png')
          .then(data => {
            saveDrawingData(activeNoteId, data);
          })
          .catch(err => console.error('Error saving drawing:', err));
      }
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [strokeColor, strokeWidth, mode, activeNoteId, saveDrawingData]);
  
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
      canvasRef.current.clearCanvas();
    }
  };
  
  const handleUndo = () => {
    canvasRef.current.undo();
  };
  
  const handleRedo = () => {
    canvasRef.current.redo();
  };
  
  const handleSave = async () => {
    try {
      const data = await canvasRef.current.exportImage('png');
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = data;
      link.download = `drawing-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error saving drawing:', error);
    }
  };
  
  const handleColorChange = (color) => {
    setStrokeColor(color.hex);
  };
  
  const handleQuickColorSelect = (color) => {
    setStrokeColor(color);
    setShowColorPicker(false);
  };
  
  const increaseStrokeWidth = () => {
    if (mode === 'pen') {
      setStrokeWidth(prev => Math.min(prev + 1, 30));
    } else {
      setEraserWidth(prev => Math.min(prev + 10, 200)); // Increased eraser size increment
    }
  };
  
  const decreaseStrokeWidth = () => {
    if (mode === 'pen') {
      setStrokeWidth(prev => Math.max(prev - 1, 1));
    } else {
      setEraserWidth(prev => Math.max(prev - 10, 10)); // Increased eraser size decrement
    }
  };
  
  const switchToPen = () => {
    setMode('pen');
    setShape('freehand');
    canvasRef.current.eraseMode(false);
  };
  
  const switchToEraser = () => {
    setMode('eraser');
    canvasRef.current.eraseMode(true);
  };

  const switchToShape = (shapeType) => {
    setMode('shape');
    setShape(shapeType);
    canvasRef.current.eraseMode(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Here you would add the image to the canvas
          // This would require a more advanced canvas library with image support
          alert('Image upload feature coming soon!');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLayer = () => {
    const newLayerId = layers.length + 1;
    setLayers([...layers, { 
      id: newLayerId, 
      name: `Layer ${newLayerId}`, 
      visible: true, 
      locked: false 
    }]);
    setActiveLayer(newLayerId);
  };

  const handleLayerVisibility = (layerId) => {
    setLayers(layers.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible } 
        : layer
    ));
  };

  const handleLayerLock = (layerId) => {
    setLayers(layers.map(layer => 
      layer.id === layerId 
        ? { ...layer, locked: !layer.locked } 
        : layer
    ));
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  const handleBackgroundChange = (color) => {
    setCanvasBackground(color.hex);
  };

  // Function to handle shape drawing
  const drawShape = (shapeType, startX, startY, endX, endY) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;

    switch (shapeType) {
      case 'rectangle':
        ctx.strokeRect(startX, startY, endX - startX, endY - startY);
        break;
      case 'circle':
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Main Toolbar */}
      <div className="flex items-center p-2 bg-gray-100 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
        <div className="flex space-x-1 mr-4">
          <button
            onClick={switchToPen}
            className={`p-2 rounded ${mode === 'pen' && shape === 'freehand' ? 'bg-primary-100 dark:bg-primary-900' : 'hover:bg-gray-200 dark:hover:bg-dark-700'}`}
            title="Pen"
          >
            <FaPencilAlt className={`h-4 w-4 ${mode === 'pen' && shape === 'freehand' ? 'text-primary-600 dark:text-primary-400' : ''}`} />
          </button>
          <button
            onClick={switchToEraser}
            className={`p-2 rounded ${mode === 'eraser' ? 'bg-primary-100 dark:bg-primary-900' : 'hover:bg-gray-200 dark:hover:bg-dark-700'}`}
            title="Eraser"
          >
            <FaEraser className={`h-4 w-4 ${mode === 'eraser' ? 'text-primary-600 dark:text-primary-400' : ''}`} />
          </button>
          <button
            onClick={() => switchToShape('rectangle')}
            className={`p-2 rounded ${mode === 'shape' && shape === 'rectangle' ? 'bg-primary-100 dark:bg-primary-900' : 'hover:bg-gray-200 dark:hover:bg-dark-700'}`}
            title="Rectangle"
          >
            <FaSquare className={`h-4 w-4 ${mode === 'shape' && shape === 'rectangle' ? 'text-primary-600 dark:text-primary-400' : ''}`} />
          </button>
          <button
            onClick={() => switchToShape('circle')}
            className={`p-2 rounded ${mode === 'shape' && shape === 'circle' ? 'bg-primary-100 dark:bg-primary-900' : 'hover:bg-gray-200 dark:hover:bg-dark-700'}`}
            title="Circle"
          >
            <FaCircle className={`h-4 w-4 ${mode === 'shape' && shape === 'circle' ? 'text-primary-600 dark:text-primary-400' : ''}`} />
          </button>
        </div>
        
        {/* Size controls */}
        <div className="flex items-center space-x-1 mr-4">
          <button
            onClick={decreaseStrokeWidth}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
            title="Decrease size"
          >
            <FaMinus className="h-4 w-4" />
          </button>
          <div className="flex items-center justify-center w-10">
            <span className="text-sm">{mode === 'pen' ? strokeWidth : eraserWidth}</span>
          </div>
          <button
            onClick={increaseStrokeWidth}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
            title="Increase size"
          >
            <FaPlus className="h-4 w-4" />
          </button>
        </div>
        
        {/* Color picker */}
        <div className="relative mr-4">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-700 flex items-center"
            title="Color picker"
            disabled={mode === 'eraser'}
          >
            <FaPalette className="h-4 w-4 mr-1" />
            <div 
              className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600" 
              style={{ backgroundColor: strokeColor }}
            ></div>
          </button>
          
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 z-10 bg-white dark:bg-dark-800 rounded shadow-lg border border-gray-200 dark:border-dark-700">
              <div className="p-2">
                <div className="grid grid-cols-6 gap-1 mb-2">
                  {colorPalette.map((color) => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded-full cursor-pointer border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                      onClick={() => handleQuickColorSelect(color)}
                    ></div>
                  ))}
                </div>
                <SketchPicker 
                  color={strokeColor}
                  onChange={handleColorChange}
                  disableAlpha={false}
                  width={220}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* History controls */}
        <div className="flex space-x-1 mr-4">
          <button
            onClick={handleUndo}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
            title="Undo"
          >
            <FaUndo className="h-4 w-4" />
          </button>
          <button
            onClick={handleRedo}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
            title="Redo"
          >
            <FaRedo className="h-4 w-4" />
          </button>
          <button
            onClick={handleClear}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
            title="Clear canvas"
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
        
        {/* Advanced tools */}
        <div className="flex space-x-1 mr-4">
          <button
            onClick={() => fileInputRef.current.click()}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
            title="Insert image"
          >
            <FaImage className="h-4 w-4" />
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </button>
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className={`p-2 rounded ${showLayerPanel ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'hover:bg-gray-200 dark:hover:bg-dark-700'}`}
            title="Layers"
          >
            <FaLayerGroup className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
            title="Zoom in"
          >
            <FaPlus className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
            title="Zoom out"
          >
            <FaMinus className="h-4 w-4" />
          </button>
        </div>
        
        {/* Export/Save */}
        <div className="flex space-x-1">
          <button
            onClick={handleSave}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
            title="Save drawing"
          >
            <FaSave className="h-4 w-4" />
          </button>
        </div>
        
        {/* Zoom level indicator */}
        <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
          {zoomLevel}%
        </div>
      </div>
      
      {/* Canvas and Layers Panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Layers panel */}
        {showLayerPanel && (
          <div className="w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-700 p-2 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Layers</h3>
              <button
                onClick={handleAddLayer}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-700"
                title="Add layer"
              >
                <FaPlus className="h-3 w-3" />
              </button>
            </div>
            
            <div className="space-y-1">
              {layers.map((layer) => (
                <div 
                  key={layer.id}
                  className={`flex items-center p-2 rounded ${activeLayer === layer.id ? 'bg-primary-100 dark:bg-primary-900/30' : 'hover:bg-gray-100 dark:hover:bg-dark-800'}`}
                  onClick={() => setActiveLayer(layer.id)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLayerVisibility(layer.id);
                    }}
                    className={`p-1 rounded ${layer.visible ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600'}`}
                    title={layer.visible ? 'Hide layer' : 'Show layer'}
                  >
                    <FaImage className="h-3 w-3" />
                  </button>
                  <span className="ml-2 flex-1 truncate">{layer.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLayerLock(layer.id);
                    }}
                    className={`p-1 rounded ${layer.locked ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-600'}`}
                    title={layer.locked ? 'Unlock layer' : 'Lock layer'}
                  >
                    {layer.locked ? '🔒' : '🔓'}
                  </button>
                </div>
              ))}
            </div>
            
            {/* Canvas background color */}
            <div className="mt-4">
              <h3 className="font-medium mb-2">Canvas Background</h3>
              <div className="flex items-center">
                <div 
                  className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 mr-2" 
                  style={{ backgroundColor: canvasBackground }}
                ></div>
                <SketchPicker 
                  color={canvasBackground}
                  onChange={handleBackgroundChange}
                  disableAlpha={false}
                  width={200}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Canvas */}
        <div 
          className="flex-1 bg-white dark:bg-dark-900 overflow-auto"
          style={{ 
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'center center'
          }}
        >
          <div style={{ 
            width: canvasSize.width, 
            height: canvasSize.height,
            backgroundColor: canvasBackground
          }}>
            <ReactSketchCanvas
              ref={canvasRef}
              strokeWidth={mode === 'pen' ? strokeWidth : eraserWidth}
              strokeColor={strokeColor}
              canvasColor="transparent"
              style={{ width: '100%', height: '100%' }}
              exportWithBackgroundImage={false}
              withTimestamp={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrawingCanvas;