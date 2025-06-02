'use client';

import Link from 'next/link';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import AdminDashboardLayout from '../../AdminDashboardLayout';
import HeroSectionPrototype from '../components/HeroSectionPrototype';
import TestimonialGridPrototype from '../components/TestimonialGridPrototype';

export default function PrototypeShowcase() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <Link
              href="/admin/ui-prototypes"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <FiArrowLeft size={18} />
              <span>Back to prototypes</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">UI Prototypes Showcase</h1>
            <p className="text-gray-400 mt-1">
              Preview all available prototype components for social media marketing
            </p>
          </div>
          
          <Link
            href="/admin/ui-prototypes"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff9240] text-white rounded-lg hover:bg-[#e67d2c] transition-colors"
          >
            <FiExternalLink size={18} />
            <span>View All Prototypes</span>
          </Link>
        </div>
        
        {/* Instructions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">How to Use These Prototypes</h2>
          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff9240] flex items-center justify-center text-white font-medium">1</span>
              <span>Browse through the prototype components below to find designs that suit your client's needs</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff9240] flex items-center justify-center text-white font-medium">2</span>
              <span>Click on any component to view it in detail, including business value and social media usage tips</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff9240] flex items-center justify-center text-white font-medium">3</span>
              <span>Use the "Share" feature to create social media posts showcasing these designs to potential clients</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff9240] flex items-center justify-center text-white font-medium">4</span>
              <span>Customize the designs to match specific client requirements and branding</span>
            </li>
          </ol>
        </div>
        
        {/* Components Section */}
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Hero Section Prototypes</h2>
              <Link
                href="/admin/ui-prototypes/hero-section-1"
                className="text-[#ff9240] hover:text-[#ffb680] transition-colors"
              >
                View Details
              </Link>
            </div>
            <HeroSectionPrototype />
          </div>
          
          {/* Testimonial Grid */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Testimonial Prototypes</h2>
              <Link
                href="/admin/ui-prototypes/testimonials-grid"
                className="text-[#ff9240] hover:text-[#ffb680] transition-colors"
              >
                View Details
              </Link>
            </div>
            <TestimonialGridPrototype />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
} 