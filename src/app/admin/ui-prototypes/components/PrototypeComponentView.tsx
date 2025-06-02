'use client';

import { useState } from 'react';
import { FiMaximize, FiMinimize, FiSmartphone, FiMonitor, FiTablet } from 'react-icons/fi';

interface PrototypeComponentViewProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function PrototypeComponentView({ 
  title, 
  description,
  children 
}: PrototypeComponentViewProps) {
  const [viewportSize, setViewportSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Determine viewport class based on selected size
  const viewportClass = {
    mobile: 'w-[375px]',
    tablet: 'w-[768px]',
    desktop: 'w-full',
  }[viewportSize];
  
  return (
    <div className={`bg-gray-900 rounded-xl overflow-hidden border border-gray-700 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Component Header */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div>
          <h3 className="text-white font-medium">{title}</h3>
          {description && <p className="text-gray-400 text-sm">{description}</p>}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Viewport Controls */}
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewportSize('mobile')}
              className={`p-1.5 rounded ${viewportSize === 'mobile' ? 'bg-gray-600 text-white' : 'text-gray-400'}`}
              title="Mobile View"
            >
              <FiSmartphone size={16} />
            </button>
            <button
              onClick={() => setViewportSize('tablet')}
              className={`p-1.5 rounded ${viewportSize === 'tablet' ? 'bg-gray-600 text-white' : 'text-gray-400'}`}
              title="Tablet View"
            >
              <FiTablet size={16} />
            </button>
            <button
              onClick={() => setViewportSize('desktop')}
              className={`p-1.5 rounded ${viewportSize === 'desktop' ? 'bg-gray-600 text-white' : 'text-gray-400'}`}
              title="Desktop View"
            >
              <FiMonitor size={16} />
            </button>
          </div>
          
          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-gray-700 rounded text-gray-400 hover:text-white"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <FiMinimize size={16} /> : <FiMaximize size={16} />}
          </button>
        </div>
      </div>
      
      {/* Component Content */}
      <div className="bg-white p-4 flex justify-center overflow-auto" style={{ minHeight: '300px' }}>
        <div className={`${viewportClass} transition-all duration-300`}>
          {children}
        </div>
      </div>
    </div>
  );
}