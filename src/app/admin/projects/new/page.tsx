'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiUpload, FiX, FiImage, FiCheck } from 'react-icons/fi';
import AdminDashboardLayout from '../../AdminDashboardLayout';

interface FormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  date: string;
  featured: boolean;
  tags: string[];
  newTag: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    featured: false,
    tags: [],
    newTag: '',
  });
  
  // Image uploads state
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // Form state
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Handle regular form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      setFormData(prev => ({ ...prev, slug }));
    }
  };
  
  // Handle thumbnail upload
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview thumbnail
    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setThumbnailFile(file);
  };
  
  // Handle multiple image uploads
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    
    // Process each file
    Array.from(files).forEach(file => {
      newFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    setImageFiles(prev => [...prev, ...newFiles]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Remove image preview and file
  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  // Remove thumbnail
  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview('');
  };
  
  // Add tag
  const handleAddTag = () => {
    if (formData.newTag.trim() === '') return;
    
    // Check if tag already exists
    if (formData.tags.includes(formData.newTag.trim())) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, prev.newTag.trim()],
      newTag: '',
    }));
  };
  
  // Remove tag
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    setErrorMessage('');
    
    try {
      // Basic validation
      if (!formData.title.trim()) {
        throw new Error('Project title is required');
      }
      
      if (!formData.slug.trim()) {
        throw new Error('Project slug is required');
      }
      
      // Create a base64 image URLs array
      const imageUrls: string[] = [];
      
      // Add thumbnail if exists
      let thumbnailUrl = '';
      if (thumbnailFile && thumbnailPreview) {
        thumbnailUrl = thumbnailPreview;
      } else if (imagePreviews.length > 0) {
        // Use first image as thumbnail if no specific thumbnail
        thumbnailUrl = imagePreviews[0];
      }
      
      // Add all other images
      imagePreviews.forEach(preview => {
        imageUrls.push(preview);
      });
      
      // Create project object
      const project = {
        id: formData.slug,
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        category: formData.category || 'Uncategorized',
        date: formData.date,
        thumbnailUrl: thumbnailUrl,
        imageUrls: imageUrls,
        featured: formData.featured,
        tags: formData.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save to localStorage
      const localProjects = localStorage.getItem('localProjects');
      let projects = [];
      
      if (localProjects) {
        projects = JSON.parse(localProjects);
      }
      
      // Check if project with same slug already exists
      const existingProjectIndex = projects.findIndex((p: any) => p.id === project.id || p.slug === project.slug);
      
      if (existingProjectIndex >= 0) {
        throw new Error('A project with this slug already exists. Please use a different slug.');
      }
      
      // Add new project
      projects.push(project);
      
      // Save back to localStorage
      localStorage.setItem('localProjects', JSON.stringify(projects));
      
      setSuccessMessage('Project created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/projects');
      }, 1500);
    } catch (error) {
      console.error('Error creating project:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create project');
      setIsSaving(false);
    }
  };
  
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Project</h1>
          <p className="text-gray-400 mt-1">Add a new project to your portfolio</p>
        </div>
        
        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 bg-red-900/20 text-red-300 rounded-xl border border-red-900/50">
            {errorMessage}
          </div>
        )}
        
        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-green-900/20 text-green-300 rounded-xl border border-green-900/50 flex items-center gap-2">
            <FiCheck size={18} />
            <span>{successMessage}</span>
          </div>
        )}
        
        {/* Project Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Details */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Project Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                  />
                </div>
                
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">
                    Slug / URL *
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    This will be used in the URL: /projects/{formData.slug}
                  </p>
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Web Development, Design, etc."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                  />
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#b85a00] rounded focus:ring-[#b85a00] bg-gray-700 border-gray-600"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-300">
                  Featured Project (will be highlighted on the portfolio)
                </label>
              </div>
            </div>
          </div>
          
          {/* Project Tags */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Project Tags</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  id="newTag"
                  name="newTag"
                  value={formData.newTag}
                  onChange={handleInputChange}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-300 rounded-full"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
                {formData.tags.length === 0 && (
                  <p className="text-sm text-gray-400">No tags added yet.</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Image Uploads */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Project Images</h2>
            
            {/* Thumbnail Upload */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-white mb-2">Thumbnail</h3>
              {thumbnailPreview ? (
                <div className="relative w-48 h-48 bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2 p-1 bg-red-900/80 text-white rounded-full hover:bg-red-800 transition-colors"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-xs">
                  <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition-colors border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiImage className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </label>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                This will be the main image displayed for the project. If not provided, the first project image will be used.
              </p>
            </div>
            
            {/* Project Images Upload */}
            <div>
              <h3 className="text-md font-medium text-white mb-2">Project Images</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {/* Image previews */}
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative h-32 bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt={`Project image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-900/80 text-white rounded-full hover:bg-red-800 transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
                
                {/* Upload button */}
                <div className="h-32">
                  <label className="flex flex-col items-center justify-center w-full h-full px-4 transition-colors border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-6 h-6 mb-2 text-gray-400" />
                      <p className="text-xs text-gray-400">
                        Add Images
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      ref={fileInputRef}
                    />
                  </label>
                </div>
              </div>
              
              <p className="text-xs text-gray-400">
                Upload multiple images to showcase your project. You can select multiple files at once.
              </p>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/admin/projects')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-[#b85a00] hover:bg-[#a04d00] text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <FiSave size={16} />
              )}
              <span>Create Project</span>
            </button>
          </div>
        </form>
      </div>
    </AdminDashboardLayout>
  );
} 