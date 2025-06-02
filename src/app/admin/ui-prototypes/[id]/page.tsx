'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiShare2, FiDownload, FiCopy, FiExternalLink } from 'react-icons/fi';
import AdminDashboardLayout from '../../AdminDashboardLayout';

// Define UI prototype types (same as in the main page)
interface UIPrototype {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  businessValue: string;
  tags: string[];
}

// Sample UI prototypes with modern designs (same as in the main page)
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

export default function PrototypeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [prototype, setPrototype] = useState<UIPrototype | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  
  useEffect(() => {
    if (params?.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundPrototype = uiPrototypes.find(p => p.id === id);
      
      if (foundPrototype) {
        setPrototype(foundPrototype);
      } else {
        setNotFound(true);
      }
    }
  }, [params]);
  
  // Handle share functionality
  const handleShare = async () => {
    if (!prototype) return;
    
    // Create share text
    const shareText = `Check out this amazing UI prototype: ${prototype.title} - Perfect for businesses looking to enhance their online presence!`;
    
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: prototype.title,
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareText + ' ' + window.location.href);
      setShareMessage('Link copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };
  
  if (notFound) {
    return (
      <AdminDashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold text-white mb-4">Prototype Not Found</h1>
          <p className="text-gray-400 mb-8">The prototype you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/admin/ui-prototypes"
            className="px-4 py-2 bg-[#ff9240] text-white rounded-lg hover:bg-[#e67d2c] transition-colors"
          >
            Back to Prototypes
          </Link>
        </div>
      </AdminDashboardLayout>
    );
  }
  
  if (!prototype) {
    return (
      <AdminDashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#ff9240] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminDashboardLayout>
    );
  }
  
  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Back navigation */}
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft size={18} />
            <span>Back to prototypes</span>
          </button>
        </div>
        
        {/* Prototype Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs rounded-full bg-[#ff9240] text-white">
                {prototype.category}
              </span>
              {prototype.tags.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                  #{tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-white mt-2">{prototype.title}</h1>
            <p className="text-gray-300 mt-2">{prototype.description}</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiShare2 size={18} />
              <span>Share</span>
            </button>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FiDownload size={18} />
              <span>Download</span>
            </button>
          </div>
        </div>
        
        {shareMessage && (
          <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            {shareMessage}
          </div>
        )}
        
        {/* Prototype Preview */}
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={prototype.imageUrl}
              alt={prototype.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-30"></div>
          </div>
        </div>
        
        {/* Business Value and Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Business Value */}
          <div className="md:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Business Value</h2>
            <p className="text-gray-300">{prototype.businessValue}</p>
            
            <h3 className="text-lg font-semibold text-white mt-6 mb-3">Key Benefits</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">✓</span>
                <span className="text-gray-300">Increases visitor engagement and time on site</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">✓</span>
                <span className="text-gray-300">Creates a professional, modern impression of your brand</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">✓</span>
                <span className="text-gray-300">Differentiates from competitors with standard designs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">✓</span>
                <span className="text-gray-300">Improves conversion rates through strategic visual hierarchy</span>
              </li>
            </ul>
          </div>
          
          {/* Ideal Use Cases */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Ideal For</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center">
                  <FiExternalLink size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Growing Businesses</h3>
                  <p className="text-gray-400 text-sm">Perfect for businesses looking to scale and attract new customers</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center">
                  <FiExternalLink size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Service Providers</h3>
                  <p className="text-gray-400 text-sm">Ideal for showcasing professional services and expertise</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex-shrink-0 flex items-center justify-center">
                  <FiExternalLink size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">E-commerce</h3>
                  <p className="text-gray-400 text-sm">Enhances product presentations and boosts sales conversion</p>
                </div>
              </li>
            </ul>
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <button className="w-full py-2 bg-[#ff9240] text-white rounded-lg hover:bg-[#e67d2c] transition-colors">
                Use This Design
              </button>
            </div>
          </div>
        </div>
        
        {/* Social Media Usage Tips */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Social Media Usage Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-2">Caption Ideas</h3>
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">✨ "Elevate your online presence with our stunning {prototype.title.toLowerCase()} design. Perfect for businesses ready to make an impact! #WebDesign #GrowYourBusiness"</p>
                <p className="text-gray-300 text-sm">🚀 "Ready to transform your website? Our {prototype.title.toLowerCase()} helps businesses stand out and convert visitors into customers. DM for details! #DigitalTransformation"</p>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-2">Posting Strategy</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Share prototype images on Instagram and LinkedIn during business hours (Tue-Thu)</li>
                <li>• Create a carousel post showcasing different aspects of the design</li>
                <li>• Add before/after comparisons to demonstrate impact</li>
                <li>• Include a clear call-to-action for interested prospects</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
} 