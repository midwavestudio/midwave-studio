'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiDownload, FiUpload } from 'react-icons/fi';
import AdminDashboardLayout from '../AdminDashboardLayout';

interface Settings {
  siteTitle: string;
  siteDescription: string;
  defaultProjectsPerPage: number;
  enableLocalStorage: boolean;
  portfolioLayout: 'grid' | 'list';
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteTitle: 'Midwave Studio',
    siteDescription: 'Design & Software Development Agency',
    defaultProjectsPerPage: 6,
    enableLocalStorage: true,
    portfolioLayout: 'grid',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('siteSettings');
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch (error) {
          console.error('Error parsing settings:', error);
        }
      }
    }
  }, []);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox input separately
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    // Handle number inputs
    if (type === 'number') {
      setSettings(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
      return;
    }
    
    // Handle regular inputs
    setSettings(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    
    try {
      // Save settings to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('siteSettings', JSON.stringify(settings));
      }
      
      setSaveMessage('Settings saved successfully');
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Failed to save settings');
      setIsSaving(false);
    }
  };
  
  // Export all data (projects and settings)
  const handleExportData = () => {
    try {
      const exportData = {
        settings: settings,
        projects: [],
      };
      
      // Get projects from localStorage
      if (typeof window !== 'undefined') {
        const localProjects = localStorage.getItem('localProjects');
        if (localProjects) {
          exportData.projects = JSON.parse(localProjects);
        }
      }
      
      // Create downloadable JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      // Create download link and trigger click
      const exportFileDefaultName = `midwave-backup-${new Date().toISOString().slice(0, 10)}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setSaveMessage('Data exported successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error exporting data:', error);
      setSaveMessage('Failed to export data');
    }
  };
  
  // Import data handler
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        
        // Validate imported data
        if (importedData.settings) {
          // Update settings
          setSettings(importedData.settings);
          localStorage.setItem('siteSettings', JSON.stringify(importedData.settings));
        }
        
        // Import projects if available
        if (importedData.projects && Array.isArray(importedData.projects)) {
          localStorage.setItem('localProjects', JSON.stringify(importedData.projects));
        }
        
        setSaveMessage('Data imported successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error importing data:', error);
        setSaveMessage('Failed to import data. Invalid file format.');
      }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
  };
  
  // Reset all data
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      try {
        // Clear localStorage
        localStorage.removeItem('siteSettings');
        localStorage.removeItem('localProjects');
        
        // Reset settings to defaults
        setSettings({
          siteTitle: 'Midwave Studio',
          siteDescription: 'Design & Software Development Agency',
          defaultProjectsPerPage: 6,
          enableLocalStorage: true,
          portfolioLayout: 'grid',
        });
        
        setSaveMessage('All data has been reset');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error resetting data:', error);
        setSaveMessage('Failed to reset data');
      }
    }
  };
  
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Configure your portfolio website settings</p>
        </div>
        
        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Site Information */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Site Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-300 mb-1">
                  Site Title
                </label>
                <input
                  type="text"
                  id="siteTitle"
                  name="siteTitle"
                  value={settings.siteTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                />
              </div>
              
              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-300 mb-1">
                  Site Description
                </label>
                <textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Portfolio Settings */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Portfolio Settings</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="defaultProjectsPerPage" className="block text-sm font-medium text-gray-300 mb-1">
                  Projects Per Page
                </label>
                <input
                  type="number"
                  id="defaultProjectsPerPage"
                  name="defaultProjectsPerPage"
                  value={settings.defaultProjectsPerPage}
                  onChange={handleChange}
                  min={1}
                  max={24}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                />
              </div>
              
              <div>
                <label htmlFor="portfolioLayout" className="block text-sm font-medium text-gray-300 mb-1">
                  Portfolio Layout
                </label>
                <select
                  id="portfolioLayout"
                  name="portfolioLayout"
                  value={settings.portfolioLayout}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#b85a00]/50"
                >
                  <option value="grid">Grid Layout</option>
                  <option value="list">List Layout</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableLocalStorage"
                  name="enableLocalStorage"
                  checked={settings.enableLocalStorage}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#b85a00] rounded focus:ring-[#b85a00] bg-gray-700 border-gray-600"
                />
                <label htmlFor="enableLocalStorage" className="text-sm font-medium text-gray-300">
                  Enable Local Storage (recommended)
                </label>
              </div>
            </div>
          </div>
          
          {/* Data Management */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Data Management</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  <FiDownload size={16} />
                  <span>Export Data</span>
                </button>
                
                <div className="relative">
                  <input
                    type="file"
                    id="importFile"
                    accept=".json"
                    onChange={handleImportData}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                  >
                    <FiUpload size={16} />
                    <span>Import Data</span>
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={handleResetData}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  <FiRefreshCw size={16} />
                  <span>Reset Data</span>
                </button>
              </div>
              
              <p className="text-xs text-gray-400">
                Export backs up all your projects and settings to a JSON file. Import allows you to restore from a backup.
                Reset will clear all data and return to default settings.
              </p>
            </div>
          </div>
          
          {/* Save Button & Message */}
          <div className="flex items-center justify-between">
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
              <span>Save Settings</span>
            </button>
            
            {saveMessage && (
              <div className={`px-4 py-2 rounded ${
                saveMessage.includes('Failed') 
                  ? 'bg-red-900/20 text-red-300' 
                  : 'bg-green-900/20 text-green-300'
              }`}>
                {saveMessage}
              </div>
            )}
          </div>
        </form>
      </div>
    </AdminDashboardLayout>
  );
} 