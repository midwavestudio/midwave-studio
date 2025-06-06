'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/firebase/projectUtils';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const expandedImageRef = useRef<HTMLDivElement>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, isVertical: false, aspectRatio: 1 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if URL is external (starts with http:// or https://)
  const isExternalUrl = (url: string) => {
    return url?.startsWith('http://') || url?.startsWith('https://');
  };
  
  // Check if URL is a local path (starts with '/images/')
  const isLocalPath = (url: string) => {
    return url?.startsWith('/images/');
  };
  
  // Reset current image index and zoom when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setExpandedImage(false);
    resetZoom();
    console.log('Project changed, reset image index and expanded state');
  }, [project]);

  // Reset zoom and pan when expanded image state changes
  useEffect(() => {
    if (!expandedImage) {
      resetZoom();
    }
  }, [expandedImage]);

  // Reset zoom and pan position
  const resetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Handle zoom in
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 8));
  };

  // Handle zoom out
  const zoomOut = () => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setPanPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
      e.preventDefault();
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle wheel event for zooming with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (expandedImage) {
      e.preventDefault();
      // Zoom in/out based on wheel direction
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    }
  };

  // Debug modal props
  useEffect(() => {
    console.log('ProjectModal props:', { 
      isOpen, 
      projectTitle: project?.title,
      hasImages: project?.imageUrls?.length
    });
  }, [isOpen, project]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        if (expandedImage) {
          if (zoomLevel > 1) {
            resetZoom();
          } else {
            setExpandedImage(false);
          }
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' && project && !expandedImage) {
        setCurrentImageIndex((prev) => 
          prev < project.imageUrls.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowLeft' && project && !expandedImage) {
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === '+' && expandedImage) {
        zoomIn();
      } else if (e.key === '-' && expandedImage) {
        zoomOut();
      } else if (e.key === '0' && expandedImage) {
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, project, expandedImage, zoomLevel]);

  // Close when clicking outside the modal content
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        if (expandedImage) {
          if (zoomLevel > 1) {
            resetZoom();
          } else {
            setExpandedImage(false);
          }
        } else {
          onClose();
        }
      }
    },
    [onClose, expandedImage, zoomLevel]
  );

  // Debug expanded image state changes
  useEffect(() => {
    console.log('Expanded image state changed:', expandedImage);
  }, [expandedImage]);

  // Function to handle image load and determine dimensions
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const isVertical = img.naturalHeight > img.naturalWidth;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
      isVertical,
      aspectRatio
    });
    setIsLoading(false);
  };

  if (!project) return null;

  // Determine which image to display
  const currentImage = project.imageUrls && project.imageUrls.length > 0 
    ? project.imageUrls[currentImageIndex] 
    : project.thumbnailUrl;

  // Validate the current image
  const isValidImage = (url: string | undefined): boolean => {
    if (!url) return false;
    
    // For base64 images
    if (url.startsWith('data:image')) return true;
    
    // For URLs
    if (url.startsWith('http://') || url.startsWith('https://')) return true;
    
    // For local images in public directory
    if (url.startsWith('/images/')) return true;
    
    return false;
  };

  const hasValidImage = isValidImage(currentImage);

  // Handle image expansion directly - simplified approach
  const handleImageExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('handleImageExpand called directly');
    
    if (hasValidImage) {
      console.log('Image is valid, expanding...');
      setExpandedImage(true);
    } else {
      console.log('No valid image to expand');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          {/* Expanded Image View */}
          <AnimatePresence>
            {expandedImage && hasValidImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 overflow-auto py-4"
                onClick={(e) => {
                  console.log('Expanded image backdrop clicked');
                  if (zoomLevel > 1) {
                    resetZoom();
                  } else {
                    setExpandedImage(false);
                  }
                }}
              >
                <div 
                  ref={expandedImageRef}
                  className={`relative ${isDragging ? 'cursor-grabbing' : zoomLevel > 1 ? 'cursor-grab' : 'cursor-zoom-in'}`}
                  onClick={(e) => {
                    console.log('Expanded image container clicked');
                    e.stopPropagation();
                    if (zoomLevel === 1) {
                      zoomIn();
                    }
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                  style={{
                    maxHeight: '95vh',
                    maxWidth: '95vw',
                    overflow: 'hidden',
                  }}
                >
                  <div 
                    className="relative"
                    style={{ 
                      transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                      transformOrigin: 'center center',
                      transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                      width: '100%',
                      height: 'auto',
                      maxHeight: '85vh',
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    {isExternalUrl(currentImage) ? (
                      <img
                        src={currentImage}
                        alt={`${project.title} - Expanded View`}
                        className="max-w-full max-h-[85vh] object-contain"
                        draggable="false"
                        onLoad={handleImageLoad}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Expanded image clicked directly');
                          if (zoomLevel === 1) {
                            zoomIn();
                          } else {
                            resetZoom();
                          }
                        }}
                        onError={(e) => {
                          console.error('Error loading expanded image:', currentImage);
                          // Hide the image on error
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          // Show fallback
                          const parent = target.parentElement;
                          if (parent) {
                            parent.classList.add('flex', 'items-center', 'justify-center', 'bg-[#0f0f13]');
                            const fallback = document.createElement('div');
                            fallback.innerHTML = `
                              <svg class="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <p class="text-gray-500 mt-2">Image not available</p>
                            `;
                            parent.appendChild(fallback);
                          }
                        }}
                        style={{
                          maxWidth: '100%',
                          maxHeight: imageDimensions.isVertical ? 'calc(100vh - 100px)' : '85vh',
                          width: 'auto',
                          height: 'auto'
                        }}
                      />
                    ) : (
                      <img
                        src={currentImage}
                        alt={`${project.title} - Expanded View`}
                        className="max-w-full max-h-[85vh] object-contain"
                        draggable="false"
                        onLoad={handleImageLoad}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Expanded image clicked directly');
                          if (zoomLevel === 1) {
                            zoomIn();
                          } else {
                            resetZoom();
                          }
                        }}
                        onError={(e) => {
                          console.error('Error loading expanded image:', currentImage);
                          // Hide the image on error
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          // Show fallback
                          const parent = target.parentElement;
                          if (parent) {
                            parent.classList.add('flex', 'items-center', 'justify-center', 'bg-[#0f0f13]');
                            const fallback = document.createElement('div');
                            fallback.innerHTML = `
                              <svg class="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <p class="text-gray-500 mt-2">Image not available</p>
                            `;
                            parent.appendChild(fallback);
                          }
                        }}
                        style={{
                          maxWidth: '100%',
                          maxHeight: imageDimensions.isVertical ? 'calc(100vh - 100px)' : '85vh',
                          width: 'auto',
                          height: 'auto'
                        }}
                      />
                    )}
                  </div>

                  {/* Zoom controls */}
                  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/70 rounded-full p-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        zoomOut();
                      }}
                      className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                      disabled={zoomLevel <= 1}
                      aria-label="Zoom out"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-white text-sm">{Math.round(zoomLevel * 100)}%</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        zoomIn();
                      }}
                      className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                      disabled={zoomLevel >= 8}
                      aria-label="Zoom in"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resetZoom();
                      }}
                      className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                      disabled={zoomLevel === 1}
                      aria-label="Reset zoom"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Close expanded view button clicked');
                      setExpandedImage(false);
                    }}
                    className="fixed top-4 right-4 bg-black/70 rounded-full p-3 text-white hover:bg-black/90 transition-colors z-10"
                    aria-label="Close expanded view"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Updated Zoom instructions */}
                  <div className="fixed top-4 left-4 bg-black/70 rounded-lg p-3 text-white text-xs z-10">
                    <p className="mb-1">• Click image to zoom in</p>
                    <p className="mb-1">• Use + and - buttons to zoom</p>
                    <p className="mb-1">• Drag to pan when zoomed in</p>
                    <p>• Press ESC to close</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-[#0f0f13] rounded-lg overflow-hidden max-w-6xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-[#b85a00]/20">
              <h2 className="text-xl font-bold text-white">{project.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="relative">
                  <div 
                    className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-zoom-in"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Image container clicked directly');
                      if (hasValidImage) {
                        setExpandedImage(true);
                      }
                    }}
                    title={hasValidImage ? "Click to expand image" : "No image available"}
                  >
                    {hasValidImage ? (
                      isExternalUrl(currentImage) ? (
                        // Use regular img tag for external URLs
                        <img
                          src={currentImage}
                          alt={`${project.title} - Image ${currentImageIndex + 1}`}
                          className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Expanded image clicked directly');
                            if (zoomLevel === 1) {
                              zoomIn();
                            } else {
                              resetZoom();
                            }
                          }}
                          onError={(e) => {
                            console.error('Error loading expanded external image:', currentImage);
                            // Hide the image on error
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            // Show fallback
                            const parent = target.parentElement;
                            if (parent) {
                              parent.classList.add('flex', 'items-center', 'justify-center', 'bg-[#0f0f13]');
                              const fallback = document.createElement('div');
                              fallback.innerHTML = `
                                <svg class="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p class="text-gray-500 mt-2">Image not available</p>
                              `;
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        // Use Next.js Image for internal URLs and local paths
                        <div 
                          className="absolute inset-0 w-full h-full"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Image container clicked directly');
                            if (hasValidImage) {
                              setExpandedImage(true);
                            }
                          }}
                        >
                          <Image
                            src={currentImage}
                            alt={`${project.title} - Image ${currentImageIndex + 1}`}
                            fill
                            quality={100}
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              console.error('Error loading expanded Next.js image:', currentImage);
                              // Hide the image on error
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              // Show fallback
                              const parent = target.parentElement;
                              if (parent) {
                                parent.classList.add('flex', 'items-center', 'justify-center', 'bg-[#0f0f13]');
                                const fallback = document.createElement('div');
                                fallback.innerHTML = `
                                  <svg class="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                  <p class="text-gray-500 mt-2">Image not available</p>
                                `;
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                      )
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f0f13]">
                        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 mt-2">No image available</p>
                      </div>
                    )}
                    
                    {/* Click to expand indicator - make it more visible */}
                    {hasValidImage && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/30"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Expand button clicked directly');
                          setExpandedImage(true);
                        }}
                      >
                        <div className="bg-black/70 rounded-full p-3 transform transition-transform duration-300 hover:scale-110">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                        <span className="absolute bottom-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                          Click to expand
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Add a clear call-to-action button for expanding the image */}
                  {hasValidImage && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Expand button clicked directly');
                        setExpandedImage(true);
                      }}
                      className="mt-4 w-full py-2 bg-[#b85a00]/20 hover:bg-[#b85a00]/40 text-white rounded flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                      Expand Image
                    </button>
                  )}

                  {/* Image Navigation - only show if there are multiple valid images */}
                  {project.imageUrls && project.imageUrls.filter(url => isValidImage(url)).length > 1 && (
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev))}
                        disabled={currentImageIndex === 0}
                        className={`p-2 rounded-full ${
                          currentImageIndex === 0
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-white bg-[#b85a00]/20 hover:bg-[#b85a00]/40'
                        }`}
                        aria-label="Previous image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div className="text-sm text-gray-400">
                        {currentImageIndex + 1} / {project.imageUrls.filter(url => isValidImage(url)).length}
                      </div>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev < project.imageUrls.filter(url => isValidImage(url)).length - 1 ? prev + 1 : prev
                          )
                        }
                        disabled={currentImageIndex === project.imageUrls.filter(url => isValidImage(url)).length - 1}
                        className={`p-2 rounded-full ${
                          currentImageIndex === project.imageUrls.filter(url => isValidImage(url)).length - 1
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-white bg-[#b85a00]/20 hover:bg-[#b85a00]/40'
                        }`}
                        aria-label="Next image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Thumbnail Navigation - only show if there are multiple valid images */}
                  {project.imageUrls && project.imageUrls.filter(url => isValidImage(url)).length > 1 && (
                    <div className="mt-4 grid grid-cols-5 gap-2">
                      {project.imageUrls.filter(url => isValidImage(url)).slice(0, 5).map((url, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                            currentImageIndex === index
                              ? 'border-[#b85a00]'
                              : 'border-transparent hover:border-[#b85a00]/50'
                          }`}
                        >
                          {isExternalUrl(url) ? (
                            <img
                              src={url}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={url}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              quality={100}
                              className="object-cover"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
                    <p className="text-gray-300 mb-6">
                      {project.fullDescription || project.description}
                    </p>
                    
                    {/* Visit Site Button */}
                    {project.url && (
                      <div className="mb-8">
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center bg-[#b85a00] hover:bg-[#a04d00] text-white px-6 py-3 rounded-md transition-colors shadow-lg shadow-black/20 text-base"
                        >
                          <span>Visit Live Site</span>
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        <p className="text-gray-400 text-sm mt-2">
                          See the live website to explore the most current version
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Project Metadata */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {project.client && (
                      <div>
                        <h4 className="text-sm font-semibold text-[#b85a00] mb-1">Client</h4>
                        <p className="text-gray-300">{project.client}</p>
                      </div>
                    )}
                    {project.date && (
                      <div>
                        <h4 className="text-sm font-semibold text-[#b85a00] mb-1">Date</h4>
                        <p className="text-gray-300">{project.date}</p>
                      </div>
                    )}
                  </div>

                  {/* Services & Technologies */}
                  <div className="space-y-4">
                    {project.services && project.services.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-[#b85a00] mb-2">Services</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.services.map((service, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-[#1a1a1a] rounded-full text-sm text-gray-300"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-[#b85a00] mb-2">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-[#1a1a1a] rounded-full text-sm text-gray-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal; 