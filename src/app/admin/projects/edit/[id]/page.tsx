'use client';

import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiX, FiImage, FiPlus, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import AdminLayout from '../../AdminLayout';
import { compressImage, Project, PLACEHOLDER_IMAGES } from '@/lib/firebase/projectUtils';
import { saveProjectsWithQuotaManagement, getStorageQuotaInfo } from '@/lib/utils/storageUtils';
import React from 'react';

// Helper to slugify a string
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  
  const [formData, setFormData] = useState<Project | null>(null);
  const [originalProject, setOriginalProject] = useState<Project | null>(null);
  const [serviceInput, setServiceInput] = useState('');
  const [technologyInput, setTechnologyInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [storageQuota, setStorageQuota] = useState<any>(null);
  
  const thumbnailFileRef = useRef<HTMLInputElement>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);
  
  // Monitor storage quota
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateStorageQuota = () => {
        const quota = getStorageQuotaInfo();
        setStorageQuota(quota);
      };
      
      updateStorageQuota();
      
      // Update quota info when form data changes
      const interval = setInterval(updateStorageQuota, 2000);
      return () => clearInterval(interval);
    }
  }, [formData, imagesPreviews]);
  
  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (typeof window === 'undefined') return;
        
        console.log('Fetching project with ID:', id);
        
        // Special handling for default projects with fixed IDs
        if (id === 'land-development') {
          try {
            const { getLandDevelopmentProject } = await import('@/lib/firebase/projectUtils');
            const landDevelopmentProject = getLandDevelopmentProject();
            setFormData(landDevelopmentProject);
            setOriginalProject(landDevelopmentProject);
            
            if (landDevelopmentProject.thumbnailUrl) {
              setThumbnailPreview(landDevelopmentProject.thumbnailUrl);
            }
            
            if (landDevelopmentProject.imageUrls && landDevelopmentProject.imageUrls.length > 0) {
              setImagesPreviews(landDevelopmentProject.imageUrls);
            }
            
            console.log('Land Development project loaded from template');
            setIsLoading(false);
            return;
          } catch (error) {
            console.error('Error loading Land Development template:', error);
          }
        }
        
        // First try to get the project from localStorage
        let project = null;
        const localData = localStorage.getItem('localProjects');
        
        if (localData) {
          try {
            const projects = JSON.parse(localData) as Project[];
            project = projects.find(p => p.id === id);
            console.log('LocalStorage search result:', project ? 'Found' : 'Not found');
          } catch (error) {
            console.error('Error parsing localStorage projects:', error);
          }
        }
        
        // If not found in localStorage, try to get from Firestore (only in production)
        if (!project && process.env.NODE_ENV !== 'development') {
          try {
            // Import Firebase modules dynamically
            const { doc, getDoc } = await import('firebase/firestore');
            const { db, ensureFirebaseInitialized } = await import('@/lib/firebase/firebase');
            
            // Ensure Firebase is initialized
            await ensureFirebaseInitialized();
            
            // Get from Firestore
            const docRef = doc(db, 'projects', id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              const projectData = docSnap.data() as Omit<Project, 'id'>;
              project = {
                id: docSnap.id,
                ...projectData
              } as Project;
              console.log('Firestore search result:', 'Found');
            } else {
              console.log('Project not found in Firestore');
            }
          } catch (firestoreError) {
            console.error('Error fetching from Firestore:', firestoreError);
          }
        } else if (!project) {
          console.log('Using localStorage only in development mode');
        }
        
        if (!project) {
          console.error('Project not found in any data source');
          setErrors(prev => ({ ...prev, fetch: 'Project not found. It may have been deleted or is not accessible.' }));
          setIsLoading(false);
          return;
        }
        
        // Set project data
        setFormData(project);
        setOriginalProject(project);
        
        // Set thumbnail preview
        if (project.thumbnailUrl) {
          setThumbnailPreview(project.thumbnailUrl);
        }
        
        // Set images previews
        if (project.imageUrls && project.imageUrls.length > 0) {
          setImagesPreviews(project.imageUrls);
        }
        
        console.log('Project loaded successfully:', project.title);
      } catch (error) {
        console.error('Error fetching project:', error);
        setErrors(prev => ({ ...prev, fetch: 'Failed to load project data. Please try again.' }));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);
  
  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;
    
    const { name, value, type } = e.target;
    
    // Handle checkbox input separately
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => prev ? { ...prev, [name]: checked } : null);
      return;
    }
    
    // Handle thumbnailUrl changes
    if (name === 'thumbnailUrl' && value) {
      // Update the form data
      setFormData(prev => prev ? { ...prev, [name]: value } : null);
      
      // Don't automatically update the preview - let the user click the preview button
      // This prevents loading errors for invalid URLs
      return;
    }
    
    // Auto-generate slug when title changes
    if (name === 'title' && value) {
      setFormData(prev => prev ? {
        ...prev,
        [name]: value,
        slug: slugify(value)
      } : null);
    } else {
      setFormData(prev => prev ? { ...prev, [name]: value } : null);
    }
    
    // Clear any error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Add service to the list
  const addService = () => {
    if (!formData || !serviceInput.trim()) return;
    
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        services: [...(prev.services || []), serviceInput.trim()]
      };
    });
    setServiceInput('');
  };
  
  // Remove service from the list
  const removeService = (index: number) => {
    if (!formData) return;
    
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        services: (prev.services || []).filter((_, i) => i !== index)
      };
    });
  };
  
  // Add technology to the list
  const addTechnology = () => {
    if (!formData || !technologyInput.trim()) return;
    
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        technologies: [...(prev.technologies || []), technologyInput.trim()]
      };
    });
    setTechnologyInput('');
  };
  
  // Remove technology from the list
  const removeTechnology = (index: number) => {
    if (!formData) return;
    
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        technologies: (prev.technologies || []).filter((_, i) => i !== index)
      };
    });
  };
  
  // Handle thumbnail upload
  const handleThumbnailUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Handle image compression with higher quality for thumbnails
      const base64Image = await compressImage(file, 1600, 1200, 0.92);
      setThumbnailPreview(base64Image);
      setFormData(prev => prev ? { ...prev, thumbnailUrl: base64Image } : null);
    } catch (error) {
      console.error('Error compressing thumbnail:', error);
      setErrors(prev => ({ ...prev, thumbnailUrl: 'Failed to process thumbnail image' }));
    }
  };
  
  // Handle project images upload
  const handleImagesUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      const newImagePromises = Array.from(files).map(file => 
        compressImage(file, 2400, 1800, 0.95)
      );
      
      const newImages = await Promise.all(newImagePromises);
      
      // Update the preview state
      const updatedPreviews = [...imagesPreviews, ...newImages];
      setImagesPreviews(updatedPreviews);
      
      // Update the form data directly with the complete list
      const updatedFormData = {
        ...formData,
        imageUrls: updatedPreviews
      };
      
      // Set the updated form data
      setFormData(updatedFormData);
      
      console.log('Images added - new count:', updatedPreviews.length);
    } catch (error) {
      console.error('Error compressing images:', error);
      setErrors(prev => ({ ...prev, imageUrls: 'Failed to process project images' }));
    }
  };
  
  // Remove a project image
  const removeImage = (index: number) => {
    if (!formData) return;
    
    console.log('Removing image at index:', index);
    
    // Create a new array without the removed image
    const newPreviews = imagesPreviews.filter((_, i) => i !== index);
    setImagesPreviews(newPreviews);
    
    // Update the form data directly with the new array
    const updatedFormData = {
      ...formData,
      imageUrls: newPreviews
    };
    
    // Set the updated form data
    setFormData(updatedFormData);
    
    console.log('Image removed - new count:', newPreviews.length);
  };
  
  // Remove all images
  const clearAllImages = () => {
    if (!formData) return;
    
    console.log('Clearing all images');
    
    // Clear both the preview state and the actual form data
    setImagesPreviews([]);
    
    // Important: Create a new copy of the form data with empty imageUrls
    const updatedFormData = {
      ...formData,
      imageUrls: []
    };
    
    // Set the updated form data
    setFormData(updatedFormData);
    
    console.log('All images cleared - formData updated');
  };
  
  // Validate form before submission
  const validateForm = (): boolean => {
    if (!formData) return false;
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    // Check for empty image arrays
    if (imagesPreviews.length === 0) {
      console.log('No images in preview state, will use placeholder');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData || !validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Ensure featured is a boolean
      const featured = Boolean(formData.featured);
      
      // Create a deep clone of the form data to avoid reference issues
      const updatedProject: Project = JSON.parse(JSON.stringify({
        ...formData,
        featured,
        order: Number(formData.order) || 0,
        updatedAt: new Date().toISOString(),
        imageUrls: imagesPreviews // Use the preview state directly as source of truth
      }));
      
      // Debug log project details
      console.log('Updating project:', updatedProject.title);
      console.log('URL:', updatedProject.url);
      console.log('Images count:', updatedProject.imageUrls?.length || 0);
      
      // Handle special IDs differently
      if (id === 'land-development') {
        // For Land Development project, we need a special approach to ensure
        // data is correctly saved
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          try {
            // Get existing projects
            const existingData = localStorage.getItem('localProjects');
            let projects: Project[] = [];
            
            if (existingData) {
              try {
                projects = JSON.parse(existingData);
              } catch (parseError) {
                console.error('Error parsing localStorage projects:', parseError);
                throw new Error('Failed to parse localStorage data');
              }
            }
            
            // Always remove the existing project first
            projects = projects.filter(p => 
              p.id !== 'land-development' && 
              p.slug !== 'land-development'
            );
            
            console.log('Removed existing Land Development project from localStorage');
            
            // Add the updated project
            projects.push({
              ...updatedProject,
              id: 'land-development',
              slug: 'land-development'
            });
            
            console.log('Added updated Land Development project to localStorage');
            
            // Save back to localStorage using quota management
            const saveResult = saveProjectsWithQuotaManagement(projects);
            
            if (!saveResult.success) {
              throw new Error(saveResult.error || 'Failed to save projects');
            }
            
            if (saveResult.compressed) {
              console.log('Projects were compressed to fit storage quota');
              setErrors(prev => ({ 
                ...prev, 
                submit: 'Project saved successfully, but some images were compressed to fit storage limits.' 
              }));
            }
            
            // Redirect back to projects page
            router.push('/admin/projects');
            return;
          } catch (error) {
            console.error('Error saving Land Development project:', error);
            setErrors(prev => ({ 
              ...prev, 
              submit: 'Failed to save Land Development project. Please try again.' 
            }));
            setIsSaving(false);
            return;
          }
        }
      }
      
      // Try to update using firebaseUtils first, but only if we're not in development mode
      // and only if we're fairly certain the document exists in Firebase
      if (process.env.NODE_ENV !== 'development' && originalProject?.createdAt) {
        try {
          const { updateDocument } = await import('@/lib/firebase/firebaseUtils');
          const result = await updateDocument('projects', id, updatedProject);
          
          console.log('Project updated successfully using updateDocument:', result);
          
          // Redirect back to projects page
          router.push('/admin/projects');
          return;
        } catch (firebaseError) {
          console.error('Error updating project with updateDocument:', firebaseError);
          // Log the specific error for debugging
          if (firebaseError instanceof Error) {
            console.log('Firebase error message:', firebaseError.message);
          }
          // Continue to localStorage fallback
        }
      } else {
        console.log('Skipping Firebase update, using localStorage only');
      }
      
      // Fallback to localStorage if updateDocument fails
      if (typeof window !== 'undefined') {
        try {
          // Get existing projects
          const existingData = localStorage.getItem('localProjects');
          let projects: Project[] = [];
          
          if (existingData) {
            try {
              projects = JSON.parse(existingData);
            } catch (parseError) {
              console.error('Error parsing localStorage projects:', parseError);
              throw new Error('Failed to parse localStorage data');
            }
          }
          
          // Find and update project
          const projectIndex = projects.findIndex(p => p.id === id);
          
          if (projectIndex === -1) {
            // If project doesn't exist in localStorage, add it as a new project
            console.log('Project not found in localStorage, adding as new project');
            projects.push(updatedProject);
          } else {
            // Update existing project
            projects[projectIndex] = updatedProject;
          }
          
          // Save back to localStorage using quota management
          const saveResult = saveProjectsWithQuotaManagement(projects);
          
          if (!saveResult.success) {
            throw new Error(saveResult.error || 'Failed to save projects');
          }
          
          if (saveResult.compressed) {
            console.log('Projects were compressed to fit storage quota');
            setErrors(prev => ({ 
              ...prev, 
              submit: 'Project saved successfully, but some images were compressed to fit storage limits.' 
            }));
          }
          
          // Verify the save
          const verifyData = localStorage.getItem('localProjects');
          const verifyProjects = verifyData ? JSON.parse(verifyData) as Project[] : [];
          const savedProject = verifyProjects.find(p => p.id === id);
          
          if (!savedProject) {
            throw new Error('Failed to verify project was saved');
          }
          
          console.log('Project updated successfully in localStorage:', id);
          
          // Redirect back to projects page
          router.push('/admin/projects');
        } catch (error) {
          console.error('Error saving project to localStorage:', error);
          setErrors(prev => ({ 
            ...prev, 
            submit: 'Failed to update project in localStorage. Please try again.' 
          }));
        }
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: 'Failed to update project. Please try again.' 
      }));
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b85a00]"></div>
          <p className="text-gray-400">Loading project data...</p>
        </div>
      </AdminLayout>
    );
  }
  
  if (!formData) {
    return (
      <AdminLayout>
        <div className="p-6 bg-red-900/20 text-red-300 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{errors.fetch}</p>
          <div className="mt-4 flex gap-3">
            <button 
              onClick={() => router.push('/admin/projects')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Back to Projects
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {formData ? `Edit Project: ${formData.title}` : 'Edit Project'}
            </h1>
            <p className="text-gray-400">Update project details and media</p>
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push('/admin/projects')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              <FiX size={16} />
              <span>Cancel</span>
            </button>
            
            <button
              type="submit"
              form="project-form"
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-[#b85a00] hover:bg-[#a04d00] text-white rounded-lg disabled:opacity-50"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <FiSave size={16} />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </div>
        
        {/* Error message for project not found */}
        {errors.submit && (
          <div className="p-4 bg-red-900/20 text-red-300 rounded-lg">
            {errors.submit}
          </div>
        )}
        
        {/* Storage Quota Warning */}
        {storageQuota && storageQuota.percentage > 70 && (
          <div className={`p-4 rounded-lg flex items-start gap-3 ${
            storageQuota.percentage > 90 
              ? 'bg-red-900/20 text-red-300 border border-red-500/30' 
              : 'bg-yellow-900/20 text-yellow-300 border border-yellow-500/30'
          }`}>
            <FiAlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Storage Usage Warning</h3>
              <p className="text-sm mb-2">
                Browser storage is {Math.round(storageQuota.percentage)}% full 
                ({Math.round(storageQuota.used)}KB of {Math.round(storageQuota.total)}KB used).
                {storageQuota.percentage > 90 
                  ? ' You may encounter errors when adding large images.'
                  : ' Consider using external image hosting for large files.'
                }
              </p>
              <p className="text-xs opacity-80">
                Tip: Use smaller images or external hosting services like ImgBB, Imgur, or Cloudinary to avoid storage limits.
              </p>
            </div>
          </div>
        )}
        
        {/* Form */}
        <form id="project-form" onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Project Details */}
            <div className="space-y-6">
              {/* Basic Project Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Project Information
                </h2>
                
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-gray-800 border ${
                        errors.title ? 'border-red-500' : 'border-gray-700'
                      } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50`}
                      placeholder="Project Title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>
                  
                  {/* Slug */}
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">
                      Slug (URL-friendly name)
                    </label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                      placeholder="project-slug"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Auto-generated from title. Used in URLs.
                    </p>
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-gray-800 border ${
                        errors.category ? 'border-red-500' : 'border-gray-700'
                      } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50`}
                      placeholder="Web Development, UI/UX Design, etc."
                    />
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                    )}
                  </div>
                  
                  {/* Client (Optional) */}
                  <div>
                    <label htmlFor="client" className="block text-sm font-medium text-gray-300 mb-1">
                      Client
                    </label>
                    <input
                      type="text"
                      id="client"
                      name="client"
                      value={formData.client || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                      placeholder="Client Name (optional)"
                    />
                  </div>
                  
                  {/* Date */}
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                    />
                  </div>
                  
                  {/* Project URL (Optional) */}
                  <div className="mb-6 border border-[#b85a00]/50 p-4 rounded-lg bg-black/20">
                    <label className="block text-white font-semibold mb-2 flex items-center">
                      <svg 
                        className="w-5 h-5 mr-2 text-[#b85a00]" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
                        />
                      </svg>
                      Live Website URL
                    </label>
                    <div className="text-gray-400 text-sm mb-3">
                      This URL will be used for the "Visit Live Site" button. Enter the full URL including https://.
                    </div>
                    <input
                      type="url"
                      id="url"
                      name="url"
                      value={formData.url || ''}
                      onChange={(e) => {
                        // Special handling for URL field to ensure it's saved correctly
                        const urlValue = e.target.value;
                        console.log('Setting URL to:', urlValue);
                        setFormData(prev => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            url: urlValue
                          };
                        });
                      }}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#b85a00] focus:ring-2 focus:ring-[#b85a00]/50"
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  {/* Featured & Order */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label htmlFor="order" className="block text-sm font-medium text-gray-300 mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        id="order"
                        name="order"
                        value={formData.order || 0}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Featured Project
                      </label>
                      <div className="pt-2">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="featured"
                            checked={Boolean(formData.featured)}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            formData.featured ? 'bg-[#b85a00]' : 'bg-gray-700'
                          }`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              formData.featured ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </div>
                          <span className="ml-2 text-gray-300 text-sm">
                            {formData.featured ? 'Yes' : 'No'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Services & Technologies
                </h2>
                
                <div className="space-y-4">
                  {/* Services */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Services
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={serviceInput}
                        onChange={(e) => setServiceInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                        placeholder="e.g., Web Design"
                      />
                      <button
                        type="button"
                        onClick={addService}
                        className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                    
                    {formData.services && formData.services.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.services.map((service, index) => (
                          <div 
                            key={index} 
                            className="flex items-center bg-gray-700 text-gray-200 px-2 py-1 rounded-md text-sm"
                          >
                            <span>{service}</span>
                            <button
                              type="button"
                              onClick={() => removeService(index)}
                              className="ml-1.5 text-gray-400 hover:text-red-400"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Technologies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Technologies
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={technologyInput}
                        onChange={(e) => setTechnologyInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                        placeholder="e.g., React"
                      />
                      <button
                        type="button"
                        onClick={addTechnology}
                        className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                    
                    {formData.technologies && formData.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.technologies.map((tech, index) => (
                          <div 
                            key={index} 
                            className="flex items-center bg-gray-700 text-gray-200 px-2 py-1 rounded-md text-sm"
                          >
                            <span>{tech}</span>
                            <button
                              type="button"
                              onClick={() => removeTechnology(index)}
                              className="ml-1.5 text-gray-400 hover:text-red-400"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Media & Description */}
            <div className="space-y-6">
              {/* Project Media */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Project Media
                </h2>
                
                <div className="space-y-4">
                  {/* Thumbnail Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Thumbnail Image
                    </label>
                    <div className="mt-1 flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-800 border border-gray-700 rounded-md overflow-hidden flex items-center justify-center">
                        {thumbnailPreview ? (
                          <img 
                            src={thumbnailPreview} 
                            alt="Thumbnail preview" 
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setExpandedImage(thumbnailPreview)}
                          />
                        ) : (
                          <FiImage size={24} className="text-gray-500" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        {/* File upload option */}
                        <div>
                          <input 
                            type="file"
                            ref={thumbnailFileRef}
                            onChange={handleThumbnailUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          
                          <button
                            type="button"
                            onClick={() => thumbnailFileRef.current?.click()}
                            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                          >
                            Select Thumbnail
                          </button>
                          
                          <p className="mt-1 text-xs text-gray-400">
                            Recommended size: 800x600px. Max size: 2MB
                          </p>
                        </div>
                        
                        {errors.thumbnailUrl && (
                          <p className="mt-1 text-sm text-red-500">{errors.thumbnailUrl}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Project Images Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Project Images
                    </label>
                    <div className="mt-1 space-y-3">
                      {/* File upload option */}
                      <div className="flex gap-2">
                        <input 
                          type="file"
                          ref={imageFileRef}
                          onChange={handleImagesUpload}
                          accept="image/*"
                          multiple
                          className="hidden"
                        />
                        
                        <button
                          type="button"
                          onClick={() => imageFileRef.current?.click()}
                          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                        >
                          Add Images
                        </button>
                        
                        {imagesPreviews.length > 0 && (
                          <button
                            type="button"
                            onClick={clearAllImages}
                            className="px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md"
                          >
                            Clear All Images
                          </button>
                        )}
                      </div>
                      
                      <p className="mt-1 text-xs text-gray-400">
                        Recommended size: 1200x800px. Max size: 5MB per image
                      </p>
                      
                      {errors.imageUrls && (
                        <p className="mt-1 text-sm text-red-500">{errors.imageUrls}</p>
                      )}
                    </div>
                    
                    {/* Image Previews */}
                    {imagesPreviews.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {imagesPreviews.map((image, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image} 
                              alt={`Project image ${index + 1}`} 
                              className="w-full h-32 object-cover rounded-md cursor-pointer"
                              onClick={() => setExpandedImage(image)}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Expanded Image Modal */}
              {expandedImage && (
                <div 
                  className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                  onClick={() => setExpandedImage(null)}
                >
                  <div className="relative max-w-screen-xl max-h-screen">
                    <img 
                      src={expandedImage} 
                      alt="Expanded view" 
                      className="max-w-full max-h-[90vh] object-contain rounded-lg"
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedImage(null);
                      }}
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Project Descriptions */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Project Descriptions
                </h2>
                
                <div className="space-y-4">
                  {/* Short Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={2}
                      className={`w-full px-3 py-2 bg-gray-800 border ${
                        errors.description ? 'border-red-500' : 'border-gray-700'
                      } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50`}
                      placeholder="Brief description of the project (shown in cards)"
                    ></textarea>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                  </div>
                  
                  {/* Full Description */}
                  <div>
                    <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-300 mb-1">
                      Full Description
                    </label>
                    <textarea
                      id="fullDescription"
                      name="fullDescription"
                      value={formData.fullDescription || ''}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                      placeholder="Detailed description of the project (shown in project details)"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
} 