'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProjects, Project, createTestFeaturedProject, clearAllProjects, getMarketingAgencyWebsite } from '@/lib/firebase/projectUtils';
import { FiEdit, FiTrash2, FiPlus, FiStar, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import AdminLayout from './AdminLayout';

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState<boolean | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [localStorageDebug, setLocalStorageDebug] = useState<string | null>(null);

  // Load projects on component mount or when refresh is triggered
  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        // First, ensure Firebase is initialized
        const { ensureFirebaseInitialized } = await import('@/lib/firebase/firebase');
        const result = await ensureFirebaseInitialized();
        
        console.log('Firebase initialization check result:', result);
        setFirebaseInitialized(result);
        
        // Then load projects
        await loadProjects();
      } catch (error) {
        console.error('Error during initialization:', error);
        setErrorMessage('Failed to initialize the application. Please try refreshing the page.');
        setIsLoading(false);
      }
    };
    
    initializeAndLoad();
  }, [lastRefresh]);

  // Function to manually refresh projects
  const refreshProjects = () => {
    setIsLoading(true);
    setLastRefresh(new Date());
  };

  // Function to load projects from firestore/localStorage
  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      console.log('Starting to load projects...');
      const allProjects = await getProjects();
      console.log(`Loaded ${allProjects.length} projects`);
      
      // Sort projects by featured status (featured first) and then by title
      const sortedProjects = allProjects.sort((a, b) => {
        if (a.featured === b.featured) {
          return (a.title || '').localeCompare(b.title || '');
        }
        return a.featured ? -1 : 1;
      });
      
      setProjects(sortedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      setErrorMessage('Failed to load projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to create a test project
  const handleCreateTestProject = async () => {
    try {
      setErrorMessage(null);
      const result = await createTestFeaturedProject();
      if (result.success) {
        setSuccessMessage('Test project created successfully!');
        // Reload projects
        loadProjects();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(result.message || 'Failed to create test project');
      }
    } catch (error) {
      console.error('Error creating test project:', error);
      setErrorMessage('Failed to create test project. Please try again.');
    }
  };

  // Function to restore Marketing Agency Website
  const restoreMarketingAgencyWebsite = () => {
    try {
      if (typeof window === 'undefined') return;
      
      // Get current projects
      const localData = localStorage.getItem('localProjects');
      let projects: Project[] = [];
      
      if (localData) {
        try {
          projects = JSON.parse(localData);
        } catch (error) {
          console.error('Error parsing localStorage projects:', error);
          projects = [];
        }
      }
      
      // Check if Marketing Agency Website exists
      const exists = projects.some(p => p.title === 'Marketing Agency Website');
      
      if (!exists) {
        // Add Marketing Agency Website
        const marketingAgencyWebsite = getMarketingAgencyWebsite();
        projects.push(marketingAgencyWebsite);
        
        // Save back to localStorage
        localStorage.setItem('localProjects', JSON.stringify(projects));
        
        setSuccessMessage('Marketing Agency Website has been restored!');
        
        // Reload projects
        loadProjects();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setSuccessMessage('Marketing Agency Website already exists.');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error restoring Marketing Agency Website:', error);
      setErrorMessage('Failed to restore Marketing Agency Website. Please try again.');
    }
  };

  // Function to restore Land Development project
  const restoreLandDevelopmentProject = () => {
    try {
      if (typeof window === 'undefined') return;
      
      // Get current projects
      const localData = localStorage.getItem('localProjects');
      let projects: Project[] = [];
      
      if (localData) {
        try {
          projects = JSON.parse(localData);
        } catch (error) {
          console.error('Error parsing localStorage projects:', error);
          projects = [];
        }
      }
      
      // Check if Land Development already exists - check by both ID and title
      const exists = projects.some(p => 
        p.title === 'Land Development' || 
        p.id === 'land-development' || 
        p.slug === 'land-development'
      );
      
      if (!exists) {
        // Create Land Development project
        const landDevelopmentProject: Project = {
          id: 'land-development',
          title: 'Land Development',
          slug: 'land-development',
          category: 'Web Development',
          description: 'Land development project with custom features and responsive design.',
          thumbnailUrl: '/images/fallback-thumbnail.svg',
          imageUrls: ['/images/fallback-thumbnail.svg'],
          featured: true,
          createdAt: new Date().toISOString(),
          client: 'Land Development Client',
          services: ['Web Design', 'Frontend Development', 'CMS Integration'],
          technologies: ['React', 'Next.js', 'Tailwind CSS'],
          order: 2
        };
        
        // Add Land Development project
        projects.push(landDevelopmentProject);
        
        // Save back to localStorage
        localStorage.setItem('localProjects', JSON.stringify(projects));
        
        setSuccessMessage('Land Development project has been restored!');
        
        // Reload projects
        loadProjects();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setSuccessMessage('Land Development project already exists.');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error restoring Land Development project:', error);
      setErrorMessage('Failed to restore Land Development project. Please try again.');
    }
  };

  // Function to toggle featured status
  const toggleFeatured = async (project: Project) => {
    try {
      // This will be handled in the edit page for simplicity
      console.log('Toggle featured status for project:', project.id);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      setErrorMessage('Failed to update project. Please try again.');
    }
  };

  // Function to handle clearing all projects
  const handleClearAllProjects = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const result = await clearAllProjects();
      
      if (result.success) {
        setSuccessMessage('All projects have been cleared successfully!');
        setProjects([]);
      } else {
        setErrorMessage(result.message || 'Failed to clear projects');
      }
    } catch (error) {
      console.error('Error clearing projects:', error);
      setErrorMessage('An unexpected error occurred while clearing projects');
    } finally {
      setIsLoading(false);
      setShowClearConfirm(false);
    }
  };

  // Function to inspect localStorage data
  const inspectLocalStorage = () => {
    try {
      const localData = localStorage.getItem('localProjects');
      if (localData) {
        try {
          const projects = JSON.parse(localData) as Project[];
          
          // Create a detailed report of the projects
          const projectDetails = projects.map(p => ({
            id: p.id,
            title: p.title,
            category: p.category,
            featured: p.featured,
            thumbnailExists: !!p.thumbnailUrl,
            imagesCount: p.imageUrls?.length || 0
          }));
          
          console.log('LocalStorage projects:', projectDetails);
          
          // Display basic info in the UI
          const projectNames = projects.map(p => p.title).join(', ');
          setSuccessMessage(`Found ${projects.length} projects in localStorage: ${projectNames}`);
        } catch (error) {
          setErrorMessage('Error parsing localStorage data');
        }
      } else {
        setErrorMessage('No projects found in localStorage');
      }
    } catch (error) {
      setErrorMessage('Error accessing localStorage');
    }
  };

  // Clear the Land Development project from localStorage
  const clearLandDevelopmentProject = () => {
    try {
      if (typeof window === 'undefined') return;
      
      // Get current projects
      const localData = localStorage.getItem('localProjects');
      let projects: Project[] = [];
      
      if (localData) {
        try {
          projects = JSON.parse(localData);
        } catch (error) {
          console.error('Error parsing localStorage projects:', error);
          projects = [];
        }
      }
      
      // Filter out Land Development project
      const filteredProjects = projects.filter(p => 
        p.title !== 'Land Development' && 
        p.id !== 'land-development' && 
        p.slug !== 'land-development'
      );
      
      // Save filtered projects back to localStorage
      localStorage.setItem('localProjects', JSON.stringify(filteredProjects));
      
      // Force page refresh
      window.location.reload();
    } catch (error) {
      console.error('Error clearing Land Development project:', error);
    }
  };

  // Recreate the Land Development project with verified images
  const recreateLandDevelopmentProject = () => {
    try {
      if (typeof window === 'undefined') return;
      
      // First, get current projects
      const localData = localStorage.getItem('localProjects');
      let projects: Project[] = [];
      
      if (localData) {
        try {
          projects = JSON.parse(localData);
        } catch (error) {
          console.error('Error parsing localStorage projects:', error);
          projects = [];
        }
      }
      
      // Filter out existing Land Development project
      const filteredProjects = projects.filter(p => 
        p.title !== 'Land Development' && 
        p.id !== 'land-development' && 
        p.slug !== 'land-development'
      );
      
      // Create a new Land Development project with verified images
      const newLandDevelopmentProject: Project = {
        id: 'land-development',
        title: 'Land Development',
        slug: 'land-development',
        category: 'Web Development',
        description: 'Land development project with custom features and responsive design.',
        fullDescription: 'Comprehensive land development platform that provides tools for property developers and investors.',
        client: 'Land Development Client',
        date: '2023',
        services: ['Web Design', 'Frontend Development', 'CMS Integration'],
        technologies: ['React', 'Next.js', 'Tailwind CSS'],
        thumbnailUrl: '/images/adhocthumb.png',
        imageUrls: [
          '/images/adhocthumb.png',
          '/images/adhocmt.png',
          '/images/adhocmtsmall.png',
          '/images/Desktop - 1.jpg',
          '/images/Group 1199.jpg',
          '/images/Hero Section.jpg',
          '/images/HOME (1).jpg'
        ],
        url: 'https://example.com/land-development',
        featured: true,
        order: 2,
        createdAt: new Date().toISOString()
      };
      
      // Add the new Land Development project
      filteredProjects.push(newLandDevelopmentProject);
      
      // Save updated projects back to localStorage
      localStorage.setItem('localProjects', JSON.stringify(filteredProjects));
      
      setSuccessMessage('Land Development project has been recreated with verified images!');
      
      // Force page refresh
      window.location.reload();
    } catch (error) {
      console.error('Error recreating Land Development project:', error);
      setErrorMessage('Failed to recreate Land Development project. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with action buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Projects</h1>
            <p className="text-gray-400">Manage your portfolio projects</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Link 
              href="/admin/projects/create" 
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
            >
              <FiPlus size={16} />
              <span>Add Project</span>
            </Link>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={inspectLocalStorage}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Debug Storage</span>
              </button>
              
              <button 
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg"
              >
                <FiTrash2 size={16} />
                <span>Clear All</span>
              </button>
              
              <button
                onClick={restoreMarketingAgencyWebsite}
                className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg"
              >
                <FiRefreshCw size={16} />
                <span>Restore Marketing Site</span>
              </button>
              
              <button
                onClick={restoreLandDevelopmentProject}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg"
              >
                <FiRefreshCw size={16} />
                <span>Restore Land Development</span>
              </button>
              
              <button
                onClick={clearLandDevelopmentProject}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg"
              >
                <FiTrash2 size={16} />
                <span>Clear Land Development</span>
              </button>
              
              <button
                onClick={recreateLandDevelopmentProject}
                className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg"
              >
                <FiRefreshCw size={16} />
                <span>Recreate Land Development</span>
              </button>
              
              <button 
                onClick={handleCreateTestProject}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                <FiPlus size={16} />
                <span>Test Project</span>
              </button>
              
              <button 
                onClick={refreshProjects}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Clear All Confirmation Dialog */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center text-red-500 mb-4">
                <FiAlertTriangle size={24} className="mr-2" />
                <h3 className="text-xl font-bold">Clear All Projects</h3>
              </div>
              <p className="text-gray-300 mb-6">
                This will permanently delete all projects from both localStorage and Firestore database. 
                This action cannot be undone. Are you sure you want to continue?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAllProjects}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg flex items-center gap-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <FiTrash2 size={16} />
                  )}
                  Yes, Clear All
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Firebase Status */}
        {firebaseInitialized === false && (
          <div className="p-4 bg-yellow-900/20 text-yellow-300 rounded-lg">
            <p className="font-medium">Firebase is not initialized</p>
            <p className="text-sm mt-1">Projects will be stored in your browser's localStorage instead.</p>
          </div>
        )}
        
        {/* Error and Success Messages */}
        {errorMessage && (
          <div className="p-4 bg-red-900/20 text-red-300 rounded-lg">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="p-4 bg-green-900/20 text-green-300 rounded-lg">
            {successMessage}
          </div>
        )}
        
        {/* Projects List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b85a00]"></div>
            <p className="text-gray-400">Loading projects...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="bg-gray-800/50 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Featured</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-700/30">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {project.thumbnailUrl && (
                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={project.thumbnailUrl} 
                                alt={project.title || 'Project thumbnail'} 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).onerror = null; 
                                  (e.target as HTMLImageElement).src = '/images/fallback-thumbnail.jpg';
                                }}
                              />
                            </div>
                          )}
                          <div className="ml-0">
                            <div className="text-sm font-medium text-white">{project.title || 'Untitled Project'}</div>
                            <div className="text-sm text-gray-400 truncate max-w-xs">{project.description?.substring(0, 60) || 'No description'}{project.description && project.description.length > 60 ? '...' : ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{project.category || 'Uncategorized'}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.featured 
                            ? 'bg-amber-900/30 text-amber-300' 
                            : 'bg-gray-800 text-gray-400'
                        }`}>
                          <FiStar className={`${project.featured ? 'text-amber-300' : 'text-gray-500'} mr-1`} size={12} />
                          {project.featured ? 'Featured' : 'Not Featured'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <Link 
                            href={`/admin/projects/edit/${project.id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Edit Project"
                          >
                            <FiEdit size={20} />
                          </Link>
                          <Link 
                            href={`/admin/projects/delete/${project.id}`}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Project"
                          >
                            <FiTrash2 size={20} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg">
            <p className="text-gray-400 mb-4">No projects found.</p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/admin/projects/new"
                className="px-4 py-2 bg-[#b85a00] text-white rounded-lg hover:bg-[#a04d00] transition-colors"
              >
                Add Your First Project
              </Link>
              <button 
                onClick={restoreMarketingAgencyWebsite}
                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Restore Marketing Site
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 