'use client';

import { useState } from 'react';
import { removeProjects, addProject } from '@/lib/firebase/projectUtils';

export default function ResetProjectsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const resetProjects = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // Step 1: Remove the old projects
      console.log('Removing Marketing Agency Website and Land Development projects...');
      const removeResult = await removeProjects([
        'default-1', // Marketing Agency Website ID
        'marketing-agency-website', // Marketing Agency Website slug
        'Marketing Agency Website', // Marketing Agency Website title
        'land-development', // Land Development ID/slug
        'Land Development' // Land Development title
      ]);
      
      if (!removeResult.success) {
        throw new Error(removeResult.message);
      }
      
      console.log('Projects removed successfully');
      
      // Step 2: Add Marketing Agency Website back as a regular project
      console.log('Adding Marketing Agency Website as regular project...');
      const marketingAgencyResult = await addProject({
        title: 'Marketing Agency Website',
        slug: 'marketing-agency-website',
        category: 'Web Development',
        description: 'A modern website for a digital marketing agency with custom animations and responsive design.',
        fullDescription: 'This comprehensive marketing agency website showcases modern web development techniques with custom animations, responsive design, and seamless user experience. Built with cutting-edge technologies to deliver exceptional performance and visual appeal.',
        client: 'XYZ Digital Agency',
        date: '2024',
        services: ['Web Design', 'Frontend Development', 'CMS Integration', 'SEO Optimization'],
        technologies: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
        thumbnailUrl: '/images/HOME (1).jpg',
        imageUrls: ['/images/HOME (1).jpg'],
        url: 'https://example.com/marketing-agency',
        featured: true,
        order: 1
      });
      
      if (!marketingAgencyResult.success) {
        throw new Error(`Failed to add Marketing Agency Website: ${marketingAgencyResult.message}`);
      }
      
      console.log('Marketing Agency Website added successfully');
      
      // Step 3: Add Land Development back as a regular project
      console.log('Adding Land Development as regular project...');
      const landDevelopmentResult = await addProject({
        title: 'Land Development',
        slug: 'land-development',
        category: 'Web Development',
        description: 'Land development project with custom features and responsive design.',
        fullDescription: 'Comprehensive land development platform that provides tools for property developers and investors. Features include property listings, development tracking, investor portals, and advanced analytics for land development projects.',
        client: 'Land Development Client',
        date: '2024',
        services: ['Web Design', 'Frontend Development', 'CMS Integration', 'Database Design'],
        technologies: ['React', 'Next.js', 'Tailwind CSS', 'Firebase'],
        thumbnailUrl: '/images/adhocthumb.png',
        imageUrls: ['/images/adhocthumb.png'],
        url: 'https://example.com/land-development',
        featured: true,
        order: 2
      });
      
      if (!landDevelopmentResult.success) {
        throw new Error(`Failed to add Land Development: ${landDevelopmentResult.message}`);
      }
      
      console.log('Land Development added successfully');
      
      // Step 4: Add Architectural Visualization Studio if it doesn't exist
      console.log('Ensuring Architectural Visualization Studio exists...');
      const archVizResult = await addProject({
        title: 'Architectural Visualization Studio',
        slug: 'architectural-visualization-studio',
        category: 'Web Development',
        description: 'A comprehensive architectural visualization platform showcasing cutting-edge 3D rendering and immersive design experiences.',
        fullDescription: 'A comprehensive architectural visualization platform showcasing cutting-edge 3D rendering and immersive design experiences. This project demonstrates our expertise in creating photorealistic architectural visualizations, interactive walkthroughs, and detailed design presentations that bring architectural concepts to life with stunning clarity and precision.',
        client: 'Architectural Visualization Client',
        date: '2024',
        services: ['Web Design', 'Frontend Development', '3D Integration', 'UI/UX Design'],
        technologies: ['React', 'Next.js', 'Three.js', 'Tailwind CSS'],
        thumbnailUrl: '/images/placeholder-arch.jpg',
        imageUrls: ['/images/placeholder-arch.jpg'],
        url: 'https://example.com/architectural-visualization',
        featured: true,
        order: 3
      });
      
      console.log('Architectural Visualization Studio processed');
      
      setIsSuccess(true);
      setMessage('Successfully reset projects! Marketing Agency Website, Land Development, and Architectural Visualization Studio are now available in the admin panel for image uploads.');
      
    } catch (error) {
      console.error('Error resetting projects:', error);
      setIsSuccess(false);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Reset Projects</h1>
        
        <div className="bg-[#1a1a1f] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Reset Marketing Agency & Land Development Projects</h2>
          <p className="text-gray-300 mb-6">
            This will remove the old Marketing Agency Website and Land Development projects and re-add them as regular projects 
            that can be managed through the admin panel. It will also ensure the Architectural Visualization Studio project exists.
          </p>
          
          <div className="space-y-4">
            <div className="text-sm text-gray-400">
              <p><strong>What this will do:</strong></p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Remove old Marketing Agency Website project</li>
                <li>Remove old Land Development project</li>
                <li>Add Marketing Agency Website as a regular admin-manageable project</li>
                <li>Add Land Development as a regular admin-manageable project</li>
                <li>Ensure Architectural Visualization Studio project exists</li>
                <li>All projects will be available in the admin panel for image uploads</li>
              </ul>
            </div>
            
            <button
              onClick={resetProjects}
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-[#b85a00] hover:bg-[#d16a00] text-white'
              }`}
            >
              {isLoading ? 'Resetting Projects...' : 'Reset Projects'}
            </button>
          </div>
        </div>
        
        {message && (
          <div className={`p-4 rounded-lg ${
            isSuccess ? 'bg-green-900/50 border border-green-500' : 'bg-red-900/50 border border-red-500'
          }`}>
            <p className={isSuccess ? 'text-green-200' : 'text-red-200'}>
              {message}
            </p>
          </div>
        )}
        
        <div className="mt-8">
          <a
            href="/admin/projects"
            className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            ← Back to Projects Admin
          </a>
        </div>
      </div>
    </div>
  );
} 