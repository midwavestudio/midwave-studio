'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiEye, FiCopy, FiDownload, FiShare2, FiBox } from 'react-icons/fi';
import AdminDashboardLayout from '../AdminDashboardLayout';

// Define UI prototype types
interface UIPrototype {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  businessValue: string;
  tags: string[];
}

export default function UIPrototypesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Sample UI prototypes with modern designs
  const uiPrototypes: UIPrototype[] = [
    {
      id: 'hero-section-1',
      title: 'Dynamic Hero Section',
      description: 'A modern hero section with animated elements and a strong call-to-action',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Landing Page',
      businessValue: 'Captures visitor attention immediately and increases conversion rates by up to 30%. The dynamic visuals create a memorable first impression that aligns with modern brand expectations.',
      tags: ['hero', 'animation', 'conversion']
    },
    {
      id: 'testimonials-grid',
      title: 'Social Proof Grid',
      description: 'A visually appealing testimonial section that showcases customer stories',
      imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Social Proof',
      businessValue: 'Builds trust through authentic customer testimonials, increasing credibility and conversions. The layout highlights key customer successes that resonate with potential clients.',
      tags: ['testimonials', 'trust', 'social proof']
    },
    {
      id: 'pricing-table',
      title: 'Interactive Pricing Table',
      description: 'A clean, interactive pricing section with toggles for different plans',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Pricing',
      businessValue: 'Clearly communicates value propositions and pricing options, helping customers make informed decisions faster. The interactive elements improve engagement and understanding of offerings.',
      tags: ['pricing', 'conversion', 'revenue']
    },
    {
      id: 'stats-dashboard',
      title: 'Animated Statistics Display',
      description: 'An animated section showcasing key business metrics and achievements',
      imageUrl: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Metrics',
      businessValue: 'Visually demonstrates business impact and success metrics, building credibility and authority in your industry. The animation draws attention to impressive statistics that influence decision-making.',
      tags: ['statistics', 'animation', 'trust']
    },
    {
      id: 'feature-cards',
      title: 'Gradient Feature Cards',
      description: 'Modern feature cards with gradient backgrounds and subtle hover effects',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Features',
      businessValue: 'Highlights product features in a visually appealing way that keeps users engaged and clearly communicates benefits. The modern design elements signal innovation and quality.',
      tags: ['features', 'product', 'benefits']
    },
    {
      id: 'cta-section',
      title: 'High-Conversion CTA Section',
      description: 'A bold call-to-action section with background animation and social proof elements',
      imageUrl: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Conversion',
      businessValue: 'Drives action with a compelling, high-contrast design that stands out and motivates visitors to convert. Strategic placement of social proof elements reduces hesitation at the critical decision point.',
      tags: ['cta', 'conversion', 'action']
    }
  ];
  
  // Filter prototypes based on search and category
  const filteredPrototypes = uiPrototypes.filter(prototype => {
    const matchesSearch = 
      prototype.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prototype.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prototype.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'All' || prototype.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = ['All', ...Array.from(new Set(uiPrototypes.map(p => p.category)))];
  
  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">UI Prototypes for Social Media</h1>
            <p className="text-gray-400 mt-1">
              Showcase these modern, visually-stunning designs to attract potential clients on social media
            </p>
          </div>
          
          <Link
            href="/admin/ui-prototypes/showcase"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff9240] text-white rounded-lg hover:bg-[#e67d2c] transition-colors"
          >
            <FiBox size={18} />
            <span>View Live Showcase</span>
          </Link>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search prototypes..."
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff9240] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? 'bg-[#ff9240] text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Prototypes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrototypes.map(prototype => (
            <div
              key={prototype.id}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-all hover:shadow-lg hover:border-gray-600 group"
            >
              {/* Prototype Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={prototype.imageUrl}
                  alt={prototype.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-0 right-0 p-2">
                  <span className="inline-block px-2 py-1 text-xs rounded bg-gray-900 bg-opacity-80 text-white">
                    {prototype.category}
                  </span>
                </div>
              </div>
              
              {/* Prototype Content */}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-white">{prototype.title}</h3>
                <p className="mt-2 text-gray-300">{prototype.description}</p>
                
                {/* Business Value */}
                <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                  <h4 className="text-sm font-medium text-[#ff9240]">Business Value</h4>
                  <p className="mt-1 text-sm text-gray-300">{prototype.businessValue}</p>
                </div>
                
                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {prototype.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* Actions */}
                <div className="mt-5 flex justify-between">
                  <Link
                    href={`/admin/ui-prototypes/${prototype.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <FiEye size={16} />
                    <span>Preview</span>
                  </Link>
                  
                  <div className="flex space-x-2">
                    <button
                      className="p-2 rounded text-gray-300 hover:text-white hover:bg-gray-700"
                      title="Copy Design"
                    >
                      <FiCopy size={16} />
                    </button>
                    <button
                      className="p-2 rounded text-gray-300 hover:text-white hover:bg-gray-700"
                      title="Download Assets"
                    >
                      <FiDownload size={16} />
                    </button>
                    <button
                      className="p-2 rounded text-gray-300 hover:text-white hover:bg-gray-700"
                      title="Share Design"
                    >
                      <FiShare2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminDashboardLayout>
  );
} 