'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiGrid, FiUsers, FiSettings, FiPlusCircle, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarNavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Check if viewport is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const navItems: SidebarNavItem[] = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <FiHome size={20} />,
    },
    {
      title: 'Projects',
      path: '/admin/projects',
      icon: <FiGrid size={20} />,
    },
    {
      title: 'New Project',
      path: '/admin/projects/new',
      icon: <FiPlusCircle size={20} />,
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: <FiSettings size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-gray-800 rounded-md text-white hover:bg-[#b85a00] transition-colors"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className={`w-64 fixed inset-y-0 z-40 flex flex-col bg-gray-800 text-white shadow-xl ${
              isMobile ? 'left-0' : ''
            }`}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-700">
              <Link href="/admin" className="flex items-center">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500">
                  Midwave Studio
                </span>
              </Link>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-4 overflow-y-auto">
              <ul className="px-2 space-y-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        pathname === item.path
                          ? 'bg-[#b85a00] text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-700">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiLogOut size={20} />
                <span>Back to Site</span>
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto bg-gray-900 p-6 transition-all duration-300 ${
          sidebarOpen && !isMobile ? 'lg:ml-64' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 