'use client';

import PrototypeComponentView from './PrototypeComponentView';

export default function HeroSectionPrototype() {
  return (
    <PrototypeComponentView 
      title="Dynamic Hero Section" 
      description="A modern hero section with animated elements and a strong call-to-action"
    >
      <div className="min-h-[600px] w-full flex items-center relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 right-40 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Content Container */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="md:max-w-3xl">
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <span className="text-white/90 text-sm font-medium">Innovative Digital Solutions</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500">Online Presence</span> with Modern Design
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Elevate your brand with cutting-edge web solutions that engage your audience and drive results. Stand out from competitors with designs that convert.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 rounded-lg bg-white text-blue-700 font-bold text-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                Get Started Now
              </button>
              <button className="px-8 py-4 rounded-lg bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition duration-300">
                See Our Work
              </button>
            </div>
            
            {/* Social Proof */}
            <div className="mt-16 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-300">
                    <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-600" />
                  </div>
                ))}
              </div>
              <div className="text-white">
                <span className="font-bold">500+</span> happy clients trust our services
              </div>
              <div className="ml-auto flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-white ml-1">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PrototypeComponentView>
  );
} 