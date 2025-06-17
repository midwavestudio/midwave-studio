/**
 * Storage utilities for managing localStorage quota and implementing efficient storage strategies
 */

export interface StorageQuotaInfo {
  used: number;
  available: number;
  total: number;
  percentage: number;
}

/**
 * Get localStorage usage information
 */
export const getStorageQuotaInfo = (): StorageQuotaInfo => {
  if (typeof window === 'undefined') {
    return { used: 0, available: 0, total: 0, percentage: 0 };
  }

  let used = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length;
    }
  }

  // Most browsers have a 5-10MB limit, we'll use 5MB as conservative estimate
  const total = 5 * 1024 * 1024; // 5MB in bytes
  const available = total - used;
  const percentage = (used / total) * 100;

  return {
    used: used / 1024, // Convert to KB
    available: available / 1024, // Convert to KB
    total: total / 1024, // Convert to KB
    percentage
  };
};

/**
 * Check if localStorage has enough space for data
 */
export const hasStorageSpace = (dataSize: number): boolean => {
  const quotaInfo = getStorageQuotaInfo();
  return dataSize < quotaInfo.available * 1024; // Convert back to bytes
};

/**
 * Estimate the size of data when stringified
 */
export const estimateDataSize = (data: any): number => {
  return JSON.stringify(data).length * 2; // UTF-16 uses 2 bytes per character
};

/**
 * Clean up localStorage by removing old or large items
 */
export const cleanupStorage = (): { cleaned: boolean; freedSpace: number } => {
  if (typeof window === 'undefined') {
    return { cleaned: false, freedSpace: 0 };
  }

  const initialQuota = getStorageQuotaInfo();
  let freedSpace = 0;

  // Remove items that are likely to be large and non-essential
  const itemsToCheck = [];
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const size = localStorage[key].length;
      itemsToCheck.push({ key, size });
    }
  }

  // Sort by size, largest first
  itemsToCheck.sort((a, b) => b.size - a.size);

  // Remove large non-essential items
  for (const item of itemsToCheck) {
    // Skip essential items
    if (item.key === 'localProjects') continue;

    // Remove very large items (>500KB)
    if (item.size > 500 * 1024) {
      localStorage.removeItem(item.key);
      freedSpace += item.size;
    }
  }

  const finalQuota = getStorageQuotaInfo();
  return {
    cleaned: freedSpace > 0,
    freedSpace: freedSpace / 1024 // Convert to KB
  };
};

/**
 * Compress project data by optimizing images
 */
export const compressProjectData = (projects: any[]): any[] => {
  return projects.map(project => {
    // Create a copy to avoid mutating original
    const compressed = { ...project };

    // Remove or compress large base64 images
    if (compressed.imageUrls && Array.isArray(compressed.imageUrls)) {
      compressed.imageUrls = compressed.imageUrls.map((url: string) => {
        // If it's a base64 image and very large, replace with placeholder
        if (url.startsWith('data:image/') && url.length > 100000) { // >100KB
          console.warn(`Large image detected (${url.length} chars), replacing with placeholder`);
          return '/images/fallback-thumbnail.jpg';
        }
        return url;
      });
    }

    // Handle thumbnail
    if (compressed.thumbnailUrl && compressed.thumbnailUrl.startsWith('data:image/') && compressed.thumbnailUrl.length > 50000) {
      console.warn(`Large thumbnail detected, replacing with placeholder`);
      compressed.thumbnailUrl = '/images/fallback-thumbnail.jpg';
    }

    return compressed;
  });
};

/**
 * Safe localStorage setItem with quota management
 */
export const safeSetItem = (key: string, value: string): { success: boolean; error?: string } => {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Not available on server side' };
  }

  try {
    // Check if we have enough space
    const dataSize = value.length * 2; // UTF-16 encoding
    const quotaInfo = getStorageQuotaInfo();

    if (dataSize > quotaInfo.available * 1024) {
      // Try to clean up storage first
      const cleanup = cleanupStorage();
      console.log(`Storage cleanup: freed ${cleanup.freedSpace}KB`);

      // Check again after cleanup
      const newQuotaInfo = getStorageQuotaInfo();
      if (dataSize > newQuotaInfo.available * 1024) {
        return {
          success: false,
          error: `Not enough storage space. Need ${Math.round(dataSize / 1024)}KB, have ${Math.round(newQuotaInfo.available)}KB available.`
        };
      }
    }

    localStorage.setItem(key, value);
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      return {
        success: false,
        error: 'Storage quota exceeded. Try removing some images or clearing browser data.'
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown storage error'
    };
  }
};

/**
 * Save projects with quota management and compression
 */
export const saveProjectsWithQuotaManagement = (projects: any[]): { success: boolean; error?: string; compressed?: boolean } => {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Not available on server side' };
  }

  try {
    // First, try to save as-is
    let projectsToSave = projects;
    let compressed = false;

    const dataString = JSON.stringify(projectsToSave);
    let result = safeSetItem('localProjects', dataString);

    // If it fails due to quota, try with compression
    if (!result.success && result.error?.includes('storage space')) {
      console.log('Compressing project data due to storage constraints...');
      projectsToSave = compressProjectData(projects);
      compressed = true;

      const compressedDataString = JSON.stringify(projectsToSave);
      result = safeSetItem('localProjects', compressedDataString);

      if (!result.success) {
        // If still failing, try more aggressive compression
        console.log('Applying more aggressive compression...');
        projectsToSave = projectsToSave.map(project => ({
          ...project,
          imageUrls: project.imageUrls?.slice(0, 2) || [], // Keep only first 2 images
          fullDescription: project.fullDescription?.substring(0, 500) || project.description // Truncate descriptions
        }));

        const aggressiveDataString = JSON.stringify(projectsToSave);
        result = safeSetItem('localProjects', aggressiveDataString);
      }
    }

    return {
      success: result.success,
      error: result.error,
      compressed
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during save'
    };
  }
};